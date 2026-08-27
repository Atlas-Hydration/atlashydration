"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useCart, BOTTLE_DISCOUNT_LIVE, TWO_PACK_DISCOUNT_AMOUNT } from "@/app/context/CartContext";
import CompleteKitBundle from "@/app/components/CompleteKitBundle";

const ONE_TIME_UNIT_PRICE = 29.99;
const SUBSCRIBE_UNIT_PRICE = 23.99;
const ONE_TIME_PER_STICK = 1.87;
const SUBSCRIBE_PER_STICK = 1.50;

const FLAVOR_IMAGES = {
  "strawberry-lemonade": [
    { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844", alt: "Atlas Strawberry Lemonade pouch and stick pack" },
    { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/2_e035ddf8-ce06-45b8-a18b-9c44b182ef6c.jpg?v=1771507845", alt: "Atlas Strawberry Lemonade lifestyle" },
    { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/3_ef424a03-cf99-4791-be11-6c35c35c9a78.jpg?v=1771507844", alt: "Atlas Strawberry Lemonade mixing" },
    { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/5_6e370a4a-9031-4d8e-a7f2-59e717e0d02d.jpg?v=1771507860", alt: "Atlas Strawberry Lemonade ingredients" },
    { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/6_b41fe7f1-0bca-41d3-8bf7-db4414e95a05.jpg?v=1771507860", alt: "Atlas Strawberry Lemonade supplement facts" },
    { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/4_b0347d0a-fc88-4c2b-b4a7-3946604c666e.jpg?v=1771507860", alt: "Atlas Strawberry Lemonade active lifestyle" },
  ],
  grapefruit: [
    { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_1a252c57-dc62-4c7b-a6b1-0f9677ce6b6f.jpg?v=1769181320", alt: "Atlas Grapefruit pouch and stick pack" },
    { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/3_895d9a50-ff83-4081-a78b-7c5034614a38.jpg?v=1769181320", alt: "Atlas Grapefruit lifestyle" },
    { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/6_9aa2f5c5-dc91-499b-a36e-2ddb0ba45f49.jpg?v=1769181321", alt: "Atlas Grapefruit mixing" },
    { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/4_04a1c3d2-929b-4150-bf92-64f0f83445b1.jpg?v=1769181321", alt: "Atlas Grapefruit active lifestyle" },
  ],
};

export default function FeaturedProduct() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [purchaseType, setPurchaseType] = useState<"subscribe" | "onetime">("subscribe");
  const [frequency, setFrequency] = useState(2);
  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState(1);
  const [customQtyOpen, setCustomQtyOpen] = useState(false);
  const { addToCart } = useCart();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartX = useRef(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((idx: number) => {
    setCurrentSlide(idx);
    setDragOffset(0);
    setIsDragging(false);
  }, []);

  const prev = useCallback(() => goTo(currentSlide === 0 ? images.length - 1 : currentSlide - 1), [currentSlide, goTo]);
  const next = useCallback(() => goTo(currentSlide === images.length - 1 ? 0 : currentSlide + 1), [currentSlide, goTo]);

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

  const [selectedFlavor, setSelectedFlavor] = useState<"strawberry-lemonade" | "grapefruit">("strawberry-lemonade");
  const images = FLAVOR_IMAGES[selectedFlavor];
  const isPreorder = selectedFlavor === "grapefruit";

  // Reset slide to 0 when flavor changes
  useEffect(() => {
    setCurrentSlide(0);
    setDragOffset(0);
  }, [selectedFlavor]);


  const isSubscribing = purchaseType === "subscribe";
  const unitPrice = isSubscribing ? SUBSCRIBE_UNIT_PRICE : ONE_TIME_UNIT_PRICE;
  const perStickPrice = isSubscribing ? SUBSCRIBE_PER_STICK : ONE_TIME_PER_STICK;
  // The 2-pack bundle discount only applies to one-time purchases — a
  // subscription already carries its own 20% discount.
  const twoPackDiscount = isSubscribing ? 0 : TWO_PACK_DISCOUNT_AMOUNT;
  const onePouchTotal = unitPrice;
  const twoPouchTotal = unitPrice * 2 - twoPackDiscount;
  const customQtyTotal = qty === 2 ? twoPouchTotal : qty * unitPrice;

  const handleAdd = async () => {
    setAdding(true);
    const subFreq = purchaseType === "subscribe" ? frequency : undefined;
    await addToCart(selectedFlavor, qty, subFreq);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdding(false), 1200);
  };

  const translateX = -currentSlide * 100 + (isDragging ? (dragOffset / (galleryRef.current?.offsetWidth || 375)) * 100 : 0);

  return (
    <section className="featured-product" id="products" aria-label="Featured Product">
      <div className="container">
        <div className="featured-product__grid">
          {/* Gallery */}
          <div className="featured-product__image">
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
                  {images.map((img, i) => (
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
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`fp-gallery__dot${i === currentSlide ? " active" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
              <div className="fp-gallery__thumbs">
                {images.map((img, i) => (
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

          {/* Info */}
          <div className="featured-product__info">
            <p className="featured-product__eyebrow">{isPreorder ? "Coming Soon" : "Best Seller"}</p>
            <h2 className="featured-product__title">{selectedFlavor === "grapefruit" ? "Grapefruit" : "Strawberry Lemonade"}<br />Electrolyte Mix</h2>
            <p className="featured-product__subtitle">
              Zero-sugar hydration with 1,769mg electrolytes, B vitamins, Vitamin C, and recovery amino acids. 16 stick packs per box.
            </p>
            <div className="featured-product__badges">
              <span className="featured-product__badge">Zero Sugar</span>
              <span className="featured-product__badge">Non-GMO</span>
              <span className="featured-product__badge">Made in USA</span>
              <span className="featured-product__badge">25 Calories</span>
            </div>

            {/* Flavor Selector */}
            <div className="flavor-selector--circles">
              <button type="button" className={`flavor-circle flavor-circle--strawberry${selectedFlavor === "strawberry-lemonade" ? " active" : ""}`} onClick={() => setSelectedFlavor("strawberry-lemonade")}>
                <span className="flavor-circle__dot" />Strawberry Lemonade
              </button>
              <button type="button" className={`flavor-circle flavor-circle--grapefruit${selectedFlavor === "grapefruit" ? " active" : ""}`} onClick={() => setSelectedFlavor("grapefruit")}>
                <span className="flavor-circle__dot" />Grapefruit
              </button>
            </div>

            <div className="purchase-options">
              <button
                type="button"
                className={`purchase-option purchase-option--subscribe${isSubscribing ? " active" : ""}`}
                onClick={() => setPurchaseType("subscribe")}
              >
                <span className="purchase-option__label">Subscribe &amp; Save</span>
                <span className="purchase-option__discount-badge">20% off</span>
              </button>
              <button
                type="button"
                className={`purchase-option purchase-option--onetime${!isSubscribing ? " active" : ""}`}
                onClick={() => setPurchaseType("onetime")}
              >
                <span className="purchase-option__label">One-Time</span>
              </button>
            </div>

            <div className="purchase-option__price-row">
              <span className="purchase-option__price">${unitPrice.toFixed(2)}</span>
              {isSubscribing && <span className="purchase-option__price-original">${ONE_TIME_UNIT_PRICE.toFixed(2)}</span>}
              <span className="purchase-option__per">${perStickPrice.toFixed(2)} / stick</span>
            </div>

            {isSubscribing ? (
              <>
                <div className="purchase-option__savings-bar">
                  Save $6.00 every order, plus free shipping.
                </div>
                <div className="frequency-selector">
                  {[2, 4, 6].map((w) => (
                    <button
                      key={w}
                      className={`frequency-selector__btn${frequency === w ? " active" : ""}`}
                      onClick={() => setFrequency(w)}
                    >
                      Every {w} weeks
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="purchase-option__perks">
                <div className="purchase-option__perk">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  <span>Free shipping over $40</span>
                </div>
              </div>
            )}

            <div className="qty-select">
              <span className="qty-select__label">Quantity</span>
              <div className="bundle-selector">
                <button type="button" className={`bundle-card${qty === 1 && !customQtyOpen ? " bundle-card--active" : ""}`} onClick={() => { setQty(1); setCustomQtyOpen(false); }}>
                  <div className="bundle-card__title">1 Pouch</div>
                  <div className="bundle-card__price">${onePouchTotal.toFixed(2)}</div>
                </button>
                <button type="button" className={`bundle-card${qty === 2 && !customQtyOpen ? " bundle-card--active" : ""}`} onClick={() => { setQty(2); setCustomQtyOpen(false); }}>
                  {twoPackDiscount > 0 && <span className="bundle-card__badge bundle-card__badge--green">Best value</span>}
                  <div className="bundle-card__title">2 Pouches</div>
                  <div className="bundle-card__price">${twoPouchTotal.toFixed(2)}</div>
                </button>
              </div>

              {qty === 2 && !customQtyOpen && twoPackDiscount > 0 && (
                <p className="qty-select__hint">Includes 50% off the Atlas Bottle, plus ${twoPackDiscount.toFixed(2)} off your pouches.</p>
              )}

              {customQtyOpen ? (
                <div className="qty-stepper">
                  <div className="qty-stepper__control">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                    <span>{qty}</span>
                    <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>+</button>
                  </div>
                  <span className="qty-stepper__total">${customQtyTotal.toFixed(2)}</span>
                </div>
              ) : (
                <button type="button" className="qty-select__custom-toggle" onClick={() => setCustomQtyOpen(true)}>
                  Need a different amount?
                </button>
              )}

              {BOTTLE_DISCOUNT_LIVE && qty >= 4 && (
                <p className="qty-select__hint">Your Atlas Bottle ships free at this quantity.</p>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <button
                className={`btn btn--primary btn--lg${adding ? " btn--added" : ""}`}
                onClick={handleAdd}
              >
                {adding ? "Added" : isPreorder ? "Pre-Order" : `Add to Cart — $${customQtyTotal.toFixed(2)}`}
              </button>
            </div>

            <CompleteKitBundle
              mixSlug={selectedFlavor}
              mixName={selectedFlavor === "grapefruit" ? "Grapefruit Electrolyte Mix" : "Strawberry Lemonade Electrolyte Mix"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
