"use client";

import { useState, useRef, useCallback } from "react";
import { useCart, BOTTLE_HALF_OFF_THRESHOLD, BOTTLE_HALF_PRICE } from "@/app/context/CartContext";
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
  const combinedPrice = mix.price * MIX_QTY + BOTTLE_HALF_PRICE;
  const fullPrice = mix.price * MIX_QTY + bottle.price;

  const handleAdd = useCallback(() => {
    setAdding(true);
    addToCart(mixSlug, MIX_QTY);
    addToCart("bottle", 1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdding(false), 1200);
  }, [addToCart, mixSlug]);

  return (
    <div className="complete-kit">
      <div className="complete-kit__images">
        <img className="complete-kit__img" src={mix.images[0]} alt={mixName} />
        <span className="complete-kit__plus">+</span>
        <img className="complete-kit__img" src={bottle.images[0]} alt="Atlas Performance Water Bottle" />
      </div>
      <div className="complete-kit__info">
        <p className="complete-kit__eyebrow">Complete Your Kit · 50% Off Bottle</p>
        <p className="complete-kit__name">{MIX_QTY}x {mixName} + Atlas Bottle</p>
        <div className="complete-kit__price-row">
          <span className="complete-kit__price">${combinedPrice.toFixed(2)}</span>
          <span className="complete-kit__price-original">${fullPrice.toFixed(2)}</span>
        </div>
      </div>
      <button
        type="button"
        className={`complete-kit__btn${adding ? " complete-kit__btn--added" : ""}`}
        onClick={handleAdd}
      >
        {adding ? "Added!" : "Add Kit to Cart"}
      </button>
    </div>
  );
}
