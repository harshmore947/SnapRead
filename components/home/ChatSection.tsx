"use client";

import React from "react";
import { Button } from "../ui/button";
import { MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function ChatSection() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative mx-auto flex flex-col items-center justify-center py-16 sm:py-20 lg:py-28 transition-all animate-in lg:px-12 max-w-7xl">
      <div className="text-center mb-12">
        {/* <div className="relative p-[1px] overflow-hidden rounded-full bg-gradient-to-r from-rose-200 via-rose-500 to-rose-800 animate-gradient-x group mb-6">
          <div className="relative px-6 py-2 bg-white rounded-full">
            <MessageCircle className="h-5 w-5 mr-2 text-rose-600 inline" />
            <span className="text-sm font-medium text-rose-600">
              Interactive Chat
            </span>
          </div>
        </div> */}

        <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl mb-6">
          Chat with Your{" "}
          <span className="relative inline-block">
            <span className="relative z-10 px-2">Documents</span>
            <span className="absolute inset-0 bg-rose-200/50 -rotate-1 rounded-lg transform -skew-y-1"></span>
          </span>
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Ask questions, get insights, and interact with your PDFs using
          advanced AI. Get instant answers from your documents.
        </p>
      </div>

      {/* Chat Preview */}
      <div className="relative w-full max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-rose-400 to-rose-500 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white/20 rounded-full"></div>
              <div className="w-3 h-3 bg-white/20 rounded-full"></div>
              <div className="w-3 h-3 bg-white/20 rounded-full"></div>
              <div className="flex-1 text-center">
                <span className="text-white font-medium text-sm">
                  SnapRead Chat
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-6 space-y-4">
            <div className="flex justify-end">
              <div className="bg-rose-500 text-white px-4 py-2 rounded-lg max-w-xs">
                <p className="text-sm">
                  What are the key findings in this report?
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg max-w-md">
                <p className="text-sm">
                  Based on the document, the key findings include: market growth
                  of 15%, increased customer satisfaction, and improved
                  operational efficiency. The report highlights three main areas
                  of success...
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-rose-500 text-white px-4 py-2 rounded-lg max-w-xs">
                <p className="text-sm">Summarize the conclusion</p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg max-w-sm">
                <p className="text-sm">
                  The conclusion emphasizes sustainable growth strategies and
                  recommends immediate implementation of the proposed changes.
                </p>
                <div className="flex items-center mt-2">
                  <Sparkles className="h-3 w-3 text-rose-500 mr-1" />
                  <span className="text-xs text-rose-500 font-medium">
                    AI Generated
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Ask anything about your document..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                disabled
              />
              <Button
                className="bg-rose-500 hover:bg-rose-600 text-white px-6"
                disabled
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      {/* <div className="text-center">
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 text-lg font-medium group">
            Start Chatting
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div> */}
    </section>
  );
}
