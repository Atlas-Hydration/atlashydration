import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, formatArticleDate, getArticle } from "@/app/data/articles";
import ArticleCover from "@/app/components/ArticleCover";
import { SITE_URL, breadcrumbJsonLd, twitterCard } from "@/app/data/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `https://atlas-hydration.com/blog/${article.slug}`;
  const image = `${SITE_URL}/og/articles/${article.slug}.png`;
  return {
    title: `${article.title} | Atlas Hydration`,
    description: article.dek,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: article.title, description: article.dek, siteName: "Atlas Hydration", publishedTime: article.published, images: [{ url: image, width: 1200, height: 630, alt: article.title }] },
    twitter: twitterCard({ title: article.title, description: article.dek, image }),
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    datePublished: article.published,
    dateModified: article.published,
    image: `${SITE_URL}/og/articles/${article.slug}.png`,
    author: { "@type": "Organization", name: "Atlas Hydration" },
    publisher: { "@type": "Organization", name: "Atlas Hydration", logo: { "@type": "ImageObject", url: "https://atlas-hydration.com/logo.svg" } },
    mainEntityOfPage: `https://atlas-hydration.com/blog/${article.slug}`,
  };

  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Hydration Explained", path: "/blog" }, { name: article.title, path: `/blog/${article.slug}` }])) }} />
      <article className="art__wrap">
        <Link href="/blog" className="art__crumb">← Hydration Explained</Link>
        <div className="art__meta">
          <span>{article.tag}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.published}>{formatArticleDate(article.published)}</time>
        </div>
        <h1 className="art__title">{article.title}</h1>
        <p className="art__dek">{article.dek}</p>

        <div className="art__cover"><ArticleCover article={article} size="wide" /></div>

        <aside className="art__takeaways" aria-label="Key takeaways">
          <h2 className="art__takeaways-title">Key takeaways</h2>
          <ul>
            {article.takeaways.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </aside>

        <div className="art__body">
          {article.body.map((block, i) => {
            switch (block.type) {
              case "h2":
                return <h2 key={i}>{block.text}</h2>;
              case "p":
                return <p key={i}>{block.text}</p>;
              case "ul":
                return <ul key={i}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
              case "callout":
                return (
                  <div className="art__callout" key={i}>
                    <p className="art__callout-title">{block.title}</p>
                    <p>{block.text}</p>
                    <Link href="/products/strawberry-lemonade" className="art__callout-link">See the label and ingredients</Link>
                  </div>
                );
            }
          })}
        </div>

        {(article.sources.length > 0 || article.sourceNote) && (
          <section className="art__sources" aria-label="Sources">
            <h2>Sources</h2>
            {article.sources.length > 0 && (
              <ol>{article.sources.map((s) => <li key={s}>{s}</li>)}</ol>
            )}
            {article.sourceNote && <p>{article.sourceNote}</p>}
          </section>
        )}

        <p className="art__disclaimer">
          This article is for general education and is not medical advice. Talk with your clinician about your own needs.
          These statements have not been evaluated by the Food and Drug Administration. Atlas Hydration is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </article>

      <section className="art__more" aria-label="More articles">
        <div className="container">
          <h2 className="art__more-title">Keep reading</h2>
          <div className="jn__grid jn__grid--two">
            {related.map((a) => (
              <Link href={`/blog/${a.slug}`} className="jn__card" key={a.slug}>
                <ArticleCover article={a} />
                <div className="jn__meta"><span>{a.tag}</span><span aria-hidden="true">·</span><span>{a.readTime}</span></div>
                <h3 className="jn__card-title">{a.title}</h3>
                <p className="jn__dek">{a.dek}</p>
                <span className="jn__read">Read article</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
