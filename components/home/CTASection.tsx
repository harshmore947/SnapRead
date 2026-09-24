import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative isolate bg-white section-rhythm">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h2 className="font-display text-4xl font-600 tracking-tight text-rose-950 sm:text-5xl lg:text-6xl">
            Ready to save hours of reading time?
          </h2>
          <p className="max-w-2xl text-base font-normal leading-relaxed tracking-tight-body text-gray-600 sm:text-lg">
            Transform lengthy documents into clear, actionable insights with
            our AI-powered summarizer.
          </p>
          <div className="mt-4">
            <Button
              asChild
              size="lg"
              variant="default"
              className="btn-primary"
            >
              <Link href="/sign-up" className="flex items-center gap-2">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}