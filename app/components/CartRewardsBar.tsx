"use client";

import type { BottleTier } from "@/app/context/CartContext";
import { BOTTLE_HALF_OFF_THRESHOLD, BOTTLE_FREE_THRESHOLD } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";

const FREE_SHIPPING_THRESHOLD = 40;
const bottle = PRODUCTS.bottle;

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
          <span className="cart-rewards__stop-icon cart-rewards__stop-icon--box" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8l-9-5-9 5 9 5 9-5z" />
              <path d="M3 8v8l9 5 9-5V8" />
              <path d="M12 13v8" />
            </svg>
          </span>
        </div>
        <div className={`cart-rewards__stop${halfUnlocked ? " cart-rewards__stop--unlocked" : ""}`} style={{ left: "66%" }}>
          <span className="cart-rewards__stop-icon cart-rewards__stop-icon--img">
            <img src={bottle.images[0]} alt="" />
          </span>
        </div>
        <div className={`cart-rewards__stop${freeUnlocked ? " cart-rewards__stop--unlocked" : ""}`} style={{ left: "100%" }}>
          <span className="cart-rewards__stop-icon cart-rewards__stop-icon--img">
            <img src={bottle.images[0]} alt="" />
          </span>
        </div>
      </div>
      <div className="cart-rewards__labels cart-rewards__labels--three">
        <span>Free Shipping</span>
        <span>50% Off</span>
        <span>Free Bottle</span>
      </div>
    </div>
  );
}
