import Popup from "~/components/Popup";
import HeroSection from "~/components/home/HeroSection";
import VitaminStrip from "~/components/home/VitaminStrip";
import FeaturedProduct from "~/components/home/FeaturedProduct";
import ScienceSection from "~/components/home/ScienceSection";
import CompareSection from "~/components/home/CompareSection";
import ReviewsSection from "~/components/home/ReviewsSection";
import WhyAtlasSection from "~/components/home/WhyAtlasSection";
import HydrationBenefits from "~/components/home/HydrationBenefits";
import DailyElectrolytes from "~/components/home/DailyElectrolytes";
import BlogSection from "~/components/home/BlogSection";
import FounderSection from "~/components/home/FounderSection";
import FaqSection from "~/components/home/FaqSection";
import CtaSection from "~/components/home/CtaSection";
import DarkCta from "~/components/home/DarkCta";
import StickyBuyBar from "~/components/home/StickyBuyBar";

export function meta() {
  return [
    { title: "Atlas Hydration | Zero-Sugar Electrolyte Mixes" },
    {
      name: "description",
      content:
        "Shop premium zero-sugar electrolyte drink mixes with 1,769mg electrolytes, B vitamins, and amino acids. Subscribe and save 20%. Free shipping over $50.",
    },
    {
      name: "keywords",
      content:
        "electrolyte drink mix, zero sugar electrolytes, sports hydration, Atlas Hydration, electrolyte powder, sugar free hydration, recovery drink",
    },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Atlas Hydration | Zero-Sugar Electrolyte Mixes" },
    {
      property: "og:description",
      content:
        "Premium zero-sugar electrolyte drink mixes with 1,769mg electrolytes, B vitamins, and amino acids. Subscribe and save 20%.",
    },
    { property: "og:site_name", content: "Atlas Hydration" },
  ];
}

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
      <Popup />
    </>
  );
}
