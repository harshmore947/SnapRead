import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { hybridSearch, formatRetrievedContext } from "@/lib/retrieval";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1. Verify user authentication with Clerk
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Parse request body (messages from useChat and summaryId)
    const { messages, summaryId } = await req.json();

    if (!summaryId) {
      return new Response("Missing summaryId", { status: 400 });
    }

    // 3. Verify document ownership & fetch metadata
    const doc = await prisma.pDFSummaries.findFirst({
      where: {
        id: summaryId,
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        file_name: true,
        summary_text: true,
      },
    });

    if (!doc) {
      return new Response("Document not found", { status: 404 });
    }

    // 4. Extract latest user query for Hybrid RAG Retrieval
    const lastUserMessage = messages[messages.length - 1];
    const userQuery =
      typeof lastUserMessage?.content === "string"
        ? lastUserMessage.content
        : "Explain this document";

    // 5. Module 3: Hybrid Search (pgvector Cosine Distance + Full-Text Search RRF)
    const relevantChunks = await hybridSearch({
      summaryId,
      query: userQuery,
      topK: 5,
    });

    const retrievedContext = formatRetrievedContext(relevantChunks);

    // 6. Construct Grounded Prompt with Citations
    const systemPrompt = `You are an expert AI Document Intelligence assistant analyzing "${doc.title}" (${doc.file_name}).

Your goal is to provide precise, accurate, and helpful answers grounded STRICTLY in the retrieved document context below.

CITATION GUIDELINES:
- Every factual claim MUST include a citation tag referring to its source page and section, e.g. [Page X: Section Title].
- If multiple sections contribute to an answer, cite each relevant section.
- If the answer cannot be found in the provided context, politely say: "I couldn't find specific information about that in the document."
- Format answers cleanly with Markdown headings, bullet points, and bold keywords.

RETRIEVED DOCUMENT CONTEXT:
${retrievedContext}

DOCUMENT SUMMARY FOR HIGH-LEVEL CONTEXT:
${doc.summary_text ?? "N/A"}`;

    // 7. Stream AI response with Google Gemini 2.5 Flash
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages,
      onFinish: async ({ text }) => {
        // Save conversation turn to PostgreSQL
        if (lastUserMessage && text) {
          try {
            await prisma.chatMessage.create({
              data: {
                summaryId,
                userId,
                message:
                  typeof lastUserMessage.content === "string"
                    ? lastUserMessage.content
                    : JSON.stringify(lastUserMessage.content),
                response: text,
              },
            });
          } catch (saveError) {
            console.error("Error saving chat message to database:", saveError);
          }
        }
      },
    });

    // 8. Return UI Message stream response for useChat()
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
