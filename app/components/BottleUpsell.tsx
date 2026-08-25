"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";

const bottle = PRODUCTS.bottle;

export default function BottleUpsell() {
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAdd = useCallback(() => {
    setAdding(true);
    addToCart("bottle", 1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdding(false), 1200);
  }, [addToCart]);

  return (
    <div className="bottle-upsell">
      <img className="bottle-upsell__img" src={bottle.images[0]} alt="Atlas Performance Water Bottle" />
      <div className="bottle-upsell__info">
        <p className="bottle-upsell__eyebrow">Complete Your Set</p>
        <p className="bottle-upsell__name">Atlas Performance Water Bottle</p>
        <p className="bottle-upsell__price">${bottle.price.toFixed(2)}</p>
      </div>
      <button
        type="button"
        className={`bottle-upsell__btn${adding ? " bottle-upsell__btn--added" : ""}`}
        onClick={handleAdd}
      >
        {adding ? "Added" : "+ Add"}
      </button>
      <Link href="/products/bottle" className="bottle-upsell__link" aria-label="View bottle details">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </Link>
    </div>
  );
}
