import React, { useState } from 'react';
import { SymptomEntry } from '../../types';
import { Card } from '../ui/Card';
import { Activity, Info, Calendar } from 'lucide-react';

interface PainTrendChartProps {
  entries: SymptomEntry[];
}

export const PainTrendChart: React.FC<PainTrendChartProps> = ({ entries }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Chronological order (oldest to newest) for trend progression
  const chronological = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14); // show last up to 14 entries

  if (chronological.length === 0) {
    return (
      <Card variant="default" padding="md" className="border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-slate-300">
          <Activity className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-semibold text-white font-display">
            Pain & Discomfort Trend
          </h3>
        </div>
        <p className="text-xs text-slate-400 py-6 text-center">
          Log entries to view pain variations over time.
        </p>
      </Card>
    );
  }

  // Calculate stats
  const totalPain = chronological.reduce((sum, e) => sum + e.painLevel, 0);
  const avgPain = (totalPain / chronological.length).toFixed(1);
  const zeroPainDays = chronological.filter((e) => e.painLevel === 0).length;

  // SVG Chart Dimensions
  const chartHeight = 150;
  const chartWidth = 560;
  const paddingX = 40;
  const paddingY = 25;
  const maxPain = 10;
  const minPain = 0;

  const getX = (index: number) => {
    if (chronological.length === 1) return chartWidth / 2;
    return paddingX + (index / (chronological.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    const ratio = (val - minPain) / (maxPain - minPain);
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };

  const points = chronological.map((e, idx) => ({
    x: getX(idx),
    y: getY(e.painLevel),
    entry: e,
  }));

  // Create SVG path
  const linePath = points.length > 1
    ? points.reduce((acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`), '')
    : '';

  const areaPath = points.length > 1
    ? `${linePath} L ${points[points.length - 1].x},${chartHeight - paddingY} L ${points[0].x},${chartHeight - paddingY} Z`
    : '';

  const avgY = getY(parseFloat(avgPain));

  return (
    <Card variant="default" padding="md" className="border-slate-800">
      {/* Header with Title & Summary Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white font-display">
              Pain & Discomfort Trend
            </h3>
            <p className="text-[11px] text-slate-400">
              Severity across recent records (0: None to 10: Severe)
            </p>
          </div>
        </div>

        {/* Metric pills */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 font-mono">
            Avg: <strong className="text-rose-300 font-bold">{avgPain}</strong>/10
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
            {zeroPainDays} {zeroPainDays === 1 ? 'day' : 'days'} pain-free
          </span>
        </div>
      </div>

      {/* SVG Visualization */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#F43F5E" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines (0, 3, 6, 10) */}
          {[0, 3, 6, 10].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingX - 10}
                  y1={y}
                  x2={chartWidth - paddingX + 10}
                  y2={y}
                  stroke="#1E293B"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? undefined : '3 3'}
                />
                <text
                  x={paddingX - 16}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-500 text-[9px] font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Average pain reference line */}
          <line
            x1={paddingX}
            y1={avgY}
            x2={chartWidth - paddingX}
            y2={avgY}
            stroke="#A78BFA"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.75"
          />
          <text
            x={chartWidth - paddingX + 6}
            y={avgY + 3}
            className="fill-violet-400 text-[9px] font-mono font-medium"
          >
            avg
          </text>

          {/* Area fill */}
          {areaPath && <path d={areaPath} fill="url(#painGradient)" />}

          {/* Trend line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#F43F5E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points */}
          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g
                key={p.entry.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Invisible hover target */}
                <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                {/* Outer halo */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? '8' : '4.5'}
                  fill={p.entry.painLevel === 0 ? '#10B981' : '#F43F5E'}
                  className="transition-all duration-150"
                  opacity={isHovered ? '0.4' : '0.2'}
                />

                {/* Core dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? '5' : '3.5'}
                  fill={p.entry.painLevel === 0 ? '#10B981' : '#FB7185'}
                  stroke="#090E1A"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />

                {/* Date label underneath */}
                {(idx === 0 || idx === points.length - 1 || idx % 2 === 0) && (
                  <text
                    x={p.x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="fill-slate-500 text-[9px] font-mono"
                  >
                    {p.entry.date.slice(5)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Hover Tooltip */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-[#0B1120] border border-slate-700 shadow-xl shadow-black/80 text-left min-w-[170px] transform -translate-x-1/2 transition-transform duration-75"
            style={{
              left: `${(points[hoveredIdx].x / chartWidth) * 100}%`,
              top: '8px',
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1 mb-1.5">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-violet-400" />
                {points[hoveredIdx].entry.date}
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                points[hoveredIdx].entry.painLevel === 0
                  ? 'bg-emerald-950 text-emerald-300'
                  : points[hoveredIdx].entry.painLevel <= 3
                  ? 'bg-sky-950 text-sky-300'
                  : 'bg-rose-950 text-rose-300'
              }`}>
                Pain {points[hoveredIdx].entry.painLevel}/10
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="text-slate-300">
                <span className="text-slate-500">Location:</span>{' '}
                <span className="font-medium text-white">
                  {points[hoveredIdx].entry.painLocation}
                </span>
              </div>
              {points[hoveredIdx].entry.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {points[hoveredIdx].entry.symptoms.map((s) => (
                    <span
                      key={s}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {points[hoveredIdx].entry.notes && (
                <p className="text-[10px] text-slate-400 italic pt-1 line-clamp-2 border-t border-slate-800/80">
                  "{points[hoveredIdx].entry.notes}"
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend & Guide */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 mt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            Reported Pain Level
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-violet-400 inline-block border-t border-dashed border-violet-400" />
            Average Pain ({avgPain})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            Pain-Free (0)
          </span>
        </div>
        <span className="text-slate-500 text-[10px] italic">
          Hover data point for details
        </span>
      </div>
    </Card>
  );
};
