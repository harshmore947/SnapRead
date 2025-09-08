"use client";

import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { file, z } from "zod";
import { generatePdfSummary } from "@/actions/upload-action";
import { useAuth } from "@clerk/nextjs";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
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
  const { userId } = useAuth();
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

      // Prepare data for summary generation
      toast.loading("🤖 Generating AI summary...", {
        id: "summary-toast",
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

      toast.dismiss("summary-toast");

      if (!summary.success) {
        toast.error(`🚫 ${summary.message}`, {
          duration: 5000,
        });
        setMessage(summary.message);
        setLoading(false);
        return;
      }

      toast.success("🎉 Summary generated successfully!", {
        duration: 3000,
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

    //uplaod the file to cloudinary

    //summarize the pdf using lang chain
    //summarie the pdf using AI
    //save the summary to the database
    //redirect to the [id summary] page
  }
  return (
    <form
      ref={formRef}
      className="flex flex-col gap-8 w-full max-w-2xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-end items-center gap-1">
        <div className="w-full flex justify-end items-center gap-1">
          <Input id="file" name="file" type="file" accept="application/pdf" />
          <Button disabled={loading}>Upload your pdf</Button>
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
          >
            Clear
          </Button>
        </div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </form>
  );
}
