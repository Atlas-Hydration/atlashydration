'use client';

import { ProductNode } from '../../lib/api';
import { USE_WORKER } from '../../lib/api';

interface VariantsTabProps {
  products: ProductNode[];
}

export default function VariantsTab({ products }: VariantsTabProps) {
  const variants: React.ReactNode[] = [];

  products.forEach((p) => {
    p.variants.edges.forEach(({ node: vn }) => {
      let price: string;
      let compareEl: React.ReactNode = null;
      let statusEl: React.ReactNode;
      let extraRows: React.ReactNode;

      if (USE_WORKER) {
        const adminPrice = vn as unknown as {
          price: string;
          compareAtPrice?: string | null;
          inventoryQuantity?: number;
          sku?: string;
          weight?: number;
          weightUnit?: string;
        };
        price = parseFloat(adminPrice.price).toFixed(2);
        if (adminPrice.compareAtPrice) {
          compareEl = (
            <span className="price--compare">
              ${parseFloat(adminPrice.compareAtPrice).toFixed(2)}
            </span>
          );
        }
        const qty = adminPrice.inventoryQuantity || 0;
        statusEl =
          qty > 0 ? (
            <span className="badge badge--available">In Stock ({qty})</span>
          ) : (
            <span className="badge badge--oos">Out of Stock</span>
          );
        extraRows = (
          <>
            <div className="variant-card__row">
              <span className="variant-card__label">SKU</span>
              <span className="variant-card__value">{adminPrice.sku || '—'}</span>
            </div>
            <div className="variant-card__row">
              <span className="variant-card__label">Inventory</span>
              <span className="variant-card__value">{qty}</span>
            </div>
            {adminPrice.weight ? (
              <div className="variant-card__row">
                <span className="variant-card__label">Weight</span>
                <span className="variant-card__value">
                  {adminPrice.weight} {(adminPrice.weightUnit || '').toLowerCase()}
                </span>
              </div>
            ) : null}
          </>
        );
      } else {
        const sfVariant = vn as unknown as {
          price: { amount: string; currencyCode: string };
          compareAtPrice?: { amount: string; currencyCode: string } | null;
          availableForSale: boolean;
          selectedOptions: { name: string; value: string }[];
        };
        price = parseFloat(sfVariant.price.amount).toFixed(2);
        if (sfVariant.compareAtPrice) {
          compareEl = (
            <span className="price--compare">
              ${parseFloat(sfVariant.compareAtPrice.amount).toFixed(2)}
            </span>
          );
        }
        statusEl = sfVariant.availableForSale ? (
          <span className="badge badge--available">Available</span>
        ) : (
          <span className="badge badge--oos">Unavailable</span>
        );
        extraRows = (
          <div className="variant-card__row">
            <span className="variant-card__label">Options</span>
            <span className="variant-card__value">
              {sfVariant.selectedOptions
                .map((o) => `${o.name}: ${o.value}`)
                .join(', ') || '—'}
            </span>
          </div>
        );
      }

      variants.push(
        <div className="variant-card" key={vn.id}>
          <div className="variant-card__header">
            <span className="variant-card__title">{vn.title}</span>
            {statusEl}
          </div>
          <div className="variant-card__row">
            <span className="variant-card__label">Product</span>
            <span className="variant-card__value">{p.title}</span>
          </div>
          <div className="variant-card__row">
            <span className="variant-card__label">Price</span>
            <span className="variant-card__value">
              <span className="price">${price}</span>
              {compareEl}
            </span>
          </div>
          {extraRows}
          <div className="variant-card__row">
            <span className="variant-card__label">ID</span>
            <span
              className="variant-card__value"
              style={{ fontSize: '0.68rem', color: 'var(--text-dim)', wordBreak: 'break-all' }}
            >
              {vn.id}
            </span>
          </div>
        </div>
      );
    });
  });

  return (
    <div className="section">
      <div className="section__header">
        <h2 className="section__title">All Variants</h2>
        <span className="section__badge">{variants.length} total</span>
      </div>
      {variants.length === 0 ? (
        <div style={{ color: 'var(--text-dim)' }}>No variants found</div>
      ) : (
        <div className="variant-cards">{variants}</div>
      )}
    </div>
  );
}
