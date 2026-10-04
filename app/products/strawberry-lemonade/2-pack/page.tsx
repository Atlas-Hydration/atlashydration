import type { Metadata } from "next";
import { PRODUCTS } from "@/app/data/products";
import { oneTimePouchTotal, multiPouchDiscount } from "@/app/data/pricing";
import { twitterCard } from "@/app/data/seo";
import StrawberryLemonadeView from "../StrawberryLemonadeView";

/**
 * Stable landing URL for the 2-pouch offer (ads, email, social):
 *   /products/strawberry-lemonade/2-pack
 *
 * The page is prerendered with Strawberry Lemonade, 2 pouches (32 sticks) and
 * one-time purchase already selected, so it is correct on first paint and without
 * JavaScript. Opening it never adds anything to the cart, and it never selects a
 * subscription. Query strings (utm_*, fbclid, ...) are left untouched.
 *
 * Shopify stays authoritative: the $5.00 off and free shipping come from the
 * ATLAS2PACK discount and the shipping rate at checkout. The price here is the
 * same expected total the cart shows (app/data/pricing.ts).
 */

const TITLE = "Strawberry Lemonade, 2 Pouches | Atlas Hydration";
const total = oneTimePouchTotal(2).toFixed(2);
const description = `Two pouches (32 stick packs) of zero-sugar Strawberry Lemonade electrolytes for $${total}, one-time purchase. Save $${multiPouchDiscount(2).toFixed(2)} and ship free.`;

export const metadata: Metadata = {
  title: TITLE,
  description,
  // The main product page is the canonical, indexed page; this is a landing alias.
  alternates: { canonical: "https://atlas-hydration.com/products/strawberry-lemonade" },
  twitter: twitterCard({ title: TITLE, description, image: PRODUCTS["strawberry-lemonade"].images[0] }),
  openGraph: {
    type: "website",
    url: "https://atlas-hydration.com/products/strawberry-lemonade/2-pack",
    title: TITLE,
    description,
    siteName: "Atlas Hydration",
    images: [PRODUCTS["strawberry-lemonade"].images[0]],
  },
};

export default function StrawberryLemonadeTwoPack() {
  return <StrawberryLemonadeView initialOffer="stock-up" />;
}
