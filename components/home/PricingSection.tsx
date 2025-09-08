import { cn } from "@/lib/utils";
import { ArrowRight, CheckIcon, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
  return (
    <section className="relative overflow-hidden " id="pricing">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:pt-12">
        <div className="flex items-center justify-center w-full pb-12 ">
          <h2 className="uppercase font--bold text-xl mb-8 text-rose-500">
            Pricing
          </h2>
        </div>

        {/* Coming Soon Section */}
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-rose-50 rounded-3xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-white rounded-3xl transform -rotate-1"></div>

            {/* Main content */}
            <div className="relative bg-white rounded-3xl border-2 border-rose-200 p-12 shadow-lg">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 bg-yellow-400 rounded-full animate-pulse">
                    <Sparkles className="w-4 h-4 text-yellow-800" />
                  </div>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Pricing Plans Coming Soon!
              </h3>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                We're working hard to bring you flexible pricing options that
                fit your needs. For now, enjoy unlimited access to all features
                while we perfect our plans.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Currently Free</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Stay tuned for updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
