'use client';

import { useState, useMemo } from 'react';
import { CustomerNode } from '../../lib/api';

interface NormalizedCustomer {
  name: string;
  email: string;
  city: string;
  orders: number;
  totalSpent: number;
  lastOrder: Date;
  firstOrder: Date;
  isRepeat: boolean;
}

function generateDemoCustomers(): NormalizedCustomer[] {
  const firstNames = [
    'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Sophia', 'Jackson', 'Isabella',
    'Aiden', 'Mia', 'Lucas', 'Harper', 'Mason', 'Evelyn', 'Ethan', 'Amelia',
    'Logan', 'Abigail', 'James', 'Charlotte', 'Benjamin', 'Emily', 'Alexander',
    'Ella', 'Daniel',
  ];
  const lastNames = [
    'Williams', 'Johnson', 'Smith', 'Brown', 'Martinez', 'Rodriguez', 'Davis',
    'Kim', 'Lopez', 'Taylor', 'Patel', 'Gonzalez', 'Anderson', 'Thomas',
    'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lee',
    'Harris', 'Clark', 'Lewis', 'Walker',
  ];
  const cities = [
    'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX',
    'Phoenix, AZ', 'Miami, FL', 'Denver, CO', 'Seattle, WA', 'Austin, TX',
    'Portland, OR', 'San Diego, CA', 'Nashville, TN', 'Atlanta, GA',
    'Boston, MA', 'Dallas, TX',
  ];

  const customers: NormalizedCustomer[] = [];
  for (let i = 0; i < 30; i++) {
    const seed = i * 987654;
    const first = firstNames[seed % firstNames.length];
    const last = lastNames[(seed + 13) % lastNames.length];
    const orderCount = (seed % 12) + 1;
    const avgOrder = 20 + (seed % 60);
    const totalSpent = orderCount * avgOrder;

    const lastOrderDays = seed % 180;
    const lastOrderDate = new Date(2026, 2, 1);
    lastOrderDate.setDate(lastOrderDate.getDate() - lastOrderDays);

    const firstOrderDays = lastOrderDays + (seed % 365);
    const firstOrderDate = new Date(2026, 2, 1);
    firstOrderDate.setDate(firstOrderDate.getDate() - firstOrderDays);

    customers.push({
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@email.com`,
      city: cities[seed % cities.length],
      orders: orderCount,
      totalSpent,
      lastOrder: lastOrderDate,
      firstOrder: firstOrderDate,
      isRepeat: orderCount > 1,
    });
  }
  customers.sort((a, b) => b.totalSpent - a.totalSpent);
  return customers;
}

const DEMO_CUSTOMERS = generateDemoCustomers();

function normalizeCustomers(raw: CustomerNode[]): NormalizedCustomer[] {
  return raw.map((c) => {
    const addr =
      c.addresses && c.addresses.length ? c.addresses[0] : {};
    const city = [
      (addr as { city?: string }).city,
      (addr as { province?: string }).province,
      (addr as { country?: string }).country,
    ]
      .filter(Boolean)
      .join(', ');
    const lastOrderDate = c.lastOrder
      ? new Date(c.lastOrder.createdAt)
      : new Date(c.updatedAt);
    const spent = parseFloat(c.totalSpent || '0');
    return {
      name:
        `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email,
      email: c.email || '—',
      city: city || '—',
      orders: parseInt(String(c.ordersCount)) || 0,
      totalSpent: spent,
      lastOrder: lastOrderDate,
      firstOrder: new Date(c.createdAt),
      isRepeat: (parseInt(String(c.ordersCount)) || 0) > 1,
    };
  });
}

interface CustomersTabProps {
  realCustomers: CustomerNode[] | null;
}

function StatCard({ label, value, sub, green }: { label: string; value: string; sub: string; green?: boolean }) {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className={`stat-card__value${green ? ' stat-card__value--green' : ''}`}>{value}</div>
      <div className="stat-card__sub">{sub}</div>
    </div>
  );
}

export default function CustomersTab({ realCustomers }: CustomersTabProps) {
  const [filter, setFilter] = useState('all');
  const now = new Date();

  const sourceCustomers = useMemo(
    () =>
      realCustomers && realCustomers.length
        ? normalizeCustomers(realCustomers)
        : DEMO_CUSTOMERS,
    [realCustomers]
  );

  const isLive = !!(realCustomers && realCustomers.length);

  const filtered = useMemo(() => {
    return sourceCustomers.filter((c) => {
      if (filter === 'repeat') return c.orders > 1;
      if (filter === 'new')
        return now.getTime() - c.firstOrder.getTime() <= 30 * 86400000;
      if (filter === 'inactive')
        return now.getTime() - c.lastOrder.getTime() > 90 * 86400000;
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceCustomers, filter]);

  const stats = useMemo(() => {
    const totalCustomers = filtered.length;
    const repeatCount = filtered.filter((c) => c.orders > 1).length;
    const totalRevenue = filtered.reduce((s, c) => s + c.totalSpent, 0);
    const avgLTV = totalCustomers ? totalRevenue / totalCustomers : 0;
    return { totalCustomers, repeatCount, totalRevenue, avgLTV };
  }, [filtered]);

  return (
    <>
      <div className="orders-header">
        <h2 className="section__title">Customers</h2>
        <div className="orders-filter">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Customers</option>
            <option value="repeat">Repeat Buyers</option>
            <option value="new">New Customers</option>
            <option value="inactive">Inactive (90d+)</option>
          </select>
        </div>
      </div>

      <div className="orders-stats">
        <StatCard label="Customers" value={String(stats.totalCustomers)} sub="Filtered results" />
        <StatCard
          label="Repeat Buyers"
          value={String(stats.repeatCount)}
          sub={`${Math.round((stats.repeatCount / (stats.totalCustomers || 1)) * 100)}% retention`}
        />
        <div className="stat-card">
          <div className="stat-card__label">Total Revenue</div>
          <div className="stat-card__value stat-card__value--green">
            ${stats.totalRevenue.toFixed(2)}
          </div>
          <div className="stat-card__sub">Lifetime</div>
        </div>
        <StatCard
          label="Avg LTV"
          value={`$${stats.avgLTV.toFixed(2)}`}
          sub="Per customer"
        />
      </div>

      <div className="section">
        <div className="section__header">
          <h2 className="section__title">Customer List</h2>
          <span className="section__badge">
            {filtered.length} customers{' '}
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
                <th>Customer</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
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
                    No customers found
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => {
                  const daysSince = Math.floor(
                    (now.getTime() - c.lastOrder.getTime()) / 86400000
                  );
                  const statusEl =
                    daysSince > 90 ? (
                      <span className="badge badge--draft">Inactive</span>
                    ) : daysSince > 30 ? (
                      <span
                        className="badge"
                        style={{
                          background: 'var(--yellow-dim)',
                          color: 'var(--yellow)',
                        }}
                      >
                        Idle
                      </span>
                    ) : (
                      <span className="badge badge--active">Active</span>
                    );

                  return (
                    <tr key={idx}>
                      <td>
                        <strong>{c.name}</strong>
                        <div
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-dim)',
                            marginTop: '2px',
                          }}
                        >
                          {c.city}
                        </div>
                      </td>
                      <td>{c.email}</td>
                      <td>{c.orders}</td>
                      <td className="price">${c.totalSpent.toFixed(2)}</td>
                      <td>{c.lastOrder.toLocaleDateString()}</td>
                      <td>{statusEl}</td>
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
