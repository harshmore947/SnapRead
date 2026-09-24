"use server";

import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function generatePdfSummary(
  uploadResponse: Array<{
    serverData: {
      userId: string;
      file: {
        url: string;
        name: string;
      };
    };
  }>
) {
  if (!uploadResponse || uploadResponse.length === 0) {
    return {
      success: false,
      message: "Failed to upload file: No upload response received",
      data: null,
    };
  }

  const {
    serverData: {
      userId: providedUserId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return {
      success: false,
      message: "Failed to upload file: No PDF URL returned",
      data: null,
    };
  }

  // Authenticate user with NextAuth
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return {
      success: false,
      message: "Unauthorized",
      data: null,
    };
  }

  // Optional: verify that the provided userId matches the session userId
  if (providedUserId !== userId) {
    console.error("User ID mismatch: provided", providedUserId, "session", userId);
    return {
      success: false,
      message: "User authentication failed",
      data: null,
    };
  }

  try {
    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // User should have been created via sign-up; if not found, return error.
      console.error("User not found in database for id:", userId);
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    // Check if user has reached the 3 PDF limit
    const existingSummaryCount = await prisma.pDFSummaries.count({
      where: {
        userId: userId,
      },
    });

    if (existingSummaryCount >= 3) {
      console.log("User has reached the maximum limit of 3 PDFs");
      return {
        success: false,
        message:
          "You have reached the maximum limit of 3 PDF summaries. Please delete an existing summary to upload a new one.",
        data: null,
      };
    }

    // Create initial document record with QUEUED status
    const savedSummary = await prisma.pDFSummaries.create({
      data: {
        userId: userId,
        original_file_url: pdfUrl,
        doc_status: "QUEUED",
        title: fileName.replace(/\.[^/.]+$/, ""), // Strip file extension
        file_name: fileName,
      },
    });

    console.log("Document queued in database with ID:", savedSummary.id);

    // Trigger asynchronous durable processing pipeline via Inngest
    await inngest.send({
      name: "document/uploaded",
      data: {
        documentId: savedSummary.id,
        fileUrl: pdfUrl,
      },
    });

    console.log("Inngest event 'document/uploaded' dispatched successfully");

    revalidatePath(`/summaries/${savedSummary.id}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "PDF uploaded and processing started",
      data: {
        id: savedSummary.id,
        title: savedSummary.title,
        fileName: savedSummary.file_name,
        doc_status: savedSummary.doc_status,
        createdAt: savedSummary.created_at,
      },
    };
  } catch (error) {
    console.error("Error initiating PDF processing:", error);
    return {
      success: false,
      message: "Failed to initiate PDF processing",
      data: null,
    };
  }
}