"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCTS } from "@/app/data/products";
import { STARTER_OFFER } from "@/app/data/starterOffer";
import { useCart } from "@/app/context/CartContext";
import styles from "./StarterOffer.module.css";

/** Compact cross-sell; Shopify owns bundle inventory and the automatic offer. */
export default function StarterOffer() {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const addingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function handleAdd() {
    if (addingRef.current) return;
    addingRef.current = true;
    setAdding(true);
    addToCart("atlas-starter-kit");
    timerRef.current = setTimeout(() => { addingRef.current = false; setAdding(false); }, 1000);
  }

  return (
    <section className={styles.offer} aria-label="Atlas starter offer">
      <div className={`complete-kit ${styles.row}`}>
        <div className="complete-kit__visual">
          <img className="complete-kit__img" src={PRODUCTS["strawberry-lemonade"].images[0]} alt="Strawberry Lemonade pouch" loading="lazy" />
          <img className="complete-kit__img complete-kit__img--bottle" src={PRODUCTS.bottle.images[0]} alt="Atlas 26 oz bottle" loading="lazy" />
        </div>
        <div className="complete-kit__info">
          <h3 className="complete-kit__name">The Atlas Starter Kit</h3>
          <p className="complete-kit__contents">2 pouches · 32 sticks · 1 Atlas bottle</p>
          <div className="complete-kit__price-row">
            <strong className="complete-kit__price">${STARTER_OFFER.price}</strong>
            <s className="complete-kit__price-original">${STARTER_OFFER.separateValue.toFixed(2)}</s>
            <span className="complete-kit__save-badge">Save ${(STARTER_OFFER.separateValue - STARTER_OFFER.price).toFixed(2)}</span>
          </div>
          <p className={styles.value}>Value when purchased separately</p>
        </div>
        <button type="button" className={`complete-kit__btn ${styles.button}`} onClick={handleAdd} disabled={adding}>
          {adding ? "Added" : "Add starter kit"}
        </button>
      </div>
      <div className={styles.footer}>
        <span>Free standard U.S. shipping · One-time purchase</span>
        <details className={styles.terms}>
          <summary>Offer details</summary>
          <p>$83.97 value when purchased separately. Save $33.97. Includes two 16-stick Strawberry Lemonade pouches and one 26 oz Atlas bottle. Free standard U.S. shipping. New and existing customers. No subscription required. Cannot be combined with discounts. Applicable tax calculated at checkout.</p>
        </details>
      </div>
    </section>
  );
}
