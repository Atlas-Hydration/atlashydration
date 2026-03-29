"use client";

import { useCart, computePromo } from "@/app/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    checkout,
  } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const { freeItems, discount } = computePromo(items);
  const finalTotal = subtotal - discount;

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
                      <img src={item.image} alt={item.title} />
                    </div>
                  )}
                  <div className="cart-item__info">
                    <h4 className="cart-item__title">{item.title}</h4>
                    <p className="cart-item__price">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="cart-item__actions">
                    <div className="cart-item__qty">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() =>
                          updateQuantity(index, item.quantity - 1)
                        }
                      >
                        &minus;
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="cart-item__qty-btn"
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

              {/* Buy 3 Get 1 Free promo */}
              {freeItems > 0 && (
                <div className="cart-promo">
                  <span className="cart-promo__badge">BUY 3 GET 1 FREE</span>
                  <span className="cart-promo__detail">
                    {freeItems} free item{freeItems > 1 ? "s" : ""} applied!
                  </span>
                  <span className="cart-promo__savings">
                    You save ${discount.toFixed(2)}
                  </span>
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
            <span>
              {discount > 0 ? (
                <>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#999",
                      fontSize: "0.85em",
                    }}
                  >
                    ${subtotal.toFixed(2)}
                  </span>{" "}
                  ${finalTotal.toFixed(2)}
                </>
              ) : (
                `$${subtotal.toFixed(2)}`
              )}
            </span>
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
