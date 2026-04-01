'use client';

import { CollectionNode } from '../../lib/api';

interface CollectionsTabProps {
  collections: CollectionNode[];
}

export default function CollectionsTab({ collections }: CollectionsTabProps) {
  return (
    <div className="section">
      <div className="section__header">
        <h2 className="section__title">Collections</h2>
        <span className="section__badge">{collections.length} total</span>
      </div>
      {collections.length === 0 ? (
        <div style={{ color: 'var(--text-dim)' }}>No collections found</div>
      ) : (
        <div className="variant-cards">
          {collections.map((c) => {
            const productList = c.products.edges
              .map((e) => e.node.title)
              .join(', ');
            return (
              <div className="collection-card" key={c.id}>
                <div className="collection-card__title">{c.title}</div>
                {c.description && (
                  <div className="collection-card__desc">{c.description}</div>
                )}
                <div className="collection-card__meta">
                  Products: {productList || 'None'}
                </div>
                <div className="collection-card__meta" style={{ marginTop: '4px' }}>
                  Updated: {new Date(c.updatedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
