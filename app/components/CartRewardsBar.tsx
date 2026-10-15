"use client";
import type { BottleTier } from "@/app/context/CartContext";
import { FREE_SHIPPING_THRESHOLD } from "@/app/data/formula";
export default function CartRewardsBar({ subtotal, hasSubscription }: { subtotal: number; qualifyingQty: number; tier: BottleTier; hasSubscription: boolean }) {
  const unlocked = hasSubscription || subtotal >= FREE_SHIPPING_THRESHOLD;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  return <div className="cart-rewards">
    <p className="cart-rewards__status">{unlocked ? "Free standard U.S. shipping." : `Add $${remaining.toFixed(2)} for free standard U.S. shipping.`}</p>
    <div className="cart-rewards__track"><div className="cart-rewards__fill" style={{ width: `${Math.min(100, subtotal / FREE_SHIPPING_THRESHOLD * 100)}%` }} /></div>
  </div>;
}
