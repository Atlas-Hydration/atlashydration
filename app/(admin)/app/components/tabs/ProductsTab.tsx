'use client';

import { ProductNode } from '../../lib/api';
import { USE_WORKER } from '../../lib/api';

interface ProductsTabProps {
  products: ProductNode[];
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function ProductsTab({ products }: ProductsTabProps) {
  if (products.length === 0) {
    return (
      <div className="section">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Status</th>
                <th>Type</th>
                <th>Variants</th>
                <th>Price Range</th>
                <th>Inventory</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '40px' }}>
                  No products found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Status</th>
              <th>Type</th>
              <th>Variants</th>
              <th>Price Range</th>
              <th>Inventory</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const img = p.images.edges.length ? p.images.edges[0].node.url : '';
              const variantCount = p.variants.edges.length;

              let statusEl: React.ReactNode;
              let minPrice: string;
              let maxPrice: string;
              let inventoryEl: React.ReactNode;

              if (USE_WORKER) {
                statusEl =
                  p.status === 'ACTIVE' ? (
                    <span className="badge badge--active">Active</span>
                  ) : (
                    <span className="badge badge--draft">{p.status || 'Unknown'}</span>
                  );
                minPrice = p.priceRangeV2
                  ? p.priceRangeV2.minVariantPrice.amount
                  : variantCount
                  ? (p.variants.edges[0].node as unknown as { price: string }).price
                  : '0';
                maxPrice = p.priceRangeV2
                  ? p.priceRangeV2.maxVariantPrice.amount
                  : minPrice;
                const totalInventory = p.variants.edges.reduce(
                  (sum, v) => sum + ((v.node as unknown as { inventoryQuantity: number }).inventoryQuantity || 0),
                  0
                );
                inventoryEl =
                  totalInventory > 0 ? (
                    <span className="badge badge--available">{totalInventory} In Stock</span>
                  ) : (
                    <span className="badge badge--oos">Out of Stock</span>
                  );
              } else {
                statusEl = p.availableForSale ? (
                  <span className="badge badge--active">Available</span>
                ) : (
                  <span className="badge badge--draft">Unavailable</span>
                );
                minPrice = p.priceRange
                  ? p.priceRange.minVariantPrice.amount
                  : variantCount
                  ? (p.variants.edges[0].node.price as unknown as { amount: string }).amount
                  : '0';
                maxPrice = p.priceRange
                  ? p.priceRange.maxVariantPrice.amount
                  : minPrice;
                const availableVariants = p.variants.edges.filter(
                  (v) => (v.node as unknown as { availableForSale: boolean }).availableForSale
                ).length;
                inventoryEl =
                  availableVariants > 0 ? (
                    <span className="badge badge--available">
                      {availableVariants}/{variantCount} Available
                    </span>
                  ) : (
                    <span className="badge badge--oos">Unavailable</span>
                  );
              }

              const minVal = parseFloat(minPrice);
              const maxVal = parseFloat(maxPrice);
              const priceStr =
                minVal === maxVal
                  ? `$${minVal.toFixed(2)}`
                  : `$${minVal.toFixed(2)} – $${maxVal.toFixed(2)}`;

              return (
                <tr key={p.id}>
                  <td>
                    <div className="table__product">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="table__product-img"
                          src={img}
                          alt={esc(p.title)}
                        />
                      ) : (
                        <div
                          className="table__product-img"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-dim)',
                            fontSize: '0.6rem',
                          }}
                        >
                          No img
                        </div>
                      )}
                      <div className="table__product-info">
                        <span className="table__product-title">{p.title}</span>
                        <span className="table__product-vendor">{p.vendor || '—'}</span>
                      </div>
                    </div>
                  </td>
                  <td>{statusEl}</td>
                  <td>{p.productType || '—'}</td>
                  <td>{variantCount}</td>
                  <td>
                    <span className="price">{priceStr}</span>
                  </td>
                  <td>{inventoryEl}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
