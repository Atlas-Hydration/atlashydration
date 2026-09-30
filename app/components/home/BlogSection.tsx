import Link from "next/link";
import { ARTICLES } from "@/app/data/articles";
import ArticleCover from "@/app/components/ArticleCover";

const FEATURED = ARTICLES.slice(0, 3);

export default function BlogSection() {
  return (
    <section className="jn" id="blog" aria-labelledby="jn-title">
      <div className="container">
        <div className="jn__head">
          <p className="section-eyebrow">The Science</p>
          <h2 className="jn__title" id="jn-title">Hydration Explained</h2>
          <p className="jn__sub">
            Plain-language articles on electrolytes, ingredients, and how hydration really works, with the sources to back them up.
          </p>
        </div>

        <div className="jn__grid">
          {FEATURED.map((a) => (
            <Link href={`/blog/${a.slug}`} className="jn__card" key={a.slug}>
              <ArticleCover article={a} />
              <div className="jn__meta">
                <span>{a.tag}</span>
                <span aria-hidden="true">·</span>
                <span>{a.readTime}</span>
              </div>
              <h3 className="jn__card-title">{a.title}</h3>
              <p className="jn__dek">{a.dek}</p>
              <span className="jn__read">Read article</span>
            </Link>
          ))}
        </div>

        <div className="jn__all">
          <Link href="/blog" className="btn btn--outline">
            All {ARTICLES.length} articles
          </Link>
        </div>
      </div>
    </section>
  );
}
