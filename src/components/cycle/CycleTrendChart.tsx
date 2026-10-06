import React, { useState } from 'react';
import { CycleEntry } from '../../types';
import { Card } from '../ui/Card';
import { TrendingUp, Info } from 'lucide-react';

interface CycleTrendChartProps {
  cycles: CycleEntry[];
  averageCycleLength: number;
}

export const CycleTrendChart: React.FC<CycleTrendChartProps> = ({
  cycles,
  averageCycleLength,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Take chronological order (oldest to newest) for a trend line
  const chronological = [...cycles]
    .filter((c) => typeof c.cycleLengthDays === 'number' && c.cycleLengthDays > 0)
    .sort((a, b) => (a.startDate > b.startDate ? 1 : -1))
    .slice(-6); // show last up to 6 cycles

  if (chronological.length === 0) {
    return (
      <Card variant="default" padding="md" className="border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-slate-300">
          <TrendingUp className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white font-display">
            Cycle Length Trend
          </h3>
        </div>
        <p className="text-xs text-slate-400 py-6 text-center">
          Log at least two completed cycles to display historical cycle length trends.
        </p>
      </Card>
    );
  }

  // Chart dimensions
  const minVal = Math.min(...chronological.map((c) => c.cycleLengthDays || 28), averageCycleLength) - 3;
  const maxVal = Math.max(...chronological.map((c) => c.cycleLengthDays || 28), averageCycleLength) + 3;
  const range = maxVal - minVal || 1;

  const chartHeight = 130;
  const chartWidth = 500;
  const paddingX = 45;
  const paddingY = 25;

  const getX = (index: number) => {
    if (chronological.length === 1) return chartWidth / 2;
    return paddingX + (index / (chronological.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    const ratio = (val - minVal) / range;
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };

  const points = chronological.map((c, i) => ({
    x: getX(i),
    y: getY(c.cycleLengthDays || 28),
    length: c.cycleLengthDays || 28,
    date: c.startDate,
    duration: c.periodDurationDays,
    notes: c.notes,
  }));

  const pathD = points.length > 1
    ? points.reduce((acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`), '')
    : '';

  const avgY = getY(averageCycleLength);

  return (
    <Card variant="default" padding="md" className="border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-600/15 border border-violet-500/30 text-violet-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white font-display">
              Cycle Length Trend
            </h3>
            <p className="text-[11px] text-slate-400">
              Historical days between period start dates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Recorded Cycle</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-0.5 border-t border-dashed border-violet-400" />
            <span>Avg ({averageCycleLength}d)</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-[340px]">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Grid background lines */}
            <line
              x1={paddingX - 10}
              y1={chartHeight - paddingY}
              x2={chartWidth - paddingX + 10}
              y2={chartHeight - paddingY}
              stroke="#1E293B"
              strokeWidth="1"
            />
            <line
              x1={paddingX - 10}
              y1={paddingY}
              x2={chartWidth - paddingX + 10}
              y2={paddingY}
              stroke="#1E293B"
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {/* Average baseline line */}
            <line
              x1={paddingX - 15}
              y1={avgY}
              x2={chartWidth - paddingX + 15}
              y2={avgY}
              stroke="#8B5CF6"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              strokeOpacity="0.7"
            />
            <text
              x={chartWidth - paddingX + 20}
              y={avgY + 3}
              fill="#A78BFA"
              fontSize="9"
              textAnchor="start"
              fontFamily="monospace"
            >
              {averageCycleLength}d avg
            </text>

            {/* Connecting Trend Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#F43F5E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points */}
            {points.map((pt, i) => {
              const isHovered = hoveredIdx === i;
              const monthLabel = new Date(`${pt.date}T00:00:00`).toLocaleDateString('en-US', {
                month: 'short',
              });

              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="cursor-pointer"
                >
                  {/* Vertical guideline */}
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x}
                    y2={chartHeight - paddingY}
                    stroke={isHovered ? '#64748B' : '#334155'}
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />

                  {/* Outer pulse when hovered */}
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="9"
                      fill="#F43F5E"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4.5}
                    fill={isHovered ? '#FDA4AF' : '#F43F5E'}
                    stroke="#0F172A"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />

                  {/* Top value tag */}
                  <text
                    x={pt.x}
                    y={pt.y - 9}
                    fill={isHovered ? '#FFFFFF' : '#E2E8F0'}
                    fontSize={isHovered ? '11' : '10'}
                    fontWeight="600"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {pt.length}d
                  </text>

                  {/* X-axis Month label */}
                  <text
                    x={pt.x}
                    y={chartHeight - 8}
                    fill="#94A3B8"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {monthLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Tooltip / Active Inspection Card */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div className="mt-3 p-2.5 rounded-xl bg-[#080C14] border border-slate-800 text-xs flex items-center justify-between animate-in fade-in duration-150">
          <div>
            <span className="font-semibold text-white">
              Cycle Started {points[hoveredIdx].date}
            </span>
            <span className="text-slate-400 text-[11px] ml-2">
              (Bleeding: {points[hoveredIdx].duration} days)
            </span>
            {points[hoveredIdx].notes && (
              <p className="text-slate-400 text-[11px] mt-0.5 italic truncate max-w-sm">
                &ldquo;{points[hoveredIdx].notes}&rdquo;
              </p>
            )}
          </div>
          <span className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-300 font-mono font-semibold">
            {points[hoveredIdx].length} days total
          </span>
        </div>
      )}

      {/* Reassurance footnote */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        <span>
          Based on your previous cycle history. Cycle lengths may naturally fluctuate.
        </span>
      </div>
    </Card>
  );
};
