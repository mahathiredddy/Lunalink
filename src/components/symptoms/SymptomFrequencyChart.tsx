import React from 'react';
import { SymptomFrequencyItem } from '../../types';
import { Card } from '../ui/Card';
import { BarChart3, Sparkles } from 'lucide-react';

interface SymptomFrequencyChartProps {
  frequencyData: SymptomFrequencyItem[];
  totalLogsCount: number;
}

const SYMPTOM_ACCENTS: Record<string, { bar: string; text: string; bg: string }> = {
  Cramps: { bar: 'bg-rose-500', text: 'text-rose-400', bg: 'bg-rose-950/30' },
  Fatigue: { bar: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-950/30' },
  Headache: { bar: 'bg-purple-500', text: 'text-purple-400', bg: 'bg-purple-950/30' },
  'Back pain': { bar: 'bg-orange-500', text: 'text-orange-400', bg: 'bg-orange-950/30' },
  Nausea: { bar: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-950/30' },
  'Mood changes': { bar: 'bg-pink-500', text: 'text-pink-400', bg: 'bg-pink-950/30' },
  Bloating: { bar: 'bg-sky-500', text: 'text-sky-400', bg: 'bg-sky-950/30' },
  Other: { bar: 'bg-slate-500', text: 'text-slate-400', bg: 'bg-slate-800/40' },
};

export const SymptomFrequencyChart: React.FC<SymptomFrequencyChartProps> = ({
  frequencyData,
  totalLogsCount,
}) => {
  if (frequencyData.length === 0 || totalLogsCount === 0) {
    return (
      <Card variant="default" padding="md" className="border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-slate-300">
          <BarChart3 className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white font-display">
            Symptom Frequency
          </h3>
        </div>
        <p className="text-xs text-slate-400 py-6 text-center">
          No symptoms logged yet to display frequency patterns.
        </p>
      </Card>
    );
  }

  const topSymptom = frequencyData[0];
  const maxCount = Math.max(...frequencyData.map((d) => d.count), 1);

  return (
    <Card variant="default" padding="md" className="border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white font-display">
              Symptom Frequency
            </h3>
            <p className="text-[11px] text-slate-400">
              Proportion of logged days reporting each symptom
            </p>
          </div>
        </div>

        {topSymptom && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-950/40 border border-violet-500/30 text-[11px] text-violet-300">
            <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span>
              Most frequent:{' '}
              <strong className="text-white font-semibold">{topSymptom.symptom}</strong> (
              {topSymptom.percentage}% of logs)
            </span>
          </div>
        )}
      </div>

      {/* Horizontal Bar Breakdown */}
      <div className="space-y-3.5 pt-1">
        {frequencyData.map((item) => {
          const accent = SYMPTOM_ACCENTS[item.symptom] || SYMPTOM_ACCENTS.Other;
          const barWidthPercent = Math.max(Math.round((item.count / maxCount) * 100), 6);

          return (
            <div key={item.symptom} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    {item.symptom}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-400">
                    {item.count} {item.count === 1 ? 'day' : 'days'}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded font-semibold ${accent.bg} ${accent.text}`}>
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full ${accent.bar} rounded-full transition-all duration-500`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 mt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
        <span>Calculated across {totalLogsCount} total recorded journal entries</span>
        <span>Relative frequency</span>
      </div>
    </Card>
  );
};
