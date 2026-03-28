import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { useCart } from "~/context/CartContext";

export function meta() {
  return [
    { title: "Grapefruit Electrolyte Drink Mix | Atlas Hydration" },
    {
      name: "description",
      content:
        "Atlas Grapefruit zero-sugar electrolyte mix. 1,300mg electrolytes, B vitamins, and amino acids. 16 stick packs for $29.99. Shop now.",
    },
    {
      name: "keywords",
      content:
        "grapefruit electrolyte, zero sugar electrolyte mix, Atlas Hydration, electrolyte powder, sports hydration drink",
    },
    { property: "og:type", content: "product" },
    {
      property: "og:title",
      content: "Grapefruit Electrolyte Drink Mix | Atlas Hydration",
    },
    {
      property: "og:description",
      content:
        "Zero-sugar electrolyte drink mix with 1,300mg electrolytes, B vitamins, Vitamin C, and recovery amino acids. 16 stick packs — $29.99.",
    },
    { property: "og:site_name", content: "Atlas Hydration" },
  ];
}

const images = [
  {
    src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_1a252c57-dc62-4c7b-a6b1-0f9677ce6b6f.jpg?v=1769181320",
    alt: "Atlas Grapefruit pouch and stick pack",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/3_895d9a50-ff83-4081-a78b-7c5034614a38.jpg?v=1769181320",
    alt: "Atlas Grapefruit lifestyle",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/6_9aa2f5c5-dc91-499b-a36e-2ddb0ba45f49.jpg?v=1769181321",
    alt: "Atlas Grapefruit mixing",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/4_04a1c3d2-929b-4150-bf92-64f0f83445b1.jpg?v=1769181321",
    alt: "Atlas Grapefruit active lifestyle",
  },
];

const faqItems = [
  {
    question: "How many electrolytes are in Atlas Grapefruit per serving?",
    answer:
      "Each stick pack contains <strong>1,300mg of total electrolytes</strong>: 600mg Sodium (from Sodium Citrate and Pink Himalayan Salt), 500mg Potassium (from Potassium Citrate), and 200mg Magnesium (from Magnesium Malate). This is more total electrolytes per serving than LMNT, Liquid I.V., or WaterBoy.",
  },
  {
    question: "Is Atlas Grapefruit sugar-free?",
    answer:
      'Yes — <strong>zero grams of sugar</strong> and only <strong>5 calories per serving</strong>. Naturally sweetened with stevia leaf extract and allulose, a rare sugar with near-zero glycemic impact. No artificial sweeteners are used.',
  },
  {
    question: "What makes Atlas Grapefruit flavor natural?",
    answer:
      "Atlas Grapefruit uses <strong>real cold-pressed grapefruit oil</strong> for authentic citrus flavor — not artificial grapefruit flavoring. Colors come from annatto seed extract (a plant-based pigment used for centuries), and sweetness from stevia leaf and allulose. Zero synthetic dyes, zero artificial flavors, zero compromise.",
  },
  {
    question: "How does Atlas Grapefruit compare to other electrolyte drinks?",
    answer:
      "Atlas delivers <strong>1,300mg electrolytes</strong> per serving with zero sugar and 5 calories, plus B vitamins, Vitamin C, and 1,200mg recovery amino acids. Most competitors either have less electrolytes (Liquid I.V. ~500mg), include sugar (Liquid I.V. 11g), or lack vitamins and amino acids (LMNT). Atlas provides the most complete hydration formula on the market.",
  },
  {
    question: "What vitamins and amino acids are in Atlas Grapefruit?",
    answer:
      "Each serving contains <strong>Vitamin C</strong> (90mg, 100% DV), <strong>Vitamin B3</strong> (24mg, 150% DV), <strong>Vitamin B5</strong> (5mg, 100% DV), <strong>Vitamin B6</strong> (2mg, 118% DV), <strong>Vitamin B12</strong> (8mcg, 333% DV), plus <strong>1,000mg L-Glutamine</strong> and <strong>200mg L-Alanine</strong> for recovery support.",
  },
  {
    question: "How do I use Atlas Hydration Grapefruit?",
    answer:
      "Mix one stick pack with <strong>12\u201316 oz of cold water</strong> and shake or stir until dissolved. Drink first thing in the morning, during or after workouts, while traveling, or anytime you need a hydration boost. Each box contains 16 individually wrapped stick packs.",
  },
];

const CheckSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function Grapefruit() {
  const { addToCart } = useCart();
  const [purchaseOption, setPurchaseOption] = useState<"subscribe" | "onetime">("subscribe");
  const [frequency, setFrequency] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

  const handleAddToCart = () => {
    addToCart("grapefruit", quantity);
  };

  return (
    <main>
      {/* Product Hero */}
      <section className="product-hero" aria-label="Grapefruit product details">
        <div className="container">
          <div className="product-hero__grid">
            {/* Product Gallery */}
            <div className="product-gallery product-gallery--stacked">
              <div className="product-gallery__stacked-images" ref={galleryRef}>
                {images.map((img, i) => (
                  <div className="product-gallery__stacked-img" key={i}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
              <button
                className="product-gallery__arrow product-gallery__arrow--prev"
                aria-label="Previous image"
                onClick={prevImage}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="product-gallery__arrow product-gallery__arrow--next"
                aria-label="Next image"
                onClick={nextImage}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <div className="product-gallery__dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`product-gallery__dot${i === currentImage ? " active" : ""}`}
                    onClick={() => setCurrentImage(i)}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
              <div className="product-gallery__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`product-gallery__thumb${i === currentImage ? " active" : ""}`}
                    onClick={() => setCurrentImage(i)}
                  >
                    <img src={img.src} alt={img.alt} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-hero__info">
              <p className="product-hero__eyebrow">Hydrate. Recover. Thrive.</p>
              <h1 className="product-hero__title">Atlas Zero-Sugar Electrolytes</h1>

              <div className="product-hero__stars">
                <span className="junip-product-summary" data-product-id="7862662103114" />
              </div>

              <span className="product-hero__preorder-badge">Pre-Order</span>
              <p className="product-hero__packs">16 Stick Packs</p>
              <p className="product-hero__desc">
                Clean, zero-sugar hydration with electrolytes, vitamins, and amino acids.
              </p>

              {/* Flavor Selector */}
              <div className="flavor-selector--circles">
                <Link
                  to="/products/strawberry-lemonade"
                  className="flavor-circle flavor-circle--strawberry"
                  title="Strawberry Lemonade"
                >
                  <span className="flavor-circle__dot" />
                  Strawberry Lemonade
                </Link>
                <Link
                  to="/products/grapefruit"
                  className="flavor-circle flavor-circle--grapefruit active"
                  title="Grapefruit"
                >
                  <span className="flavor-circle__dot" />
                  Grapefruit
                </Link>
              </div>

              {/* Purchase Options */}
              <div className="purchase-options">
                <label
                  className={`purchase-option purchase-option--subscribe${purchaseOption === "subscribe" ? " active" : ""}`}
                  data-option="subscribe"
                >
                  <div className="purchase-option__header">
                    <div className="purchase-option__radio">
                      <input
                        type="radio"
                        name="purchase-type"
                        value="subscribe"
                        checked={purchaseOption === "subscribe"}
                        onChange={() => setPurchaseOption("subscribe")}
                      />
                      <span className="purchase-option__radio-custom" />
                    </div>
                    <span className="purchase-option__label">Subscribe &amp; Save</span>
                    <div className="purchase-option__pricing">
                      <span className="purchase-option__price">$23.99</span>
                      <span className="purchase-option__per">$1.69 / Stick</span>
                    </div>
                  </div>
                  <div className="purchase-option__details">
                    <div className="purchase-option__perks">
                      <div className="purchase-option__perk">
                        <CheckSvg />
                        <span className="purchase-option__save-badge">Save 20%</span>
                      </div>
                      <div className="purchase-option__perk">
                        <CheckSvg />
                        <strong>Free Shipping</strong>
                      </div>
                      <div className="purchase-option__perk">
                        <CheckSvg />
                        <strong>Cancel Anytime</strong>
                      </div>
                    </div>
                    <div className="frequency-selector">
                      {[2, 4, 6].map((f) => (
                        <button
                          key={f}
                          className={`frequency-selector__btn${frequency === f ? " active" : ""}`}
                          data-frequency={f}
                          onClick={() => setFrequency(f)}
                        >
                          {f} Weeks
                        </button>
                      ))}
                    </div>
                  </div>
                </label>

                <label
                  className={`purchase-option purchase-option--onetime${purchaseOption === "onetime" ? " active" : ""}`}
                  data-option="onetime"
                >
                  <div className="purchase-option__header">
                    <div className="purchase-option__radio">
                      <input
                        type="radio"
                        name="purchase-type"
                        value="onetime"
                        checked={purchaseOption === "onetime"}
                        onChange={() => setPurchaseOption("onetime")}
                      />
                      <span className="purchase-option__radio-custom" />
                    </div>
                    <span className="purchase-option__label">One-time</span>
                    <div className="purchase-option__pricing">
                      <span className="purchase-option__price">$29.99</span>
                      <span className="purchase-option__per">$1.87 / Stick</span>
                    </div>
                  </div>
                </label>
              </div>

              <p className="product-hero__promo">
                <strong>Limited Time. Buy 3 Get 1 Free</strong>
              </p>

              {/* Quantity + Add to Cart */}
              <div className="product-hero__buy">
                <div className="qty-selector">
                  <button
                    className="qty-selector__btn"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    &minus;
                  </button>
                  <input
                    type="number"
                    className="qty-selector__input"
                    value={quantity}
                    min={1}
                    max={10}
                    aria-label="Quantity"
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (v >= 1 && v <= 10) setQuantity(v);
                    }}
                  />
                  <button
                    className="qty-selector__btn"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn--primary btn--lg"
                  data-product="grapefruit"
                  onClick={handleAddToCart}
                >
                  Pre-Order Now
                </button>
              </div>

              {/* Product Detail Accordions */}
              <div className="product-accordions" style={{ marginTop: 16 }}>
                <div className="product-accordion__divider" />
                <div className="product-accordion">
                  <button className="product-accordion__header" aria-expanded="false">
                    <svg className="product-accordion__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span className="product-accordion__title">Description &amp; Ingredients</span>
                    <svg className="product-accordion__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div className="product-accordion__body">
                    <div className="product-accordion__content">
                      <p>
                        <strong>Atlas Hydration Grapefruit</strong> is a premium zero-sugar
                        electrolyte drink mix engineered for superior hydration, recovery, and
                        everyday performance. Each box contains 16 individually wrapped stick packs
                        — perfect for the gym, office, or travel.
                      </p>
                      <p>
                        <strong>Key Electrolytes:</strong> Sodium 500mg, Potassium 400mg, Magnesium
                        60mg. <strong>Vitamins:</strong> Vitamin C 90mg, Niacin (B3) 20mg,
                        Pantothenic Acid (B5) 10mg, Vitamin B6 2mg, Vitamin B12 8mcg.{" "}
                        <strong>Amino Acids:</strong> L-Glutamine 1,000mg, L-Taurine 200mg.
                      </p>
                      <p>
                        <strong>Other Ingredients:</strong> Citric Acid, Natural Grapefruit Flavor,
                        Bamboo Extract, Grapefruit Oil, Annatto Seed Extract (color), Stevia Leaf
                        Extract, Allulose.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="product-accordion__divider" />
                <div className="product-accordion">
                  <button className="product-accordion__header" aria-expanded="false">
                    <svg className="product-accordion__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                    </svg>
                    <span className="product-accordion__title">How to Use</span>
                    <svg className="product-accordion__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div className="product-accordion__body">
                    <div className="product-accordion__content">
                      <p>
                        Mix one stick pack with 12–16 oz of cold water and shake or stir until
                        dissolved. Adjust water to taste — less water for a stronger flavor, more
                        for a lighter drink.
                      </p>
                      <p>
                        <strong>When to drink:</strong> First thing in the morning, during or after
                        workouts, while traveling, or anytime you need a hydration boost. Use daily
                        for best results.
                      </p>
                      <p>
                        <strong>Storage:</strong> Store in a cool, dry place. No refrigeration
                        needed until mixed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="product-accordion__divider" />
                <div className="product-accordion">
                  <button className="product-accordion__header" aria-expanded="false">
                    <svg className="product-accordion__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="1" y="3" width="15" height="13" rx="2" />
                      <path d="M16 8h4l3 3v5h-7V8z" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <span className="product-accordion__title">Shipping &amp; Returns</span>
                    <svg className="product-accordion__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div className="product-accordion__body">
                    <div className="product-accordion__content">
                      <p>
                        <strong>Free shipping</strong> on all U.S. orders over $50. Standard
                        shipping (3–5 business days) is $4.99. Expedited options available at
                        checkout.
                      </p>
                      <p>
                        <strong>Satisfaction guaranteed:</strong> If you&apos;re not completely happy
                        with your order, contact us within 30 days for a full refund or exchange —
                        no questions asked.
                      </p>
                      <p>
                        We currently ship within the United States. International shipping coming
                        soon.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="product-accordion__divider" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="benefits-bar" aria-label="Product benefits">
        <div className="container">
          <div className="benefits-bar__grid">
            <div className="benefits-bar__item">
              <div className="benefits-bar__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                </svg>
              </div>
              <span className="benefits-bar__label">Hydration</span>
            </div>
            <div className="benefits-bar__item">
              <div className="benefits-bar__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="benefits-bar__label">Recovery</span>
            </div>
            <div className="benefits-bar__item">
              <div className="benefits-bar__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="benefits-bar__label">Performance</span>
            </div>
            <div className="benefits-bar__item">
              <div className="benefits-bar__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="benefits-bar__label">Immunity</span>
            </div>
            <div className="benefits-bar__item">
              <div className="benefits-bar__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <span className="benefits-bar__label">No Sugar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Supplement Facts */}
      <section className="supplement-facts" id="supplement-facts" aria-label="Supplement Facts">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Transparency</p>
            <h2 className="section-title">Supplement Facts</h2>
            <p className="section-subtitle">
              Every ingredient listed. No proprietary blends. No hidden fillers.
            </p>
          </div>

          <div className="supplement-facts__grid">
            <div className="supplement-facts__table" role="table" aria-label="Supplement Facts">
              <h3>Supplement Facts</h3>
              <p className="sf-meta">16 servings per container</p>
              <p className="sf-meta">
                Serving Size <strong>1 Stick (8g)</strong>
              </p>

              <div className="sf-divider" />
              <p className="sf-meta" style={{ fontSize: "var(--text-xs)" }}>
                Amount per serving
              </p>

              <div className="sf-row sf-row--calories">
                <span>Calories</span>
                <span>5</span>
              </div>

              <div className="sf-row sf-row--header">
                <span>% Daily Value*</span>
              </div>

              <div className="sf-row">
                <span>
                  <strong>Total Carbohydrate</strong> 1g
                </span>
                <span>&lt;1%*</span>
              </div>
              <div className="sf-row">
                <span>
                  <strong>Total Sugar</strong> 0g
                </span>
                <span>0%</span>
              </div>
              <div className="sf-row">
                <span>
                  <strong>Protein</strong> 0g
                </span>
                <span>0%</span>
              </div>

              <div className="sf-section-divider" />

              <div className="sf-row">
                <span>
                  <strong>Sodium</strong> (as Sodium Citrate and Pink Himalayan Salt) 600mg
                </span>
                <span>26%</span>
              </div>
              <div className="sf-row">
                <span>
                  <strong>Magnesium</strong> (as Magnesium Malate) 200mg
                </span>
                <span>48%</span>
              </div>
              <div className="sf-row">
                <span>
                  <strong>Potassium</strong> (as Potassium Citrate) 500mg
                </span>
                <span>11%</span>
              </div>

              <div className="sf-section-divider" />

              <div className="sf-row">
                <span>
                  <strong>Vitamin B3</strong> (as Niacin) 24mg
                </span>
                <span>150%</span>
              </div>
              <div className="sf-row">
                <span>
                  <strong>Vitamin B5</strong> (as Pantothenic acid) 5mg
                </span>
                <span>100%</span>
              </div>
              <div className="sf-row">
                <span>
                  <strong>Vitamin B6</strong> (as Pyridoxal-5-phosphate) 2mg
                </span>
                <span>118%</span>
              </div>
              <div className="sf-row">
                <span>
                  <strong>Vitamin B12</strong> (as Methylcobalamin) 8mcg
                </span>
                <span>333%</span>
              </div>
              <div className="sf-row">
                <span>
                  <strong>Vitamin C</strong> (Ascorbic Acid) 90mg
                </span>
                <span>100%</span>
              </div>

              <div className="sf-section-divider" />

              <div className="sf-row">
                <span>
                  <strong>L-Glutamine</strong> 1000mg
                </span>
                <span>+</span>
              </div>
              <div className="sf-row">
                <span>
                  <strong>L-Alanine</strong> 200mg
                </span>
                <span>+</span>
              </div>

              <div className="sf-divider" />

              <p className="sf-other">
                <strong>Other Ingredients:</strong> Citric Acid, Bamboo Extract, Grapefruit Oil,
                Annatto Seed Extract (color)
              </p>
              <p className="sf-other">
                *Percent Daily Values Are Based on a 2000 Calorie Diet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="product-faq"
        aria-label="Frequently asked questions about Atlas Hydration Grapefruit"
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about Atlas Hydration Grapefruit electrolyte mix.
            </p>
          </div>
          <div className="product-faq__list">
            {faqItems.map((item, i) => (
              <div className="product-faq__item" key={i}>
                <button
                  className="product-faq__question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <h3 style={{ font: "inherit", margin: 0 }}>{item.question}</h3>
                  <span>{openFaq === i ? "\u2212" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="product-faq__answer">
                    <p dangerouslySetInnerHTML={{ __html: item.answer }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" aria-label="Buy now">
        <div className="cta-section__video-wrap">
          <iframe
            className="cta-section__video-yt"
            src="https://www.youtube.com/embed/l0Dk8Ylqbxk?autoplay=1&mute=1&loop=1&playlist=l0Dk8Ylqbxk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Atlas Hydration video background"
          />
        </div>
        <div className="cta-section__overlay" />
        <div className="container">
          <div className="cta-section__inner">
            <h2 className="cta-section__title">Ready to Try Grapefruit?</h2>
            <p className="cta-section__text">
              16 stick packs of crisp, refreshing hydration. Zero sugar. Five calories. Full
              performance.
            </p>
            <button
              className="btn btn--white btn--lg"
              data-product="grapefruit"
              onClick={handleAddToCart}
            >
              Pre-Order — $29.99
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
