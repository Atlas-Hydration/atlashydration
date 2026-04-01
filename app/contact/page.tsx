import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Atlas Hydration",
  description: "Get in touch with Atlas Hydration. We're here to help with orders, subscriptions, and any questions.",
  alternates: { canonical: "https://atlas-hydration.com/contact" },
  openGraph: {
    type: "website",
    url: "https://atlas-hydration.com/contact",
    title: "Contact Us | Atlas Hydration",
    description: "Get in touch with Atlas Hydration. We're here to help with orders, subscriptions, and any questions.",
    siteName: "Atlas Hydration",
  },
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <div className="container">
        <div className="contact-page__inner">
          <h1 className="contact-page__title">
            Need Help With an Order or Have a Question?
          </h1>
          <p className="contact-page__text">
            Please email us at{" "}
            <a href="mailto:support@atlas-hydration.com" className="contact-page__email">
              support@atlas-hydration.com
            </a>
            . A member of our team will be happy to help.
          </p>
        </div>
      </div>
    </main>
  );
}
