import BgGradient from "@/components/common/bg-gradient";
import UploadFrom from "@/components/upload/upload-form";
import UploadHeader from "@/components/upload/upload-header";
import { getUserSummaryCount } from "@/actions/summary-actions";
import { Badge } from "@/components/ui/badge";
import React from "react";

export const dynamic = "force-dynamic";

export default async function page() {
  const summaryCountResult = await getUserSummaryCount();
  const currentCount = summaryCountResult.data || 0;

  return (
    <section className="min-h-screen">
      <BgGradient />
      <div className="mx-auto max-w-7xl px-6 py-24 ms:py-32 lg:px-8 flex flex-col item-center justify-center gap-6 text-center">
        <UploadHeader />

        {/* Summary count display */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <Badge
            variant={currentCount >= 3 ? "destructive" : "secondary"}
            className="text-sm"
          >
            {currentCount}/3 PDFs uploaded
          </Badge>
          {currentCount >= 3 && (
            <p className="text-sm text-red-600">
              You've reached the maximum limit. Delete a summary to upload a new
              one.
            </p>
          )}
        </div>

        <UploadFrom />
      </div>
    </section>
  );
}
