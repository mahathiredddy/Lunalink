import React from 'react';
import { CyclePhaseSymptomMetric } from '../../types';
import { Card } from '../ui/Card';
import { RefreshCw, Calendar, Sparkles } from 'lucide-react';

interface CycleChangesChartProps {
  metrics: CyclePhaseSymptomMetric[];
  totalLogsCount: number;
}

const PHASE_COLORS: Record<string, { ring: string; text: string; bg: string; bar: string }> = {
  Menstrual: {
    ring: 'border-rose-500/40',
    text: 'text-rose-400',
    bg: 'bg-rose-950/20',
    bar: 'bg-rose-500',
  },
  Follicular: {
    ring: 'border-emerald-500/40',
    text: 'text-emerald-400',
    bg: 'bg-emerald-950/20',
    bar: 'bg-emerald-500',
  },
  Ovulatory: {
    ring: 'border-cyan-500/40',
    text: 'text-cyan-400',
    bg: 'bg-cyan-950/20',
    bar: 'bg-cyan-500',
  },
  Luteal: {
    ring: 'border-purple-500/40',
    text: 'text-purple-400',
    bg: 'bg-purple-950/20',
    bar: 'bg-purple-500',
  },
};

export const CycleChangesChart: React.FC<CycleChangesChartProps> = ({
  metrics,
  totalLogsCount,
}) => {
  if (totalLogsCount === 0) {
    return (
      <Card variant="default" padding="md" className="border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-slate-300">
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white font-display">
            Changes Across Cycles
          </h3>
        </div>
        <p className="text-xs text-slate-400 py-6 text-center">
          Log symptoms across cycle days to view phase-by-phase patterns.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="md" className="border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white font-display">
              Changes Across Cycles
            </h3>
            <p className="text-[11px] text-slate-400">
              Pattern breakdown grouped by natural cycle phase
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          4 Phase Overview
        </span>
      </div>

      {/* Grid of 4 Cycle Phases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const style = PHASE_COLORS[m.phase] || PHASE_COLORS.Luteal;
          const painFillPercent = Math.min(Math.round((m.avgPain / 10) * 100), 100);

          return (
            <div
              key={m.phase}
              className={`p-3.5 rounded-xl border ${style.ring} ${style.bg} space-y-3 transition-all hover:border-slate-600`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
                    {m.phase}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {m.dayRange}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700/60">
                  {m.entryCount} {m.entryCount === 1 ? 'log' : 'logs'}
                </span>
              </div>

              {/* Average pain bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Avg Pain</span>
                  <span className="font-mono font-bold text-white">
                    {m.entryCount > 0 ? `${m.avgPain}/10` : '—'}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full ${style.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${painFillPercent}%` }}
                  />
                </div>
              </div>

              {/* Primary reported symptom */}
              <div className="pt-1.5 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-400 block">Top Reported:</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {m.entryCount > 0 ? m.topSymptom : 'No logs'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cycle insight tip */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400">
        <Calendar className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
        <span>
          Symptoms like cramps typically center around Menstrual days, whereas bloating and mood shifts often recur during the Luteal phase.
        </span>
      </div>
    </Card>
  );
};
