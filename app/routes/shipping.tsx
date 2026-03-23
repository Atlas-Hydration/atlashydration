import { useClientScripts } from "~/hooks/useClientScripts";

export function meta() {
  return [
    { title: "Shipping & Returns | Atlas Hydration" },
    { name: "description", content: "Atlas Hydration shipping and returns policy. Free shipping on orders over $40. Learn about processing times, shipping rates, and our return policy." },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Shipping & Returns | Atlas Hydration" },
    { property: "og:description", content: "Free shipping on orders over $40. Learn about processing times, shipping rates, and our return policy." },
    { property: "og:url", content: "https://rwb8771.github.io/atlashydration/shipping.html" },
    { property: "og:image", content: "https://rwb8771.github.io/atlashydration/images/og-default.jpg" },
    { property: "og:site_name", content: "Atlas Hydration" },
    { tagName: "link", rel: "canonical", href: "https://rwb8771.github.io/atlashydration/shipping.html" },
  ];
}

export default function ShippingPage() {
  useClientScripts();

  return (
    <>
      {/*  Announcement Bar  */}
  <div className="announcement-bar" role="banner">
    <div className="announcement-bar__inner">
      <span>UNLOCK 10% OFF</span>
    </div>
  </div>

  {/*  Header  */}
  <header className="header" role="navigation">
    <nav className="header__nav" aria-label="Main navigation">
      <a href="/atlashydration/" className="header__logo" aria-label="Atlas Hydration Home">
        <img src="/atlashydration/logo.svg" alt="Atlas" className="header__logo-img" height="28" />
      </a>
      <div className="header__right">
        <button className="header__icon js-cart-toggle" aria-label="Shopping cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span className="cart-count" style={{display: "none"}}>0</span>
        </button>
      </div>
      <button className="header__hamburger" aria-label="Open menu" id="menuToggle">
        <span></span><span></span><span></span>
      </button>
    </nav>

    {/*  Mobile Menu  */}
    <div className="mobile-menu" id="mobileMenu" aria-hidden="true">
      <a href="index.html#products">Shop</a>
      <a href="index.html#science">Science</a>
      <a href="index.html#mission">Mission</a>
      <a href="#" className="js-cart-toggle">Cart</a>
    </div>
  </header>

  <main>
    <section className="policy-page">
      <div className="container">
        <nav aria-label="Breadcrumb" style={{marginBottom: "24px", fontSize: "0.875rem", color: "#888"}}>
          <a href="/atlashydration/" style={{color: "#888", textDecoration: "none"}}>Home</a>
          <span style={{margin: "0 8px"}}>&gt;</span>
          <span style={{color: "#1a1a1a"}}>Shipping &amp; Returns</span>
        </nav>

        <h1 className="policy-page__title">Shipping &amp; Returns</h1>

        <div className="policy-page__content">
          <h2>Returns</h2>
          <p>All sales are final, unless the product is defective! However, we stand by our formula. If you are unhappy with your purchase or experience issues with your order, please contact us at <a href="mailto:support@atlas-hydration.com">support@atlas-hydration.com</a>.</p>

          <h2>Shipping</h2>
          <p>Atlas Hydration ships to the 48 contiguous U.S. states, Alaska, Hawaii, U.S. Territories, and APO/FPO addresses. Products can be shipped anywhere that has a physical address and can receive packages via USPS, FedEx, or DHL.</p>

          <h2>Processing Time</h2>
          <p>There is a 1-2 business day processing time for all orders.</p>
          <ul>
            <li>Please note: We do not ship on weekends. If your order was placed on Friday evening, it will not ship out until Monday.</li>
            <li>While we strive to ship an order within 2 working days, we can't directly control the delivery times once the package leaves our facility :)</li>
          </ul>

          <h2>Shipping Rates</h2>
          <ul>
            <li>Orders over $40 (4-6 Business Days): FREE</li>
            <li>Orders under $40 (4-6 Business Days): $4.99</li>
            <li>Once an order has been processed, the shipping method cannot be changed.</li>
            <li>Shipping fees are non-refundable.</li>
          </ul>

          <h2>Tracking Updates</h2>
          <p>During busier seasons, carriers may take longer than expected to update the tracking status of a package.</p>
          <ul>
            <li>If a package has shipped and the tracking status does not update within 3 business days, please contact Atlas Hydration for an additional update on your package.</li>
            <li>If a package shows tracking updates but has stalled at a processing location, please contact the carrier for additional information, as they would be able to provide the most up-to-date information on your package.</li>
          </ul>

          <h2>Unexpected Delays</h2>
          <p>Due to occasional carrier delays nationwide, shipments may experience delays of up to 10 business days. Most orders are shipped within 1-3 days of being placed. Please note all delivery timeframes are estimates and are subject to change. These timeframes do not include weekends and holidays. If you have not received your order after 10 business days, contact our customer service team and we can further assist you.</p>
        </div>
      </div>
    </section>
  </main>

  {/*  Footer  */}
  <footer className="footer" role="contentinfo">
    <div className="container">
      <div className="footer__grid">
        <div className="footer__brand">
          <img src="/atlashydration/logo.svg" alt="Atlas" className="footer__logo-img" height="24" />
          <p className="footer__tagline">Hydrate. Recover. Thrive.</p>
          <div className="footer__social">
            <a href="https://www.instagram.com/atlashydration" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@atlashydration" target="_blank" rel="noopener noreferrer" aria-label="Follow us on TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.16V11.7a4.83 4.83 0 01-3.77-1.78V6.69h3.77z"/></svg>
            </a>
          </div>
        </div>
        <div className="footer__links">
          <h4>Shop</h4>
          <nav aria-label="Shop links">
            <a href="/atlashydration/products/strawberry-lemonade">Strawberry Lemonade</a>
            <a href="/atlashydration/products/grapefruit">Grapefruit</a>
          </nav>
        </div>
        <div className="footer__links">
          <h4>Company</h4>
          <nav aria-label="Company links">
            <a href="/atlashydration/shipping">Shipping &amp; Returns</a>
            <a href="/atlashydration/privacy">Privacy Policy</a>
          </nav>
        </div>
        <div className="footer__links">
          <h4>Support</h4>
          <nav aria-label="Support links">
            <a href="mailto:support@atlas-hydration.com">Contact Us</a>
          </nav>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; 2026 Atlas Hydration. All rights reserved.</p>
        <p>Non-GMO &bull; Made in USA &bull; Zero Sugar</p>
      </div>
    </div>
  </footer>

  {/*  Shopify Buy SDK (CDN)  */}
    </>
  );
}
