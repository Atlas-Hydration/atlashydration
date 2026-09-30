import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/app/data/articles";
import ArticleCover from "@/app/components/ArticleCover";
import { DEFAULT_OG_IMAGE, SITE_URL, breadcrumbJsonLd, twitterCard } from "@/app/data/seo";

export const metadata: Metadata = {
  title: "Hydration Explained | Atlas Hydration",
  description:
    "Plain-language articles on electrolytes, sodium, amino acids, sweeteners, and travel hydration, with sources. From the team at Atlas Hydration.",
  alternates: { canonical: "https://atlas-hydration.com/blog" },
  openGraph: {
    type: "website",
    url: "https://atlas-hydration.com/blog",
    title: "Hydration Explained | Atlas Hydration",
    description: "Plain-language articles on electrolytes, sodium, amino acids, sweeteners, and travel hydration, with sources.",
    siteName: "Atlas Hydration",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: twitterCard({ title: "Hydration Explained | Atlas Hydration", description: "Plain-language articles on electrolytes, ingredients, and hydration, with sources.", image: DEFAULT_OG_IMAGE }),
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Hydration Explained",
  url: `${SITE_URL}/blog`,
  description: "Plain-language articles on electrolytes, ingredients, and how hydration works, with sources.",
  hasPart: ARTICLES.map((a) => ({ "@type": "Article", headline: a.title, url: `${SITE_URL}/blog/${a.slug}`, datePublished: a.published })),
};

export default function BlogPage() {
  const [featured, ...rest] = ARTICLES;
  return (
    <main className="jn jn--page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Hydration Explained", path: "/blog" }])) }} />
      <div className="container">
        <div className="jn__head">
          <p className="section-eyebrow">The Science</p>
          <h1 className="jn__title">Hydration Explained</h1>
          <p className="jn__sub">
            Plain-language articles on electrolytes, ingredients, and how hydration really works, with the sources to back them up.
          </p>
        </div>

        <Link href={`/blog/${featured.slug}`} className="jn__feature">
          <ArticleCover article={featured} size="wide" />
          <div className="jn__feature-copy">
            <div className="jn__meta">
              <span>Start here</span>
              <span aria-hidden="true">·</span>
              <span>{featured.readTime}</span>
            </div>
            <h2 className="jn__feature-title">{featured.title}</h2>
            <p className="jn__dek">{featured.dek}</p>
            <span className="jn__read">Read article</span>
          </div>
        </Link>

        <div className="jn__grid">
          {rest.map((a) => (
            <Link href={`/blog/${a.slug}`} className="jn__card" key={a.slug}>
              <ArticleCover article={a} />
              <div className="jn__meta">
                <span>{a.tag}</span>
                <span aria-hidden="true">·</span>
                <span>{a.readTime}</span>
              </div>
              <h2 className="jn__card-title">{a.title}</h2>
              <p className="jn__dek">{a.dek}</p>
              <span className="jn__read">Read article</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
