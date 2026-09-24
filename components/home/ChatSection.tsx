"use client";

import React from "react";
import { Button } from "../ui/button";
import { MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ChatSection() {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";

  return (
    <section className="relative isolate overflow-hidden bg-rose-950 section-rhythm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-pill bg-white/10 px-5 py-2 text-sm font-normal text-white ring-1 ring-inset ring-white/20">
            <MessageCircle className="h-4 w-4 text-rose-300" />
            Interactive Chat
          </div>

          <h2 className="font-display text-4xl font-600 tracking-tight text-white sm:text-5xl lg:text-6xl">
            Chat with your{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 bg-rose-500 px-2 text-white">documents</span>
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-base font-normal leading-normal tracking-tight-body text-white/90 sm:text-xl">
            Ask questions, get insights, and interact with your PDFs using advanced AI. Get instant, grounded answers from your documents.
          </p>
        </div>

        {/* Chat Preview */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-utility-card border border-white/10 bg-white shadow-2xl">
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-4">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-rose-300" />
              <span className="h-3 w-3 rounded-full bg-rose-200" />
              <span className="ml-3 text-sm font-medium text-gray-700">
                SnapRead Chat
              </span>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 bg-white p-6">
              <div className="flex justify-end">
                <div className="max-w-xs rounded-2xl bg-rose-600 px-4 py-3 text-sm text-white">
                  What are the key findings in this report?
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-md rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-800">
                  Based on the document, the key findings include: market growth of 15%, increased customer satisfaction, and improved operational efficiency. The report highlights three main areas of success...
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-xs rounded-2xl bg-rose-600 px-4 py-3 text-sm text-white">
                  Summarize the conclusion
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-sm rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-800">
                  The conclusion emphasizes sustainable growth strategies and recommends immediate implementation of the proposed changes.
                  <span className="mt-2 flex items-center gap-1 text-xs text-rose-500">
                    <Sparkles className="h-3 w-3" />
                    AI Generated
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-3 border-t border-gray-100 bg-white p-4">
            <input
              type="text"
              placeholder="Ask anything about your document..."
              className="flex-1 rounded-pill border border-gray-200 bg-gray-50 px-5 py-3 text-base text-gray-600 outline-none"
            />
            <Button className="rounded-pill bg-rose-600 px-6 py-3 text-white hover:bg-rose-700">
              Send
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            variant="default"
            className="btn-primary"
          >
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className="flex items-center gap-2">
              Start chatting
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}