'use client';

import { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import TopBar, { ApiStatus } from './components/TopBar';
import ProductsTab from './components/tabs/ProductsTab';
import VariantsTab from './components/tabs/VariantsTab';
import CollectionsTab from './components/tabs/CollectionsTab';
import OrdersTab from './components/tabs/OrdersTab';
import CustomersTab from './components/tabs/CustomersTab';
import SeoTab from './components/tabs/SeoTab';
import GeoTab from './components/tabs/GeoTab';
import ShopInfoTab from './components/tabs/ShopInfoTab';
import RoadmapTab from './components/tabs/RoadmapTab';

import {
  fetchProducts,
  fetchCollections,
  fetchShopInfo,
  fetchCustomers,
  fetchOrders,
  USE_WORKER,
  ProductNode,
  CollectionNode,
  ShopInfo,
  CustomerNode,
  OrderNode,
} from './lib/api';

type Tab =
  | 'products'
  | 'variants'
  | 'collections'
  | 'orders'
  | 'customers'
  | 'seo'
  | 'geo'
  | 'shop'
  | 'roadmap';

const PAGE_TITLES: Record<Tab, string> = {
  products: 'Products',
  variants: 'Variants',
  collections: 'Collections',
  orders: 'Orders',
  customers: 'Customers',
  seo: 'SEO',
  geo: 'GEO',
  shop: 'Shop Info',
  roadmap: 'Roadmap',
};

interface DashboardData {
  products: ProductNode[];
  collections: CollectionNode[];
  shop: ShopInfo | null;
  customers: CustomerNode[] | null;
  orders: OrderNode[] | null;
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__sub">{sub}</div>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('loading');
  const [apiError, setApiError] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [data, setData] = useState<DashboardData>({
    products: [],
    collections: [],
    shop: null,
    customers: null,
    orders: null,
  });

  // Init auth + theme from storage
  useEffect(() => {
    const auth = sessionStorage.getItem('atlas_app_auth') === '1';
    setIsAuthenticated(auth);

    const savedTheme = (localStorage.getItem('atlas_theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    setApiStatus('loading');
    setErrorMessage('');

    try {
      const fetches: Promise<unknown>[] = [fetchProducts(), fetchCollections(), fetchShopInfo()];
      if (USE_WORKER) {
        fetches.push(fetchCustomers());
        fetches.push(fetchOrders());
      }

      const results = await Promise.all(fetches);
      const products = results[0] as ProductNode[];
      const collections = results[1] as CollectionNode[];
      const shop = results[2] as ShopInfo;
      const customers = USE_WORKER ? (results[3] as CustomerNode[]) : null;
      const orders = USE_WORKER ? (results[4] as OrderNode[]) : null;

      setData({ products, collections, shop, customers, orders });
      setApiStatus('connected');
      setLastUpdated('Updated ' + new Date().toLocaleTimeString());
    } catch (err) {
      const errText = err instanceof Error ? err.message : String(err);
      setApiStatus('error');
      setApiError(errText);
      setErrorMessage('Failed to fetch data: ' + errText);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Auto-fetch on login
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  function handleLogin() {
    setIsAuthenticated(true);
  }

  function handleLogout() {
    sessionStorage.removeItem('atlas_app_auth');
    setIsAuthenticated(false);
  }

  function handleThemeToggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('atlas_theme', next);
  }

  function handleTabChange(tab: string) {
    setActiveTab(tab as Tab);
    setSidebarOpen(false);
  }

  // Stats calculation
  function renderStats() {
    const { products, collections, shop } = data;
    let totalVariants = 0;
    let totalAvailable = 0;
    const prices: number[] = [];

    products.forEach((p) => {
      p.variants.edges.forEach((v) => {
        totalVariants++;
        if (USE_WORKER) {
          const adminV = v.node as unknown as { inventoryQuantity?: number; price: string };
          if ((adminV.inventoryQuantity || 0) > 0) totalAvailable++;
          prices.push(parseFloat(adminV.price));
        } else {
          const sfV = v.node as unknown as { availableForSale: boolean; price: { amount: string } };
          if (sfV.availableForSale) totalAvailable++;
          prices.push(parseFloat(sfV.price.amount));
        }
      });
    });

    const avgPrice = prices.length
      ? prices.reduce((a, b) => a + b, 0) / prices.length
      : 0;
    const currency = shop?.currencyCode || 'USD';

    return (
      <div className="stats">
        <StatCard label="Products" value={products.length} sub="In store" />
        <StatCard
          label="Variants"
          value={totalVariants}
          sub={`${totalAvailable} ${USE_WORKER ? 'in stock' : 'available'}`}
        />
        <StatCard label="Collections" value={collections.length} sub="Organized groups" />
        <StatCard label="Avg Price" value={`$${avgPrice.toFixed(2)}`} sub={currency} />
        <StatCard
          label="Currencies"
          value={shop?.enabledPresentmentCurrencies?.length ?? 0}
          sub="Accepted"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Show stats only on data tabs
  const showStats = ['products', 'variants', 'collections', 'shop'].includes(activeTab);

  return (
    <>
      <div className="animated-bg">
        <div className="animated-bg__gradient" />
        <div className="animated-bg__noise" />
      </div>

      <div className="app active">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onRefresh={fetchAllData}
          onLogout={handleLogout}
          lastUpdated={lastUpdated}
          isOpen={sidebarOpen}
          isRefreshing={isRefreshing}
        />

        <div className="app__main">
          <TopBar
            pageTitle={PAGE_TITLES[activeTab]}
            apiStatus={apiStatus}
            apiError={apiError}
            theme={theme}
            onThemeToggle={handleThemeToggle}
            onSidebarToggle={() => setSidebarOpen((v) => !v)}
          />

          <div className="dashboard">
            {errorMessage && (
              <div className="error-banner visible">{errorMessage}</div>
            )}

            {isLoading ? (
              <div className="loading-overlay">
                <div className="loading-spinner" />
                <div>Fetching data from Shopify...</div>
              </div>
            ) : (
              <>
                {showStats && renderStats()}

                {activeTab === 'products' && (
                  <ProductsTab products={data.products} />
                )}
                {activeTab === 'variants' && (
                  <VariantsTab products={data.products} />
                )}
                {activeTab === 'collections' && (
                  <CollectionsTab collections={data.collections} />
                )}
                {activeTab === 'shop' && (
                  <ShopInfoTab shop={data.shop} />
                )}
                {activeTab === 'orders' && (
                  <OrdersTab realOrders={data.orders} />
                )}
                {activeTab === 'customers' && (
                  <CustomersTab realCustomers={data.customers} />
                )}
                {activeTab === 'seo' && <SeoTab />}
                {activeTab === 'geo' && <GeoTab />}
                {activeTab === 'roadmap' && <RoadmapTab />}

              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
