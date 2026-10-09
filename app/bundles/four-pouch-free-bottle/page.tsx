import type { Metadata } from "next";
import FourPouchBundle from "@/app/components/FourPouchBundle";

export const metadata: Metadata = {
  title: "4 Strawberry Lemonade Pouches + Free Bottle | Atlas Hydration",
  description: "Stock up with four Strawberry Lemonade pouches and one free Atlas Performance Bottle. One-time purchase, 64 sticks, free shipping.",
  alternates: { canonical: "https://atlas-hydration.com/bundles/four-pouch-free-bottle" },
};

export default function Page() { return <FourPouchBundle />; }
