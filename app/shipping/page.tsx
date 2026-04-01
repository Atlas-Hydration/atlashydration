import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Returns | Atlas Hydration",
  description:
    "Atlas Hydration shipping and returns policy. Free shipping on orders over $40. Learn about processing times, shipping rates, and our return policy.",
  alternates: { canonical: "https://atlas-hydration.com/shipping" },
  openGraph: {
    type: "website",
    url: "https://atlas-hydration.com/shipping",
    title: "Shipping & Returns | Atlas Hydration",
    description: "Atlas Hydration shipping and returns policy. Free shipping on orders over $40.",
    siteName: "Atlas Hydration",
  },
};

export default function Shipping() {
  return (
    <section className="policy-page">
      <div className="container">
        <nav
          aria-label="Breadcrumb"
          style={{ marginBottom: 24, fontSize: "0.875rem", color: "#888" }}
        >
          <Link href="/" style={{ color: "#888", textDecoration: "none" }}>
            Home
          </Link>
          <span style={{ margin: "0 8px" }}>&gt;</span>
          <span style={{ color: "#1a1a1a" }}>Shipping &amp; Returns</span>
        </nav>

        <h1 className="policy-page__title">Shipping &amp; Returns</h1>

        <div className="policy-page__content">
          <h2>Returns</h2>
          <p>
            All sales are final, unless the product is defective! However, we
            stand by our formula. If you are unhappy with your purchase or
            experience issues with your order, please contact us at{" "}
            <a href="mailto:support@atlas-hydration.com">
              support@atlas-hydration.com
            </a>
            .
          </p>

          <h2>Shipping</h2>
          <p>
            Atlas Hydration ships to the 48 contiguous U.S. states, Alaska,
            Hawaii, U.S. Territories, and APO/FPO addresses. Products can be
            shipped anywhere that has a physical address and can receive packages
            via USPS, FedEx, or DHL.
          </p>

          <h2>Processing Time</h2>
          <p>
            There is a 1-2 business day processing time for all orders.
          </p>
          <ul>
            <li>
              Please note: We do not ship on weekends. If your order was placed
              on Friday evening, it will not ship out until Monday.
            </li>
            <li>
              While we strive to ship an order within 2 working days, we
              can&apos;t directly control the delivery times once the package
              leaves our facility :)
            </li>
          </ul>

          <h2>Shipping Rates</h2>
          <ul>
            <li>Orders over $40 (4-6 Business Days): FREE</li>
            <li>Orders under $40 (4-6 Business Days): $4.99</li>
            <li>
              Once an order has been processed, the shipping method cannot be
              changed.
            </li>
            <li>Shipping fees are non-refundable.</li>
          </ul>

          <h2>Tracking Updates</h2>
          <p>
            During busier seasons, carriers may take longer than expected to
            update the tracking status of a package.
          </p>
          <ul>
            <li>
              If a package has shipped and the tracking status does not update
              within 3 business days, please contact Atlas Hydration for an
              additional update on your package.
            </li>
            <li>
              If a package shows tracking updates but has stalled at a processing
              location, please contact the carrier for additional information, as
              they would be able to provide the most up-to-date information on
              your package.
            </li>
          </ul>

          <h2>Unexpected Delays</h2>
          <p>
            Due to occasional carrier delays nationwide, shipments may experience
            delays of up to 10 business days. Most orders are shipped within 1-3
            days of being placed. Please note all delivery timeframes are
            estimates and are subject to change. These timeframes do not include
            weekends and holidays. If you have not received your order after 10
            business days, contact our customer service team and we can further
            assist you.
          </p>
        </div>
      </div>
    </section>
  );
}
