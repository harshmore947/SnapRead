"use server";

import { generateSummaryFromGemini } from "@/lib/geminiAI";
import { fectAndExtractionPdfText } from "@/lib/langchain";
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
  if (!uploadResponse) {
    return {
      success: false,
      message: "failed upload file in summary function",
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
      message: "failed upload file in summary function",
      data: null,
    };
  }

  // Get user data from Clerk
  const { userId: clerkUserId } = await auth();
  console.log("Auth check - Form userId:", userId);
  console.log("Auth check - Clerk userId:", clerkUserId);

  if (!clerkUserId || clerkUserId !== userId) {
    console.error("User authentication mismatch!");
    return {
      success: false,
      message: "User authentication failed",
      data: null,
    };
  }

  // Get full user data from Clerk
  const clerkUser = await currentUser();
  console.log(
    "Clerk currentUser result:",
    clerkUser ? "User data retrieved" : "No user data"
  );

  if (!clerkUser) {
    console.log("No clerk user data available, using basic user creation");
  }

  try {
    const pdfText = await fectAndExtractionPdfText(pdfUrl);
    console.log("PDF text extracted successfully");

    // Check if user exists in database, if not create them
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    console.log("User lookup result:", user ? "User found" : "User not found");

    if (!user) {
      console.log("User not found in database, creating user record");
      console.log("Clerk user data:", {
        id: clerkUser?.id,
        email: clerkUser?.emailAddresses[0]?.emailAddress,
        firstName: clerkUser?.firstName,
        lastName: clerkUser?.lastName,
      });

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
    } else {
      console.log("User already exists:", user.id);
    }

    // Check if user has reached the 3 PDF limit
    const existingSummaryCount = await prisma.pDFSummaries.count({
      where: {
        userId: userId,
      },
    });

    console.log("User's current summary count:", existingSummaryCount);

    if (existingSummaryCount >= 3) {
      console.log("User has reached the maximum limit of 3 PDFs");
      return {
        success: false,
        message:
          "You have reached the maximum limit of 3 PDF summaries. Please delete an existing summary to upload a new one.",
        data: null,
      };
    }

    let summary = "";
    try {
      console.log("Entering Google Gemini");
      summary = await generateSummaryFromGemini(pdfText);
      console.log(summary);
    } catch (geminiError) {
      console.log("Gemini API failed, proceeding without summary");
      summary = "Summary generation failed - please try again later";
    }

    // Save to database
    console.log("About to save PDF summary with userId:", userId);
    console.log("User object:", user);

    const savedSummary = await prisma.pDFSummaries.create({
      data: {
        userId: userId,
        original_file_url: pdfUrl,
        summary_text: summary,
        status: true,
        title: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension for title
        file_name: fileName,
      },
    });

    console.log("PDF summary saved to database:", savedSummary.id);

    revalidatePath(`/summaries/${savedSummary.id}`);

    return {
      success: true,
      message: "PDF processed and saved successfully",
      data: {
        id: savedSummary.id,
        summary: summary,
        title: savedSummary.title,
        fileName: savedSummary.file_name,
        createdAt: savedSummary.created_at,
      },
    };
  } catch (error) {
    console.error("Error processing PDF:", error);
    return {
      success: false,
      message: "Failed to process PDF",
      data: null,
    };
  }
}
