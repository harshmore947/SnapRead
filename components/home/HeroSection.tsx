"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, Sparkle } from "lucide-react";
import { Badge } from "../ui/badge";
import { useSession } from "next-auth/react";

export default function HeroSection() {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";

  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div className="relative mx-auto flex flex-col items-center justify-center px-6 py-24 sm:py-32 lg:px-8 lg:py-36 xl:py-44">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="secondary"
            className="relative mb-8 inline-flex items-center gap-2 rounded-pill bg-rose-50 px-5 py-2 text-sm font-normal text-rose-600 ring-1 ring-inset ring-rose-200"
          >
            <Sparkle className="h-4 w-4 text-rose-500" />
            Powered by AI
          </Badge>

          <h1 className="font-display text-5xl font-600 tracking-tight text-rose-950 sm:text-6xl lg:text-7xl xl:text-8xl">
            Transform PDFs into{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 bg-rose-600 px-2 text-white">concise</span>{" "}
            </span>
            summaries and chat
          </h1>

          <p className="mt-8 max-w-3xl text-lg font-normal leading-relaxed text-ink text-1D1D1F sm:text-xl">
            Get a beautiful, easy-to-read summary of your document in seconds.
            Ask questions and get grounded answers from the pages you care about.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="default"
              className="btn-primary"
            >
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-up"}
                className="flex items-center gap-2"
              >
                {isSignedIn ? "Go to Dashboard" : "Try SnapRead"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="btn-secondary"
            >
              <Link href="/upload">Upload a PDF</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}