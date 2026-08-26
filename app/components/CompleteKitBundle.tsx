"use client";

import { useState, useRef, useCallback } from "react";
import { useCart } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";

const bottle = PRODUCTS.bottle;

// Shopify discount code that must exist in the store, configured to bring
// the combined Mix + Bottle order to $39.98 (matches the price shown here).
const KIT_DISCOUNT_CODE = "ATLASKIT10";
const BOTTLE_KIT_PRICE = 9.99;

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
  const combinedPrice = mix.price + BOTTLE_KIT_PRICE;
  const fullPrice = mix.price + bottle.price;

  const handleAdd = useCallback(() => {
    setAdding(true);
    localStorage.setItem("atlas_discount_code", KIT_DISCOUNT_CODE);
    addToCart(mixSlug, 1);
    addToCart("bottle", 1, undefined, BOTTLE_KIT_PRICE);
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
        <p className="complete-kit__eyebrow">Complete Your Kit</p>
        <p className="complete-kit__name">{mixName} + Atlas Bottle</p>
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
