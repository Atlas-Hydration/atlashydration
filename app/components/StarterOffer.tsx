"use client";

import { PRODUCTS } from "@/app/data/products";
import { STARTER_OFFER } from "@/app/data/starterOffer";
import { useCart } from "@/app/context/CartContext";
import styles from "./StarterOffer.module.css";

/** Shopify owns component inventory, price allocation, and discount eligibility. */
export default function StarterOffer() {
  const { addToCart } = useCart();
  const pouch = PRODUCTS["strawberry-lemonade"];
  const bottle = PRODUCTS.bottle;

  return (
    <section className={styles.offer} aria-label="Atlas starter offer">
      <div className={styles.visual}>
        <div className={styles.product}>
          <img src={pouch.images[0]} alt="Atlas Strawberry Lemonade pouch" loading="lazy" />
          <span>2 × 16-stick pouches</span>
        </div>
        <span className={styles.plus} aria-hidden="true">+</span>
        <div className={styles.product}>
          <img src={bottle.images[0]} alt="Atlas Performance Water Bottle, 26 oz" loading="lazy" />
          <span>1 × Atlas bottle</span>
        </div>
      </div>
      <div className={styles.details}>
        <p className={styles.eyebrow}>THE ATLAS STARTER OFFER</p>
        <h3>More hydration.<br />One complete kit.</h3>
        <p className={styles.contents}>Two Strawberry Lemonade pouches. {STARTER_OFFER.stickQuantity} sticks. One 26 oz Atlas bottle.</p>
        <div className={styles.priceRow}>
          <strong className={styles.price}>${STARTER_OFFER.price}</strong>
          <span className={styles.saving}>Save ${(STARTER_OFFER.separateValue - STARTER_OFFER.price).toFixed(2)}</span>
        </div>
        <p className={styles.value}>${STARTER_OFFER.separateValue.toFixed(2)} value when purchased separately</p>
        <p className={styles.shipping}>Free standard U.S. shipping</p>
        <button type="button" className={styles.button} onClick={() => addToCart("atlas-starter-kit")}>Add starter kit — $50</button>
        <p className={styles.terms}>One-time purchase. No subscription required. For new and existing customers. Cannot be combined with discounts. Applicable tax calculated at checkout.</p>
        <p className={styles.expiry}>Strawberry Lemonade expiration: 01/2027.</p>
      </div>
    </section>
  );
}
