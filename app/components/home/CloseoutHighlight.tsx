"use client";

import { useEffect, useRef, useState } from "react";
import { BLACK_FRIDAY } from "@/app/data/blackFriday";
import { openBlackFridayCheckout } from "@/app/lib/blackFridayCheckout";
import { PRODUCTS } from "@/app/data/products";
import { resizeShopify } from "@/app/lib/images";
import styles from "./CloseoutHighlight.module.css";

/** An additive sale feature. The original hero, catalog and homepage remain intact. */
export default function CloseoutHighlight() {
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");
  const openingRef = useRef(false);

  useEffect(() => {
    const restore = () => { openingRef.current = false; setOpening(false); };
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);

  function checkout() {
    if (openingRef.current) return;
    openingRef.current = true;
    setOpening(true);
    setError("");
    try {
      openBlackFridayCheckout();
    } catch {
      openingRef.current = false;
      setOpening(false);
      setError("Checkout could not open. Please try again.");
    }
  }

  return (
    <section id="closeout-bundles" className={styles.section} aria-labelledby="closeout-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}><span aria-hidden="true" />Black Friday Sale</p>
          <h2 id="closeout-title" className={styles.title}>Black Friday.<br /><span>Big on hydration.</span></h2>
          <p className={styles.description}>Your favorite Strawberry Lemonade, at our Black Friday price.</p>
          <p className={styles.heroPrice}>One pouch. <strong>${BLACK_FRIDAY.price}.</strong></p>
          <p className={styles.value}>{BLACK_FRIDAY.sticks} stick packs</p>
          <p className={styles.shipping}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 5h11v12H3zM14 9h4l3 4v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>
            Free standard U.S. shipping
          </p>
        </div>
        <div className={styles.order}>
          <div className={styles.options}>
            <div className={`${styles.option} ${styles.selected}`}>
              <span className={styles.selectionMark} aria-hidden="true">✓</span>
              <span className={styles.optionVisual} aria-hidden="true">
                <img src={resizeShopify(PRODUCTS["strawberry-lemonade"].images[0], 160)} alt="" width="64" height="80" loading="lazy" />
              </span>
              <span className={styles.optionCopy}>
                <span className={styles.optionEyebrow}>Black Friday</span>
                <span className={styles.optionTitle}>Strawberry Lemonade</span>
                <span className={styles.optionDetail}>1 pouch · {BLACK_FRIDAY.sticks} sticks</span>
                <span className={styles.priceRow}><strong className={styles.optionPrice}>${BLACK_FRIDAY.price}</strong></span>
              </span>
            </div>
          </div>
          <button type="button" className={styles.buy} onClick={checkout} disabled={opening}>
            <span>{opening ? "Opening secure checkout…" : `Shop Black Friday · $${BLACK_FRIDAY.price}`}</span>
            {!opening && <span aria-hidden="true">→</span>}
          </button>
          <p className={styles.summary} aria-live="polite">1 pouch · {BLACK_FRIDAY.sticks} sticks · One-time purchase</p>
          {error && <p role="alert" className={styles.error}>{error}</p>}
          <p className={styles.terms}>Free standard U.S. shipping. Taxes, if applicable, are calculated at checkout. This offer checks out separately from your bag.</p>
          <a className={styles.catalogLink} href="#products">Explore all Atlas products <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
