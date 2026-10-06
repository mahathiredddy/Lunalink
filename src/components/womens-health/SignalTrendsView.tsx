import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  WomensHealthSignalEntry,
  WomensHealthSignalType,
  CycleEntry,
} from '../../types';
import {
  WOMENS_HEALTH_SIGNALS,
  SignalTypeDefinition,
} from '../../services/womensHealthService';
import {
  CalendarClock,
  Sparkles,
  Scissors,
  BatteryLow,
  Moon,
  Smile,
  Scale,
  Activity,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Sliders,
  Filter,
} from 'lucide-react';

interface SignalTrendsViewProps {
  signals: WomensHealthSignalEntry[];
  cycles: CycleEntry[];
}

interface SignalStatItem {
  type: WomensHealthSignalType;
  label: string;
  count: number;
  mild: number;
  moderate: number;
  notable: number;
  commonTags: Record<string, number>;
}

type TimeframeOption = '30' | '60' | '90' | 'all';

export const SignalTrendsView: React.FC<SignalTrendsViewProps> = ({ signals, cycles }) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('60');
  const [selectedSignalFilter, setSelectedSignalFilter] = useState<WomensHealthSignalType | 'all'>('all');

  // Filter signals by timeframe
  const filteredSignals = useMemo(() => {
    if (timeframe === 'all') return signals;
    const days = parseInt(timeframe, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return signals.filter((s) => s.date >= cutoffStr);
  }, [signals, timeframe]);

  // Aggregate stats per signal type
  const signalStats = useMemo(() => {
    const stats: Record<
      WomensHealthSignalType,
      {
        type: WomensHealthSignalType;
        label: string;
        count: number;
        mild: number;
        moderate: number;
        notable: number;
        commonTags: Record<string, number>;
      }
    > = {
      cycle_irregularity: { type: 'cycle_irregularity', label: 'Cycle irregularity', count: 0, mild: 0, moderate: 0, notable: 0, commonTags: {} },
      acne_skin: { type: 'acne_skin', label: 'Acne or skin changes', count: 0, mild: 0, moderate: 0, notable: 0, commonTags: {} },
      hair_changes: { type: 'hair_changes', label: 'Hair changes', count: 0, mild: 0, moderate: 0, notable: 0, commonTags: {} },
      fatigue: { type: 'fatigue', label: 'Fatigue', count: 0, mild: 0, moderate: 0, notable: 0, commonTags: {} },
      sleep: { type: 'sleep', label: 'Sleep', count: 0, mild: 0, moderate: 0, notable: 0, commonTags: {} },
      mood: { type: 'mood', label: 'Mood', count: 0, mild: 0, moderate: 0, notable: 0, commonTags: {} },
      weight_changes: { type: 'weight_changes', label: 'Weight changes', count: 0, mild: 0, moderate: 0, notable: 0, commonTags: {} },
      other_symptoms: { type: 'other_symptoms', label: 'Other selected symptoms', count: 0, mild: 0, moderate: 0, notable: 0, commonTags: {} },
    };

    filteredSignals.forEach((entry) => {
      entry.signals.forEach((sig) => {
        if (stats[sig.type]) {
          stats[sig.type].count += 1;
          if (sig.severity === 'mild') stats[sig.type].mild += 1;
          else if (sig.severity === 'moderate') stats[sig.type].moderate += 1;
          else if (sig.severity === 'notable') stats[sig.type].notable += 1;

          if (sig.subTags) {
            sig.subTags.forEach((tag) => {
              stats[sig.type].commonTags[tag] = (stats[sig.type].commonTags[tag] || 0) + 1;
            });
          }
        }
      });
    });

    return stats;
  }, [filteredSignals]);

  const signalStatsList = useMemo(() => {
    return Object.values(signalStats) as SignalStatItem[];
  }, [signalStats]);

  const totalSignalEvents = useMemo(() => {
    return signalStatsList.reduce((acc, curr) => acc + curr.count, 0);
  }, [signalStatsList]);

  const maxSignalCount = useMemo(() => {
    return Math.max(...signalStatsList.map((s) => s.count), 1);
  }, [signalStatsList]);

  const getSignalIcon = (type: WomensHealthSignalType) => {
    switch (type) {
      case 'cycle_irregularity':
        return <CalendarClock className="w-4 h-4 text-violet-400" />;
      case 'acne_skin':
        return <Sparkles className="w-4 h-4 text-rose-400" />;
      case 'hair_changes':
        return <Scissors className="w-4 h-4 text-amber-400" />;
      case 'fatigue':
        return <BatteryLow className="w-4 h-4 text-orange-400" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'mood':
        return <Smile className="w-4 h-4 text-pink-400" />;
      case 'weight_changes':
        return <Scale className="w-4 h-4 text-emerald-400" />;
      case 'other_symptoms':
        return <Activity className="w-4 h-4 text-cyan-400" />;
    }
  };

  // Timeline entries filtered by specific signal selection if active
  const timelineEntries = useMemo(() => {
    if (selectedSignalFilter === 'all') return filteredSignals;
    return filteredSignals.filter((entry) =>
      entry.signals.some((s) => s.type === selectedSignalFilter)
    );
  }, [filteredSignals, selectedSignalFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar with Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-white font-display flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <span>Health Signal Trends</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize recurring body signals, severity distribution, and multi-signal clusters
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setTimeframe('30')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              timeframe === '30'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('60')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              timeframe === '60'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            60 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('90')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              timeframe === '90'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            90 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              timeframe === 'all'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* 2. Top-Level Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card variant="subtle" padding="sm" className="bg-slate-900/60 border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Signal Entries
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{filteredSignals.length}</span>
            <span className="text-[11px] text-slate-500">logged days</span>
          </div>
        </Card>

        <Card variant="subtle" padding="sm" className="bg-slate-900/60 border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Signal Events
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-violet-400 font-mono">{totalSignalEvents}</span>
            <span className="text-[11px] text-slate-500">instances</span>
          </div>
        </Card>

        <Card variant="subtle" padding="sm" className="bg-slate-900/60 border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Most Tracked Signal
          </span>
          <div className="mt-1">
            {[...signalStatsList].sort((a, b) => b.count - a.count)[0]?.count > 0 ? (
              <div className="truncate text-xs font-semibold text-rose-300">
                {[...signalStatsList].sort((a, b) => b.count - a.count)[0].label}
              </div>
            ) : (
              <span className="text-xs text-slate-500">None yet</span>
            )}
            <span className="text-[10px] text-slate-500 block">
              {[...signalStatsList].sort((a, b) => b.count - a.count)[0]?.count || 0} times logged
            </span>
          </div>
        </Card>

        <Card variant="subtle" padding="sm" className="bg-slate-900/60 border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Multi-Signal Days
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-amber-400 font-mono">
              {filteredSignals.filter((s) => s.signals.length >= 2).length}
            </span>
            <span className="text-[11px] text-slate-500">cluster dates</span>
          </div>
        </Card>
      </div>

      {/* 3. Signal Frequency Bars & Severity Breakdown */}
      <Card variant="default" padding="md" className="border-slate-800 bg-[#0C1222]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-white font-display">
              Signal Frequency & Severity Breakdown
            </h4>
            <p className="text-xs text-slate-400">
              Proportional distribution of each tracked signal in the chosen timeframe
            </p>
          </div>

          {/* Severity Legend */}
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60" />
              <span className="text-slate-400">Mild</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/60" />
              <span className="text-slate-400">Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/60" />
              <span className="text-slate-400">Notable</span>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          {WOMENS_HEALTH_SIGNALS.map((sigDef) => {
            const data = signalStats[sigDef.type];
            const percentOfMax = (data.count / maxSignalCount) * 100;
            const topTag = (Object.entries(data.commonTags) as [string, number][]).sort(
              (a, b) => b[1] - a[1]
            )[0];

            return (
              <div
                key={sigDef.type}
                className="group p-2.5 rounded-xl hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-800"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex-shrink-0">
                      {getSignalIcon(sigDef.type)}
                    </div>
                    <span className="text-xs font-semibold text-white truncate">
                      {sigDef.label}
                    </span>
                    {topTag && (
                      <span className="hidden sm:inline-block text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/60 truncate">
                        Most common: {topTag[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-mono font-semibold text-slate-200">
                      {data.count} {data.count === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>

                {/* Stacked Proportional Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden flex">
                  {data.count === 0 ? (
                    <div className="w-full h-full bg-slate-800/40" />
                  ) : (
                    <>
                      {data.mild > 0 && (
                        <div
                          style={{ width: `${(data.mild / data.count) * percentOfMax}%` }}
                          className="h-full bg-emerald-500/70 hover:bg-emerald-400 transition-all"
                          title={`Mild: ${data.mild}`}
                        />
                      )}
                      {data.moderate > 0 && (
                        <div
                          style={{ width: `${(data.moderate / data.count) * percentOfMax}%` }}
                          className="h-full bg-amber-500/70 hover:bg-amber-400 transition-all"
                          title={`Moderate: ${data.moderate}`}
                        />
                      )}
                      {data.notable > 0 && (
                        <div
                          style={{ width: `${(data.notable / data.count) * percentOfMax}%` }}
                          className="h-full bg-rose-500/70 hover:bg-rose-400 transition-all"
                          title={`Notable: ${data.notable}`}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. Chronological Signal Timeline / Log Strip */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-white font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span>Chronological Health Log & Details</span>
            </h4>
            <p className="text-xs text-slate-400">
              Filtered entries showing co-occurring signals, specific indicators, and notes
            </p>
          </div>

          {/* Filter by signal pill selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedSignalFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedSignalFilter === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Signals ({filteredSignals.length})
            </button>
            {WOMENS_HEALTH_SIGNALS.map((sig) => {
              const count = signalStats[sig.type].count;
              if (count === 0) return null;
              return (
                <button
                  key={sig.type}
                  type="button"
                  onClick={() => setSelectedSignalFilter(sig.type)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                    selectedSignalFilter === sig.type
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{sig.label.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-slate-800">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {timelineEntries.length === 0 ? (
          <Card variant="subtle" padding="lg" className="text-center py-10 bg-slate-900/40 border-slate-800">
            <p className="text-sm text-slate-300 font-medium">No signal entries match this filter</p>
            <p className="text-xs text-slate-500 mt-1">
              Select &quot;All Signals&quot; or expand the timeframe to view recorded history.
            </p>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {timelineEntries.map((entry) => {
              return (
                <Card
                  key={entry.id}
                  variant="default"
                  padding="sm"
                  className="bg-[#0B101E]/90 border-slate-800 hover:border-slate-700/80 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-white font-mono flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {entry.date}
                        </span>
                        {entry.cycleDay && (
                          <Badge variant="subtle" size="sm">
                            Day {entry.cycleDay}
                          </Badge>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {entry.signals.length} {entry.signals.length === 1 ? 'signal tracked' : 'signals tracked'}
                        </span>
                      </div>

                      {/* Signals Chips in this entry */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {entry.signals.map((sig, idx) => {
                          const severityBadgeClass =
                            sig.severity === 'mild'
                              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                              : sig.severity === 'moderate'
                              ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                              : 'bg-rose-950/40 text-rose-300 border-rose-500/30';

                          return (
                            <div
                              key={idx}
                              className={`p-2 rounded-xl border text-xs flex flex-col gap-1 max-w-sm ${severityBadgeClass}`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 font-medium">
                                  {getSignalIcon(sig.type)}
                                  <span>{sig.label}</span>
                                </div>
                                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold px-1 rounded bg-black/30">
                                  {sig.severity}
                                </span>
                              </div>

                              {sig.subTags && sig.subTags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {sig.subTags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-slate-300"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {sig.notes && (
                                <p className="text-[11px] text-slate-300/90 italic pt-0.5">
                                  &quot;{sig.notes}&quot;
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* General Entry Notes if any */}
                      {entry.generalNotes && (
                        <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/60 mt-2">
                          <span className="font-semibold text-slate-300">Notes:</span>{' '}
                          {entry.generalNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
