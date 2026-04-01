'use client';

import { ShopInfo, USE_WORKER, SHOPIFY } from '../../lib/api';

interface ShopInfoTabProps {
  shop: ShopInfo | null;
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-card">
      <div className="info-card__label">{label}</div>
      <div className="info-card__value">{value}</div>
    </div>
  );
}

export default function ShopInfoTab({ shop }: ShopInfoTabProps) {
  if (!shop) {
    return (
      <div className="section">
        <div className="section__header">
          <h2 className="section__title">Shop Details</h2>
        </div>
        <div style={{ color: 'var(--text-dim)' }}>No shop info available</div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section__header">
        <h2 className="section__title">Shop Details</h2>
      </div>
      <div className="shop-info">
        <InfoCard label="Shop Name" value={shop.name || '—'} />
        <InfoCard label="Description" value={shop.description || '—'} />
        {USE_WORKER ? (
          <>
            <InfoCard label="Domain" value={shop.myshopifyDomain || '—'} />
            <InfoCard label="Store URL" value={shop.url || '—'} />
            <InfoCard label="Plan" value={shop.plan?.displayName || '—'} />
            <InfoCard label="Currency" value={shop.currencyCode || '—'} />
            <InfoCard
              label="Presentment Currencies"
              value={
                shop.enabledPresentmentCurrencies?.length
                  ? shop.enabledPresentmentCurrencies.join(', ')
                  : '—'
              }
            />
            <InfoCard
              label="Contact"
              value={shop.contactEmail || shop.email || '—'}
            />
            <InfoCard
              label="Country"
              value={shop.billingAddress?.country || '—'}
            />
          </>
        ) : (
          <>
            <InfoCard label="Domain" value={SHOPIFY.domain} />
            <InfoCard label="Money Format" value={shop.moneyFormat || '—'} />
            <InfoCard label="Currency" value={shop.currencyCode || '—'} />
            <InfoCard
              label="Presentment Currencies"
              value={
                shop.enabledPresentmentCurrencies?.length
                  ? shop.enabledPresentmentCurrencies.join(', ')
                  : '—'
              }
            />
            <InfoCard
              label="Card Brands"
              value={
                shop.paymentSettings?.acceptedCardBrands?.length
                  ? shop.paymentSettings.acceptedCardBrands.join(', ')
                  : '—'
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
