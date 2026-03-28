import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { useCart } from "~/context/CartContext";

const NAV_LINKS: { label: string; href: string }[] = [];

export default function Header() {
  const { cartCount, toggleCart } = useCart();
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/atlashydration/";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [solid, setSolid] = useState(!isHome);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!isHome) {
      setSolid(true);
      setHeaderVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentY = window.scrollY;
      setSolid(currentY > 50);

      if (currentY < 60) {
        setHeaderVisible(true);
      } else if (currentY > lastScrollY.current) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const headerClass = [
    "header",
    headerVisible ? "" : "header--hidden",
    solid ? "header--solid" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar" role="banner">
        <div className="announcement-bar__inner">
          <span>UNLOCK 10% OFF</span>
        </div>
      </div>

      {/* Header */}
      <header className={headerClass} role="banner">
        <nav className="header__nav" aria-label="Main navigation">
          <Link to="/" className="header__logo" aria-label="Atlas Hydration Home">
            <img
              src="/atlashydration/logo.svg"
              alt="Atlas Hydration"
              className="header__logo-img"
              height={28}
            />
          </Link>

          <div className="header__links">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.href} className="header__link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="header__right">
            <button
              className="header__icon js-cart-toggle"
              aria-label="Shopping cart"
              onClick={toggleCart}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </button>
          </div>

          <button
            className={`header__hamburger${mobileMenuOpen ? " active" : ""}`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`mobile-menu${mobileMenuOpen ? " active" : ""}`}
          aria-hidden={!mobileMenuOpen}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
          <button
            className="js-cart-toggle"
            onClick={() => {
              closeMobileMenu();
              toggleCart();
            }}
          >
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </button>
        </div>
      </header>
    </>
  );
}
