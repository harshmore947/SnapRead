"use client";

import { useState } from "react";
import { FileText, Bookmark, CheckCircle2 } from "lucide-react";

interface CitationBadgeProps {
  pageNumber: string | number;
  sectionTitle?: string;
}

export function CitationBadge({
  pageNumber,
  sectionTitle,
}: CitationBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cleanSection = sectionTitle?.trim() || "Document Reference";

  return (
    <span className="relative inline-block mx-1 align-baseline">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-all shadow-2xs cursor-pointer group"
        title={`View citation details: Page ${pageNumber}`}
      >
        <FileText className="h-3 w-3 text-rose-500 group-hover:scale-110 transition-transform" />
        <span>
          P.{pageNumber}
          {sectionTitle ? ` · ${sectionTitle.slice(0, 15)}${sectionTitle.length > 15 ? "…" : ""}` : ""}
        </span>
      </button>

      {/* Floating Citation Preview Card */}
      {isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 text-left text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-rose-100">
            <span className="font-semibold text-gray-900 flex items-center gap-1">
              <Bookmark className="h-3.5 w-3.5 text-rose-600" />
              Page {pageNumber} Citation
            </span>
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-2.5 w-2.5" />
              Verified
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-gray-500 text-[11px]">Section:</p>
            <p className="text-gray-800 font-medium leading-snug line-clamp-2">
              {cleanSection}
            </p>
          </div>

          <div className="mt-2 pt-1 text-[10px] text-gray-400 flex items-center justify-between">
            <span>Ground Truth Reference</span>
            <span className="font-mono text-rose-500">SnapRead RAG</span>
          </div>

          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-white border-r border-b border-rose-100 rotate-45" />
        </div>
      )}
    </span>
  );
}
