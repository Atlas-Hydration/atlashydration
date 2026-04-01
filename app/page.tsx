import type { Metadata } from "next";
import HeroSection from "@/app/components/home/HeroSection";
import VitaminStrip from "@/app/components/home/VitaminStrip";
import FeaturedProduct from "@/app/components/home/FeaturedProduct";
import ScienceSection from "@/app/components/home/ScienceSection";
import CompareSection from "@/app/components/home/CompareSection";
import ReviewsSection from "@/app/components/home/ReviewsSection";
import WhyAtlasSection from "@/app/components/home/WhyAtlasSection";
import HydrationBenefits from "@/app/components/home/HydrationBenefits";
import DailyElectrolytes from "@/app/components/home/DailyElectrolytes";
import BlogSection from "@/app/components/home/BlogSection";
import FounderSection from "@/app/components/home/FounderSection";
import FaqSection from "@/app/components/home/FaqSection";
import CtaSection from "@/app/components/home/CtaSection";
import DarkCta from "@/app/components/home/DarkCta";
import StickyBuyBar from "@/app/components/home/StickyBuyBar";


export const metadata: Metadata = {
  title: "Atlas Hydration | Zero-Sugar Electrolyte Mixes",
  description:
    "Shop premium zero-sugar electrolyte drink mixes with 1,769mg electrolytes, B vitamins, and amino acids. Subscribe and save 20%. Free shipping over $50.",
  keywords:
    "electrolyte drink mix, zero sugar electrolytes, sports hydration, Atlas Hydration, electrolyte powder, sugar free hydration, recovery drink",
  openGraph: {
    type: "website",
    title: "Atlas Hydration | Zero-Sugar Electrolyte Mixes",
    description:
      "Premium zero-sugar electrolyte drink mixes with 1,769mg electrolytes, B vitamins, and amino acids. Subscribe and save 20%.",
    siteName: "Atlas Hydration",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <VitaminStrip />
      <FeaturedProduct />
      <ScienceSection />
      <CompareSection />
      <ReviewsSection />
      <WhyAtlasSection />
      <HydrationBenefits />
      <DailyElectrolytes />
      <BlogSection />
      <FounderSection />
      <FaqSection />
      <CtaSection />
      <DarkCta />
      <StickyBuyBar />
    </>
  );
}
