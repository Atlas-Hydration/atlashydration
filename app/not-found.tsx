import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | Atlas Hydration",
  description: "The page you're looking for doesn't exist or has moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="container">
        <p className="not-found-page__eyebrow">404</p>
        <h1 className="not-found-page__title">Page Not Found</h1>
        <p className="not-found-page__text">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="not-found-page__actions">
          <Link href="/" className="btn btn--dark">Back to Home</Link>
          <Link href="/products/strawberry-lemonade" className="btn btn--outline">Shop Now</Link>
        </div>
      </div>
    </section>
  );
}
