'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface DateRangeSliderProps {
  start: Date;
  end: Date;
  onChange: (start: Date, end: Date) => void;
  monthsBack?: number; // how many months the full timeline spans
}

const MS_PER_DAY = 86400000;
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatLabel(d: Date): string {
  return `${MONTH_LABELS[d.getMonth()]} ${d.getDate()}`;
}

function stripTime(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export default function DateRangeSlider({ start, end, onChange, monthsBack = 14 }: DateRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragMode, setDragMode] = useState<'left' | 'right' | 'middle' | null>(null);
  const dragOffset = useRef(0);

  // Timeline: from `monthsBack` months before today, to today
  const { minDate, maxDate, totalDays, monthTicks } = useMemo(() => {
    const max = stripTime(new Date());
    const min = new Date(max);
    min.setMonth(min.getMonth() - monthsBack);
    const total = Math.round((max.getTime() - min.getTime()) / MS_PER_DAY);

    const ticks: { date: Date; pct: number; label: string }[] = [];
    const cursor = new Date(min.getFullYear(), min.getMonth(), 1);
    while (cursor <= max) {
      const pct = (cursor.getTime() - min.getTime()) / (max.getTime() - min.getTime());
      if (pct >= 0 && pct <= 1) {
        ticks.push({
          date: new Date(cursor),
          pct,
          label: MONTH_LABELS[cursor.getMonth()],
        });
      }
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return { minDate: min, maxDate: max, totalDays: total, monthTicks: ticks };
  }, [monthsBack]);

  const totalMs = maxDate.getTime() - minDate.getTime();
  const startPct = Math.max(0, Math.min(1, (start.getTime() - minDate.getTime()) / totalMs));
  const endPct = Math.max(0, Math.min(1, (end.getTime() - minDate.getTime()) / totalMs));

  const dateFromPct = useCallback(
    (pct: number) => {
      const clamped = Math.max(0, Math.min(1, pct));
      const d = new Date(minDate.getTime() + clamped * totalMs);
      return stripTime(d);
    },
    [minDate, totalMs]
  );

  const handlePointerDown = (mode: 'left' | 'right' | 'middle') => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === 'middle' && trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const clickPct = (e.clientX - rect.left) / rect.width;
      dragOffset.current = clickPct - startPct;
    }
    setDragMode(mode);
  };

  useEffect(() => {
    if (!dragMode) return;

    const handleMove = (e: PointerEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;

      if (dragMode === 'left') {
        const newStart = dateFromPct(pct);
        if (newStart.getTime() < end.getTime() - MS_PER_DAY) {
          onChange(newStart, end);
        }
      } else if (dragMode === 'right') {
        const newEnd = dateFromPct(pct);
        if (newEnd.getTime() > start.getTime() + MS_PER_DAY) {
          onChange(start, newEnd);
        }
      } else if (dragMode === 'middle') {
        const rangeWidthPct = endPct - startPct;
        let newStartPct = pct - dragOffset.current;
        newStartPct = Math.max(0, Math.min(1 - rangeWidthPct, newStartPct));
        const newStart = dateFromPct(newStartPct);
        const newEnd = dateFromPct(newStartPct + rangeWidthPct);
        onChange(newStart, newEnd);
      }
    };

    const handleUp = () => setDragMode(null);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragMode, dateFromPct, onChange, start, end, startPct, endPct]);

  const rangeLabel = `${formatLabel(start)} – ${formatLabel(end)}`;

  return (
    <div style={{ flex: 1, minWidth: 360, maxWidth: 680, userSelect: 'none' }}>
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          height: 54,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border)',
          touchAction: 'none',
        }}
      >
        {/* Month ticks */}
        {monthTicks.map((t, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${t.pct * 100}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: 'rgba(255,255,255,0.04)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Month labels */}
        {monthTicks.map((t, i) => (
          <div
            key={`l-${i}`}
            style={{
              position: 'absolute',
              left: `${t.pct * 100}%`,
              bottom: 4,
              transform: 'translateX(-50%)',
              fontSize: '0.6rem',
              color: 'var(--text-dim)',
              pointerEvents: 'none',
            }}
          >
            {t.label}
          </div>
        ))}

        {/* Selected range */}
        <div
          onPointerDown={handlePointerDown('middle')}
          style={{
            position: 'absolute',
            left: `${startPct * 100}%`,
            width: `${(endPct - startPct) * 100}%`,
            top: 0,
            bottom: 0,
            background: 'rgba(59,130,246,0.22)',
            border: '1px solid rgba(59,130,246,0.7)',
            borderRadius: 4,
            cursor: 'grab',
          }}
        >
          {/* Range label */}
          <div
            style={{
              position: 'absolute',
              top: -22,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#fff',
              background: 'var(--accent)',
              padding: '2px 8px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {rangeLabel}
          </div>
        </div>

        {/* Left handle */}
        <div
          onPointerDown={handlePointerDown('left')}
          style={{
            position: 'absolute',
            left: `${startPct * 100}%`,
            top: 0,
            bottom: 0,
            width: 10,
            marginLeft: -5,
            cursor: 'ew-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 3, height: 20, background: 'var(--accent)', borderRadius: 2 }} />
        </div>

        {/* Right handle */}
        <div
          onPointerDown={handlePointerDown('right')}
          style={{
            position: 'absolute',
            left: `${endPct * 100}%`,
            top: 0,
            bottom: 0,
            width: 10,
            marginLeft: -5,
            cursor: 'ew-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 3, height: 20, background: 'var(--accent)', borderRadius: 2 }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.65rem', color: 'var(--text-dim)' }}>
        <span>{totalDays} days timeline</span>
        <span>Drag handles or the range to adjust</span>
      </div>
    </div>
  );
}
