import BgGradient from "@/components/common/bg-gradient";
import CTASection from "@/components/home/CTASection";
import ChatSection from "@/components/home/ChatSection";
import DemoSection from "@/components/home/DemoSection";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PricingSection from "@/components/home/PricingSection";

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
        <ChatSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </div>
    </div>
  );
}
