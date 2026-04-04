'use client';

// Country center coordinates (x, y) on a 1000x500 equirectangular projection
const COUNTRY_COORDS: Record<string, [number, number]> = {
  'United States': [200, 190],
  'Canada': [210, 130],
  'Mexico': [180, 240],
  'Brazil': [340, 330],
  'Argentina': [310, 400],
  'Colombia': [280, 270],
  'Chile': [300, 390],
  'Peru': [280, 310],
  'United Kingdom': [475, 140],
  'France': [490, 170],
  'Germany': [510, 155],
  'Spain': [480, 185],
  'Italy': [515, 180],
  'Netherlands': [500, 150],
  'Belgium': [495, 155],
  'Switzerland': [505, 168],
  'Austria': [520, 165],
  'Poland': [530, 150],
  'Sweden': [520, 115],
  'Norway': [510, 105],
  'Denmark': [510, 135],
  'Finland': [545, 110],
  'Ireland': [465, 140],
  'Portugal': [470, 190],
  'Greece': [540, 190],
  'Turkey': [575, 185],
  'Russia': [650, 130],
  'Ukraine': [560, 155],
  'Romania': [545, 170],
  'Czechia': [520, 155],
  'Hungary': [530, 168],
  'India': [680, 240],
  'China': [740, 195],
  'Japan': [810, 185],
  'South Korea': [790, 190],
  'Australia': [810, 380],
  'New Zealand': [860, 415],
  'Indonesia': [760, 310],
  'Thailand': [730, 260],
  'Vietnam': [740, 255],
  'Philippines': [780, 260],
  'Malaysia': [740, 285],
  'Singapore': [740, 295],
  'Pakistan': [655, 225],
  'Bangladesh': [700, 240],
  'Sri Lanka': [685, 275],
  'Nepal': [685, 225],
  'Saudi Arabia': [600, 235],
  'United Arab Emirates': [625, 240],
  'Israel': [575, 210],
  'Egypt': [560, 225],
  'South Africa': [555, 395],
  'Nigeria': [510, 270],
  'Kenya': [575, 300],
  'Ethiopia': [580, 275],
  'Ghana': [490, 270],
  'Morocco': [470, 210],
  'Tanzania': [575, 320],
  'Algeria': [495, 210],
  '(not set)': [500, 250],
};

// Simplified land mass dots for background
function generateLandDots(): [number, number][] {
  const regions: [number, number, number, number][] = [
    [130, 280, 100, 250], [150, 230, 80, 120], // North America
    [170, 210, 240, 280], // Central America
    [260, 370, 270, 440], // South America
    [460, 570, 110, 200], // Europe
    [460, 590, 200, 410], // Africa
    [570, 640, 190, 250], // Middle East
    [560, 800, 90, 160],  // Russia/Central Asia
    [640, 720, 200, 280], // South Asia
    [720, 810, 150, 250], // East Asia
    [720, 790, 250, 310], // Southeast Asia
    [770, 860, 340, 410], // Australia
    [790, 820, 170, 200], // Japan/Korea
  ];
  const dots: [number, number][] = [];
  for (const [xMin, xMax, yMin, yMax] of regions) {
    for (let x = xMin; x <= xMax; x += 12) {
      for (let y = yMin; y <= yMax; y += 12) {
        dots.push([x, y]);
      }
    }
  }
  return dots;
}

const LAND_DOTS = generateLandDots();

interface WorldMapProps {
  countries: { country: string; activeUsers: number }[];
}

export default function WorldMap({ countries }: WorldMapProps) {
  const maxUsers = Math.max(...countries.map((c) => c.activeUsers), 1);

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 24,
    }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>Visitor Map</h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 16 }}>Active users by location</p>

      <svg viewBox="0 0 1000 500" style={{ width: '100%', height: 'auto', maxHeight: 350 }}>
        {/* Land dots */}
        {LAND_DOTS.map(([x, y], i) => (
          <circle key={`l${i}`} cx={x} cy={y} r={1.5} fill="var(--text-dim)" opacity={0.15} />
        ))}

        {/* Country highlights */}
        {countries.map((c) => {
          const coords = COUNTRY_COORDS[c.country];
          if (!coords) return null;
          const [cx, cy] = coords;
          const intensity = Math.min(c.activeUsers / maxUsers, 1);
          const radius = 6 + intensity * 14;

          return (
            <g key={c.country}>
              {/* Pulsing ring */}
              <circle cx={cx} cy={cy} r={radius + 8} fill="none" stroke="var(--green)" strokeWidth={1} opacity={0.3}>
                <animate attributeName="r" from={String(radius + 4)} to={String(radius + 20)} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Glow */}
              <circle cx={cx} cy={cy} r={radius} fill="var(--green)" opacity={0.15 + intensity * 0.15} />
              {/* Core */}
              <circle cx={cx} cy={cy} r={4 + intensity * 4} fill="var(--green)" opacity={0.7 + intensity * 0.3} />
              {/* Label */}
              <text x={cx} y={cy - radius - 6} textAnchor="middle" fill="var(--text)" fontSize={11} fontWeight={600}>
                {c.country}
              </text>
              <text x={cx} y={cy - radius + 6} textAnchor="middle" fill="var(--green)" fontSize={10} fontWeight={700}>
                {c.activeUsers}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
