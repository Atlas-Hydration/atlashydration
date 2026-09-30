"use client";

import { useState, useRef, useCallback } from "react";
import { useCart, BOTTLE_HALF_OFF_THRESHOLD, computeCartPricing } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";

const bottle = PRODUCTS.bottle;
const MIX_QTY = BOTTLE_HALF_OFF_THRESHOLD; // 2 pouches is the real threshold for the bottle's 50% off tier

export default function CompleteKitBundle({
  mixSlug,
  mixName,
}: {
  mixSlug: string;
  mixName: string;
}) {
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mix = PRODUCTS[mixSlug];
  // Priced by the same function the cart uses, so the card always equals what the
  // cart (and Shopify) will show after Add Bundle.
  const { subtotal: fullPrice, total: combinedPrice } = computeCartPricing([
    { slug: mixSlug, title: mixName, price: mix.price, quantity: MIX_QTY, image: null },
    { slug: "bottle", title: bottle.name, price: bottle.price, quantity: 1, image: null },
  ]);

  const handleAdd = useCallback(() => {
    setAdding(true);
    addToCart(mixSlug, MIX_QTY);
    addToCart("bottle", 1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdding(false), 1200);
  }, [addToCart, mixSlug]);

  const savings = fullPrice - combinedPrice;

  return (
    <div className="complete-kit">
      <div className="complete-kit__visual">
        <img className="complete-kit__img" src={mix.images[0]} alt={mixName} />
        <img className="complete-kit__img complete-kit__img--bottle" src={bottle.images[0]} alt="Atlas Performance Water Bottle" />
      </div>
      <div className="complete-kit__info">
        <p className="complete-kit__name">The Complete Hydration System</p>
        <p className="complete-kit__contents">{MIX_QTY}x {mixName} + Atlas Performance Bottle</p>
        <div className="complete-kit__price-row">
          <span className="complete-kit__price">${combinedPrice.toFixed(2)}</span>
          <span className="complete-kit__price-original">${fullPrice.toFixed(2)}</span>
          <span className="complete-kit__save-badge">Save ${savings.toFixed(2)}</span>
        </div>
      </div>
      <button
        type="button"
        className={`complete-kit__btn${adding ? " complete-kit__btn--added" : ""}`}
        onClick={handleAdd}
      >
        {adding ? "Added" : "Add Bundle"}
      </button>
    </div>
  );
}
