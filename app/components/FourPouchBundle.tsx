"use client";

import Link from "next/link";
import { PRODUCTS } from "@/app/data/products";
import { BOTTLE_DISCOUNT_LIVE, computeCartPricing, useCart } from "@/app/context/CartContext";
import { ensureFourPouchBundle } from "@/app/lib/fourPouchBundle";
import { resizeShopify, shopifySrcSet } from "@/app/lib/images";
import styles from "./FourPouchBundle.module.css";

export default function FourPouchBundle() {
  const { addFourPouchBundle } = useCart();
  const { total } = computeCartPricing(ensureFourPouchBundle([]));
  const pouch = PRODUCTS["strawberry-lemonade"];
  const bottle = PRODUCTS.bottle;

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="bundle-title">
        <div className={`container ${styles.grid}`}>
          <figure className={styles.photograph}>
            <img
              src={resizeShopify(pouch.images[0], 800)}
              srcSet={shopifySrcSet(pouch.images[0])}
              sizes="(max-width: 760px) calc(100vw - 40px), 540px"
              alt="Atlas Strawberry Lemonade electrolyte pouch and stick pack — four pouches included in this bundle"
              width="800" height="1000" fetchPriority="high" decoding="async"
            />
            <figcaption>4 pouches. 64 sticks. Ready for your routine.</figcaption>
          </figure>
          <div className={styles.purchase}>
            <p className={`product-hero__eyebrow ${styles.eyebrow}`}>The Strawberry Lemonade bundle</p>
            <h1 id="bundle-title" className={styles.title}>Stock up.<br />Bottle on us.</h1>
            <p className={styles.description}>Your daily hydration, fully stocked. Four pouches of Strawberry Lemonade electrolytes and an Atlas Performance Bottle, on us.</p>
            <div className={styles.includes} aria-label="What’s included">
              <div className={styles.pouches}>
                <div><h2>4 Strawberry Lemonade pouches</h2><p>64 sticks total · Zero sugar</p></div>
                <span>${(pouch.price * 4).toFixed(2)}</span>
              </div>
              <div className={styles.bottle}>
                <img src={bottle.images[0]} alt="Atlas Performance Bottle — included free" width="72" height="90" decoding="async" />
                <div><h2>Atlas Performance Bottle</h2><p>26 oz · Made for daily movement</p></div>
                <span className={styles.gift}>{BOTTLE_DISCOUNT_LIVE ? "Free" : `$${bottle.price.toFixed(2)}`}</span>
              </div>
            </div>
            <div className={styles.total}>
              <strong>${total.toFixed(2)}</strong>
              <span>One-time purchase<br />No subscription</span>
            </div>
            {BOTTLE_DISCOUNT_LIVE ? (
              <button type="button" className={`btn btn--primary ${styles.buy}`} aria-label="Add 4 pouches + free bottle" onClick={addFourPouchBundle}>
                Add bundle <span aria-hidden="true">—</span> ${total.toFixed(2)}
              </button>
            ) : <p className={styles.unavailable}>This bundle offer is currently unavailable.</p>}
            <p className={styles.shipping}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
              Free shipping included
            </p>
            <p className={styles.note}>Taxes and final discounts calculated at checkout.</p>
            <Link className={styles.details} href="/products/strawberry-lemonade#supplement-facts">Explore the ingredients <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
