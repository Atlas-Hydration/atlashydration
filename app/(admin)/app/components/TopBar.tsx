'use client';

export type ApiStatus = 'loading' | 'connected' | 'error';

interface TopBarProps {
  pageTitle: string;
  apiStatus: ApiStatus;
  apiError?: string;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  onSidebarToggle: () => void;
}

export default function TopBar({
  pageTitle,
  apiStatus,
  apiError,
  theme,
  onThemeToggle,
  onSidebarToggle,
}: TopBarProps) {
  function renderApiBadge() {
    if (apiStatus === 'connected') {
      return (
        <span className="api-badge api-badge--connected">
          <span className="api-badge__dot" />
          API Connected
        </span>
      );
    }
    if (apiStatus === 'error') {
      const short = apiError ? apiError.substring(0, 60) : 'Unknown error';
      return (
        <span
          className="api-badge api-badge--error"
          title={apiError || 'Unknown error'}
        >
          <span className="api-badge__dot" />
          API Error: {short}
        </span>
      );
    }
    return (
      <span className="api-badge api-badge--loading">
        <span className="api-badge__dot" />
        Connecting...
      </span>
    );
  }

  return (
    <div className="topbar">
      <div className="topbar__left">
        <button className="sidebar-toggle" onClick={onSidebarToggle}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="topbar__page-title">{pageTitle}</span>
      </div>
      <div className="topbar__right">
        {renderApiBadge()}
        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          title="Toggle light/dark mode"
        >
          {theme === 'light' ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
