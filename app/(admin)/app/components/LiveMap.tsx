'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Public Mapbox token. Set NEXT_PUBLIC_MAPBOX_TOKEN in your env.
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Lat/Lon for country centers (lng, lat)
const COUNTRY_LATLNG: Record<string, [number, number]> = {
  'United States': [-98.5, 39.8],
  'Canada': [-106.3, 56.1],
  'Mexico': [-102.5, 23.6],
  'Brazil': [-51.9, -14.2],
  'Argentina': [-63.6, -38.4],
  'Colombia': [-74.3, 4.6],
  'Chile': [-71.5, -35.7],
  'Peru': [-75.0, -9.2],
  'United Kingdom': [-3.4, 55.4],
  'France': [2.2, 46.2],
  'Germany': [10.4, 51.2],
  'Spain': [-3.7, 40.5],
  'Italy': [12.6, 41.9],
  'Netherlands': [5.3, 52.1],
  'Belgium': [4.5, 50.5],
  'Switzerland': [8.2, 46.8],
  'Austria': [14.6, 47.5],
  'Poland': [19.1, 51.9],
  'Sweden': [18.6, 60.1],
  'Norway': [8.5, 60.5],
  'Denmark': [9.5, 56.3],
  'Finland': [25.7, 61.9],
  'Ireland': [-8.2, 53.4],
  'Portugal': [-8.2, 39.4],
  'Greece': [21.8, 39.1],
  'Turkey': [35.2, 38.9],
  'Russia': [105.3, 61.5],
  'Ukraine': [31.2, 48.4],
  'Romania': [24.9, 45.9],
  'Czechia': [15.5, 49.8],
  'Hungary': [19.5, 47.2],
  'India': [78.9, 20.6],
  'China': [104.2, 35.9],
  'Japan': [138.3, 36.2],
  'South Korea': [127.8, 35.9],
  'Australia': [133.8, -25.3],
  'New Zealand': [174.9, -40.9],
  'Indonesia': [113.9, -0.8],
  'Thailand': [100.9, 15.9],
  'Vietnam': [108.3, 14.1],
  'Philippines': [121.8, 12.9],
  'Malaysia': [101.9, 4.2],
  'Singapore': [103.8, 1.35],
  'Pakistan': [69.3, 30.4],
  'Bangladesh': [90.4, 23.7],
  'Sri Lanka': [80.8, 7.9],
  'Nepal': [84.1, 28.4],
  'Saudi Arabia': [45.1, 23.9],
  'United Arab Emirates': [53.8, 23.4],
  'Israel': [34.9, 31.0],
  'Egypt': [30.8, 26.8],
  'South Africa': [22.9, -30.6],
  'Nigeria': [8.7, 9.1],
  'Kenya': [37.9, -0.02],
  'Ethiopia': [40.5, 9.1],
  'Ghana': [-1.0, 7.9],
  'Morocco': [-7.1, 31.8],
};

// Lat/Lon for major cities (lng, lat)
const CITY_LATLNG: Record<string, [number, number]> = {
  'New York': [-74.0, 40.7],
  'Los Angeles': [-118.2, 34.1],
  'Chicago': [-87.6, 41.9],
  'Houston': [-95.4, 29.8],
  'Phoenix': [-112.1, 33.4],
  'Philadelphia': [-75.2, 40.0],
  'San Antonio': [-98.5, 29.4],
  'San Diego': [-117.2, 32.7],
  'Dallas': [-96.8, 32.8],
  'San Francisco': [-122.4, 37.8],
  'Austin': [-97.7, 30.3],
  'Seattle': [-122.3, 47.6],
  'Denver': [-105.0, 39.7],
  'Boston': [-71.1, 42.4],
  'Miami': [-80.2, 25.8],
  'Atlanta': [-84.4, 33.7],
  'London': [-0.13, 51.5],
  'Paris': [2.35, 48.85],
  'Berlin': [13.4, 52.5],
  'Madrid': [-3.7, 40.4],
  'Rome': [12.5, 41.9],
  'Amsterdam': [4.9, 52.4],
  'Dublin': [-6.3, 53.3],
  'Toronto': [-79.4, 43.7],
  'Vancouver': [-123.1, 49.3],
  'Montreal': [-73.6, 45.5],
  'Sydney': [151.2, -33.9],
  'Melbourne': [144.9, -37.8],
  'Tokyo': [139.7, 35.7],
  'Seoul': [126.98, 37.57],
  'Singapore': [103.8, 1.35],
  'Mumbai': [72.88, 19.08],
  'Delhi': [77.1, 28.7],
  'Bangalore': [77.6, 12.97],
  'Hong Kong': [114.17, 22.32],
  'Dubai': [55.3, 25.2],
  'São Paulo': [-46.6, -23.5],
  'Mexico City': [-99.1, 19.4],
  'Buenos Aires': [-58.4, -34.6],
};

interface LiveMapProps {
  countries: { country: string; activeUsers: number }[];
  cities?: { city: string; activeUsers: number }[];
  height?: number;
}

type Point = { lng: number; lat: number; label: string; users: number; kind: 'city' | 'country' };

export default function LiveMap({ countries, cities = [], height = 420 }: LiveMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!container.current || mapRef.current || !MAPBOX_TOKEN) return;
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: container.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [0, 20],
        zoom: 1.2,
        projection: 'mercator',
        attributionControl: false,
      });
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      mapRef.current = map;

      // Log and surface any mapbox errors (token issues, tile failures).
      map.on('error', (e: { error?: Error & { status?: number } }) => {
        const msg = e?.error?.message || 'Unknown map error';
        const status = e?.error?.status;
        console.error('[Mapbox]', msg, e);
        setMapError(status ? `${msg} (HTTP ${status})` : msg);
      });

      // Trigger resize after load — handles 0-sized parent containers
      // (e.g. hidden tab at mount) and forces tile loading.
      map.on('load', () => {
        map.resize();
        setMapError(null);
      });

      // Fallback: call resize() a few times after mount in case the
      // ResizeObserver doesn't fire (e.g. container already had its
      // final size but the canvas was created before paint).
      const t1 = setTimeout(() => mapRef.current?.resize(), 100);
      const t2 = setTimeout(() => mapRef.current?.resize(), 500);
      const t3 = setTimeout(() => mapRef.current?.resize(), 1500);

      // Observe container size changes and resize the map.
      const ro = new ResizeObserver(() => {
        mapRef.current?.resize();
      });
      ro.observe(container.current);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        ro.disconnect();
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Mapbox] init failed:', msg);
      setMapError(msg);
    }
  }, []);

  // Update markers whenever data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyMarkers = () => {
      markers.current.forEach((m) => m.remove());
      markers.current = [];

      const points: Point[] = [];
      cities.forEach((c) => {
        const coord = CITY_LATLNG[c.city];
        if (coord) points.push({ lng: coord[0], lat: coord[1], label: c.city, users: c.activeUsers, kind: 'city' });
      });
      countries.forEach((c) => {
        const coord = COUNTRY_LATLNG[c.country];
        if (!coord) return;
        const hasCity = points.some((p) => p.kind === 'city' && Math.abs(p.lng - coord[0]) < 3 && Math.abs(p.lat - coord[1]) < 3);
        if (hasCity) return;
        points.push({ lng: coord[0], lat: coord[1], label: c.country, users: c.activeUsers, kind: 'country' });
      });

      points.forEach((p) => {
        const el = document.createElement('div');
        el.style.cssText = `
          position: relative; width: 14px; height: 14px;
          background: #22c55e; border: 2px solid #ffffff;
          border-radius: 50%; box-shadow: 0 0 0 4px rgba(34,197,94,0.25), 0 0 12px rgba(34,197,94,0.7);
          cursor: pointer;
        `;
        const pulse = document.createElement('div');
        pulse.style.cssText = `
          position: absolute; inset: -6px; border-radius: 50%;
          border: 2px solid #22c55e; animation: lm-pulse 2s ease-out infinite;
        `;
        el.appendChild(pulse);

        const popup = new mapboxgl.Popup({ offset: 18, closeButton: false, closeOnClick: false }).setHTML(
          `<div style="font-family: inherit; font-size: 12px; padding: 4px 2px;">
             <div style="font-weight:700; color:#111;">${p.label}</div>
             <div style="color:#555;">${p.users} active ${p.users === 1 ? 'user' : 'users'}</div>
           </div>`
        );

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([p.lng, p.lat])
          .setPopup(popup)
          .addTo(map);
        el.addEventListener('mouseenter', () => marker.togglePopup());
        el.addEventListener('mouseleave', () => marker.togglePopup());
        markers.current.push(marker);
      });
    };

    if (map.isStyleLoaded()) applyMarkers();
    else map.once('load', applyMarkers);
  }, [countries, cities]);

  if (!MAPBOX_TOKEN) {
    return (
      <div
        style={{
          width: '100%',
          height,
          borderRadius: 'var(--radius)',
          border: '1px dashed var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.8rem',
          padding: 16,
          textAlign: 'center',
        }}
      >
        Set NEXT_PUBLIC_MAPBOX_TOKEN to enable the visitor map.
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes lm-pulse {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .mapboxgl-popup-content { background: #fff; border-radius: 6px; padding: 8px 10px; }
        .mapboxgl-popup-tip { border-top-color: #fff !important; border-bottom-color: #fff !important; }
      `}</style>
      <div style={{ position: 'relative', width: '100%', height }}>
        <div
          ref={container}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        />
        {mapError && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              right: 16,
              padding: '10px 14px',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 8,
              color: '#fca5a5',
              fontSize: '0.78rem',
              fontFamily: 'monospace',
              pointerEvents: 'none',
            }}
          >
            Mapbox error: {mapError}
          </div>
        )}
      </div>
    </>
  );
}
