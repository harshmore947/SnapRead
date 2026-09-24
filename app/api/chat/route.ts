import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hybridSearch, formatRetrievedContext } from "@/lib/retrieval";
import { contextualizeQuery } from "@/lib/query-rewriter";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1. Verify user authentication with NextAuth
    const session = await auth();
    const userId = session?.user?.id;
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

    // 4. Extract latest user query & history for Conversational RAG
    const lastUserMessage = messages[messages.length - 1];
    let userQuery = "Explain this document";

    if (lastUserMessage) {
      if (typeof lastUserMessage.content === "string") {
        userQuery = lastUserMessage.content;
      } else if (Array.isArray(lastUserMessage.parts)) {
        userQuery =
          lastUserMessage.parts
            .filter((p: any) => p.type === "text")
            .map((p: any) => p.text)
            .join("") || userQuery;
      }
    }

    // Format previous messages for conversational contextualization
    const previousHistory = messages.slice(0, -1).map((m: any) => {
      let content = "";
      if (typeof m.content === "string") {
        content = m.content;
      } else if (Array.isArray(m.parts)) {
        content = m.parts
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("");
      }
      return {
        role: m.role,
        content,
      };
    });

    // 5. Module 5: Multi-Turn Query Contextualization (Gemini Flash)
    const contextualizedQuery = await contextualizeQuery({
      history: previousHistory,
      latestQuery: userQuery,
    });

    // 6. Hybrid Search (Dense pgvector Cosine Distance + Sparse Full-Text Search RRF)
    const relevantChunks = await hybridSearch({
      summaryId,
      query: contextualizedQuery,
      topK: 5,
    });

    const retrievedContext = formatRetrievedContext(relevantChunks);

    // 7. Construct Grounded System Prompt with Strict Citations
    const systemPrompt = `You are an expert AI Document Intelligence assistant analyzing "${doc.title}" (${doc.file_name}).

Your goal is to provide precise, well-structured, and helpful answers grounded STRICTLY in the retrieved document context below.

CITATION GUIDELINES:
- Every single factual statement, statistic, claim, or key concept MUST cite its exact source tag using standard bracketed notation: [Page X: Section Title].
- Example: "The quarterly revenue grew by 24% in Q3 [Page 4: Financial Highlights]."
- If multiple sections support a point, include all citations: [Page 2: Executive Summary] [Page 5: Market Analysis].
- If the answer is not present in the retrieved context, politely state: "I couldn't find specific information about that in the document."
- Use clean Markdown with headers, bold text, and bullet points for high legibility.

RETRIEVED DOCUMENT CONTEXT (Ground Truth):
${retrievedContext}

HIGH-LEVEL DOCUMENT SUMMARY (Background):
${doc.summary_text ?? "N/A"}`;

    // 8. Stream AI response with Google Gemini 2.5 Flash
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
                message: userQuery,
                response: text,
              },
            });
          } catch (saveError) {
            console.error("Error saving chat message to database:", saveError);
          }
        }
      },
    });

    // 9. Return UI Message stream response for useChat()
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
