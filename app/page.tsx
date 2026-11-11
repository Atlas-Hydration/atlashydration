import type { Metadata } from "next";
import WarehouseCloseout from "@/app/components/home/WarehouseCloseout";
import { CLOSEOUT_LIVE } from "@/app/data/closeoutOffer";
import StrawberrySale from "@/app/components/home/StrawberrySale";
import HeroSection from "@/app/components/home/HeroSection";
import ProofStrip from "@/app/components/home/ProofStrip";
import FeaturedProduct from "@/app/components/home/FeaturedProduct";
import BottleSection from "@/app/components/home/BottleSection";
import ScienceSection from "@/app/components/home/ScienceSection";
import ReviewsSection from "@/app/components/home/ReviewsSection";
import WhyAtlasSection from "@/app/components/home/WhyAtlasSection";
import HydrationBenefits from "@/app/components/home/HydrationBenefits";
import BlogSection from "@/app/components/home/BlogSection";
import FounderSection from "@/app/components/home/FounderSection";
import GrapefruitWaitlist from "@/app/components/home/GrapefruitWaitlist";
import FaqSection from "@/app/components/home/FaqSection";
import CtaSection from "@/app/components/home/CtaSection";
import DarkCta from "@/app/components/home/DarkCta";
import StickyBuyBar from "@/app/components/home/StickyBuyBar";
import { twitterCard } from "@/app/data/seo";
import { PurchaseSelectionProvider } from "@/app/context/PurchaseSelectionContext";


const closeoutTitle = "Warehouse Closeout Sale | Atlas Hydration";
const closeoutDescription = "Our biggest warehouse closeout sale. Strawberry Lemonade: 5 pouches for $50 or 2 for $32. Free standard U.S. shipping. One-time purchase.";

export const metadata: Metadata = CLOSEOUT_LIVE ? {
  title: closeoutTitle,
  description: closeoutDescription,
  alternates: { canonical: "https://atlas-hydration.com/" },
  openGraph: { type: "website", url: "https://atlas-hydration.com/", title: closeoutTitle, description: closeoutDescription, siteName: "Atlas Hydration", images: ["https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844"] },
  twitter: twitterCard({ title: closeoutTitle, description: closeoutDescription, image: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844" }),
} : {
  title: "Atlas Hydration | Zero-Sugar Electrolyte Mixes",
  description:
    "Shop premium zero-sugar electrolyte drink mixes with 1,769mg electrolytes, B vitamins, and amino acids. Subscribe and save 20%. Free shipping $50 and up.",
  keywords:
    "electrolyte drink mix, zero sugar electrolytes, sports hydration, Atlas Hydration, electrolyte powder, sugar free hydration, recovery drink",
  alternates: { canonical: "https://atlas-hydration.com/" },
  twitter: twitterCard({ title: "Atlas Hydration | Zero-Sugar Electrolyte Mixes", description: "Premium zero-sugar electrolyte drink mixes with B vitamins and amino acids.", image: "https://atlas-hydration.com/og/default.png" }),
  openGraph: {
    type: "website",
    url: "https://atlas-hydration.com/",
    title: "Atlas Hydration | Zero-Sugar Electrolyte Mixes",
    description:
      "Premium zero-sugar electrolyte drink mixes with 1,769mg electrolytes, B vitamins, and amino acids. Subscribe and save 20%.",
    siteName: "Atlas Hydration",
    images: ["https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Atlas Hydration",
  url: "https://atlas-hydration.com",
  logo: "https://atlas-hydration.com/logo.svg",
  description: "Premium zero-sugar electrolyte drink mixes with 1,769mg electrolytes, B vitamins, and amino acids.",
  sameAs: [
    "https://www.instagram.com/atlashydration",
    "https://www.tiktok.com/@atlashydration",
  ],
  brand: { "@type": "Brand", name: "Atlas Hydration" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Atlas Hydration",
  url: "https://atlas-hydration.com",
};

export default function Home() {
  if (CLOSEOUT_LIVE) return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} /><WarehouseCloseout /></>;
  if (process.env.NODE_ENV !== "production" && process.env.ATLAS_CLOSEOUT_PREVIEW === "true") return <WarehouseCloseout preview />;
  // Opt-in, local-only sale homepage review. Production remains unchanged.
  if (process.env.NODE_ENV !== "production" && process.env.ATLAS_SALE_PREVIEW === "true") return <StrawberrySale />;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <PurchaseSelectionProvider>
      <HeroSection />
      <ProofStrip />
      <FeaturedProduct />
      <ReviewsSection />
      <BottleSection />
      <ScienceSection />
      <WhyAtlasSection />
      <FounderSection />
      <HydrationBenefits />
      <BlogSection />
      <GrapefruitWaitlist />
      <FaqSection />
      <CtaSection />
      <DarkCta />
      <StickyBuyBar />
      </PurchaseSelectionProvider>
    </>
  );
}
