'use client';

import { useState, useMemo } from 'react';
import { OrderNode } from '../../lib/api';

interface NormalizedOrder {
  id: string;
  date: Date;
  customer: string;
  items: string[];
  total: number;
  status: string;
}

function generateDemoOrders(): NormalizedOrder[] {
  const names = [
    'Emma W.', 'Liam J.', 'Olivia S.', 'Noah B.', 'Ava M.', 'Sophia R.',
    'Jackson T.', 'Isabella K.', 'Aiden L.', 'Mia C.', 'Lucas P.', 'Harper D.',
    'Mason G.', 'Evelyn F.', 'Ethan H.', 'Amelia N.', 'Logan V.', 'Abigail Z.',
    'James Q.', 'Charlotte X.', 'Benjamin Y.', 'Emily A.', 'Alexander U.',
    'Ella I.', 'Daniel O.',
  ];
  const products = [
    'Strawberry Lemonade (8-Pack)',
    'Grapefruit (8-Pack)',
    'Strawberry Lemonade (24-Pack)',
    'Grapefruit (24-Pack)',
    'Variety Pack (16-Pack)',
    'Strawberry Lemonade (Single)',
    'Grapefruit (Single)',
  ];
  const unitPrices = [6.99, 6.99, 49.99, 49.99, 39.99, 3.99, 3.99];
  const statuses = [
    'fulfilled', 'fulfilled', 'fulfilled', 'fulfilled', 'fulfilled', 'fulfilled',
    'pending', 'pending', 'cancelled', 'refunded',
  ];

  const orders: NormalizedOrder[] = [];
  // Use a seeded approach for deterministic output on server
  for (let i = 0; i < 50; i++) {
    const seed = i * 1234567;
    const daysAgo = Math.floor(((seed * 9301 + 49297) % 233280) / 233280 * 90);
    const d = new Date(2026, 2, 1); // 2026-03-01
    d.setDate(d.getDate() - daysAgo);
    d.setHours(Math.floor(((seed * 7) % 24)));

    const itemCount = (i % 3) + 1;
    const itemList: string[] = [];
    for (let j = 0; j < itemCount; j++) {
      itemList.push(products[((seed + j * 17) % products.length)]);
    }
    let total = 0;
    itemList.forEach((item) => {
      const idx = products.indexOf(item);
      total += unitPrices[idx];
    });

    orders.push({
      id: `#ATL-${1000 + i}`,
      date: d,
      customer: names[seed % names.length],
      items: itemList,
      total,
      status: statuses[seed % statuses.length],
    });
  }
  orders.sort((a, b) => b.date.getTime() - a.date.getTime());
  return orders;
}

const DEMO_ORDERS = generateDemoOrders();

function normalizeOrders(raw: OrderNode[]): NormalizedOrder[] {
  const statusMap: Record<string, string> = {
    FULFILLED: 'fulfilled',
    UNFULFILLED: 'pending',
    PARTIALLY_FULFILLED: 'pending',
    RESTOCKED: 'refunded',
  };
  return raw.map((o) => {
    const fulfillStatus = o.displayFulfillmentStatus || 'UNFULFILLED';
    const finStatus = o.displayFinancialStatus || '';
    const status =
      finStatus === 'REFUNDED'
        ? 'refunded'
        : finStatus === 'VOIDED'
        ? 'cancelled'
        : statusMap[fulfillStatus] || 'pending';
    const customerName = o.customer
      ? `${o.customer.firstName || ''} ${o.customer.lastName || ''}`.trim()
      : 'Guest';
    const items = o.lineItems
      ? o.lineItems.edges.map((e) =>
          e.node.title + (e.node.quantity > 1 ? ` x${e.node.quantity}` : '')
        )
      : [];
    return {
      id: o.name || o.id,
      date: new Date(o.createdAt),
      customer: customerName,
      items,
      total: parseFloat(o.totalPriceSet.shopMoney.amount),
      status,
    };
  });
}

interface OrdersTabProps {
  realOrders: OrderNode[] | null;
}

function StatCard({
  label,
  value,
  sub,
  green,
}: {
  label: string;
  value: string;
  sub: string;
  green?: boolean;
}) {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className={`stat-card__value${green ? ' stat-card__value--green' : ''}`}>
        {value}
      </div>
      <div className="stat-card__sub">{sub}</div>
    </div>
  );
}

export default function OrdersTab({ realOrders }: OrdersTabProps) {
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const sourceOrders = useMemo(
    () =>
      realOrders && realOrders.length
        ? normalizeOrders(realOrders)
        : DEMO_ORDERS,
    [realOrders]
  );

  const isLive = !!(realOrders && realOrders.length);

  const filtered = useMemo(() => {
    const now = new Date();
    return sourceOrders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (dateFilter === 'today') return o.date.toDateString() === now.toDateString();
      if (dateFilter === '7d') return now.getTime() - o.date.getTime() <= 7 * 86400000;
      if (dateFilter === '30d') return now.getTime() - o.date.getTime() <= 30 * 86400000;
      if (dateFilter === '90d') return now.getTime() - o.date.getTime() <= 90 * 86400000;
      return true;
    });
  }, [sourceOrders, dateFilter, statusFilter]);

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let fulfilledCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;
    let refundedCount = 0;
    filtered.forEach((o) => {
      if (o.status === 'fulfilled') {
        totalRevenue += o.total;
        fulfilledCount++;
      } else if (o.status === 'pending') {
        totalRevenue += o.total;
        pendingCount++;
      } else if (o.status === 'cancelled') {
        cancelledCount++;
      } else if (o.status === 'refunded') {
        refundedCount++;
      }
    });
    const avgOrderValue =
      filtered.length ? totalRevenue / (fulfilledCount + pendingCount || 1) : 0;
    const fulfillRate = filtered.length
      ? Math.round((fulfilledCount / filtered.length) * 100)
      : 0;
    return {
      totalRevenue,
      fulfilledCount,
      pendingCount,
      cancelledCount,
      refundedCount,
      avgOrderValue,
      fulfillRate,
    };
  }, [filtered]);

  return (
    <>
      <div className="orders-header">
        <h2 className="section__title">Orders Overview</h2>
        <div className="orders-filter">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="orders-stats">
        <StatCard label="Total Orders" value={String(filtered.length)} sub="Filtered results" />
        <div className="stat-card">
          <div className="stat-card__label">Revenue</div>
          <div className="stat-card__value stat-card__value--green">
            ${stats.totalRevenue.toFixed(2)}
          </div>
          <div className="stat-card__sub">From fulfilled &amp; pending</div>
        </div>
        <StatCard
          label="Avg Order Value"
          value={`$${stats.avgOrderValue.toFixed(2)}`}
          sub="Per order"
        />
        <StatCard
          label="Fulfilled"
          value={String(stats.fulfilledCount)}
          sub={`${Math.round((stats.fulfilledCount / (filtered.length || 1)) * 100)}% fulfillment rate`}
        />
        <StatCard
          label="Pending"
          value={String(stats.pendingCount)}
          sub="Awaiting fulfillment"
        />
        <StatCard
          label="Cancelled / Refunded"
          value={String(stats.cancelledCount + stats.refundedCount)}
          sub={`${stats.cancelledCount} cancelled, ${stats.refundedCount} refunded`}
        />
      </div>

      <div className="section">
        <div className="section__header">
          <h2 className="section__title">Conversion Insights</h2>
        </div>
        <div className="conversion-cards">
          <div className="conversion-card">
            <div className="conversion-card__title">Fulfillment Rate</div>
            <div className="conversion-card__bar-wrap">
              <div
                className="conversion-card__bar conversion-card__bar--green"
                style={{ width: `${stats.fulfillRate}%` }}
              />
            </div>
            <div className="conversion-card__row">
              <span>
                {stats.fulfilledCount} of {filtered.length} orders fulfilled
              </span>
              <span>{stats.fulfillRate}%</span>
            </div>
            <div className="conversion-card__tip">
              Tip: Fulfill pending orders within 24 hours to improve customer
              satisfaction and reduce cancellations.
            </div>
          </div>
          <div className="conversion-card">
            <div className="conversion-card__title">Repeat Customer Rate</div>
            <div className="conversion-card__bar-wrap">
              <div
                className="conversion-card__bar conversion-card__bar--accent"
                style={{ width: '32%' }}
              />
            </div>
            <div className="conversion-card__row">
              <span>Estimated repeat buyers</span>
              <span>32%</span>
            </div>
            <div className="conversion-card__tip">
              Tip: Send post-purchase emails 7 days after delivery with a 15%
              discount code to boost repeat orders.
            </div>
          </div>
          <div className="conversion-card">
            <div className="conversion-card__title">Subscribe &amp; Save Adoption</div>
            <div className="conversion-card__bar-wrap">
              <div
                className="conversion-card__bar conversion-card__bar--yellow"
                style={{ width: '18%' }}
              />
            </div>
            <div className="conversion-card__row">
              <span>Subscription vs one-time</span>
              <span>18%</span>
            </div>
            <div className="conversion-card__tip">
              Tip: Highlight the 20% subscription discount more prominently on
              product pages. Add &ldquo;Most Popular&rdquo; badge to subscription option.
            </div>
          </div>
          <div className="conversion-card">
            <div className="conversion-card__title">Cart Abandonment Recovery</div>
            <div className="conversion-card__bar-wrap">
              <div
                className="conversion-card__bar conversion-card__bar--green"
                style={{ width: '42%' }}
              />
            </div>
            <div className="conversion-card__row">
              <span>Recovery rate from abandoned carts</span>
              <span>42%</span>
            </div>
            <div className="conversion-card__tip">
              Tip: Add a 3-email abandoned cart sequence: reminder at 1hr,
              incentive at 24hrs, urgency at 48hrs.
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h2 className="section__title">Recent Orders</h2>
          <span className="section__badge">
            {filtered.length} orders{' '}
            {isLive ? (
              <span style={{ fontSize: '0.7rem', color: 'var(--green)', marginLeft: '8px' }}>
                Live Data
              </span>
            ) : (
              <span style={{ fontSize: '0.7rem', color: 'var(--yellow)', marginLeft: '8px' }}>
                Demo Data
              </span>
            )}
          </span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: 'center',
                      color: 'var(--text-dim)',
                      padding: '40px',
                    }}
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const statusLabel =
                    o.status.charAt(0).toUpperCase() + o.status.slice(1);
                  return (
                    <tr key={o.id}>
                      <td>
                        <strong>{o.id}</strong>
                      </td>
                      <td>
                        {o.date.toLocaleDateString()}{' '}
                        {o.date.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>{o.customer}</td>
                      <td>
                        {o.items.map((item, i) => (
                          <span key={i}>
                            {item}
                            {i < o.items.length - 1 && <br />}
                          </span>
                        ))}
                      </td>
                      <td className="price">${o.total.toFixed(2)}</td>
                      <td>
                        <span
                          className={`order-status-dot order-status-dot--${o.status}`}
                        />
                        {statusLabel}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
