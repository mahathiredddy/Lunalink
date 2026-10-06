import React, { useState } from 'react';
import { SymptomEntry } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Calendar,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  Filter,
  Search,
  MessageSquareQuote,
  Activity,
  Smile,
} from 'lucide-react';

interface SymptomHistoryListProps {
  entries: SymptomEntry[];
  onEdit: (entry: SymptomEntry) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const SymptomHistoryList: React.FC<SymptomHistoryListProps> = ({
  entries,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const [selectedSymptomFilter, setSelectedSymptomFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect all unique symptoms from entries for quick filter tabs
  const allUniqueSymptoms = Array.from(
    new Set(entries.flatMap((e) => e.symptoms))
  ).sort();

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    // Symptom filter
    if (selectedSymptomFilter !== 'all') {
      if (!entry.symptoms.includes(selectedSymptomFilter)) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchLoc = entry.painLocation.toLowerCase().includes(q);
      const matchNotes = entry.notes?.toLowerCase().includes(q);
      const matchSymptoms = entry.symptoms.some((s) => s.toLowerCase().includes(q));
      const matchDate = entry.date.includes(q);
      if (!matchLoc && !matchNotes && !matchSymptoms && !matchDate) return false;
    }

    return true;
  });

  const getPainBadge = (level: number) => {
    if (level === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
          <Smile className="w-3 h-3" />
          No Pain
        </span>
      );
    }
    if (level <= 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950/60 border border-sky-500/40 text-sky-300">
          <Activity className="w-3 h-3" />
          Pain {level}/10 • Mild
        </span>
      );
    }
    if (level <= 6) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 border border-amber-500/40 text-amber-300">
          <Activity className="w-3 h-3" />
          Pain {level}/10 • Moderate
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/70 border border-rose-500/50 text-rose-300">
        <Activity className="w-3 h-3" />
        Pain {level}/10 • Severe
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card variant="default" padding="md" className="border-slate-800 space-y-4">
      {/* Header with Title and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-semibold text-white font-display">
            Recent Symptom History
          </h3>
          <p className="text-xs text-slate-400">
            Chronological records of pain levels, physical symptoms, and personal notes
          </p>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, symptoms, dates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      {allUniqueSymptoms.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none">
          <span className="text-slate-400 flex items-center gap-1 mr-1 text-[11px]">
            <Filter className="w-3 h-3 text-violet-400" />
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSymptomFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedSymptomFilter === 'all'
                ? 'bg-violet-600/30 text-violet-200 border border-violet-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All ({entries.length})
          </button>
          {allUniqueSymptoms.map((symp) => {
            const count = entries.filter((e) => e.symptoms.includes(symp)).length;
            const isActive = selectedSymptomFilter === symp;
            return (
              <button
                key={symp}
                type="button"
                onClick={() => setSelectedSymptomFilter(isActive ? 'all' : symp)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-violet-600/30 text-violet-200 border border-violet-500/50'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {symp} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Entry Cards List */}
      {filteredEntries.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-300">
              No matching entries found
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Try adjusting your filter or search query.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedSymptomFilter('all');
              setSearchQuery('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => {
            return (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-[#0B101E] border border-slate-800/90 hover:border-slate-700 transition-all space-y-3 group"
              >
                {/* Entry Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-violet-400" />
                      {formatDate(entry.date)}
                    </span>

                    {entry.cycleDay && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-rose-950/40 border border-rose-500/30 text-rose-300">
                        Cycle Day {entry.cycleDay}
                      </span>
                    )}

                    {getPainBadge(entry.painLevel)}

                    {entry.painLocation && entry.painLocation !== 'None' && (
                      <span className="text-xs text-slate-300 px-2 py-0.5 rounded-md bg-slate-800/70 border border-slate-700/60 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {entry.painLocation}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onEdit(entry)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit Entry"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(entry.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Symptoms Badges */}
                {entry.symptoms && entry.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {entry.symptoms.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-lg text-xs font-medium bg-violet-950/40 border border-violet-500/30 text-violet-200"
                      >
                        {s}
                      </span>
                    ))}
                    {entry.otherSymptomDetail && (
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 italic border border-slate-700">
                        Note: {entry.otherSymptomDetail}
                      </span>
                    )}
                  </div>
                )}

                {/* Notes */}
                {entry.notes && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs text-slate-300">
                    <MessageSquareQuote className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {entry.notes}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
