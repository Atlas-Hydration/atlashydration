import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const PROPERTY_ID = process.env.GA4_PROPERTY_ID || '';
const CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL || '';
const PRIVATE_KEY = (process.env.GA4_PRIVATE_KEY || '').replace(/\\n/g, '\n');

const GA4_API = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`;
const GA4_REALTIME_API = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runRealtimeReport`;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getAuth() {
  return new GoogleAuth({
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
}

async function getAccessToken() {
  const auth = getAuth();
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token;
}

async function fetchGA4Report(body: Record<string, unknown>) {
  const token = await getAccessToken();

  const res = await fetch(GA4_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GA4 API error ${res.status}: ${text}`);
  }

  return res.json();
}

async function fetchGA4Realtime(body: Record<string, unknown>) {
  const token = await getAccessToken();

  const res = await fetch(GA4_REALTIME_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GA4 Realtime API error ${res.status}: ${text}`);
  }

  return res.json();
}

function getDimensionRows(report: { rows?: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }[] }) {
  if (!report.rows) return [];
  return report.rows.map((row: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }) => ({
    dimension: row.dimensionValues?.[0]?.value || '',
    metrics: (row.metricValues || []).map((m: { value: string }) => Number(m.value)),
  }));
}

export async function GET(request: Request) {
  if (!PROPERTY_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    return NextResponse.json(
      { error: 'GA4 credentials not configured. Set GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, and GA4_PRIVATE_KEY environment variables.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '7d';
  const customStart = searchParams.get('startDate');
  const customEnd = searchParams.get('endDate');

  // Handle realtime request
  if (period === 'realtime') {
    try {
      const safeRealtime = (body: Record<string, unknown>) =>
        fetchGA4Realtime(body).catch((e) => {
          console.error('Realtime query failed:', e instanceof Error ? e.message : e);
          return { rows: [] };
        });
      const safeReport = (body: Record<string, unknown>) =>
        fetchGA4Report(body).catch((e) => {
          console.error('Report query failed:', e instanceof Error ? e.message : e);
          return { rows: [] };
        });

      // Batch 1: core realtime queries (7 calls)
      const [
        activeUsers, realtimePages, realtimeCountries, realtimeCities,
        realtimeDevices, realtimeOS, realtimeEvents,
      ] = await Promise.all([
        safeRealtime({
          metrics: [{ name: 'activeUsers' }],
        }),
        safeRealtime({
          dimensions: [{ name: 'unifiedScreenName' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 10,
        }),
        safeRealtime({
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 10,
        }),
        safeRealtime({
          dimensions: [{ name: 'city' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 10,
        }),
        safeRealtime({
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 10,
        }),
        safeRealtime({
          dimensions: [{ name: 'platform' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 10,
        }),
        // Recent events
        safeRealtime({
          dimensions: [
            { name: 'eventName' },
            { name: 'city' },
            { name: 'country' },
            { name: 'minutesAgo' },
          ],
          metrics: [{ name: 'eventCount' }],
          orderBys: [{ dimension: { dimensionName: 'minutesAgo' } }],
          limit: 50,
        }),
      ]);

      // Batch 2: today report queries (4 calls — runs after batch 1 to avoid quota)
      const [
        todaySources, todayBrowsers, todayRevenue, todayEvents,
      ] = await Promise.all([
        safeReport({
          dateRanges: [{ startDate: 'today', endDate: 'today' }],
          dimensions: [{ name: 'sessionSource' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 10,
        }),
        safeReport({
          dateRanges: [{ startDate: 'today', endDate: 'today' }],
          dimensions: [{ name: 'browser' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 10,
        }),
        safeReport({
          dateRanges: [{ startDate: 'today', endDate: 'today' }],
          metrics: [
            { name: 'totalRevenue' },
            { name: 'ecommercePurchases' },
            { name: 'averagePurchaseRevenue' },
          ],
        }),
        // Today's recent events (fallback + page/device detail)
        safeReport({
          dateRanges: [{ startDate: 'today', endDate: 'today' }],
          dimensions: [
            { name: 'eventName' },
            { name: 'city' },
            { name: 'country' },
            { name: 'dateHourMinute' },
            { name: 'pagePath' },
            { name: 'deviceCategory' },
          ],
          metrics: [{ name: 'eventCount' }],
          orderBys: [{ dimension: { dimensionName: 'dateHourMinute' }, desc: true }],
          limit: 50,
        }),
      ]);

      const totalActive = Number(activeUsers.rows?.[0]?.metricValues?.[0]?.value || 0);

      const pages = (realtimePages.rows || []).map((r: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }) => ({
        page: r.dimensionValues?.[0]?.value || '/',
        activeUsers: Number(r.metricValues?.[0]?.value || 0),
      }));

      const countries = (realtimeCountries.rows || []).map((r: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }) => ({
        country: r.dimensionValues?.[0]?.value || '',
        activeUsers: Number(r.metricValues?.[0]?.value || 0),
      }));

      const cities = (realtimeCities.rows || []).map((r: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }) => ({
        city: r.dimensionValues?.[0]?.value || '',
        activeUsers: Number(r.metricValues?.[0]?.value || 0),
      }));

      const devices = (realtimeDevices.rows || []).map((r: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }) => ({
        device: r.dimensionValues?.[0]?.value || '',
        activeUsers: Number(r.metricValues?.[0]?.value || 0),
      }));

      type RTRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };

      const sources = (todaySources.rows || []).map((r: RTRow) => ({
        source: r.dimensionValues?.[0]?.value || '(direct)',
        activeUsers: Number(r.metricValues?.[0]?.value || 0),
      }));

      const browsers = (todayBrowsers.rows || []).map((r: RTRow) => ({
        browser: r.dimensionValues?.[0]?.value || '',
        activeUsers: Number(r.metricValues?.[0]?.value || 0),
      }));

      const platforms = (realtimeOS.rows || []).map((r: RTRow) => ({
        os: r.dimensionValues?.[0]?.value || '',
        activeUsers: Number(r.metricValues?.[0]?.value || 0),
      }));

      // Build page/device lookup from today's events (keyed by event+city)
      const detailLookup = new Map<string, { page: string; device: string }>();
      for (const r of (todayEvents.rows || []) as RTRow[]) {
        const key = `${r.dimensionValues?.[0]?.value || ''}|${r.dimensionValues?.[1]?.value || ''}`;
        if (!detailLookup.has(key)) {
          detailLookup.set(key, {
            page: r.dimensionValues?.[4]?.value || '',
            device: r.dimensionValues?.[5]?.value || '',
          });
        }
      }

      const realtimeEventsParsed = (realtimeEvents.rows || []).map((r: RTRow) => {
        const eventName = r.dimensionValues?.[0]?.value || '';
        const city = r.dimensionValues?.[1]?.value || '';
        const detail = detailLookup.get(`${eventName}|${city}`) || { page: '', device: '' };
        return {
          event: eventName,
          city,
          country: r.dimensionValues?.[2]?.value || '',
          minutesAgo: Number(r.dimensionValues?.[3]?.value || 0),
          page: detail.page,
          device: detail.device,
          count: Number(r.metricValues?.[0]?.value || 0),
          live: true,
        };
      });

      // Today's events as fallback — convert dateHourMinute (YYYYMMDDHHMM) to minutesAgo
      const todayEventsParsed = (todayEvents.rows || []).map((r: RTRow) => {
        const dhm = r.dimensionValues?.[3]?.value || '';
        let minutesAgo = 0;
        if (dhm.length >= 12) {
          // Parse YYYYMMDDHHMM into a Date object (GA4 uses property timezone)
          const year = parseInt(dhm.substring(0, 4), 10);
          const month = parseInt(dhm.substring(4, 6), 10) - 1;
          const day = parseInt(dhm.substring(6, 8), 10);
          const hour = parseInt(dhm.substring(8, 10), 10);
          const min = parseInt(dhm.substring(10, 12), 10);
          const eventTime = new Date(year, month, day, hour, min);
          minutesAgo = Math.max(0, Math.round((Date.now() - eventTime.getTime()) / 60000));
        }
        return {
          event: r.dimensionValues?.[0]?.value || '',
          city: r.dimensionValues?.[1]?.value || '',
          country: r.dimensionValues?.[2]?.value || '',
          minutesAgo,
          page: r.dimensionValues?.[4]?.value || '',
          device: r.dimensionValues?.[5]?.value || '',
          count: Number(r.metricValues?.[0]?.value || 0),
          live: false,
        };
      });

      // Merge: realtime events first, then append today's older events
      // Deduplicate by event+city+page so realtime events take priority
      const seenKeys = new Set(realtimeEventsParsed.map(
        (e: { event: string; city: string; page: string }) => `${e.event}|${e.city}|${e.page}`
      ));
      const olderToday = todayEventsParsed.filter(
        (e: { event: string; city: string; page: string }) => !seenKeys.has(`${e.event}|${e.city}|${e.page}`)
      );
      const events = [...realtimeEventsParsed, ...olderToday].slice(0, 60);

      const revRow = todayRevenue?.rows?.[0];
      const revenue = {
        total: Number(revRow?.metricValues?.[0]?.value || 0),
        orders: Number(revRow?.metricValues?.[1]?.value || 0),
        avgOrderValue: Number(revRow?.metricValues?.[2]?.value || 0),
      };

      return NextResponse.json({
        realtime: true,
        activeUsers: totalActive,
        pages,
        countries,
        cities,
        devices,
        sources,
        browsers,
        platforms,
        events,
        revenue,
      }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('GA4 Realtime API error:', message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // Compute date range — prefer explicit startDate/endDate if provided
  const isCustom = period === 'custom' && customStart && customEnd;
  const isToday = period === 'today';
  const days = isToday ? 0 : period === '90d' ? 90 : period === '30d' ? 30 : 7;

  let dateRange: { startDate: string; endDate: string };
  let prevDateRange: { startDate: string; endDate: string };

  if (isCustom) {
    const start = new Date(customStart!);
    const end = new Date(customEnd!);
    const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
    const prevEnd = new Date(start.getTime() - 86400000);
    const prevStart = new Date(prevEnd.getTime() - diffDays * 86400000);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    dateRange = { startDate: fmt(start), endDate: fmt(end) };
    prevDateRange = { startDate: fmt(prevStart), endDate: fmt(prevEnd) };
  } else if (isToday) {
    dateRange = { startDate: 'today', endDate: 'today' };
    prevDateRange = { startDate: 'yesterday', endDate: 'yesterday' };
  } else if (period === 'yesterday') {
    dateRange = { startDate: 'yesterday', endDate: 'yesterday' };
    prevDateRange = { startDate: '2daysAgo', endDate: '2daysAgo' };
  } else {
    dateRange = { startDate: `${days}daysAgo`, endDate: 'today' };
    prevDateRange = { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` };
  }

  try {
    // Run all queries in parallel
    const [overview, prevOverview, pages, channels, countries, funnel] = await Promise.all([
      // Current period overview
      fetchGA4Report({
        dateRanges: [dateRange],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'ecommercePurchases' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'sessionConversionRate' },
        ],
      }),
      // Previous period overview (for trends)
      fetchGA4Report({
        dateRanges: [prevDateRange],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'ecommercePurchases' },
        ],
      }),
      // Top pages
      fetchGA4Report({
        dateRanges: [dateRange, prevDateRange],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      // Traffic channels
      fetchGA4Report({
        dateRanges: [dateRange],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),
      // Countries
      fetchGA4Report({
        dateRanges: [dateRange],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 10,
      }),
      // Funnel events
      fetchGA4Report({
        dateRanges: [dateRange],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            inListFilter: {
              values: ['session_start', 'page_view', 'add_to_cart', 'begin_checkout', 'purchase'],
            },
          },
        },
      }),
    ]);

    // Parse overview
    const row = overview.rows?.[0];
    const users = Number(row?.metricValues?.[0]?.value || 0);
    const sessions = Number(row?.metricValues?.[1]?.value || 0);
    const purchases = Number(row?.metricValues?.[2]?.value || 0);
    const avgSessionSec = Number(row?.metricValues?.[3]?.value || 0);
    const bounceRate = Number(row?.metricValues?.[4]?.value || 0);
    const conversionRate = Number(row?.metricValues?.[5]?.value || 0);

    // Previous period
    const prevRow = prevOverview.rows?.[0];
    const prevUsers = Number(prevRow?.metricValues?.[0]?.value || 0);
    const prevSessions = Number(prevRow?.metricValues?.[1]?.value || 0);
    const prevPurchases = Number(prevRow?.metricValues?.[2]?.value || 0);

    function trendPct(current: number, previous: number): string {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const pct = ((current - previous) / previous) * 100;
      return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
    }

    // Format avg session duration
    const mins = Math.floor(avgSessionSec / 60);
    const secs = Math.round(avgSessionSec % 60);

    // Parse top pages (with comparison) — deduplicate by path
    const pageRows = pages.rows || [];
    const pageMap = new Map<string, { views: number; prevViews: number }>();
    for (const r of pageRows) {
      const path = (r as { dimensionValues?: { value: string }[] }).dimensionValues?.[0]?.value || '/';
      const currentViews = Number((r as { metricValues?: { value: string }[] }).metricValues?.[0]?.value || 0);
      const prevViews = Number((r as { metricValues?: { value: string }[] }).metricValues?.[1]?.value || 0);
      const existing = pageMap.get(path);
      if (existing) {
        existing.views += currentViews;
        existing.prevViews += prevViews;
      } else {
        pageMap.set(path, { views: currentViews, prevViews });
      }
    }
    const topPages = [...pageMap.entries()]
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, 10)
      .map(([path, { views, prevViews }]) => ({
        path,
        views,
        change: trendPct(views, prevViews),
      }));

    // Parse channels
    const channelColors: Record<string, string> = {
      'Organic Video': '#ef4444',
      'Organic Shopping': '#f59e0b',
      'Cross-network': '#8b5cf6',
      'Organic Search': '#22c55e',
      'Direct': '#3b82f6',
      'Organic Social': '#ec4899',
      'Email': '#6b7280',
      'Paid Search': '#f97316',
      'Paid Social': '#a855f7',
      'Referral': '#14b8a6',
      'Display': '#eab308',
    };
    const defaultColors = ['#6366f1', '#0ea5e9', '#84cc16', '#f43f5e', '#d946ef'];

    const channelRows = getDimensionRows(channels);
    const parsedChannels = channelRows.map((r, i) => ({
      name: r.dimension,
      sessions: r.metrics[0],
      color: channelColors[r.dimension] || defaultColors[i % defaultColors.length],
    }));

    // Parse countries
    const countryRows = getDimensionRows(countries);
    const totalCountryUsers = countryRows.reduce((s, r) => s + r.metrics[0], 0) || 1;
    const parsedCountries = countryRows.map((r) => ({
      name: r.dimension,
      users: r.metrics[0],
      pct: `${((r.metrics[0] / totalCountryUsers) * 100).toFixed(1)}%`,
    }));

    // Parse funnel
    const funnelMap: Record<string, number> = {};
    const funnelRows = getDimensionRows(funnel);
    funnelRows.forEach((r) => { funnelMap[r.dimension] = r.metrics[0]; });

    const sessionCount = funnelMap['session_start'] || sessions;
    const pageViews = funnelMap['page_view'] || 0;
    const addToCart = funnelMap['add_to_cart'] || 0;
    const beginCheckout = funnelMap['begin_checkout'] || 0;
    const purchaseCount = funnelMap['purchase'] || purchases;

    const funnelPct = (v: number) => sessionCount > 0 ? `${((v / sessionCount) * 100).toFixed(1)}%` : '0%';
    const parsedFunnel = [
      { label: 'Sessions', value: sessionCount, rate: '100%' },
      { label: 'Page Views', value: pageViews, rate: funnelPct(pageViews) },
      { label: 'Add to Cart', value: addToCart, rate: funnelPct(addToCart) },
      { label: 'Checkout', value: beginCheckout, rate: funnelPct(beginCheckout) },
      { label: 'Purchase', value: purchaseCount, rate: funnelPct(purchaseCount) },
    ];

    return NextResponse.json({
      users,
      sessions,
      purchases,
      usersTrend: trendPct(users, prevUsers),
      sessionsTrend: trendPct(sessions, prevSessions),
      purchasesTrend: trendPct(purchases, prevPurchases),
      conversionRate: `${conversionRate.toFixed(1)}%`,
      avgSessionDuration: `${mins}m ${secs}s`,
      bounceRate: `${bounceRate.toFixed(1)}%`,
      topPages,
      channels: parsedChannels,
      countries: parsedCountries,
      funnel: parsedFunnel,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('GA4 API error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
