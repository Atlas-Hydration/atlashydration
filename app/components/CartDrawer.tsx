"use client";

import { useCart, computeBottlePromo, deriveDiscountCode, computeTwoPackDiscount, BOTTLE_HALF_PRICE, BOTTLE_FULL_PRICE } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";
import CartRewardsBar from "@/app/components/CartRewardsBar";

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

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const { qualifyingQty, bottleInCart, tier } = computeBottlePromo(items);
  const discountCode = deriveDiscountCode(items);
  const hasSubscription = items.some((i) => i.subscriptionFrequency);

  // Only counts if the bottle is actually in the cart contributing to the subtotal —
  // an unlocked tier alone (before the bottle is added) must not discount the total.
  const bottleDiscountAmount = !bottleInCart ? 0 : tier === "free" ? BOTTLE_FULL_PRICE : tier === "half" ? BOTTLE_FULL_PRICE - BOTTLE_HALF_PRICE : 0;
  const twoPackDiscountAmount = computeTwoPackDiscount(items);
  const totalDiscountAmount = bottleDiscountAmount + twoPackDiscountAmount;
  const estimatedTotal = subtotal - totalDiscountAmount;

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
                      {item.slug === "bottle" && tier !== "none" && (
                        <span className="cart-item__discount-tag">
                          {tier === "free" ? "FREE" : "50% OFF"}
                        </span>
                      )}
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

              {/* Sliding-scale rewards: Free Shipping @ $40, 50% Off Bottle @ 2 pouches, Free Bottle @ 4 pouches */}
              <CartRewardsBar subtotal={subtotal} qualifyingQty={qualifyingQty} tier={tier} hasSubscription={hasSubscription} />

              {tier !== "none" && !bottleInCart && (
                <div className="cart-promo cart-promo--unlocked">
                  <div className="cart-promo__bottle-card">
                    {bottle.images[0] && (
                      <img className="cart-promo__bottle-img" src={bottle.images[0]} alt={bottle.name} />
                    )}
                    <div className="cart-promo__bottle-info">
                      <span className="cart-promo__bottle-name">
                        {bottle.name}
                        <span className="cart-item__discount-tag">{tier === "free" ? "FREE" : "50% OFF"}</span>
                      </span>
                      <span className="cart-promo__bottle-price">
                        <span className="cart-promo__bottle-price-original">${BOTTLE_FULL_PRICE.toFixed(2)}</span>{" "}
                        {tier === "free" ? "FREE" : `$${BOTTLE_HALF_PRICE.toFixed(2)}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="cart-promo__bottle-btn"
                      onClick={() => addToCart("bottle", 1)}
                    >
                      {tier === "free" ? "Add Free Bottle" : "Add Bottle"}
                    </button>
                  </div>
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
          {discountCode && (
            <p className="cart-drawer__promo-line">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
              {discountCode} applied
            </p>
          )}
          {totalDiscountAmount > 0 ? (
            <>
              <div className="cart-drawer__line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {twoPackDiscountAmount > 0 && (
                <div className="cart-drawer__line cart-drawer__line--discount">
                  <span>2-Pack discount</span>
                  <span>&minus;${twoPackDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              {bottleDiscountAmount > 0 && (
                <div className="cart-drawer__line cart-drawer__line--discount">
                  <span>{tier === "free" ? "Free bottle" : "Bottle discount"}</span>
                  <span>&minus;${bottleDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="cart-drawer__total">
                <span>Total</span>
                <span>${estimatedTotal.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div className="cart-drawer__total">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          )}
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
