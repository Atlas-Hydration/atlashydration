"use client";

import Link from "next/link";
import { PRODUCTS } from "@/app/data/products";
import { BOTTLE_DISCOUNT_LIVE, computeCartPricing, useCart } from "@/app/context/CartContext";
import { ensureFourPouchBundle } from "@/app/lib/fourPouchBundle";

export default function FourPouchBundle() {
  const { addFourPouchBundle } = useCart();
  const lines = ensureFourPouchBundle([]);
  const { total } = computeCartPricing(lines);
  return (
    <main>
      <section className="product-hero" aria-labelledby="bundle-title">
        <div className="container">
          <div className="product-hero__grid">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 16 }}>
              <img src={PRODUCTS["strawberry-lemonade"].images[0]} alt="Strawberry Lemonade electrolyte pouch — four included" style={{ width: "100%" }} />
              <img src={PRODUCTS.bottle.images[0]} alt="Atlas Performance Bottle — one included free" style={{ width: "100%" }} />
            </div>
            <div className="product-hero__info">
              <p className="section-eyebrow">Stock up · One-time purchase</p>
              <h1 id="bundle-title">4 pouches. Your bottle is free.</h1>
              <p>Four Strawberry Lemonade pouches (64 sticks total) plus one Atlas Performance Bottle.</p>
              <ul><li>4 × Strawberry Lemonade — ${(PRODUCTS["strawberry-lemonade"].price * 4).toFixed(2)}</li><li>1 × Atlas Performance Bottle — {BOTTLE_DISCOUNT_LIVE ? "FREE" : `$${PRODUCTS.bottle.price.toFixed(2)}`}</li><li>Free shipping · No subscription</li></ul>
              <p style={{ fontSize: "2rem", fontWeight: 700 }}>${total.toFixed(2)}</p>
              {BOTTLE_DISCOUNT_LIVE ? <button type="button" className="btn btn--primary btn--lg" onClick={addFourPouchBundle}>Add 4 pouches + free bottle</button> : <p>This bundle offer is currently unavailable.</p>}
              <p>Review your items in the cart before checkout. Taxes and final discounts are calculated at checkout.</p>
              <Link href="/products/strawberry-lemonade">Product details and supplement facts</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
