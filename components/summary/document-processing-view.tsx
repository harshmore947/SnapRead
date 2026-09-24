"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Loader2, XCircle, FileSearch, Sparkles, Scissors, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export type DocumentStatus =
  | "UPLOADED"
  | "QUEUED"
  | "PARSING"
  | "CHUNKING"
  | "INDEXING"
  | "READY"
  | "FAILED";

interface DocumentProcessingViewProps {
  documentId: string;
  initialStatus: DocumentStatus;
  initialErrorMessage?: string | null;
  documentTitle: string;
}

const STEPS: Array<{
  key: DocumentStatus;
  label: string;
  description: string;
  icon: React.ElementType;
}> = [
  {
    key: "QUEUED",
    label: "Queued",
    description: "Waiting for background worker resources",
    icon: Clock,
  },
  {
    key: "PARSING",
    label: "Extracting Text",
    description: "Extracting pages and raw textual content",
    icon: FileSearch,
  },
  {
    key: "CHUNKING",
    label: "Chunking & Structuring",
    description: "Splitting text into coherent semantic chunks",
    icon: Scissors,
  },
  {
    key: "INDEXING",
    label: "Generating AI Summary",
    description: "Synthesizing insights using Gemini 2.5 Flash",
    icon: Sparkles,
  },
];

export default function DocumentProcessingView({
  documentId,
  initialStatus,
  initialErrorMessage,
  documentTitle,
}: DocumentProcessingViewProps) {
  const [status, setStatus] = useState<DocumentStatus>(initialStatus);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialErrorMessage ?? null
  );
  const router = useRouter();

  const getStepIndex = (currentStatus: DocumentStatus) => {
    switch (currentStatus) {
      case "UPLOADED":
      case "QUEUED":
        return 0;
      case "PARSING":
        return 1;
      case "CHUNKING":
        return 2;
      case "INDEXING":
        return 3;
      case "READY":
        return 4;
      case "FAILED":
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(status);

  useEffect(() => {
    if (status === "READY" || status === "FAILED") {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/documents/${documentId}/status`);
        if (!res.ok) return;

        const data = await res.json();
        if (data.document) {
          setStatus(data.document.doc_status);
          if (data.document.error_message) {
            setErrorMessage(data.document.error_message);
          }

          if (data.document.doc_status === "READY") {
            router.refresh();
          }
        }
      } catch (err) {
        console.error("Failed to poll document status:", err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [documentId, status, router]);

  if (status === "FAILED") {
    return (
      <div className="utility-card p-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mx-auto">
          <XCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Failed</h2>
        <p className="text-sm text-gray-600 mb-4">
          We encountered an error while processing <span className="font-medium text-gray-800">{documentTitle}</span>.
        </p>
        {errorMessage && (
          <div className="mt-4 p-4 rounded-sm bg-red-50 text-red-800 text-xs font-mono overflow-auto max-h-40">
            {errorMessage}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="w-full mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="utility-card p-6">
      <div className="mb-4 flex items-center gap-2 rounded-sm bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Durable Ingestion Pipeline Running
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-1">Processing Your Document</h2>
      <p className="text-sm text-gray-500">
        We are analyzing and summarizing <span className="font-medium text-gray-700">{documentTitle}</span>.
      </p>

      <div className="mt-6 space-y-6">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentStepIndex > idx;
          const isCurrent = currentStepIndex === idx;

          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-emerald-200 bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                ) : isCurrent ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-rose-300 bg-rose-50 text-rose-600 animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-gray-200 bg-gray-50 text-gray-400">
                    <Circle className="h-4 w-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-semibold ${
                      isCompleted
                        ? "text-emerald-700"
                        : isCurrent
                        ? "text-rose-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  <Icon
                    className={`h-4 w-4 ${
                      isCompleted
                        ? "text-emerald-500"
                        : isCurrent
                        ? "text-rose-500"
                        : "text-gray-300"
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}