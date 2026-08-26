"use client";

import { useState, useEffect } from "react";
import { useCart, computeBottlePromo } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";

const bottle = PRODUCTS.bottle;

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    checkout,
    addToCart,
  } = useCart();
  const [discountCode, setDiscountCode] = useState('');

  useEffect(() => {
    const code = localStorage.getItem('atlas_discount_code') || '';
    setDiscountCode(code);
  }, [isCartOpen]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const { qualifyingQty, bottleInCart, unlocked, remaining } = computeBottlePromo(items);
  const bottlePromoState: "unlocked-no-bottle" | "unlocked-with-bottle" | "downgrade" | "progress" | "none" =
    unlocked && !bottleInCart ? "unlocked-no-bottle"
    : unlocked && bottleInCart ? "unlocked-with-bottle"
    : !unlocked && bottleInCart ? "downgrade"
    : qualifyingQty > 0 ? "progress"
    : "none";

  return (
    <div
      className={`cart-drawer${isCartOpen ? " cart-drawer--open" : ""}`}
      aria-hidden={!isCartOpen}
    >
      {/* Overlay */}
      <div className="cart-drawer__overlay" onClick={closeCart} />

      {/* Panel */}
      <div className="cart-drawer__panel">
        {/* Header */}
        <div className="cart-drawer__header">
          <h2>Your Cart</h2>
          <button
            className="cart-drawer__close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="cart-drawer__items">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-spinner" />
              <p>Your cart is empty</p>
              <a
                href="/#products"
                className="btn btn--outline btn--sm"
                onClick={closeCart}
              >
                Shop Now
              </a>
            </div>
          ) : (
            <>
              {items.map((item, index) => (
                <div className="cart-item" key={`${item.slug}-${index}`}>
                  {item.image && (
                    <div className="cart-item__image">
                      <img src={item.image} alt={item.title} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                  <div className="cart-item__info">
                    <h4 className="cart-item__title">{item.title}</h4>
                    <p className="cart-item__price">
                      ${item.price.toFixed(2)}
                    </p>
                    {item.subscriptionFrequency && (
                      <p className="cart-item__subscription">
                        Subscription · Every {item.subscriptionFrequency} weeks
                      </p>
                    )}
                  </div>
                  <div className="cart-item__actions">
                    <div className="cart-item__qty">
                      <button
                        className="cart-item__qty-btn"
                        aria-label={`Decrease ${item.title} quantity`}
                        onClick={() =>
                          updateQuantity(index, item.quantity - 1)
                        }
                      >
                        &minus;
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="cart-item__qty-btn"
                        aria-label={`Increase ${item.title} quantity`}
                        onClick={() =>
                          updateQuantity(index, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(index)}
                      aria-label="Remove item"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Buy 4 Qualifying Pouches, Get 1 Atlas Bottle Free */}
              {bottlePromoState === "progress" && (
                <div className="cart-promo cart-promo--progress">
                  <span className="cart-promo__detail">
                    Add {remaining} more pouch{remaining > 1 ? "es" : ""} to unlock a FREE Atlas Performance Bottle.
                  </span>
                </div>
              )}
              {bottlePromoState === "downgrade" && (
                <div className="cart-promo cart-promo--progress">
                  <span className="cart-promo__detail">
                    Add {remaining} more pouch{remaining > 1 ? "es" : ""} to make your bottle FREE.
                  </span>
                </div>
              )}
              {bottlePromoState === "unlocked-no-bottle" && (
                <div className="cart-promo cart-promo--unlocked">
                  <span className="cart-promo__badge">FREE BOTTLE UNLOCKED</span>
                  <div className="cart-promo__bottle-card">
                    {bottle.images[0] && (
                      <img className="cart-promo__bottle-img" src={bottle.images[0]} alt={bottle.name} />
                    )}
                    <div className="cart-promo__bottle-info">
                      <span className="cart-promo__bottle-name">{bottle.name}</span>
                      <span className="cart-promo__bottle-price">
                        <span className="cart-promo__bottle-price-original">${bottle.price.toFixed(2)}</span> FREE
                      </span>
                    </div>
                    <button
                      type="button"
                      className="cart-promo__bottle-btn"
                      onClick={() => addToCart("bottle", 1)}
                    >
                      Add Free Bottle
                    </button>
                  </div>
                </div>
              )}
              {bottlePromoState === "unlocked-with-bottle" && (
                <div className="cart-promo cart-promo--unlocked">
                  <span className="cart-promo__badge">FREE BOTTLE UNLOCKED</span>
                  <span className="cart-promo__detail">Atlas Performance Bottle is on us.</span>
                  <span className="cart-promo__savings">You save ${bottle.price.toFixed(2)}</span>
                </div>
              )}
              {discountCode && (
                <div style={{
                  padding: '10px 14px', background: 'rgba(22,163,74,0.08)',
                  borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: '0.82rem', color: '#16a34a', fontWeight: 500, marginTop: 8,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  {discountCode} applied
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="cart-drawer__footer"
          style={{ display: items.length === 0 ? "none" : "block" }}
        >
          <div className="cart-drawer__subtotal">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button
            className="btn btn--primary btn--full"
            onClick={checkout}
          >
            Checkout
          </button>
          <p className="cart-drawer__note">
            Shipping &amp; taxes calculated at checkout
          </p>
        </div>
      </div>
    </div>
  );
}
