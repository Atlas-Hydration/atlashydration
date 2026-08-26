"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { SupplementFactsWithPanel } from "@/app/components/IngredientDetailPanel";
import FaqSection from "@/app/components/home/FaqSection";
import CompleteKitBundle from "@/app/components/CompleteKitBundle";

interface ProductImage {
  src: string;
  alt: string;
}

interface AccordionItem {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

interface ProductPageConfig {
  slug: string;
  flavorName: string;
  junipProductId: string;
  images: ProductImage[];
  accordionItems: AccordionItem[];
  ctaTitle: React.ReactNode;
  ctaText: string;
  activeFlavorClass: "strawberry" | "grapefruit";
  supplementFactsProps?: { otherIngredients?: string };
  preorder?: boolean;
}

const CheckSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

function ProductGallery({ images }: { images: ProductImage[] }) {
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

  const prevImage = useCallback(() => setCurrentImage((i) => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const nextImage = useCallback(() => setCurrentImage((i) => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  return (
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
          <button key={i} className={`product-gallery__thumb${i === currentImage ? " active" : ""}`} onClick={() => setCurrentImage(i)} aria-label={`Thumbnail ${i + 1}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductPage({ config }: { config: ProductPageConfig }) {
  const { addToCart } = useCart();
  const [purchaseOption, setPurchaseOption] = useState<"subscribe" | "onetime">("subscribe");
  const [frequency, setFrequency] = useState(2);
  const [bundleOption, setBundleOption] = useState<1 | 2>(1);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const bundleQty = bundleOption === 2 ? 2 : 1;
  const bundleSavings = bundleOption === 2 ? 4.99 : 0;
  const bundleCode = bundleOption === 2 ? 'ATLAS2PACK' : '';

  const handleAddToCart = useCallback(() => {
    localStorage.removeItem('atlas_discount_code');
    if (bundleCode) localStorage.setItem('atlas_discount_code', bundleCode);
    const isSubscription = purchaseOption === "subscribe";
    addToCart(config.slug, bundleQty, isSubscription ? frequency : undefined);
  }, [addToCart, config.slug, bundleQty, bundleCode, purchaseOption, frequency]);

  const buyButtonText = config.preorder ? "Pre-Order" : "Add to Cart";
  const ctaButtonText = config.preorder ? "Pre-Order — $29.99" : "Order — $29.99";

  return (
    <main>
      <section className="product-hero" aria-label={`${config.flavorName} product details`}>
        <div className="container">
          <div className="product-hero__grid">
            <ProductGallery images={config.images} />

            <div className="product-hero__info">
              <p className="product-hero__eyebrow">Hydrate. Recover. Thrive.</p>
              <h1 className="product-hero__title">Atlas Zero-Sugar Electrolytes</h1>
              <div className="product-hero__stars">
                <span className="junip-product-summary" data-product-id={config.junipProductId} />
              </div>
              <p className="product-hero__packs">16 Stick Packs</p>
              <p className="product-hero__desc">Clean, zero-sugar hydration with electrolytes, vitamins, and amino acids.</p>

              <div className="flavor-selector--circles">
                <Link href="/products/strawberry-lemonade" className={`flavor-circle flavor-circle--strawberry${config.activeFlavorClass === "strawberry" ? " active" : ""}`} title="Strawberry Lemonade">
                  <span className="flavor-circle__dot" />Strawberry Lemonade
                </Link>
                <Link href="/products/grapefruit" className={`flavor-circle flavor-circle--grapefruit${config.activeFlavorClass === "grapefruit" ? " active" : ""}`} title="Grapefruit">
                  <span className="flavor-circle__dot" />Grapefruit
                </Link>
              </div>

              <div className="purchase-options">
                <label className={`purchase-option purchase-option--subscribe${purchaseOption === "subscribe" ? " active" : ""}`}>
                  <span className="purchase-option__best-value">Best Value</span>
                  <div className="purchase-option__header">
                    <div className="purchase-option__radio">
                      <input type="radio" name="purchase-type" value="subscribe" checked={purchaseOption === "subscribe"} onChange={() => setPurchaseOption("subscribe")} />
                      <span className="purchase-option__radio-custom" />
                    </div>
                    <span className="purchase-option__label">Subscribe &amp; Save</span>
                    <span className="purchase-option__discount-badge">20% OFF</span>
                  </div>
                  <div className="purchase-option__price-row">
                    <span className="purchase-option__price">$23.99</span>
                    <span className="purchase-option__per">$1.50 / Stick</span>
                    <span className="purchase-option__price-original">$29.99</span>
                  </div>
                  <div className="purchase-option__savings-bar">
                    You save $6.00 every order + free shipping
                  </div>
                  <div className="purchase-option__details">
                    <div className="purchase-option__perks">
                      <div className="purchase-option__perk"><CheckSvg /><strong>Save 20% every order</strong></div>
                      <div className="purchase-option__perk"><CheckSvg /><strong>Free shipping on every delivery</strong></div>
                      <div className="purchase-option__perk"><CheckSvg /><strong>Edit, skip, or cancel anytime</strong></div>
                    </div>
                    <div className="frequency-selector">
                      {[2, 4, 6].map((f) => (
                        <button key={f} className={`frequency-selector__btn${frequency === f ? " active" : ""}`} onClick={() => setFrequency(f)}>{f} Weeks</button>
                      ))}
                    </div>
                  </div>
                </label>
                <label className={`purchase-option purchase-option--onetime${purchaseOption === "onetime" ? " active" : ""}`}>
                  <div className="purchase-option__header">
                    <div className="purchase-option__radio">
                      <input type="radio" name="purchase-type" value="onetime" checked={purchaseOption === "onetime"} onChange={() => setPurchaseOption("onetime")} />
                      <span className="purchase-option__radio-custom" />
                    </div>
                    <span className="purchase-option__label">One-time Purchase</span>
                  </div>
                  <div className="purchase-option__price-row">
                    <span className="purchase-option__price">$29.99</span>
                    <span className="purchase-option__per">$1.87 / Stick</span>
                  </div>
                </label>
              </div>

              <div className="bundle-selector">
                <button type="button" className={`bundle-card${bundleOption === 1 ? " bundle-card--active" : ""}`} onClick={() => setBundleOption(1)}>
                  <div className="bundle-card__title">1 Pouch</div>
                  <div className="bundle-card__price">$29.99</div>
                  <div className="bundle-card__per">$1.87 / stick</div>
                </button>
                <button type="button" className={`bundle-card${bundleOption === 2 ? " bundle-card--active" : ""}`} onClick={() => setBundleOption(2)}>
                  <span className="bundle-card__badge bundle-card__badge--green">Best Value</span>
                  <div className="bundle-card__title">2 Pouches</div>
                  <div className="bundle-card__price">$54.99</div>
                  <div className="bundle-card__per">$1.72 / stick · Save $5</div>
                </button>
              </div>
              {bundleSavings > 0 && (
                <div className="bundle-savings">You&apos;re saving ${bundleSavings.toFixed(2)} on this order</div>
              )}

              <div className="product-hero__buy">
                <button className="btn btn--primary btn--lg" onClick={handleAddToCart}>{buyButtonText}</button>
              </div>

              <CompleteKitBundle mixSlug={config.slug} mixName={config.flavorName} />

              <div className="product-accordions" style={{ marginTop: 16 }}>
                {config.accordionItems.map((acc, i) => (
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
          <SupplementFactsWithPanel {...(config.supplementFactsProps || {})} />
        </div>
      </section>

      {/* Junip Reviews */}
      <section className="junip-review-section reviews-section">
        <div className="container">
          <span className="junip-product-review" data-product-id={config.junipProductId} />
        </div>
      </section>

      <FaqSection />

      <section className="cta-section" aria-label="Buy now">
        <div className="cta-section__video-wrap">
          <iframe className="cta-section__video-yt" src="https://www.youtube.com/embed/l0Dk8Ylqbxk?autoplay=1&mute=1&loop=1&playlist=l0Dk8Ylqbxk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1" allow="autoplay; encrypted-media" allowFullScreen title="Atlas Hydration video background" referrerPolicy="strict-origin-when-cross-origin" loading="lazy" />
        </div>
        <div className="cta-section__overlay" />
        <div className="container">
          <div className="cta-section__inner">
            <h2 className="cta-section__title">{config.ctaTitle}</h2>
            <p className="cta-section__text">{config.ctaText}</p>
            <button className="btn btn--white btn--lg" onClick={handleAddToCart}>{ctaButtonText}</button>
          </div>
        </div>
      </section>
    </main>
  );
}
