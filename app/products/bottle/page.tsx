import type { Metadata } from "next";
import BottleProductPage from "@/app/components/BottleProductPage";

export const metadata: Metadata = {
  title: "Atlas Performance Water Bottle — 26 oz | Atlas Hydration",
  description:
    "Lightweight, easy-squeeze 26 oz water bottle with Purist inner-wall technology and a leak-free MoFlo 2.0 cap. BPA-free, made in the USA.",
  alternates: { canonical: "https://atlas-hydration.com/products/bottle" },
  openGraph: {
    type: "website",
    url: "https://atlas-hydration.com/products/bottle",
    title: "Atlas Performance Water Bottle — 26 oz | Atlas Hydration",
    description:
      "Lightweight, easy-squeeze 26 oz water bottle with Purist inner-wall technology and a leak-free MoFlo 2.0 cap.",
    siteName: "Atlas Hydration",
    images: ["https://atlas-hydration.com/images/products/bottle/atlas-bottle-studio.jpg"],
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Atlas Performance Water Bottle — 26 oz",
  description:
    "Lightweight, easy-squeeze 26 oz water bottle with Purist inner-wall technology and a leak-free MoFlo 2.0 cap. BPA-free, made in the USA.",
  image: "https://atlas-hydration.com/images/products/bottle/atlas-bottle-studio.jpg",
  brand: { "@type": "Brand", name: "Atlas Hydration" },
  offers: {
    "@type": "Offer",
    price: "19.99",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://atlas-hydration.com/products/bottle",
  },
};

export default function Bottle() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <BottleProductPage />
    </>
  );
}
