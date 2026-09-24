"use client";

import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { file, z } from "zod";
import { generatePdfSummary } from "@/actions/upload-action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const schema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 20 * 1024 * 1024, "Max 20mb")
    .refine((f) => f.type === "application/pdf", "Only PDF"),
});

export default function UploadFrom() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    if (!file) {
      toast.error("📄 Please choose a PDF file", {
        duration: 3000,
      });
      setMessage("please choose a PDF file");
      return;
    }

    const parsed = schema.safeParse({ file });
    if (!parsed.success) {
      toast.error("❌ Invalid PDF file. Must be under 20MB", {
        duration: 4000,
      });
      setMessage("Error in pdf parsing");
      return;
    }

    try {
      setLoading(true);
      toast.loading("📤 Uploading your PDF...", {
        id: "upload-toast",
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.dismiss("upload-toast");
        toast.error(`❌ ${data?.error ?? "Upload failed"}`, {
          duration: 4000,
        });
        setMessage(data?.error ?? "upload failed");
        setLoading(false);
        return;
      }

      //data.asset.secure_url contains the hosted PDF
      const url = data.asset?.secure_url;
      toast.dismiss("upload-toast");
      toast.success("✅ PDF uploaded successfully!", {
        duration: 2000,
      });

      setMessage(url ? `Uploaded! ${url}` : "Uploaded, but no URL returned");

      // Dispatch background processing
      toast.loading("⚙️ Queueing document for processing...", {
        id: "process-toast",
      });
      const summaryData = [
        {
          serverData: {
            userId: userId!,
            file: {
              url: url,
              name: file.name,
            },
          },
        },
      ];

      const summary = await generatePdfSummary(summaryData);
      console.log(summary);

      toast.dismiss("process-toast");

      if (!summary.success) {
        toast.error(`🚫 ${summary.message}`, {
          duration: 5000,
        });
        setMessage(summary.message);
        setLoading(false);
        return;
      }

      toast.success("🚀 Processing started! Redirecting...", {
        duration: 2000,
      });

      router.push(`/summaries/${summary.data?.id}`);
      // Reset form after successful upload and summary generation
      setTimeout(() => {
        formRef.current?.reset();
        setMessage(null);
      }, 2000); // Show success message for 2 seconds before resetting
    } catch (error) {
      console.error(error);
      toast.dismiss("upload-toast");
      toast.dismiss("summary-toast");
      toast.error("⚠️ Upload failed. Please try again.", {
        duration: 4000,
      });
      setMessage("upload error");
      // Reset form on error after showing error message
      setTimeout(() => {
        formRef.current?.reset();
        setMessage(null);
      }, 3000); // Show error message for 3 seconds before resetting
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-8 w-full max-w-2xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="text-center">
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
        <h2 className="text-2xl font-semibold text-gray-900">Upload your PDF</h2>
        <p className="mt-2 text-gray-600">
          Drag and drop or click to select a PDF file (max 20MB)
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Input
          id="file"
          name="file"
          type="file"
          accept="application/pdf"
          className="rounded-pill cursor-pointer bg-white/50 border-rose-200 focus:border-rose-400 focus:ring-rose-400/30 focus:ring-[3px] px-5 py-3"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-pill py-3 text-base font-light"
          >
            {loading ? "Uploading..." : "Upload your PDF"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              formRef.current?.reset();
              setMessage(null);
              toast.success("🧹 Form cleared", {
                duration: 2000,
              });
            }}
            disabled={loading}
            className="flex-1 rounded-pill py-3 text-base font-light"
          >
            Clear
          </Button>
        </div>
      </div>

      {message && (
        <p className="text-sm text-center text-gray-600">{message}</p>
      )}
    </form>
  );
}