import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export interface ChatHistoryMessage {
  role: "user" | "assistant" | "system" | string;
  content: string;
}

/**
 * Module 5: Conversational Query Contextualizer
 *
 * In a multi-turn chat, users often ask follow-up questions referencing previous answers
 * using pronouns or elliptical phrasing (e.g. "How does it mitigate the first one?").
 *
 * If we search vector/keyword storage with "How does it mitigate the first one?",
 * the retrieval will fail because the embedding has no context on what "the first one" is.
 *
 * This function uses Gemini Flash to reformulate follow-up queries into standalone,
 * fully-qualified search queries before executing Hybrid Search (pgvector + FTS).
 */
export async function contextualizeQuery({
  history,
  latestQuery,
}: {
  history: ChatHistoryMessage[];
  latestQuery: string;
}): Promise<string> {
  const cleanQuery = latestQuery.trim();

  // If there's no previous history (first question), it's already standalone
  if (!history || history.length === 0 || !cleanQuery) {
    return cleanQuery;
  }

  // Filter and take the last 6 messages to keep context concise
  const recentHistory = history
    .slice(-6)
    .filter((msg) => msg.content && typeof msg.content === "string");

  if (recentHistory.length === 0) {
    return cleanQuery;
  }

  try {
    const formattedHistory = recentHistory
      .map(
        (msg) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content.slice(
            0,
            500
          )}`
      )
      .join("\n");

    const prompt = `Given the following conversation history and a follow-up user question, reformulate the follow-up question into a standalone search query that contains all necessary context (replacing pronouns like "it", "they", "the first one", "this" with the actual topics discussed).

CONVERSATION HISTORY:
${formattedHistory}

FOLLOW-UP QUESTION:
${cleanQuery}

INSTRUCTIONS:
1. Return ONLY the standalone search query.
2. DO NOT answer the question.
3. If the question is already clear and self-contained, return it as-is.
4. Keep the rewritten query concise, clear, and keyword-rich for document retrieval.

STANDALONE QUERY:`;

    const response = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
      // Lower temperature for deterministic query reformulation
      temperature: 0.1,
    });

    const rewritten = response.text.trim().replace(/^["']|["']$/g, "");

    if (rewritten && rewritten.length > 2) {
      return rewritten;
    }

    return cleanQuery;
  } catch (error) {
    console.warn("Contextualize query fallback to original query:", error);
    return cleanQuery;
  }
}
