import Link from "next/link";
import { ARTICLES } from "@/app/data/articles";

const PICKS = ["what-are-electrolytes", "sodium-science", "amino-acids-hydration", "allulose-performance"];

/** Crawlable links from product pages to the ingredient guides. */
export default function ProductArticles() {
  const items = PICKS.map((slug) => ARTICLES.find((a) => a.slug === slug)).filter((a) => !!a);
  return (
    <section className="pa" aria-labelledby="pa-title">
      <div className="container">
        <h2 className="pa__title" id="pa-title">What&apos;s in every stick</h2>
        <p className="pa__sub">Plain-language guides to the ingredients and the science behind them.</p>
        <ul className="pa__list">
          {items.map((a) => (
            <li key={a.slug}>
              <Link href={`/blog/${a.slug}`} className="pa__link">
                <span className="pa__tag">{a.tag}</span>
                <span className="pa__name">{a.title}</span>
                <span className="pa__dek">{a.dek}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
