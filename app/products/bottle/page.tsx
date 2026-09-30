import type { Metadata } from "next";
import { PRODUCTS } from "@/app/data/products";
import { buildOffer, breadcrumbJsonLd, twitterCard } from "@/app/data/seo";
import BottleProductPage from "@/app/components/BottleProductPage";

export const metadata: Metadata = {
  title: "Atlas Performance Water Bottle — 26 oz | Atlas Hydration",
  description:
    "Lightweight, easy-squeeze 26 oz water bottle with Purist inner-wall technology and a leak-free MoFlo 2.0 cap. BPA-free, made in the USA.",
  alternates: { canonical: "https://atlas-hydration.com/products/bottle" },
  twitter: twitterCard({ title: "Atlas Performance Water Bottle | Atlas Hydration", description: "Lightweight 26 oz squeeze bottle with a leak-free cap. BPA-free, made in the USA.", image: "https://atlas-hydration.com/images/products/bottle/atlas-bottle-studio.jpg" }),
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
  sku: PRODUCTS.bottle.variantId.replace("gid://shopify/ProductVariant/", ""),
  offers: buildOffer({ url: "https://atlas-hydration.com/products/bottle", price: PRODUCTS.bottle.price.toFixed(2) }),
};

export default function Bottle() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Atlas Performance Water Bottle", path: "/products/bottle" }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <BottleProductPage />
    </>
  );
}
