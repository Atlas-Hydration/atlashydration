"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { SupplementFactsWithPanel } from "@/app/components/IngredientDetailPanel";
import FaqSection from "@/app/components/home/FaqSection";

const images = [
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_1a252c57-dc62-4c7b-a6b1-0f9677ce6b6f.jpg?v=1769181320", alt: "Atlas Grapefruit pouch and stick pack" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/3_895d9a50-ff83-4081-a78b-7c5034614a38.jpg?v=1769181320", alt: "Atlas Grapefruit lifestyle" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/6_9aa2f5c5-dc91-499b-a36e-2ddb0ba45f49.jpg?v=1769181321", alt: "Atlas Grapefruit mixing" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/4_04a1c3d2-929b-4150-bf92-64f0f83445b1.jpg?v=1769181321", alt: "Atlas Grapefruit active lifestyle" },
];


const CheckSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function Grapefruit() {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const imgs = el.querySelectorAll(".product-gallery__stacked-img");
    if (imgs[currentImage]) {
      imgs[currentImage].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  }, [currentImage]);

  const prevImage = () => setCurrentImage((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setCurrentImage((i) => (i === images.length - 1 ? 0 : i + 1));
  const handleAddToCart = () => addToCart("grapefruit", quantity);

  return (
    <main>
      <section className="product-hero" aria-label="Grapefruit product details">
        <div className="container">
          <div className="product-hero__grid">
            <div className="product-gallery product-gallery--stacked">
              <div className="product-gallery__stacked-images" ref={galleryRef}>
                {images.map((img, i) => (
                  <div className="product-gallery__stacked-img" key={i}>
                    <img src={img.src} alt={img.alt} loading={i === 0 ? "eager" : "lazy"} />
                  </div>
                ))}
              </div>
              <button className="product-gallery__arrow product-gallery__arrow--prev" aria-label="Previous image" onClick={prevImage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button className="product-gallery__arrow product-gallery__arrow--next" aria-label="Next image" onClick={nextImage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
              <div className="product-gallery__dots">
                {images.map((_, i) => (
                  <button key={i} className={`product-gallery__dot${i === currentImage ? " active" : ""}`} onClick={() => setCurrentImage(i)} aria-label={`View image ${i + 1}`} />
                ))}
              </div>
              <div className="product-gallery__thumbs">
                {images.map((img, i) => (
                  <button key={i} className={`product-gallery__thumb${i === currentImage ? " active" : ""}`} onClick={() => setCurrentImage(i)}>
                    <img src={img.src} alt={img.alt} />
                  </button>
                ))}
              </div>
            </div>

            <div className="product-hero__info">
              <p className="product-hero__eyebrow">Hydrate. Recover. Thrive.</p>
              <h1 className="product-hero__title">Atlas Zero-Sugar Electrolytes</h1>
              <div className="product-hero__stars">
                <span className="junip-product-summary" data-product-id="7862662103114" />
              </div>
              <span className="product-hero__preorder-badge">Pre-Order</span>
              <p className="product-hero__packs">16 Stick Packs</p>
              <p className="product-hero__desc">Clean, zero-sugar hydration with electrolytes, vitamins, and amino acids.</p>

              <div className="flavor-selector--circles">
                <Link href="/products/strawberry-lemonade" className="flavor-circle flavor-circle--strawberry" title="Strawberry Lemonade">
                  <span className="flavor-circle__dot" />Strawberry Lemonade
                </Link>
                <Link href="/products/grapefruit" className="flavor-circle flavor-circle--grapefruit active" title="Grapefruit">
                  <span className="flavor-circle__dot" />Grapefruit
                </Link>
              </div>

              <div className="product-hero__preorder-box">
                <p className="product-hero__preorder-price"><strong>$29.99</strong> <span>16 Stick Packs</span></p>
              </div>

              <div className="product-hero__buy">
                <div className="qty-selector">
                  <button className="qty-selector__btn" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>&minus;</button>
                  <input type="number" className="qty-selector__input" value={quantity} min={1} max={10} aria-label="Quantity" onChange={(e) => { const v = parseInt(e.target.value, 10); if (v >= 1 && v <= 10) setQuantity(v); }} />
                  <button className="qty-selector__btn" aria-label="Increase quantity" onClick={() => setQuantity((q) => Math.min(10, q + 1))}>+</button>
                </div>
                <button className="btn btn--primary btn--lg" onClick={handleAddToCart}>Pre-Order — $29.99</button>
              </div>

              <div className="product-accordions" style={{ marginTop: 16 }}>
                {[
                  {
                    icon: <svg className="product-accordion__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
                    title: "Description & Ingredients",
                    content: (
                      <>
                        <p><strong>Atlas Hydration Grapefruit</strong> is a premium zero-sugar electrolyte drink mix engineered for superior hydration, recovery, and everyday performance. Each box contains 16 individually wrapped stick packs — perfect for the gym, office, or travel.</p>
                        <p><strong>Key Electrolytes:</strong> Sodium 500mg, Potassium 400mg, Magnesium 60mg. <strong>Vitamins:</strong> Vitamin C 90mg, Niacin (B3) 20mg, Pantothenic Acid (B5) 10mg, Vitamin B6 2mg, Vitamin B12 8mcg. <strong>Amino Acids:</strong> L-Glutamine 1,000mg, L-Taurine 200mg.</p>
                        <p><strong>Other Ingredients:</strong> Citric Acid, Natural Grapefruit Flavor, Bamboo Extract, Grapefruit Oil, Annatto Seed Extract (color), Stevia Leaf Extract, Allulose.</p>
                      </>
                    ),
                  },
                  {
                    icon: <svg className="product-accordion__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>,
                    title: "How to Use",
                    content: (
                      <>
                        <p>Mix one stick pack with 12–16 oz of cold water and shake or stir until dissolved. Adjust water to taste — less water for a stronger flavor, more for a lighter drink.</p>
                        <p><strong>When to drink:</strong> First thing in the morning, during or after workouts, while traveling, or anytime you need a hydration boost. Use daily for best results.</p>
                        <p><strong>Storage:</strong> Store in a cool, dry place. No refrigeration needed until mixed.</p>
                      </>
                    ),
                  },
                  {
                    icon: <svg className="product-accordion__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
                    title: "Shipping & Returns",
                    content: (
                      <>
                        <p><strong>Free shipping</strong> on all U.S. orders over $50. Standard shipping (3–5 business days) is $4.99. Expedited options available at checkout.</p>
                        <p><strong>Satisfaction guaranteed:</strong> If you&apos;re not completely happy with your order, contact us within 30 days for a full refund or exchange — no questions asked.</p>
                        <p>We currently ship within the United States. International shipping coming soon.</p>
                      </>
                    ),
                  },
                ].map((acc, i) => (
                  <div key={i}>
                    <div className="product-accordion__divider" />
                    <div className="product-accordion">
                      <button className="product-accordion__header" aria-expanded={openAccordion === i} onClick={() => setOpenAccordion(openAccordion === i ? null : i)}>
                        {acc.icon}
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

      <section className="benefits-bar" aria-label="Product benefits">
        <div className="container">
          <div className="benefits-bar__grid">
            <div className="benefits-bar__item"><div className="benefits-bar__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg></div><span className="benefits-bar__label">Hydration</span></div>
            <div className="benefits-bar__item"><div className="benefits-bar__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div><span className="benefits-bar__label">Recovery</span></div>
            <div className="benefits-bar__item"><div className="benefits-bar__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg></div><span className="benefits-bar__label">Performance</span></div>
            <div className="benefits-bar__item"><div className="benefits-bar__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div><span className="benefits-bar__label">Immunity</span></div>
            <div className="benefits-bar__item"><div className="benefits-bar__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /><circle cx="12" cy="12" r="10" /></svg></div><span className="benefits-bar__label">No Sugar</span></div>
          </div>
        </div>
      </section>

      <section className="supplement-facts" id="supplement-facts" aria-label="Supplement Facts">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Transparency</p>
            <h2 className="section-title">Supplement Facts</h2>
            <p className="section-subtitle">Every ingredient listed. No proprietary blends. No hidden fillers.</p>
          </div>
          <div className="supplement-facts__tap-hint">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 15.5V13a2 2 0 0 1 4 0v2.5" />
              <path d="M11 15.5V11a2 2 0 0 1 4 0v4.5" />
              <path d="M7 15.5V13a2 2 0 0 1 4 0v2.5" />
              <path d="M5 13a2 2 0 0 1 2-2v0" />
              <path d="M5 15.5V15a6.5 6.5 0 0 0 13 0v-1" />
              <path d="M5 13v-1a2 2 0 0 1 4 0v3" />
            </svg>
            Tap any ingredient to explore
          </div>
          <SupplementFactsWithPanel otherIngredients="Citric Acid, Bamboo Extract, Grapefruit Oil, Annatto Seed Extract (color)" />
        </div>
      </section>

      <FaqSection />

      <section className="cta-section" aria-label="Buy now">
        <div className="cta-section__video-wrap">
          <iframe className="cta-section__video-yt" src="https://www.youtube.com/embed/l0Dk8Ylqbxk?autoplay=1&mute=1&loop=1&playlist=l0Dk8Ylqbxk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1" allow="autoplay; encrypted-media" allowFullScreen title="Atlas Hydration video background" />
        </div>
        <div className="cta-section__overlay" />
        <div className="container">
          <div className="cta-section__inner">
            <h2 className="cta-section__title">Ready to Try Grapefruit?</h2>
            <p className="cta-section__text">16 stick packs of crisp, refreshing hydration. Zero sugar. Five calories. Full performance.</p>
            <button className="btn btn--white btn--lg" onClick={handleAddToCart}>Pre-Order — $29.99</button>
          </div>
        </div>
      </section>
    </main>
  );
}
