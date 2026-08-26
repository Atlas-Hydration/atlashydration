"use client";

import type { BottleTier } from "@/app/context/CartContext";
import { BOTTLE_HALF_OFF_THRESHOLD, BOTTLE_FREE_THRESHOLD } from "@/app/context/CartContext";

const FREE_SHIPPING_THRESHOLD = 40;

export default function CartRewardsBar({
  subtotal,
  qualifyingQty,
  tier,
}: {
  subtotal: number;
  qualifyingQty: number;
  tier: BottleTier;
}) {
  const shippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;
  const halfUnlocked = tier === "half" || tier === "free";
  const freeUnlocked = tier === "free";

  // Three stops, evenly spaced at 33% / 66% / 100%.
  const shippingSegmentPct = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1) * 33;
  const halfSegmentPct = !shippingUnlocked
    ? shippingSegmentPct
    : 33 + Math.min(qualifyingQty / BOTTLE_HALF_OFF_THRESHOLD, 1) * 33;
  const freeSegmentPct = !halfUnlocked
    ? halfSegmentPct
    : 66 + Math.min((qualifyingQty - BOTTLE_HALF_OFF_THRESHOLD) / (BOTTLE_FREE_THRESHOLD - BOTTLE_HALF_OFF_THRESHOLD), 1) * 34;
  const fillPct = freeUnlocked ? 100 : Math.max(shippingSegmentPct, halfSegmentPct, freeSegmentPct);

  const remainingShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const remainingToHalf = Math.max(0, BOTTLE_HALF_OFF_THRESHOLD - qualifyingQty);
  const remainingToFree = Math.max(0, BOTTLE_FREE_THRESHOLD - qualifyingQty);

  let statusText: string;
  if (!shippingUnlocked) {
    statusText = `Add $${remainingShipping.toFixed(2)} more to unlock free shipping.`;
  } else if (tier === "none") {
    statusText = `Add ${remainingToHalf} more pouch${remainingToHalf > 1 ? "es" : ""} to unlock 50% off the Atlas Bottle.`;
  } else if (tier === "half") {
    statusText = `Add ${remainingToFree} more pouch${remainingToFree > 1 ? "es" : ""} to make your bottle FREE.`;
  } else {
    statusText = "🎉 You've unlocked free shipping and a FREE bottle!";
  }

  return (
    <div className="cart-rewards">
      <p className="cart-rewards__status">{statusText}</p>
      <div className="cart-rewards__track">
        <div className="cart-rewards__fill" style={{ width: `${fillPct}%` }} />
        <div className={`cart-rewards__stop${shippingUnlocked ? " cart-rewards__stop--unlocked" : ""}`} style={{ left: "33%" }}>
          <span className="cart-rewards__stop-icon">🚚</span>
        </div>
        <div className={`cart-rewards__stop${halfUnlocked ? " cart-rewards__stop--unlocked" : ""}`} style={{ left: "66%" }}>
          <span className="cart-rewards__stop-icon">🥤</span>
        </div>
        <div className={`cart-rewards__stop${freeUnlocked ? " cart-rewards__stop--unlocked" : ""}`} style={{ left: "100%" }}>
          <span className="cart-rewards__stop-icon">🍾</span>
        </div>
      </div>
      <div className="cart-rewards__labels cart-rewards__labels--three">
        <span>Free Shipping</span>
        <span>50% Off Bottle</span>
        <span>Free Bottle</span>
      </div>
    </div>
  );
}
