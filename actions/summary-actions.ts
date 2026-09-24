"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserSummaries() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
        data: null,
      };
    }

    const summaries = await prisma.pDFSummaries.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      success: true,
      message: "Summaries fetched successfully",
      data: summaries,
    };
  } catch (error) {
    console.error("Error fetching summaries:", error);
    return {
      success: false,
      message: "Failed to fetch summaries",
      data: null,
    };
  }
}

export async function getUserSummaryCount() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
        data: 0,
      };
    }

    const count = await prisma.pDFSummaries.count({
      where: {
        userId: userId,
      },
    });

    return {
      success: true,
      message: "Summary count fetched successfully",
      data: count,
    };
  } catch (error) {
    console.error("Error fetching summary count:", error);
    return {
      success: false,
      message: "Failed to fetch summary count",
      data: 0,
    };
  }
}

export async function deleteSummary(summaryId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Check if summary belongs to the user
    const summary = await prisma.pDFSummaries.findFirst({
      where: {
        id: summaryId,
        userId: userId,
      },
    });

    if (!summary) {
      return {
        success: false,
        message: "Summary not found or access denied",
      };
    }

    // Delete the summary
    await prisma.pDFSummaries.delete({
      where: {
        id: summaryId,
      },
    });

    // Revalidate paths
    revalidatePath("/dashboard");
    revalidatePath("/summaries");
    revalidatePath(`/summaries/${summaryId}`);

    return {
      success: true,
      message: "Summary deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting summary:", error);
    return {
      success: false,
      message: "Failed to delete summary",
    };
  }
}