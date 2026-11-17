import React, { useState } from 'react';
import { PieChart as PieIcon, BarChart3, Info } from 'lucide-react';

export interface ChartDataPoint {
  label: string;
  count: number;
  color?: string;
  id?: string;
}

export const CHART_PALETTE = [
  '#06b6d4', // cyan-500
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#64748b', // slate-500
];

/**
 * Helper to compute SVG Donut Slice Path
 */
function getSlicePath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngleDeg: number,
  endAngleDeg: number
): string {
  // Convert degrees to radians (offset by -90 to start at 12 o'clock)
  const degToRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const startRad = degToRad(startAngleDeg);
  const endRad = degToRad(endAngleDeg);

  const x1 = cx + rOuter * Math.cos(startRad);
  const y1 = cy + rOuter * Math.sin(startRad);
  const x2 = cx + rOuter * Math.cos(endRad);
  const y2 = cy + rOuter * Math.sin(endRad);

  const x3 = cx + rInner * Math.cos(endRad);
  const y3 = cy + rInner * Math.sin(endRad);
  const x4 = cx + rInner * Math.cos(startRad);
  const y4 = cy + rInner * Math.sin(startRad);

  const largeArcFlag = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}

// ============================================================================
// 1. FORMS DONUT / PIE CHART (Google Forms Style)
// ============================================================================
interface FormsDonutChartProps {
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
  size?: number;
  centerLabel?: string;
  centerSublabel?: string;
  showLegend?: boolean;
}

export const FormsDonutChart: React.FC<FormsDonutChartProps> = ({
  data,
  title,
  subtitle,
  size = 200,
  centerLabel,
  centerSublabel,
  showLegend = true,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-cyan-300/60 font-medium text-xs">
        <Info className="h-6 w-6 mb-1 opacity-60" />
        <span>Sin respuestas registradas para este gráfico</span>
      </div>
    );
  }

  // Pre-calculate angle slices
  let currentAngle = 0;
  const slices = data
    .filter((d) => d.count > 0)
    .map((item, idx) => {
      const sliceAngle = (item.count / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;
      const color = item.color || CHART_PALETTE[idx % CHART_PALETTE.length];
      const pct = Math.round((item.count / total) * 100);

      return {
        ...item,
        startAngle,
        endAngle,
        sliceAngle,
        pct,
        color,
        idx,
      };
    });

  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.44;
  const rInner = size * 0.26;

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="space-y-3 font-body">
      {(title || subtitle) && (
        <div>
          {title && <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">{title}</h5>}
          {subtitle && <p className="text-[11px] text-slate-500 dark:text-cyan-200/70">{subtitle}</p>}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* SVG Donut */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
            {slices.length === 1 ? (
              // If only 1 item has 100%, render a full circle stroke
              <circle
                cx={cx}
                cy={cy}
                r={(rOuter + rInner) / 2}
                fill="none"
                stroke={slices[0].color}
                strokeWidth={rOuter - rInner}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(0)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ) : (
              slices.map((slice, i) => {
                const isHovered = hoveredIdx === i;
                const path = getSlicePath(
                  cx,
                  cy,
                  isHovered ? rOuter + 4 : rOuter,
                  isHovered ? rInner - 2 : rInner,
                  slice.startAngle,
                  slice.endAngle
                );

                return (
                  <path
                    key={slice.label + i}
                    d={path}
                    fill={slice.color}
                    className="transition-all duration-200 cursor-pointer hover:opacity-90"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth={1.5}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                );
              })
            )}
          </svg>

          {/* Central Donut Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
            <span className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white leading-none font-display">
              {activeSlice ? `${activeSlice.pct}%` : centerLabel || total}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-cyan-200/80 leading-tight mt-0.5 max-w-[85px] truncate">
              {activeSlice ? activeSlice.label : centerSublabel || 'Respuestas'}
            </span>
          </div>
        </div>

        {/* Legend (Google Forms style) */}
        {showLegend && (
          <div className="flex-1 w-full max-w-xs space-y-1.5 text-xs">
            {slices.map((item, i) => {
              const isHovered = hoveredIdx === i;
              return (
                <div
                  key={item.label + i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`flex items-center justify-between gap-2 p-1.5 rounded-xl transition cursor-pointer ${
                    isHovered
                      ? 'bg-cyan-50 dark:bg-cyan-950/60 ring-1 ring-cyan-400/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-3 w-3 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={item.label}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{item.count}</span>
                    <span className="text-[11px] text-slate-400 dark:text-cyan-300/70">({item.pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 2. FORMS HORIZONTAL / VERTICAL BAR CHART (Google Forms Style)
// ============================================================================
interface FormsBarChartProps {
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
  orientation?: 'horizontal' | 'vertical';
  showPercentages?: boolean;
}

export const FormsBarChart: React.FC<FormsBarChartProps> = ({
  data,
  title,
  subtitle,
  orientation = 'horizontal',
  showPercentages = true,
}) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-cyan-300/60 font-medium text-xs">
        <Info className="h-6 w-6 mb-1 opacity-60" />
        <span>Sin respuestas registradas para este gráfico</span>
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div className="space-y-3 font-body">
        {(title || subtitle) && (
          <div>
            {title && <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">{title}</h5>}
            {subtitle && <p className="text-[11px] text-slate-500 dark:text-cyan-200/70">{subtitle}</p>}
          </div>
        )}

        <div className="pt-4 pb-2">
          <div className="flex items-end justify-around gap-2 sm:gap-3 h-44 px-2 border-b border-slate-200 dark:border-cyan-800/60">
            {data.map((item, idx) => {
              const heightPct = Math.max(6, Math.round((item.count / maxCount) * 100));
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              const color = item.color || CHART_PALETTE[idx % CHART_PALETTE.length];

              return (
                <div key={item.label + idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[11px] font-mono font-bold text-slate-600 dark:text-cyan-200 mb-1 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition">
                    {item.count}
                  </div>
                  <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800/80 rounded-t-xl overflow-hidden h-full flex items-end p-0.5 border border-white/60 dark:border-cyan-500/20 shadow-2xs">
                    <div
                      className="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    />
                  </div>
                  <div className="mt-2 text-center w-full">
                    <span className="block text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[65px] mx-auto" title={item.label}>
                      {item.label}
                    </span>
                    {showPercentages && (
                      <span className="block text-[9px] font-mono text-slate-400 dark:text-cyan-300/60">
                        {pct}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Horizontal Mode (Google Forms Default)
  return (
    <div className="space-y-3 font-body">
      {(title || subtitle) && (
        <div>
          {title && <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">{title}</h5>}
          {subtitle && <p className="text-[11px] text-slate-500 dark:text-cyan-200/70">{subtitle}</p>}
        </div>
      )}

      <div className="space-y-2.5">
        {data.map((item, idx) => {
          const widthPct = Math.max(3, Math.round((item.count / maxCount) * 100));
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const color = item.color || CHART_PALETTE[idx % CHART_PALETTE.length];

          return (
            <div key={item.label + idx} className="space-y-1 group">
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={item.label}>
                  {item.label}
                </span>
                <span className="text-slate-500 font-mono font-bold shrink-0">
                  {item.count}{' '}
                  {showPercentages && <span className="font-normal text-slate-400">({pct}%)</span>}
                </span>
              </div>

              <div className="h-3.5 w-full bg-white/70 dark:bg-slate-900/60 rounded-full overflow-hidden p-0.5 border border-white/80 dark:border-cyan-500/20 shadow-2xs">
                <div
                  className="h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: color,
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 3. FORMS STACKED LIKERT MATRIX CHART (For Matrix / Scale Questions)
// ============================================================================
export interface LikertColumn {
  id: string;
  label: string;
  color: string;
}

export interface LikertRow {
  id: string;
  label: string;
  counts: Record<string, number>;
}

interface FormsStackedLikertChartProps {
  columns: LikertColumn[];
  rows: LikertRow[];
  title?: string;
  subtitle?: string;
}

export const FormsStackedLikertChart: React.FC<FormsStackedLikertChartProps> = ({
  columns,
  rows,
  title,
  subtitle,
}) => {
  return (
    <div className="space-y-4 font-body">
      {(title || subtitle) && (
        <div>
          {title && <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">{title}</h5>}
          {subtitle && <p className="text-[11px] text-slate-500 dark:text-cyan-200/70">{subtitle}</p>}
        </div>
      )}

      {/* Global Likert Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/80 dark:border-cyan-500/20 text-xs">
        {columns.map((col) => (
          <div key={col.id} className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md shrink-0 shadow-2xs" style={{ backgroundColor: col.color }} />
            <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">{col.label}</span>
          </div>
        ))}
      </div>

      {/* Stacked Rows */}
      <div className="space-y-3 pt-1">
        {rows.map((row) => {
          const rowTotal = Object.values(row.counts).reduce((s, c) => s + c, 0);

          return (
            <div
              key={row.id}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 space-y-2"
            >
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">{row.label}</span>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  {rowTotal} {rowTotal === 1 ? 'respuesta' : 'respuestas'}
                </span>
              </div>

              {/* Stacked Bar */}
              {rowTotal === 0 ? (
                <div className="h-6 w-full rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 italic">
                  Sin respuestas aún
                </div>
              ) : (
                <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-2xs border border-white/70 dark:border-cyan-500/20 p-0.5 bg-slate-200/50 dark:bg-slate-900/50">
                  {columns.map((col) => {
                    const count = row.counts[col.id] || 0;
                    if (count === 0) return null;
                    const pct = Math.round((count / rowTotal) * 100);

                    return (
                      <div
                        key={col.id}
                        style={{ width: `${(count / rowTotal) * 100}%`, backgroundColor: col.color }}
                        className="h-full flex items-center justify-center text-[10px] font-bold text-white transition-all hover:brightness-110 cursor-pointer first:rounded-l-lg last:rounded-r-lg"
                        title={`${col.label}: ${count} (${pct}%)`}
                      >
                        {pct >= 10 && <span>{pct}%</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 4. CHART TOGGLE BUTTON (Circle / Bars)
// ============================================================================
interface ChartTypeSwitchProps {
  currentType: 'pie' | 'bar';
  onChange: (type: 'pie' | 'bar') => void;
}

export const ChartTypeSwitch: React.FC<ChartTypeSwitchProps> = ({ currentType, onChange }) => {
  return (
    <div className="inline-flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => onChange('pie')}
        title="Ver gráfico circular (Pie)"
        className={`p-1.5 rounded-full transition cursor-pointer ${
          currentType === 'pie'
            ? 'bg-white dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 shadow-2xs'
            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
      >
        <PieIcon className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => onChange('bar')}
        title="Ver gráfico de barras"
        className={`p-1.5 rounded-full transition cursor-pointer ${
          currentType === 'bar'
            ? 'bg-white dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 shadow-2xs'
            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
      >
        <BarChart3 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
