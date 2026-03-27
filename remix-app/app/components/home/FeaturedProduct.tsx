import { useState, useRef } from "react";
import { Link } from "react-router";
import { useCart } from "~/context/CartContext";

const images = [
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844", alt: "Atlas Strawberry Lemonade pouch and stick pack" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/2_e035ddf8-ce06-45b8-a18b-9c44b182ef6c.jpg?v=1771507845", alt: "Atlas Strawberry Lemonade lifestyle" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/3_ef424a03-cf99-4791-be11-6c35c35c9a78.jpg?v=1771507844", alt: "Atlas Strawberry Lemonade mixing" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/5_6e370a4a-9031-4d8e-a7f2-59e717e0d02d.jpg?v=1771507860", alt: "Atlas Strawberry Lemonade ingredients" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/6_b41fe7f1-0bca-41d3-8bf7-db4414e95a05.jpg?v=1771507860", alt: "Atlas Strawberry Lemonade supplement facts" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/4_b0347d0a-fc88-4c2b-b4a7-3946604c666e.jpg?v=1771507860", alt: "Atlas Strawberry Lemonade active lifestyle" },
];

export default function FeaturedProduct() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [purchaseType, setPurchaseType] = useState<"subscribe" | "onetime">("subscribe");
  const [frequency, setFrequency] = useState(2);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prev = () => setCurrentSlide((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentSlide((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleAdd = async () => {
    setAdding(true);
    await addToCart("strawberry-lemonade", 1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdding(false), 1200);
  };

  return (
    <section className="featured-product" id="products" aria-label="Featured Product">
      <div className="container">
        <div className="featured-product__grid">
          {/* Gallery */}
          <div className="featured-product__image">
            <div className="fp-gallery">
              <div className="fp-gallery__main">
                {images.map((img, i) => (
                  <img
                    key={i}
                    className={`fp-gallery__slide${i === currentSlide ? " active" : ""}`}
                    src={img.src}
                    alt={img.alt}
                  />
                ))}
              </div>
              <button className="fp-gallery__arrow fp-gallery__arrow--prev" aria-label="Previous image" onClick={prev}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button className="fp-gallery__arrow fp-gallery__arrow--next" aria-label="Next image" onClick={next}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
              <div className="fp-gallery__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`fp-gallery__thumb${i === currentSlide ? " active" : ""}`}
                    onClick={() => setCurrentSlide(i)}
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
            <p className="featured-product__eyebrow">Best Seller</p>
            <h2 className="featured-product__title">Strawberry Lemonade<br />Electrolyte Mix</h2>
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
              <Link to="/products/strawberry-lemonade" className="flavor-circle flavor-circle--strawberry active">
                <span className="flavor-circle__dot" />Strawberry Lemonade
              </Link>
              <Link to="/products/grapefruit" className="flavor-circle flavor-circle--grapefruit">
                <span className="flavor-circle__dot" />Grapefruit
              </Link>
            </div>

            {/* Purchase Options */}
            <div className="purchase-options">
              <label
                className={`purchase-option purchase-option--subscribe${purchaseType === "subscribe" ? " active" : ""}`}
                onClick={() => setPurchaseType("subscribe")}
              >
                <div className="purchase-option__header">
                  <div className="purchase-option__radio">
                    <input type="radio" name="fp-purchase-type" value="subscribe" checked={purchaseType === "subscribe"} readOnly />
                    <span className="purchase-option__radio-custom" />
                  </div>
                  <span className="purchase-option__label">Subscribe &amp; Save</span>
                  <div className="purchase-option__pricing">
                    <span className="purchase-option__price">$23.99</span>
                    <span className="purchase-option__per">$1.50 / Stick</span>
                  </div>
                </div>
                <div className="purchase-option__details">
                  <div className="purchase-option__perks">
                    {["Save 20%", "Free Shipping", "Cancel Anytime"].map((perk, i) => (
                      <div className="purchase-option__perk" key={i}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                        <strong>{perk}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="frequency-selector">
                    {[2, 4, 6].map((w) => (
                      <button
                        key={w}
                        className={`frequency-selector__btn${frequency === w ? " active" : ""}`}
                        onClick={(e) => { e.preventDefault(); setFrequency(w); }}
                      >
                        {w} Weeks
                      </button>
                    ))}
                  </div>
                </div>
              </label>
              <label
                className={`purchase-option purchase-option--onetime${purchaseType === "onetime" ? " active" : ""}`}
                onClick={() => setPurchaseType("onetime")}
              >
                <div className="purchase-option__header">
                  <div className="purchase-option__radio">
                    <input type="radio" name="fp-purchase-type" value="onetime" checked={purchaseType === "onetime"} readOnly />
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

            <div style={{ marginTop: 8 }}>
              <button
                className={`btn btn--primary btn--lg${adding ? " btn--added" : ""}`}
                onClick={handleAdd}
              >
                {adding ? "Added!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
