"use client";

const FREE_SHIPPING_THRESHOLD = 40;
const BOTTLE_POUCH_THRESHOLD = 4;

export default function CartRewardsBar({
  subtotal,
  qualifyingQty,
  bottleInCart,
}: {
  subtotal: number;
  qualifyingQty: number;
  bottleInCart: boolean;
}) {
  const shippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;
  const bottleUnlocked = qualifyingQty >= BOTTLE_POUCH_THRESHOLD;

  const shippingSegmentPct = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1) * 50;
  const bottleSegmentPct = shippingUnlocked
    ? 50 + Math.min(qualifyingQty / BOTTLE_POUCH_THRESHOLD, 1) * 50
    : shippingSegmentPct;
  const fillPct = Math.max(shippingSegmentPct, bottleUnlocked ? 100 : bottleSegmentPct);

  const remainingShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const remainingPouches = Math.max(0, BOTTLE_POUCH_THRESHOLD - qualifyingQty);

  let statusText: string;
  if (shippingUnlocked && bottleUnlocked) {
    statusText = "🎉 You've unlocked free shipping and a free bottle!";
  } else if (!shippingUnlocked) {
    statusText = `Add $${remainingShipping.toFixed(2)} more to unlock free shipping.`;
  } else if (bottleInCart) {
    statusText = `Add ${remainingPouches} more pouch${remainingPouches > 1 ? "es" : ""} to make your bottle FREE.`;
  } else {
    statusText = `Add ${remainingPouches} more pouch${remainingPouches > 1 ? "es" : ""} to unlock a FREE Atlas Performance Bottle.`;
  }

  return (
    <div className="cart-rewards">
      <p className="cart-rewards__status">{statusText}</p>
      <div className="cart-rewards__track">
        <div className="cart-rewards__fill" style={{ width: `${fillPct}%` }} />
        <div className={`cart-rewards__stop${shippingUnlocked ? " cart-rewards__stop--unlocked" : ""}`} style={{ left: "50%" }}>
          <span className="cart-rewards__stop-icon">🚚</span>
        </div>
        <div className={`cart-rewards__stop${bottleUnlocked ? " cart-rewards__stop--unlocked" : ""}`} style={{ left: "100%" }}>
          <span className="cart-rewards__stop-icon">🍾</span>
        </div>
      </div>
      <div className="cart-rewards__labels">
        <span>Free Shipping</span>
        <span>Free Bottle</span>
      </div>
    </div>
  );
}
