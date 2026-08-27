"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";
import CompleteKitBundle from "@/app/components/CompleteKitBundle";

const bottle = PRODUCTS.bottle;

const CheckSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const FEATURES = [
  {
    title: "Purist Technology",
    text: "An inner-wall coating that keeps water tasting like water — no lingering odors or flavors, even after months of daily use.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 2C10 6 6 10 6 14a6 6 0 1012 0c0-4-4-8-6-12z" /></svg>
    ),
  },
  {
    title: "MoFlo 2.0 Cap",
    text: "A high-flow, self-sealing cap that delivers water fast without spilling — squeeze and go.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
    ),
  },
  {
    title: "26 oz Capacity",
    text: "A wide mouth built for ice and powdered drink mixes, with enough capacity to get you through any session.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M9 2h6M10 2v4.5l-4 5.5v8a2 2 0 002 2h8a2 2 0 002-2v-8l-4-5.5V2" /></svg>
    ),
  },
  {
    title: "BPA-Free LDPE",
    text: "Lightweight, easy-squeeze construction made with FDA food-grade materials — made and printed in California.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 5-5" /></svg>
    ),
  },
];

export default function BottleProductPage() {
  const { addToCart } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAdd = useCallback(() => {
    setAdding(true);
    addToCart("bottle", qty);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdding(false), 1200);
  }, [addToCart, qty]);

  const accordions = [
    { title: "Details", content: (
      <ul className="bottle-page__details-list">
        {(bottle.details || []).map((d) => <li key={d}>{d}</li>)}
      </ul>
    ) },
    { title: "Care", content: <p>{bottle.care}</p> },
  ];

  return (
    <main className="bottle-page">
      {/* Hero */}
      <section className="bottle-page__hero" aria-label="Atlas Performance Water Bottle">
        <div className="container">
          <div className="bottle-page__hero-grid">
            <div className="bottle-page__gallery">
              <div className="bottle-page__gallery-main">
                <img src={bottle.images[currentImage]} alt="Atlas Performance Water Bottle — 26 oz" />
              </div>
              <div className="bottle-page__gallery-thumbs">
                {bottle.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`bottle-page__gallery-thumb${i === currentImage ? " active" : ""}`}
                    onClick={() => setCurrentImage(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bottle-page__info">
              <div className="bottle-page__eyebrow-row">
                <p className="bottle-page__eyebrow">Atlas Gear</p>
                <span className="bottle-page__new-badge">New</span>
              </div>
              <h1 className="bottle-page__title">Built for daily movement.</h1>
              <p className="bottle-page__proof">
                The same bottle our founder — a commercial pilot — keeps within reach on every layover, workout, and long day at a desk.
              </p>
              <p className="bottle-page__desc">
                The Atlas Performance Water Bottle pairs a lightweight, easy-squeeze design with a 26 oz
                capacity and Specialized Purist technology to help keep your water tasting clean without
                lingering odors or flavors. Made for everything from training and padel to travel and
                everyday hydration.
              </p>

              <div className="bottle-page__buy">
                <span className="bottle-page__price">${bottle.price.toFixed(2)}</span>
                <div className="bottle-page__qty">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))}>+</button>
                </div>
              </div>
              <button
                className={`btn btn--primary btn--lg${adding ? " btn--added" : ""}`}
                style={{ width: "100%" }}
                onClick={handleAdd}
              >
                {adding ? "Added" : `Add to Cart — $${(bottle.price * qty).toFixed(2)}`}
              </button>

              <div className="bottle-page__perks">
                <div className="bottle-page__perk"><CheckSvg /><span>BPA-free, food-grade material</span></div>
                <div className="bottle-page__perk"><CheckSvg /><span>Dishwasher safe, top rack</span></div>
                <div className="bottle-page__perk"><CheckSvg /><span>Ships with every Atlas order</span></div>
              </div>

              <CompleteKitBundle mixSlug="strawberry-lemonade" mixName="Strawberry Lemonade Electrolyte Mix" />

              <div className="product-accordions" style={{ marginTop: 28 }}>
                {accordions.map((acc, i) => (
                  <div key={acc.title}>
                    <div className="product-accordion__divider" />
                    <div className="product-accordion">
                      <button className="product-accordion__header" aria-expanded={openAccordion === i} onClick={() => setOpenAccordion(openAccordion === i ? null : i)}>
                        <span className="product-accordion__title">{acc.title}</span>
                        <svg className="product-accordion__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                      </button>
                      <div className="product-accordion__body" style={{ maxHeight: openAccordion === i ? 500 : 0, transition: "max-height 0.35s ease" }}>
                        <div className="product-accordion__content">{acc.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="product-accordion__divider" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="bottle-page__features" aria-label="Bottle features">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Engineered for Performance</p>
            <h2 className="section-title">Every detail, considered.</h2>
          </div>
          <div className="bottle-page__features-grid">
            {FEATURES.map((f) => (
              <div className="bottle-page__feature" key={f.title}>
                <span className="bottle-page__feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-sell / Bundle */}
      <section className="bottle-page__cross-sell" aria-label="The Complete Hydration System">
        <div className="container">
          <div className="bottle-page__cross-sell-inner">
            <div className="bottle-page__cross-sell-copy">
              <h2>The Complete Hydration System</h2>
              <p>Fill it up with zero-sugar hydration — 1,769mg electrolytes, B vitamins, and Vitamin C per stick.</p>
              <Link href="/products/strawberry-lemonade" className="bottle-page__cross-sell-link">Or shop electrolytes on their own →</Link>
            </div>
            <CompleteKitBundle mixSlug="strawberry-lemonade" mixName="Strawberry Lemonade Electrolyte Mix" />
          </div>
        </div>
      </section>
    </main>
  );
}
