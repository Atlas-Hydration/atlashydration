import type { Article } from "@/app/data/articles";

/** Typographic cover: one real figure from the article, no stock photography. */
export default function ArticleCover({ article, size = "card" }: { article: Article; size?: "card" | "wide" }) {
  const { figure, caption, tone } = article.cover;
  return (
    <div className={`acover acover--${tone} acover--${size}`} aria-hidden="true">
      <span className="acover__tag">{article.tag}</span>
      <span className="acover__figure">{figure}</span>
      <span className="acover__caption">{caption}</span>
    </div>
  );
}
