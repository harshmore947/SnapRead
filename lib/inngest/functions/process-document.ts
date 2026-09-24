import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { fectAndExtractionPdfText } from "@/lib/langchain";
import { generateSummaryFromGemini } from "@/lib/geminiAI";
import { chunkDocumentText } from "@/lib/chunker";
import { embedTexts } from "@/lib/embeddings";
import { randomUUID } from "crypto";

export const processDocument = inngest.createFunction(
  {
    id: "process-document",
    retries: 3,
    triggers: [{ event: "document/uploaded" as const }],
  },
  async ({ event, step }) => {
    const { documentId, fileUrl } = event.data as {
      documentId: string;
      fileUrl: string;
    };

    try {
      // STEP 1: Extract PDF text and save to raw_text
      const extractionResult = await step.run("extract-pdf-text", async () => {
        await prisma.pDFSummaries.update({
          where: { id: documentId },
          data: { doc_status: "PARSING" },
        });

        const rawText = await fectAndExtractionPdfText(fileUrl);

        await prisma.pDFSummaries.update({
          where: { id: documentId },
          data: { raw_text: rawText },
        });

        return { rawText };
      });

      // STEP 2: Document chunking and embedding generation (RAG Module 3)
      const chunkResult = await step.run("chunk-and-embed-document", async () => {
        await prisma.pDFSummaries.update({
          where: { id: documentId },
          data: { doc_status: "CHUNKING" },
        });

        const chunks = chunkDocumentText(extractionResult.rawText);

        // Delete any previous chunks for this document for idempotency
        await prisma.documentChunk.deleteMany({
          where: { summaryId: documentId },
        });

        if (chunks.length > 0) {
          // 1. Generate 768-dimensional embeddings for all chunks in batch
          const chunkContents = chunks.map((c) => c.content);
          const embeddings = await embedTexts(chunkContents);

          // 2. Persist chunks with pgvector embeddings to PostgreSQL
          for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const emb = embeddings[i];
            const vectorString = `[${emb.join(",")}]`;
            const chunkId = randomUUID();

            await prisma.$executeRawUnsafe(
              `INSERT INTO "DocumentChunk" ("id", "summaryId", "page_number", "section_path", "content", "token_estimate", "embedding", "created_at")
               VALUES ($1, $2, $3, $4, $5, $6, $7::vector, NOW())`,
              chunkId,
              documentId,
              chunk.pageNumber,
              chunk.sectionPath,
              chunk.content,
              chunk.tokenEstimate,
              vectorString
            );
          }
        }

        return { chunkCount: chunks.length };
      });

      // STEP 3: Generate AI Summary and finalize to READY
      await step.run("generate-summary", async () => {
        await prisma.pDFSummaries.update({
          where: { id: documentId },
          data: { doc_status: "INDEXING" },
        });

        const summary = await generateSummaryFromGemini(
          extractionResult.rawText
        );

        await prisma.pDFSummaries.update({
          where: { id: documentId },
          data: {
            summary_text: summary,
            doc_status: "READY",
          },
        });

        return { success: true };
      });

      return { success: true, documentId, chunkCount: chunkResult.chunkCount };
    } catch (error) {
      console.error("Document processing pipeline failed:", error);

      await prisma.pDFSummaries.update({
        where: { id: documentId },
        data: {
          doc_status: "FAILED",
          error_message:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      });

      throw error;
    }
  }
);
