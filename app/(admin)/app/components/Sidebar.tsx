'use client';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefresh: () => void;
  onLogout: () => void;
  lastUpdated: string;
  isOpen: boolean;
  isRefreshing: boolean;
}

const navItems = {
  store: [
    {
      tab: 'products',
      label: 'Products',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
    {
      tab: 'variants',
      label: 'Variants',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      tab: 'collections',
      label: 'Collections',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      tab: 'orders',
      label: 'Orders',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      tab: 'customers',
      label: 'Customers',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
  ],
  tools: [
    {
      tab: 'seo',
      label: 'SEO',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      tab: 'geo',
      label: 'GEO',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      ),
    },
    {
      tab: 'shop',
      label: 'Shop Info',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
    {
      tab: 'roadmap',
      label: 'Roadmap',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        </svg>
      ),
    },
    {
      tab: 'content-machine',
      label: 'Content Machine',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      tab: 'strategy-lab',
      label: 'Strategy Lab',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
      ),
    },
  ],
};

export default function Sidebar({
  activeTab,
  onTabChange,
  onRefresh,
  onLogout,
  lastUpdated,
  isOpen,
  isRefreshing,
}: SidebarProps) {
  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div className="sidebar__brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Atlas Hydration" className="sidebar__brand-logo" />
      </div>

      <nav className="sidebar__nav">
        <div className="sidebar__section-label">Store</div>
        {navItems.store.map((item) => (
          <button
            key={item.tab}
            className={`sidebar__link${activeTab === item.tab ? ' active' : ''}`}
            onClick={() => onTabChange(item.tab)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <div className="sidebar__section-label">Tools</div>
        {navItems.tools.map((item) => (
          <button
            key={item.tab}
            className={`sidebar__link${activeTab === item.tab ? ' active' : ''}`}
            onClick={() => onTabChange(item.tab)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <div className="sidebar__section-label">Dev</div>
        <a className="sidebar__link" href="/dev/" style={{ textDecoration: 'none' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Image Manager
        </a>
        <a className="sidebar__link" href="/dev/packaging/" style={{ textDecoration: 'none' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          Packaging
        </a>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__footer-status">{lastUpdated}</div>
        <div className="sidebar__footer-actions">
          <button
            className={`topbar__refresh${isRefreshing ? ' loading' : ''}`}
            style={{ flex: 1 }}
            onClick={onRefresh}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0115.36-6.36L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 01-15.36 6.36L3 16" />
            </svg>
            Refresh
          </button>
          <button className="topbar__logout" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
