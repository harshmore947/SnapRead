import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { SUMMARY_SYSTEM_PROMPT } from "./prompt";

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    console.log("Generating summary with Vercel AI SDK...");

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: SUMMARY_SYSTEM_PROMPT,
      prompt: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
      temperature: 0.7,
      maxOutputTokens: 1500,
    });

    if (!text || text.trim() === "") {
      console.log("Empty response from Gemini API");
      return "Summary generation failed - please try again later.";
    }

    console.log("Summary generated successfully");
    return text.trim();
  } catch (error) {
    console.error("Gemini API Error with Vercel AI SDK:", error);
    throw new Error("Failed to generate summary from Gemini API");
  }
};

export const generateChatResponseFromGemini = async (
  summaryText: string,
  documentTitle: string,
  userQuestion: string
) => {
  try {
    console.log("Generating chat response with Vercel AI SDK...");

    const chatSystemPrompt = `You are an AI assistant helping users understand a PDF document. You should:
- Provide helpful, accurate responses based on the document content
- Be conversational and friendly
- If the question cannot be answered from the document content, politely let the user know
- Keep responses concise but informative
- Use emojis sparingly and appropriately`;

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: chatSystemPrompt,
      prompt: `Document Title: ${documentTitle}

Document Summary: ${summaryText}

User Question: ${userQuestion}

Please provide a helpful response based on the document content above.`,
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    if (!text || text.trim() === "") {
      console.log("Empty response from Gemini API for chat");
      return "I apologize, but I couldn't generate a response at this time. Please try asking your question again.";
    }

    console.log("Chat response generated successfully");
    return text.trim();
  } catch (error) {
    console.error("Gemini API Error for chat with Vercel AI SDK:", error);
    throw new Error("Failed to generate chat response from Gemini API");
  }
};
