import { ArrowRight, CheckIcon, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden bg-white py-80 lg:py-80"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-normal uppercase tracking-wide text-rose-600">
            Pricing
          </p>
          <h2 className="font-display mt-4 text-4xl font-600 tracking-tight text-rose-950 sm:text-5xl">
            Pricing plans coming soon
          </h2>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="utility-card relative max-w-xl p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-white">
              <Clock className="h-8 w-8" />
            </div>

            <h3 className="text-3xl font-600 text-rose-950">
              Pricing Plans Coming Soon!
            </h3>

            <p className="mt-4 text-base font-normal leading-relaxed text-gray-600">
              We're working hard to bring you flexible pricing options that fit
              your needs. For now, enjoy unlimited access to all features while
              we perfect our plans.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <span className="inline-flex items-center gap-2 rounded-pill bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700">
                <Sparkles className="h-4 w-4" /> Currently Free
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" /> Stay tuned for updates
              </span>
            </div>

            <div className="mt-10">
              <Button asChild size="lg" variant="default" className="rounded-pill px-8 py-4 text-base font-light">
                <Link href="/sign-up" className="flex items-center gap-2">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}