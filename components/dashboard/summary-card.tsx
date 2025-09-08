"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Trash2, Eye, Download, ExternalLink } from "lucide-react";
import { deleteSummary } from "@/actions/summary-actions";
import { downloadSummary } from "@/actions/download-actions";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PDFSummary {
  id: string;
  title: string;
  file_name: string;
  summary_text: string;
  status: boolean;
  created_at: Date;
  original_file_url: string;
}

interface SummaryCardProps {
  summary: PDFSummary;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSummary(summary.id);
      if (result.success) {
        toast.success("🗑️ Summary deleted successfully", {
          duration: 3000,
        });
        setIsDialogOpen(false);
      } else {
        toast.error(`❌ ${result.message || "Failed to delete summary"}`, {
          duration: 4000,
        });
      }
    } catch (error) {
      toast.error("⚠️ An error occurred while deleting the summary", {
        duration: 4000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsDownloading(true);
    try {
      const result = await downloadSummary(summary.id);

      if (result.success && result.data) {
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

  const handleViewPDF = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    window.open(summary.original_file_url, "_blank", "noopener,noreferrer");
    toast.success("🔗 Opening original PDF...");
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minutes ago`;
      }
      return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return "1 day ago";
    } else {
      return `${diffInDays} days ago`;
    }
  };

  const handleOnClick = (summaryId: string) => {
    router.push(`/summaries/${summaryId}`);
  };

  return (
    <Card
      className="w-full hover:scale-105 transition-all duration-400 ease-in-out hover:shadow-md hover:bg-white cursor-pointer"
      onClick={() => handleOnClick(summary.id)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <FileText className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {summary.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {getTimeAgo(summary.created_at)}
              </CardDescription>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-600"
                onClick={(e) => e.stopPropagation()} // Prevent card click
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Summary</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{summary.title}"? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-3">
            {summary.summary_text.length > 200
              ? `${summary.summary_text.substring(0, 200)}...`
              : summary.summary_text}
          </p>

          <div className="flex items-center justify-between">
            <Badge
              variant={summary.status ? "default" : "secondary"}
              className={summary.status ? "bg-green-100 text-green-800" : ""}
            >
              {summary.status ? "Completed" : "Processing"}
            </Badge>

            {/* <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-rose-600"
                onClick={handleViewPDF}
                title="View Original PDF"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-rose-600"
                onClick={handleDownload}
                disabled={isDownloading}
                title="Download Summary"
              >
                <Download className="h-4 w-4" />
              </Button>

              <Link href={`/summaries/${summary.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-rose-600"
                  title="View Summary"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
