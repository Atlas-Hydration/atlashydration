import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Atlas Hydration",
  description:
    "Atlas Hydration terms and conditions. Please read these terms carefully before using our site or placing an order.",
  alternates: { canonical: "https://atlas-hydration.com/terms" },
  openGraph: {
    type: "website",
    url: "https://atlas-hydration.com/terms",
    title: "Terms & Conditions | Atlas Hydration",
    description: "Atlas Hydration terms and conditions. Please read these terms carefully before using our site or placing an order.",
    siteName: "Atlas Hydration",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms & Conditions",
  description: "Atlas Hydration terms and conditions. Please read these terms carefully before using our site or placing an order.",
  url: "https://atlas-hydration.com/terms",
  publisher: { "@type": "Organization", name: "Atlas Hydration", url: "https://atlas-hydration.com" },
};

export default function Terms() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
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
          <span style={{ color: "#1a1a1a" }}>Terms &amp; Conditions</span>
        </nav>

        <h1 className="policy-page__title">Terms &amp; Conditions</h1>

        <div className="policy-page__content">
          <p>
            These Terms &amp; Conditions govern your use of the Atlas Hydration
            website and any purchase you make from us. By accessing this site or
            placing an order, you agree to be bound by these terms.
          </p>

          <h2>Use of This Site</h2>
          <p>
            You may use this site to browse and purchase products for personal,
            non-commercial use. You agree not to misuse the site, interfere with
            its operation, or attempt to access it through automated or
            unauthorized means.
          </p>

          <h2>Products &amp; Pricing</h2>
          <p>
            We make every effort to display product information and pricing
            accurately, but errors may occasionally occur. We reserve the right
            to correct any pricing or product information errors and to cancel
            orders placed based on incorrect pricing.
          </p>

          <h2>Orders &amp; Payment</h2>
          <p>
            All orders are subject to acceptance and availability. Payment is
            processed securely at checkout. Subscription orders renew
            automatically at the frequency you select and can be skipped,
            paused, or cancelled at any time before the next billing date.
          </p>

          <h2>Shipping &amp; Returns</h2>
          <p>
            Shipping timelines and our return and refund policy are detailed on
            our <Link href="/shipping">Shipping &amp; Returns</Link> page.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this site, including text, graphics, logos, and
            images, is the property of Atlas Hydration and is protected by
            applicable intellectual property laws. You may not reproduce or use
            it without our prior written consent.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Atlas Hydration is not liable for any indirect, incidental, or
            consequential damages arising from your use of this site or our
            products, to the fullest extent permitted by law.
          </p>

          <h2>Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the
            site after changes are posted constitutes acceptance of the revised
            terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a href="mailto:support@atlas-hydration.com">support@atlas-hydration.com</a>.
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
