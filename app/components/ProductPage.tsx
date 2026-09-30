"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { oneTimePouchTotal } from "@/app/data/pricing";
import { PRODUCTS } from "@/app/data/products";
import { FREE_SHIPPING_THRESHOLD } from "@/app/data/formula";
import PurchaseOptions from "@/app/components/PurchaseOptions";
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
  supplementFactsProps?: { otherIngredients?: string; formula?: "current" | "legacy" };
  preorder?: boolean;
}

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
  const [qty, setQty] = useState(1);
  const [customQtyOpen, setCustomQtyOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const product = PRODUCTS[config.slug];
  const isSubscribing = purchaseOption === "subscribe";
  const unitPrice = isSubscribing ? product.subscribePrice : product.price;
  // The multi-pouch discount only applies to one-time purchases.
  const customQtyTotal = isSubscribing ? qty * unitPrice : oneTimePouchTotal(qty);

  const handleAddToCart = useCallback(() => {
    const isSubscription = purchaseOption === "subscribe";
    addToCart(config.slug, qty, isSubscription ? frequency : undefined);
  }, [addToCart, config.slug, qty, purchaseOption, frequency]);

  // Mobile sticky Add to Cart: only while the main buy button is off-screen and
  // the closing CTA hasn't been reached. Reuses handleAddToCart unchanged.
  useEffect(() => {
    const onScroll = () => {
      const buy = buyRef.current?.getBoundingClientRect();
      const cta = document.querySelector(".cta-section")?.getBoundingClientRect();
      const vh = window.innerHeight;
      const buyInView = !!buy && buy.top < vh && buy.bottom > 0;
      const ctaInView = !!cta && cta.top < vh;
      setShowSticky(window.scrollY > 240 && !buyInView && !ctaInView);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const buyButtonText = config.preorder ? "Pre-Order" : "Add to Cart";
  const pouchLabel = `${qty} pouch${qty === 1 ? "" : "es"}`;
  const stickyMeta = isSubscribing ? `Subscribe & Save · ${pouchLabel}` : `One-time · ${pouchLabel}`;
  const ctaButtonText = `${config.preorder ? "Pre-Order" : "Order"} — $${customQtyTotal.toFixed(2)}`;

  return (
    <main>
      <section className="product-hero" aria-label={`${config.flavorName} product details`}>
        <div className="container">
          <div className="product-hero__grid">
            <ProductGallery images={config.images} />

            <div className="product-hero__info">
              <p className="product-hero__eyebrow">Daily performance hydration</p>
              <h1 className="product-hero__title">Atlas {config.flavorName} Electrolytes</h1>
              <div className="product-hero__stars">
                <span className="junip-product-summary" data-product-id={config.junipProductId} />
              </div>
              <p className="product-hero__price">
                <strong>${product.price.toFixed(2)}</strong>
                <span>or ${product.subscribePrice.toFixed(2)} per pouch with Subscribe &amp; Save</span>
              </p>
              <p className="product-hero__packs">16 Stick Packs</p>
              <p className="product-hero__desc">Zero-sugar electrolytes with B vitamins, vitamin C, and amino acids. Built for training, travel, heat, and long days.</p>

              <div className="product-hero__actives">
                <span className="product-hero__actives-chip"><strong>1,769mg</strong> Electrolytes</span>
                <span className="product-hero__actives-chip">Zero Sugar</span>
                <span className="product-hero__actives-chip">25 Calories</span>
                <span className="product-hero__actives-chip">B Vitamins + C</span>
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

              <PurchaseOptions
                slug={config.slug}
                purchaseType={purchaseOption}
                onPurchaseTypeChange={setPurchaseOption}
                qty={qty}
                onQtyChange={setQty}
                customQtyOpen={customQtyOpen}
                onCustomQtyOpenChange={setCustomQtyOpen}
                frequency={frequency}
                onFrequencyChange={setFrequency}
              />

              <div className="product-hero__buy" ref={buyRef}>
                <button className="btn btn--primary btn--lg" onClick={handleAddToCart}>{buyButtonText} — ${customQtyTotal.toFixed(2)}</button>
              </div>

              <ul className="trust-row" aria-label="Why customers feel good buying Atlas">
                <li>Third-party tested</li>
                <li>Made in USA</li>
                <li>Free shipping over ${FREE_SHIPPING_THRESHOLD}</li>
                <li>Skip or cancel subscriptions anytime</li>
              </ul>

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

      {/* Junip Reviews */}
      <section className="junip-review-section reviews-section">
        <div className="container">
          <span className="junip-product-review" data-product-id={config.junipProductId} />
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
      <div className={`pdp-sticky${showSticky ? " pdp-sticky--visible" : ""}`} aria-hidden={!showSticky}>
        <div className="pdp-sticky__info">
          <span className="pdp-sticky__name">{config.flavorName}</span>
          <span className="pdp-sticky__meta">{stickyMeta}</span>
        </div>
        <button type="button" className="btn btn--primary" tabIndex={showSticky ? 0 : -1} onClick={handleAddToCart}>
          {buyButtonText} — ${customQtyTotal.toFixed(2)}
        </button>
      </div>
    </main>
  );
}
