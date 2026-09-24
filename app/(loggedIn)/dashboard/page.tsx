import BgGradient from "@/components/common/bg-gradient";
import { Button } from "@/components/ui/button";
import SummaryCard from "@/components/dashboard/summary-card";
import { getUserSummaries } from "@/actions/summary-actions";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

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
          <div className="utility-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 mx-auto">
              <svg
                className="h-6 w-6 text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No summaries yet
            </h3>
            <p className="text-gray-600 mb-4">
              Upload your first PDF to get started with AI-powered summaries.
            </p>
            <Link href="/upload">
              <Button size="lg" variant="default" className="rounded-pill px-8 py-3 text-base font-light">
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
          <div className="rounded-sm bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm">
            You have reached the limit of 3 uploads
          </div>
        </div>
      )}
    </>
  );
}

export default async function DashboardPage() {
  return (
    <main className="min-h-screen bg-white">
      <BgGradient />
      <div className="flex flex-col gap-4 w-full">
        <div className="px-6 py-12 sm:py-12 flex gap-4 mb-8 justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-600 tracking-tight text-rose-950 sm:text-5xl">
              Your Summaries
            </h1>
            <p className="text-gray-600">
              Transform your PDFs into concise, actionable insights
            </p>
          </div>
          <Link href="/upload">
            <Button size="lg" variant="default" className="rounded-pill px-8 py-3 text-base font-light">
              <Plus className="h-4 w-4" /> New Summary
            </Button>
          </Link>
        </div>

        {/* Summary Cards Grid */}
        <div className="px-6 mb-6">
          <SummaryList />
        </div>
      </div>
    </main>
  );
}