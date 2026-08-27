"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";
import CompleteKitBundle from "@/app/components/CompleteKitBundle";

const bottle = PRODUCTS.bottle;

const BOTTLE_IMAGES = bottle.images.map((src, i) => ({
  src,
  alt: i === 0 ? "Atlas Performance Water Bottle — 26 oz" : "Atlas Performance Water Bottle lifestyle",
}));

const FEATURES = [
  { label: "26 oz Capacity", icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2h6M10 2v4.5l-4 5.5v8a2 2 0 002 2h8a2 2 0 002-2v-8l-4-5.5V2" /></svg>
  ) },
  { label: "Leak-Free Cap", icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
  ) },
  { label: "BPA-Free", icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 5-5" /></svg>
  ) },
  { label: "Made in USA", icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
  ) },
];

export default function BottleSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartX = useRef(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((idx: number) => {
    setCurrentSlide(idx);
    setDragOffset(0);
    setIsDragging(false);
  }, []);

  const prev = useCallback(() => goTo(currentSlide === 0 ? BOTTLE_IMAGES.length - 1 : currentSlide - 1), [currentSlide, goTo]);
  const next = useCallback(() => goTo(currentSlide === BOTTLE_IMAGES.length - 1 ? 0 : currentSlide + 1), [currentSlide, goTo]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - dragStartX.current;
    setDragOffset(dx);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    const width = galleryRef.current?.offsetWidth || 375;
    const threshold = width * 0.15;
    if (dragOffset < -threshold) {
      next();
    } else if (dragOffset > threshold) {
      prev();
    } else {
      setDragOffset(0);
      setIsDragging(false);
    }
  }, [isDragging, dragOffset, next, prev]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleAdd = useCallback(() => {
    setAdding(true);
    addToCart("bottle", qty);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdding(false), 1200);
  }, [addToCart, qty]);

  const translateX = -currentSlide * 100 + (isDragging ? (dragOffset / (galleryRef.current?.offsetWidth || 375)) * 100 : 0);

  return (
    <section className="bottle-section" id="bottle" aria-label="Atlas Performance Water Bottle">
      <div className="container">
        <div className="bottle-section__grid">
          <div className="bottle-section__image">
            <div className="fp-gallery">
              <div
                className="fp-gallery__main"
                ref={galleryRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="fp-gallery__track"
                  style={{
                    transform: `translateX(${translateX}%)`,
                    transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
                    willChange: "transform",
                  }}
                >
                  {BOTTLE_IMAGES.map((img, i) => (
                    <div className="fp-gallery__slide-wrap" key={i}>
                      <img
                        className="fp-gallery__slide-img"
                        src={img.src}
                        alt={img.alt}
                        loading={i === 0 ? "eager" : "lazy"}
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button className="fp-gallery__arrow fp-gallery__arrow--prev" aria-label="Previous image" onClick={prev}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button className="fp-gallery__arrow fp-gallery__arrow--next" aria-label="Next image" onClick={next}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
              <div className="fp-gallery__dots">
                {BOTTLE_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    className={`fp-gallery__dot${i === currentSlide ? " active" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
              <div className="fp-gallery__thumbs">
                {BOTTLE_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    className={`fp-gallery__thumb${i === currentSlide ? " active" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img src={img.src} alt={img.alt} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bottle-section__info">
            <p className="bottle-section__eyebrow">New</p>
            <h2 className="bottle-section__title">Atlas Performance<br />Water Bottle</h2>
            <p className="bottle-section__subtitle">
              Built for daily movement. Lightweight, easy-squeeze design with a 26 oz capacity
              and Purist technology that keeps water tasting clean.
            </p>

            <div className="bottle-section__features">
              {FEATURES.map((f) => (
                <div className="bottle-section__feature" key={f.label}>
                  <span className="bottle-section__feature-icon">{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>

            <div className="bottle-section__buy">
              <span className="bottle-section__price">${bottle.price.toFixed(2)}</span>
              <div className="bottle-section__qty">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(9, q + 1))}
                >
                  +
                </button>
              </div>
              <button
                className={`btn btn--primary btn--lg${adding ? " btn--added" : ""}`}
                onClick={handleAdd}
              >
                {adding ? "Added" : `Add to Cart — $${(bottle.price * qty).toFixed(2)}`}
              </button>
            </div>

            <Link href="/products/bottle" className="bottle-section__link">
              View full details
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </Link>

            <CompleteKitBundle mixSlug="strawberry-lemonade" mixName="Strawberry Lemonade Electrolyte Mix" />
          </div>
        </div>
      </div>
    </section>
  );
}
