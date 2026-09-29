"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart, BOTTLE_DISCOUNT_LIVE, BOTTLE_HALF_OFF_THRESHOLD, BOTTLE_FREE_THRESHOLD } from "@/app/context/CartContext";
import { FREE_SHIPPING_THRESHOLD } from "@/app/data/formula";
import { useSignupPopup } from "@/app/components/SignupPopup";

const NAV_LINKS: { label: string; href: string }[] = [];

interface Announcement {
  lead: string;
  detail: string;
  /** Single-line version for phones. */
  short: string;
  href?: string;
  /** Opens the 10% signup popup. */
  signup?: boolean;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    lead: "Free shipping",
    detail: `on orders over $${FREE_SHIPPING_THRESHOLD}, and always free with Subscribe & Save`,
    short: `Free shipping over $${FREE_SHIPPING_THRESHOLD}`,
    href: "/shipping",
  },
  {
    lead: "Subscribe & Save 20%",
    detail: "Free shipping on every delivery · skip, pause, or cancel anytime",
    short: "Subscribe & Save 20% + free shipping",
    href: "/products/strawberry-lemonade",
  },
  {
    lead: "Unlock 10% off",
    detail: "your first order when you join the Atlas list",
    short: "Unlock 10% off your first order",
    signup: true,
  },
  ...(BOTTLE_DISCOUNT_LIVE
    ? [
        {
          lead: "Build your kit",
          detail: `${BOTTLE_HALF_OFF_THRESHOLD} pouches for 50% off the Atlas Bottle, ${BOTTLE_FREE_THRESHOLD} pouches and it's free`,
          short: `${BOTTLE_HALF_OFF_THRESHOLD} pouches = 50% off the bottle`,
          href: "/products/bottle",
        },
      ]
    : []),
  {
    lead: "Made in USA",
    detail: "Third-party tested · zero sugar · 25 calories per stick",
    short: "Made in USA · Third-party tested",
    href: "/#science",
  },
  {
    lead: "Inside every stick",
    detail: "1,769mg electrolytes · B vitamins + vitamin C · L-Glutamine + L-Alanine",
    short: "Electrolytes, vitamins + amino acids",
    href: "/products/strawberry-lemonade#supplement-facts",
  },
  {
    lead: "30-day guarantee",
    detail: "Not happy? Contact us within 30 days for a full refund or exchange",
    short: "30-day satisfaction guarantee",
    href: "/shipping",
  },
  {
    lead: "New flavor",
    detail: "Grapefruit Zest is available to pre-order",
    short: "Grapefruit Zest: pre-order now",
    href: "/products/grapefruit",
  },
  {
    lead: "New",
    detail: "The Atlas Performance Bottle · 26 oz, leak-free, BPA-free",
    short: "New: the Atlas Performance Bottle",
    href: "/products/bottle",
  },
];

export default function Header() {
  const { cartCount, toggleCart } = useCart();
  const { openSignup } = useSignupPopup();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [solid, setSolid] = useState(!isHome);
  const [headerTop, setHeaderTop] = useState(36);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [announcementPaused, setAnnouncementPaused] = useState(false);
  const lastScrollY = useRef(0);
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcementPaused) return;
    const id = setInterval(() => {
      setAnnouncementIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(id);
  }, [announcementPaused]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const barHeight = announcementRef.current?.offsetHeight ?? 36;
      setHeaderTop(Math.max(0, barHeight - currentY));

      if (!isHome) {
        setSolid(true);
        setHeaderVisible(true);
        return;
      }

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
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

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
      <div
        className="announcement-bar"
        role="region"
        aria-label="Announcements"
        aria-live="off"
        ref={announcementRef}
        onMouseEnter={() => setAnnouncementPaused(true)}
        onMouseLeave={() => setAnnouncementPaused(false)}
        onFocus={() => setAnnouncementPaused(true)}
        onBlur={() => setAnnouncementPaused(false)}
      >
        {(() => {
          const current = ANNOUNCEMENTS[announcementIndex];
          const content = (
            <span key={announcementIndex} className="announcement-bar__text">
              <span className="announcement-bar__full">
                <strong>{current.lead}</strong> <span className="announcement-bar__detail">{current.detail}</span>
              </span>
              <span className="announcement-bar__short">{current.short}</span>
            </span>
          );
          return current.signup ? (
            <button className="announcement-bar__inner announcement-bar__btn" onClick={openSignup} type="button">
              {content}
            </button>
          ) : (
            <Link className="announcement-bar__inner announcement-bar__btn" href={current.href ?? "/"}>
              {content}
            </Link>
          );
        })()}
        <div className="announcement-bar__dots">
          {ANNOUNCEMENTS.map((a, i) => (
            <button
              key={a.lead}
              type="button"
              className={`announcement-bar__dot${i === announcementIndex ? " active" : ""}`}
              aria-label={`Show announcement ${i + 1}: ${a.lead}`}
              onClick={() => setAnnouncementIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className={headerClass} role="banner" style={{ top: headerTop }}>
        <nav className="header__nav" aria-label="Main navigation">
          <Link href="/" className="header__logo" aria-label="Atlas Hydration Home">
            <img
              src="/logo.svg"
              alt="Atlas Hydration"
              className="header__logo-img"
              height={34}
            />
          </Link>

          <div className="header__links">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="header__link">
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
              href={link.href}
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
