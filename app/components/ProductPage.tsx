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
// Matches the real "ATLAS2PACK" Shopify discount — one-time purchases only,
// since a subscription already carries its own 20% discount.
const TWO_PACK_BUNDLE_DISCOUNT = 4.99;
const STICKS_PER_POUCH = 16;

export default function ProductPage({ config }: { config: ProductPageConfig }) {
  const { addToCart } = useCart();
  const [purchaseOption, setPurchaseOption] = useState<"subscribe" | "onetime">("subscribe");
  const [frequency, setFrequency] = useState(2);
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const isSubscribing = purchaseOption === "subscribe";
  const unitPrice = isSubscribing ? SUBSCRIBE_UNIT_PRICE : ONE_TIME_UNIT_PRICE;
  const perStickPrice = isSubscribing ? SUBSCRIBE_PER_STICK : ONE_TIME_PER_STICK;
  // The 2-pack bundle discount only applies to one-time purchases.
  const twoPackDiscount = isSubscribing ? 0 : TWO_PACK_BUNDLE_DISCOUNT;
  const onePouchTotal = unitPrice;
  const twoPouchTotal = unitPrice * 2 - twoPackDiscount;
  const twoPouchPerStick = twoPouchTotal / (STICKS_PER_POUCH * 2);
  const customQtyTotal = qty === 2 ? twoPouchTotal : qty * unitPrice;

  const bundleSavings = qty === 2 ? twoPackDiscount : 0;

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

              <div className="flavor-selector--circles">
                <Link href="/products/strawberry-lemonade" className={`flavor-circle flavor-circle--strawberry${config.activeFlavorClass === "strawberry" ? " active" : ""}`} title="Strawberry Lemonade">
                  <span className="flavor-circle__dot" />Strawberry Lemonade
                </Link>
                <Link href="/products/grapefruit" className={`flavor-circle flavor-circle--grapefruit${config.activeFlavorClass === "grapefruit" ? " active" : ""}`} title="Grapefruit">
                  <span className="flavor-circle__dot" />Grapefruit
                </Link>
              </div>

              <p className="product-hero__bundle-teaser">
                {BOTTLE_DISCOUNT_LIVE
                  ? "🎁 Add 2 pouches, get the Atlas Bottle 50% off — details below"
                  : `🎁 Add 2 pouches, save $${TWO_PACK_DISCOUNT_AMOUNT.toFixed(2)} — details below`}
              </p>

              <div className="purchase-options">
                <label className={`purchase-option purchase-option--subscribe${purchaseOption === "subscribe" ? " active" : ""}`}>
                  <span className="purchase-option__best-value">Most Popular</span>
                  <div className="purchase-option__header">
                    <div className="purchase-option__radio">
                      <input type="radio" name="purchase-type" value="subscribe" checked={purchaseOption === "subscribe"} onChange={() => setPurchaseOption("subscribe")} />
                      <span className="purchase-option__radio-custom" />
                    </div>
                    <span className="purchase-option__label">Subscribe &amp; Save</span>
                    <span className="purchase-option__discount-badge">20% OFF</span>
                  </div>
                  <div className="purchase-option__price-row">
                    <span className="purchase-option__price">${SUBSCRIBE_UNIT_PRICE.toFixed(2)}</span>
                    <span className="purchase-option__per">${SUBSCRIBE_PER_STICK.toFixed(2)} / Stick</span>
                    <span className="purchase-option__price-original">${ONE_TIME_UNIT_PRICE.toFixed(2)}</span>
                  </div>
                  <div className="purchase-option__savings-bar">
                    You save $6.00 every order + free shipping
                  </div>
                  <div className="purchase-option__details">
                    <div className="purchase-option__perks">
                      <div className="purchase-option__perk"><CheckSvg /><strong>Edit, skip, or cancel anytime</strong></div>
                      <div className="purchase-option__perk"><CheckSvg /><strong>Locked-in price, every delivery</strong></div>
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
                    <span className="purchase-option__price">${ONE_TIME_UNIT_PRICE.toFixed(2)}</span>
                    <span className="purchase-option__per">${ONE_TIME_PER_STICK.toFixed(2)} / Stick</span>
                  </div>
                </label>
              </div>

              <p className="bundle-selector__scope-label">
                Quantity for {isSubscribing ? "Subscribe & Save" : "One-Time Purchase"}
              </p>

              <div className="bundle-selector">
                <button type="button" className={`bundle-card${qty === 1 ? " bundle-card--active" : ""}`} onClick={() => setQty(1)}>
                  <div className="bundle-card__title">1 Pouch</div>
                  <div className="bundle-card__price">${onePouchTotal.toFixed(2)}</div>
                  <div className="bundle-card__per">${perStickPrice.toFixed(2)} / stick</div>
                </button>
                <button type="button" className={`bundle-card${qty === 2 ? " bundle-card--active" : ""}`} onClick={() => setQty(2)}>
                  {twoPackDiscount > 0 && <span className="bundle-card__badge bundle-card__badge--green">Best Value</span>}
                  <div className="bundle-card__title">2 Pouches</div>
                  <div className="bundle-card__price">${twoPouchTotal.toFixed(2)}</div>
                  <div className="bundle-card__per">
                    ${twoPouchPerStick.toFixed(2)} / stick{twoPackDiscount > 0 ? ` · Save $${twoPackDiscount.toFixed(2)}` : ""}
                  </div>
                </button>
              </div>

              <div className="qty-stepper">
                <span className="qty-stepper__label">Or choose your own quantity</span>
                <div className="qty-stepper__control">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>+</button>
                </div>
                <span className="qty-stepper__total">${customQtyTotal.toFixed(2)}</span>
              </div>
              {bundleSavings > 0 && (
                <div className="bundle-savings">You&apos;re saving ${bundleSavings.toFixed(2)} on this order</div>
              )}
              {BOTTLE_DISCOUNT_LIVE && qty >= 4 && qty < 8 && (
                <div className="qty-stepper__promo-hint">🎉 4+ pouches unlocks a FREE Atlas Performance Bottle in your cart!</div>
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
