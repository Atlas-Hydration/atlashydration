"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useCart, TWO_PACK_DISCOUNT_AMOUNT } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";
import { FREE_SHIPPING_THRESHOLD } from "@/app/data/formula";
import CompleteKitBundle from "@/app/components/CompleteKitBundle";
import PurchaseOptions from "@/app/components/PurchaseOptions";

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
    { src: "/images/products/grapefruit/atlas-grapefruit-cover.jpg", alt: "Atlas Grapefruit pouch and stick pack" },
    { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/4_04a1c3d2-929b-4150-bf92-64f0f83445b1.jpg?v=1769181321", alt: "Atlas Grapefruit supplement facts" },
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


  const product = PRODUCTS[selectedFlavor];
  const isSubscribing = purchaseType === "subscribe";
  const unitPrice = isSubscribing ? product.subscribePrice : product.price;
  // The 2-pack bundle discount only applies to one-time purchases — a
  // subscription already carries its own 20% discount.
  const twoPackDiscount = isSubscribing ? 0 : TWO_PACK_DISCOUNT_AMOUNT;
  const customQtyTotal = qty === 2 ? unitPrice * 2 - twoPackDiscount : qty * unitPrice;

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
            {!isPreorder && (
              <div className="featured-product__rating">
                <span className="junip-product-summary" data-product-id="7693950255178" />
              </div>
            )}
            <p className="featured-product__subtitle">
              1,769mg electrolytes, B vitamins, vitamin C, and amino acids. Zero sugar. 16 stick packs per box.
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

            <PurchaseOptions
              slug={selectedFlavor}
              purchaseType={purchaseType}
              onPurchaseTypeChange={setPurchaseType}
              qty={qty}
              onQtyChange={setQty}
              customQtyOpen={customQtyOpen}
              onCustomQtyOpenChange={setCustomQtyOpen}
              frequency={frequency}
              onFrequencyChange={setFrequency}
            />

            <div style={{ marginTop: 16 }}>
              <button
                className={`btn btn--primary btn--lg${adding ? " btn--added" : ""}`}
                onClick={handleAdd}
              >
                {adding ? "Added" : isPreorder ? "Pre-Order" : `Add to Cart — $${customQtyTotal.toFixed(2)}`}
              </button>
            </div>

            <ul className="trust-row" aria-label="Why customers feel good buying Atlas">
              <li>Third-party tested</li>
              <li>Made in USA</li>
              <li>Free shipping over ${FREE_SHIPPING_THRESHOLD}</li>
              <li>Skip or cancel subscriptions anytime</li>
            </ul>

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
