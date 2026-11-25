"use client";
import StarterOffer from "./StarterOffer";
import { STARTER_OFFER_LIVE } from "@/app/data/starterOffer";
/** Existing placements now use the inventory-linked starter kit. */
export default function CompleteKitBundle(_props: { mixSlug: string; mixName: string }) {
  return STARTER_OFFER_LIVE ? <StarterOffer /> : null;
}
