"use client";

import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { downloadSummary } from "@/actions/download-actions";
import toast from "react-hot-toast";
import { useState } from "react";

interface DownloadButtonsProps {
  summaryId: string;
  originalFileUrl: string;
  summaryTitle: string;
}

export default function DownloadButtons({
  summaryId,
  originalFileUrl,
  summaryTitle,
}: DownloadButtonsProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadSummary = async () => {
    setIsDownloading(true);
    try {
      const result = await downloadSummary(summaryId);

      if (result.success && result.data) {
        // Create blob and download
        const blob = new Blob([result.data.content], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = result.data.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success("📄 Summary downloaded successfully!");
      } else {
        toast.error(result.error || "Failed to download summary");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download summary");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewOriginal = () => {
    window.open(originalFileUrl, "_blank", "noopener,noreferrer");
    toast.success("🔗 Opening original PDF...");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="default"
        className="text-xs h-7 px-2"
        onClick={handleViewOriginal}
      >
        <ExternalLink className="h-3 w-3 mr-1" />
        View PDF
      </Button>

      <Button
        size="sm"
        variant="default"
        className="text-xs h-7 px-2"
        onClick={handleDownloadSummary}
        disabled={isDownloading}
      >
        <Download className="h-3 w-3 mr-1" />
        {isDownloading ? "Downloading..." : "Download"}
      </Button>
    </div>
  );
}
