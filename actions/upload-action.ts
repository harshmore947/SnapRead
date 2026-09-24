"use server";

import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
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
      userId,
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

  // Authenticate user with Clerk
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId || clerkUserId !== userId) {
    console.error("User authentication mismatch!");
    return {
      success: false,
      message: "User authentication failed",
      data: null,
    };
  }

  const clerkUser = await currentUser();

  try {
    // Check if user exists in database, if not create them
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log("User not found in database, creating user record");
      try {
        user = await prisma.user.create({
          data: {
            id: userId,
            email:
              clerkUser?.emailAddresses[0]?.emailAddress ||
              `user_${userId}@temp.com`,
            full_name: clerkUser
              ? `${clerkUser.firstName || ""} ${
                  clerkUser.lastName || ""
                }`.trim() || "User"
              : "User",
            customer_id: "",
            price_id: "",
            status: true,
          },
        });
        console.log("User created successfully:", user.id);
      } catch (createUserError) {
        console.error(
          "Failed to create user - detailed error:",
          createUserError
        );
        return {
          success: false,
          message: "Failed to create user record",
          data: null,
        };
      }
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
