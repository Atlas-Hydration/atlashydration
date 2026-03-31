import Link from "next/link";

function FooterYear() {
  return <>{new Date().getFullYear()}</>;
}

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <img
              src="/logo.svg"
              alt="Atlas Hydration"
              className="footer__logo-img"
              height={36}
            />
            <p className="footer__tagline">
              premium ingredients. third-party tested.
            </p>
            <div className="footer__social">
              <a
                href="https://www.instagram.com/atlashydration"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@atlashydration"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.16V11.7a4.83 4.83 0 01-3.77-1.78V6.69h3.77z" />
                </svg>
              </a>
              <a
                href="https://x.com/atlashydration"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Support Links */}
          <div className="footer__links">
            <nav aria-label="Support links">
              <a href="mailto:support@atlas-hydration.com">support</a>
              <Link href="/products/strawberry-lemonade">shop</Link>
              <Link href="/#founder">about us</Link>
              <Link href="/products/strawberry-lemonade#supplement-facts">
                supplement facts
              </Link>
              <Link href="/#science">science</Link>
            </nav>
          </div>

          {/* Policy Links */}
          <div className="footer__links">
            <nav aria-label="Policy links">
              <Link href="/shipping">shipping policy</Link>
              <Link href="/shipping">refund policy</Link>
              <Link href="/privacy">privacy policy</Link>
              <a href="mailto:support@atlas-hydration.com">contact us</a>
            </nav>
          </div>
        </div>

        <div className="footer__divider"></div>

        <div className="footer__bottom">
          <p>&copy; <FooterYear /> Atlas Hydration. all rights reserved.</p>
          <div className="footer__payments">
            <span className="footer__payment-icon">Visa</span>
            <span className="footer__payment-icon">MC</span>
            <span className="footer__payment-icon">Amex</span>
            <span className="footer__payment-icon">PayPal</span>
            <span className="footer__payment-icon">GPay</span>
            <span className="footer__payment-icon">Apple</span>
            <span className="footer__payment-icon">Shop</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
