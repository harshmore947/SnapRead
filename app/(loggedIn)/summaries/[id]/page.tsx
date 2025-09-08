import BgGradient from "@/components/common/bg-gradient";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, FileText, Calendar, Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DownloadButtons from "@/components/summary/download-buttons";
import SummaryLayout from "@/components/summary/summary-layout";

export const dynamic = "force-dynamic";

interface SummaryPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getSummary(id: string, userId: string) {
  try {
    const summary = await prisma.pDFSummaries.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });
    return summary;
  } catch (error) {
    console.error("Error fetching summary:", error);
    return null;
  }
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { userId } = await auth();

  if (!userId) {
    return notFound();
  }

  const { id } = await params;
  const summary = await getSummary(id, userId);

  if (!summary) {
    return notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <main className="min-h-screen">
      <BgGradient />
      <div className="container mx-auto py-4 max-w-4xl">
        {/* Compact Header with pink background */}
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4">
          {/* Top navigation bar - more compact */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-rose-600">
                <Sparkles className="h-3 w-3" />
                <span className="text-xs font-medium">AI Summary</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  {formatDate(summary.created_at)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-3 w-3" />
                <span className="text-xs">
                  {getReadingTime(summary.summary_text)}
                </span>
              </div>
            </div>

            <Link href="/dashboard">
              <Button size="sm" variant="default" className="text-xs h-7 px-2">
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Main title - more compact */}
              <h1 className="text-lg font-bold text-rose-600 mb-2">
                {summary.title}
              </h1>

              {/* Source information - inline */}
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="h-3 w-3 text-rose-400" />
                <span className="text-xs">Source: {summary.file_name}</span>
              </div>
            </div>

            {/* Action buttons - compact */}
            <div className="ml-4">
              <DownloadButtons
                summaryId={summary.id}
                originalFileUrl={summary.original_file_url}
                summaryTitle={summary.title}
              />
            </div>
          </div>
        </div>

        {/* Content Area - Summary and Chat */}
        <SummaryLayout
          summaryText={summary.summary_text}
          summaryId={summary.id}
          summaryTitle={summary.title}
        />
      </div>
    </main>
  );
}
