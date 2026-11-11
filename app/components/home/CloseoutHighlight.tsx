"use client";

import { useEffect, useRef, useState } from "react";
import { CLOSEOUT_BUNDLES, type CloseoutSize } from "@/app/data/closeoutOffer";
import { buildCloseoutCheckoutUrl } from "@/app/lib/closeoutCheckout";
import styles from "./CloseoutHighlight.module.css";

/** An additive sale feature. The original hero, catalog and homepage remain intact. */
export default function CloseoutHighlight() {
  const [size, setSize] = useState<CloseoutSize>(5);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");
  const openingRef = useRef(false);
  const bundle = CLOSEOUT_BUNDLES[size];

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
      window.location.assign(buildCloseoutCheckoutUrl(size));
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
          <p className={styles.eyebrow}><span aria-hidden="true" />The warehouse closeout event</p>
          <h2 id="closeout-title" className={styles.title}>Big hydration.<br /><span>Our biggest sale.</span></h2>
          <p className={styles.description}>The Strawberry Lemonade you love.<br />A whole lot more, for a whole lot less.</p>
          <p className={styles.heroPrice}>5 pouches. <strong>$50.</strong></p>
          <p className={styles.value}>80 stick packs <span aria-hidden="true">·</span> Just $10 per pouch</p>
          <p className={styles.shipping}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 5h11v12H3zM14 9h4l3 4v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>
            Free standard U.S. shipping
          </p>
        </div>
        <div className={styles.order}>
          <fieldset className={styles.options} disabled={opening}>
            <legend>Choose your sale bundle</legend>
            {([5, 2] as const).map((count) => {
              const option = CLOSEOUT_BUNDLES[count];
              return (
                <label key={count} className={`${styles.option} ${size === count ? styles.selected : ""}`}>
                  <input type="radio" name="closeout-size" value={count} checked={size === count} onChange={() => setSize(count)} />
                  <span className={styles.optionCopy}>
                    <span className={styles.optionTitle}>{count} pouches {count === 5 && <small>Best value</small>}</span>
                    <span className={styles.optionDetail}>{option.sticks} sticks · ${option.perPouch} per pouch</span>
                  </span>
                  <strong className={styles.optionPrice}>${option.price}</strong>
                </label>
              );
            })}
          </fieldset>
          <button type="button" className={styles.buy} onClick={checkout} disabled={opening}>
            <span>{opening ? "Opening secure checkout…" : `Shop the closeout · $${bundle.price}`}</span>
            {!opening && <span aria-hidden="true">→</span>}
          </button>
          <p className={styles.summary} aria-live="polite">{bundle.pouches} pouches · {bundle.sticks} sticks · One-time purchase</p>
          {error && <p role="alert" className={styles.error}>{error}</p>}
          <p className={styles.terms}>Strawberry Lemonade only. Free standard U.S. shipping. Taxes, if applicable, calculated at checkout. Other promotional discounts do not combine. Sale bundles check out separately from your bag.</p>
          <a className={styles.catalogLink} href="#products">Explore all Atlas products <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
