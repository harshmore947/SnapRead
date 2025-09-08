"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { MessageCircle, FileText } from "lucide-react";
import SummaryViewer from "../summary/summary-viewer";
import ChatComponent from "../chat/chat-component";

interface SummaryLayoutProps {
  summaryText: string;
  summaryId: string;
  summaryTitle: string;
}

export default function SummaryLayout({
  summaryText,
  summaryId,
  summaryTitle,
}: SummaryLayoutProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "chat">("summary");

  return (
    <div className="w-full">
      {/* Mobile Tab Toggle */}
      <div className="xl:hidden mb-4">
        <div className="flex bg-rose-50 border border-rose-200 rounded-lg p-1">
          <Button
            variant={activeTab === "summary" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 text-sm ${
              activeTab === "summary"
                ? "bg-rose-600 text-white"
                : "text-gray-600 hover:text-rose-600"
            }`}
            onClick={() => setActiveTab("summary")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Summary
          </Button>
          <Button
            variant={activeTab === "chat" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 text-sm ${
              activeTab === "chat"
                ? "bg-rose-600 text-white"
                : "text-gray-600 hover:text-rose-600"
            }`}
            onClick={() => setActiveTab("chat")}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="xl:grid xl:grid-cols-2 xl:gap-6">
        {/* Summary Content */}
        <div
          className={`${
            activeTab === "summary" ? "block" : "hidden"
          } xl:block flex justify-center`}
        >
          <SummaryViewer summary={summaryText} />
        </div>

        {/* Chat Component */}
        <div
          className={`${
            activeTab === "chat" ? "block" : "hidden"
          } xl:block flex justify-center mt-6 xl:mt-0`}
        >
          <ChatComponent summaryId={summaryId} summaryTitle={summaryTitle} />
        </div>
      </div>
    </div>
  );
}
