import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Atlas Hydration",
  description:
    "Atlas Hydration privacy policy. Learn how we collect, use, and safeguard your personal information.",
  alternates: { canonical: "https://atlas-hydration.com/privacy" },
  openGraph: {
    type: "website",
    url: "https://atlas-hydration.com/privacy",
    title: "Privacy Policy | Atlas Hydration",
    description: "Atlas Hydration privacy policy. Learn how we collect, use, and safeguard your personal information.",
    siteName: "Atlas Hydration",
  },
};

export default function Privacy() {
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
          <span style={{ color: "#1a1a1a" }}>Privacy Policy</span>
        </nav>

        <h1 className="policy-page__title">Privacy Policy</h1>

        <div className="policy-page__content">
          <p>
            At Atlas Hydration, we value your privacy and are committed to
            protecting your personal information. This privacy policy outlines
            how we collect, use, and safeguard your information when you visit
            our website and make a purchase.
          </p>

          <h2>Information Collection</h2>
          <p>
            <strong>Personal Information:</strong> When you purchase something
            from our store, we collect the personal information you provide such
            as your name, address, and email address.
          </p>

          <h2>Use of Information</h2>
          <p>
            <strong>Purpose:</strong> We use your information to process
            transactions, manage your orders, provide customer service, and send
            you promotional communications.
          </p>
          <p>
            <strong>Consent:</strong> By providing us with personal information
            to complete a transaction, verify your credit card, place an order,
            or return a purchase, you consent to our collecting it and using it
            for that specific reason only.
          </p>

          <h2>Disclosure</h2>
          <p>
            <strong>Third Parties:</strong> We may disclose your personal
            information if we are required by law to do so or if you violate our
            Terms of Service.
          </p>

          <h2>Security</h2>
          <p>
            <strong>Protection:</strong> We implement a variety of security
            measures to maintain the safety of your personal information when you
            place an order or enter, submit, or access your personal information.
          </p>
        </div>
      </div>
    </section>
  );
}
