"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCart, BOTTLE_DISCOUNT_LIVE, TWO_PACK_DISCOUNT_AMOUNT } from "@/app/context/CartContext";
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

const ONE_TIME_UNIT_PRICE = 29.99;
const SUBSCRIBE_UNIT_PRICE = 23.99;
const ONE_TIME_PER_STICK = 1.87;
const SUBSCRIBE_PER_STICK = 1.50;

export default function ProductPage({ config }: { config: ProductPageConfig }) {
  const { addToCart } = useCart();
  const [purchaseOption, setPurchaseOption] = useState<"subscribe" | "onetime">("subscribe");
  const [frequency, setFrequency] = useState(2);
  const [qty, setQty] = useState(1);
  const [customQtyOpen, setCustomQtyOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const isSubscribing = purchaseOption === "subscribe";
  const unitPrice = isSubscribing ? SUBSCRIBE_UNIT_PRICE : ONE_TIME_UNIT_PRICE;
  const perStickPrice = isSubscribing ? SUBSCRIBE_PER_STICK : ONE_TIME_PER_STICK;
  // The 2-pack bundle discount only applies to one-time purchases.
  const twoPackDiscount = isSubscribing ? 0 : TWO_PACK_DISCOUNT_AMOUNT;
  const onePouchTotal = unitPrice;
  const twoPouchTotal = unitPrice * 2 - twoPackDiscount;
  const customQtyTotal = qty === 2 ? twoPouchTotal : qty * unitPrice;

  const handleAddToCart = useCallback(() => {
    const isSubscription = purchaseOption === "subscribe";
    addToCart(config.slug, qty, isSubscription ? frequency : undefined);
  }, [addToCart, config.slug, qty, purchaseOption, frequency]);

  const buyButtonText = config.preorder ? "Pre-Order" : "Add to Cart";
  const ctaButtonText = `${config.preorder ? "Pre-Order" : "Order"} — $${customQtyTotal.toFixed(2)}`;

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

              <div className="product-hero__actives">
                <span className="product-hero__actives-chip"><strong>1,769mg</strong> Electrolytes</span>
                <span className="product-hero__actives-chip">Magnesium Malate</span>
                <span className="product-hero__actives-chip">B12 (Methylcobalamin)</span>
                <span className="product-hero__actives-chip">L-Glutamine</span>
                <a href="#supplement-facts" className="product-hero__actives-link">Full breakdown →</a>
              </div>

              <div className="flavor-selector--circles">
                <Link href="/products/strawberry-lemonade" className={`flavor-circle flavor-circle--strawberry${config.activeFlavorClass === "strawberry" ? " active" : ""}`} title="Strawberry Lemonade">
                  <span className="flavor-circle__dot" />Strawberry Lemonade
                </Link>
                <Link href="/products/grapefruit" className={`flavor-circle flavor-circle--grapefruit${config.activeFlavorClass === "grapefruit" ? " active" : ""}`} title="Grapefruit">
                  <span className="flavor-circle__dot" />Grapefruit
                </Link>
              </div>

              <div className="purchase-options">
                <button
                  type="button"
                  className={`purchase-option purchase-option--subscribe${isSubscribing ? " active" : ""}`}
                  onClick={() => setPurchaseOption("subscribe")}
                >
                  <span className="purchase-option__label">Subscribe &amp; Save</span>
                  <span className="purchase-option__discount-badge">20% off</span>
                </button>
                <button
                  type="button"
                  className={`purchase-option purchase-option--onetime${!isSubscribing ? " active" : ""}`}
                  onClick={() => setPurchaseOption("onetime")}
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
                  <div className="purchase-option__perks">
                    <div className="purchase-option__perk"><CheckSvg /><span>20% off every order</span></div>
                    <div className="purchase-option__perk"><CheckSvg /><span>Free shipping on every delivery</span></div>
                    <div className="purchase-option__perk"><CheckSvg /><span>Skip, pause, or cancel anytime</span></div>
                  </div>
                  <div className="frequency-selector">
                    {[2, 4, 6].map((f) => (
                      <button key={f} className={`frequency-selector__btn${frequency === f ? " active" : ""}`} onClick={() => setFrequency(f)}>Every {f} weeks</button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="purchase-option__perks">
                  <div className="purchase-option__perk"><CheckSvg /><span>Free shipping over $40</span></div>
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

              <div className="product-hero__buy">
                <button className="btn btn--primary btn--lg" onClick={handleAddToCart}>{buyButtonText} — ${customQtyTotal.toFixed(2)}</button>
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
