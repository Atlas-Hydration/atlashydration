"use client";
import StarterOffer from "./StarterOffer";
/** Existing placements now use the inventory-linked starter kit. */
export default function CompleteKitBundle(_props: { mixSlug: string; mixName: string }) {
  return <StarterOffer />;
}
