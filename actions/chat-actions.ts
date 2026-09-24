"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateChatResponseFromGemini } from "@/lib/geminiAI";

export async function getChatMessages(summaryId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        summaryId: summaryId,
        userId: userId,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return {
      success: true,
      data: messages,
    };
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return {
      success: false,
      error: "Failed to fetch chat messages",
    };
  }
}

export async function sendChatMessage(summaryId: string, message: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Get the PDF summary content for context
    const summary = await prisma.pDFSummaries.findFirst({
      where: {
        id: summaryId,
        userId: userId,
      },
    });

    if (!summary) {
      return {
        success: false,
        error: "Summary not found",
      };
    }

    // Generate AI response based on the PDF content using our Gemini function
    const response = await generateChatResponseFromGemini(
      summary.summary_text ?? "",
      summary.title,
      message
    );

    // Save the chat message and response to database
    const chatMessage = await prisma.chatMessage.create({
      data: {
        summaryId: summaryId,
        userId: userId,
        message: message,
        response: response,
      },
    });

    return {
      success: true,
      data: {
        id: chatMessage.id,
        message: chatMessage.message,
        response: chatMessage.response,
        created_at: chatMessage.created_at,
      },
    };
  } catch (error) {
    console.error("Error sending chat message:", error);
    return {
      success: false,
      error: "Failed to send message",
    };
  }
}

export async function deleteChatMessage(messageId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    await prisma.chatMessage.delete({
      where: {
        id: messageId,
        userId: userId, // Ensure user owns the message
      },
    });

    return {
      success: true,
      message: "Chat message deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting chat message:", error);
    return {
      success: false,
      error: "Failed to delete message",
    };
  }
}