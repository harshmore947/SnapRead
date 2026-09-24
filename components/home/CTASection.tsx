import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative isolate bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h2 className="font-display text-4xl font-600 tracking-tight text-rose-950 sm:text-5xl">
            Ready to save hours of reading time?
          </h2>
          <p className="max-w-2xl text-lg font-normal leading-relaxed text-gray-600 sm:text-xl">
            Transform lengthy documents into clear, actionable insights with
            our AI-powered summarizer.
          </p>
          <div className="mt-4">
            <Button
              asChild
              size="lg"
              variant="default"
              className="rounded-pill px-8 py-4 text-base font-light"
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