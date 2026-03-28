import { useState, useEffect } from "react";
import { useCart } from "~/context/CartContext";

const flavors = [
  {
    key: "strawberry",
    product: "strawberry-lemonade" as const,
    name: "Strawberry Lemonade",
    price: "$29.99",
    thumb: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844",
  },
  {
    key: "grapefruit",
    product: "grapefruit" as const,
    name: "Grapefruit",
    price: "$29.99",
    thumb: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_1a252c57-dc62-4c7b-a6b1-0f9677ce6b6f.jpg?v=1769181320",
  },
];

export default function StickyBuyBar() {
  const [activeFlavor, setActiveFlavor] = useState(0);
  const [visible, setVisible] = useState(false);
  const { addToCart } = useCart();
  const flavor = flavors[activeFlavor];

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`sticky-buy sticky-buy--${flavor.key}${visible ? " visible" : ""}`} id="stickyBuy">
      <svg className="sticky-buy__wave" viewBox="0 0 1200 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,18 C150,6 300,24 450,14 C600,4 750,22 900,12 C1050,2 1200,18 1200,18 L1200,24 L0,24 Z" />
      </svg>
      <svg className="sticky-buy__wave sticky-buy__wave--back" viewBox="0 0 1200 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,16 C200,8 350,22 500,12 C650,2 800,20 1000,10 C1100,5 1200,16 1200,16 L1200,24 L0,24 Z" />
      </svg>
      <div className="sticky-buy__bubbles">
        {Array.from({ length: 7 }).map((_, i) => (
          <span className="sticky-buy__bubble" key={i} />
        ))}
      </div>
      <div className="sticky-buy__inner">
        <div className="sticky-buy__left">
          <img
            className="sticky-buy__thumb"
            src={flavor.thumb}
            alt={flavor.name}
            width="44"
            height="44"
          />
          <div className="sticky-buy__info">
            <span className="sticky-buy__name">{flavor.name}</span>
            <span className="sticky-buy__price">{flavor.price}</span>
          </div>
          <div className="sticky-buy__flavors">
            {flavors.map((f, i) => (
              <button
                key={f.key}
                className={`sticky-buy__flavor-dot sticky-buy__flavor-dot--${f.key}${i === activeFlavor ? " active" : ""}`}
                onClick={() => setActiveFlavor(i)}
                aria-label={f.name}
              />
            ))}
          </div>
        </div>
        <button
          className="sticky-buy__btn"
          onClick={() => addToCart(flavor.product, 1)}
        >
          <span className="sticky-buy__btn-text">Pre-Order</span>
        </button>
      </div>
    </div>
  );
}
