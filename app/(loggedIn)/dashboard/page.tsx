import BgGradient from "@/components/common/bg-gradient";
import { Button } from "@/components/ui/button";
import SummaryCard from "@/components/dashboard/summary-card";
import { getUserSummaries } from "@/actions/summary-actions";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

function SummaryListSkeleton() {
  return null;
}

async function SummaryList() {
  const result = await getUserSummaries();
  const summaries = result.success ? result.data : [];

  return (
    <>
      {summaries && summaries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaries.map((summary) => (
            <SummaryCard key={summary.id} summary={summary} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No summaries yet
            </h3>
            <p className="text-gray-600 mb-4">
              Upload your first PDF to get started with AI-powered summaries.
            </p>
            <Link href="/upload">
              <Button className="bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-500">
                <Plus className="h-4 w-4 mr-2" />
                Upload PDF
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Upload Limit Notice */}
      {summaries && summaries.length >= 3 && (
        <div className="px-2 mb-6 mt-6">
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800">
            <p className="text-sm">You have reached the limit of 3 uploads</p>
          </div>
        </div>
      )}
    </>
  );
}

export default async function DashboardPage() {
  return (
    <main className="min-h-screen">
      <BgGradient />
      <div className="flex flex-col gap-4 w-full">
        <div className="px-2 py-12 sm:py-12 flex gap-4 mb-8 justify-between items-center">
          <div className="flex flex-col gap-2 ">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
              Your Summaries
            </h1>
            <p className="text-gray-600">
              Transform your PDFs into concise, actionable insights
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-rose-500 to-rose-700 hover:no-underline hover:from-rose-600 hover:to-rose-500 hover:scale-105 transition-all duration-300 ease-in-out"
            variant={"link"}
          >
            <Link
              href={"/upload"}
              className="flex text-white items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              New Summary
            </Link>
          </Button>
        </div>

        {/* Summary Cards Grid */}
        <div className="px-2 mb-6">
          <SummaryList />
        </div>
      </div>
    </main>
  );
}
