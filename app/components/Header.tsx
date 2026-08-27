"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { usePopupTrigger } from "@/app/components/Popup";

const NAV_LINKS: { label: string; href: string }[] = [];

const ANNOUNCEMENTS = [
  { text: "Unlock 10% Off", type: "popup" as const },
  { text: "New — The Atlas Performance Bottle", type: "link" as const, href: "/products/bottle" },
];

export default function Header() {
  const { cartCount, toggleCart } = useCart();
  const { openPopup } = usePopupTrigger();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [solid, setSolid] = useState(!isHome);
  const [headerTop, setHeaderTop] = useState(36);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const lastScrollY = useRef(0);
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setAnnouncementIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

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
      <div className="announcement-bar" role="banner" ref={announcementRef}>
        {(() => {
          const current = ANNOUNCEMENTS[announcementIndex];
          return current.type === "popup" ? (
            <button className="announcement-bar__inner announcement-bar__btn" onClick={openPopup} type="button">
              <span key={announcementIndex} className="announcement-bar__text">{current.text}</span>
            </button>
          ) : (
            <Link className="announcement-bar__inner announcement-bar__btn" href={current.href}>
              <span key={announcementIndex} className="announcement-bar__text">{current.text}</span>
            </Link>
          );
        })()}
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
