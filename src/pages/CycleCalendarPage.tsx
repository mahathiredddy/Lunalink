import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PeriodEntryModal } from '../components/cycle/PeriodEntryModal';
import { MonthlyCalendar } from '../components/cycle/MonthlyCalendar';
import { CycleTrendChart } from '../components/cycle/CycleTrendChart';
import { CycleEntry } from '../types';
import { addDaysYMD } from '../services/cycleService';
import {
  Calendar,
  Clock,
  Heart,
  Sparkles,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Lock,
  ArrowRight,
  TrendingUp,
  History,
  Activity,
  ChevronRight,
  AlertCircle,
  CalendarDays,
  HeartHandshake,
} from 'lucide-react';

export const CycleCalendarPage: React.FC = () => {
  const { cycles, cycleStats, saveCycle, deleteCycle, navigateTo } = useApp();

  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<CycleEntry | null>(null);
  const [prefillDate, setPrefillDate] = useState<string | undefined>(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Open modal to log or edit
  const handleOpenLogModal = (date?: string, entry?: CycleEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setPrefillDate(undefined);
    } else {
      setEditingEntry(null);
      setPrefillDate(date || '2026-09-13');
    }
    setIsLogModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLogModalOpen(false);
    setEditingEntry(null);
    setPrefillDate(undefined);
  };

  // Quick mark date from calendar
  const handleQuickMarkDate = async (date: string, type: 'start' | 'end') => {
    if (type === 'start') {
      // Default 5-day flow
      const end = addDaysYMD(date, 4);
      await saveCycle({
        startDate: date,
        endDate: end,
        notes: 'Marked from calendar',
      });
    } else {
      handleOpenLogModal(date);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteCycle(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ================= 1. PAGE HEADER ================= */}
      <div
        id="cycle-page-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80"
      >
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white font-display tracking-tight">
              My Cycle
            </h1>
            <Badge variant="private" size="sm" icon={<Lock className="w-3 h-3 text-emerald-400" />}>
              Personal Health Data
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Understand your cycle patterns over time.
          </p>
        </div>

        {/* Action Button: Log Period */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigateTo('shared-calendar')}
            leftIcon={<HeartHandshake className="w-4 h-4 text-violet-400" />}
          >
            Shared Calendar
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => handleOpenLogModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Log Period
          </Button>
        </div>
      </div>

      {/* ================= 2. CALENDAR EXPANSION SWITCHER TABS ================= */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 text-white shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-100" />
            <span>My Cycle (Personal Health)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-700/80 text-emerald-100">
              Private
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('shared-calendar')}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-violet-400" />
            <span>Shared Calendar (Practical Support)</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 hidden lg:flex items-center gap-1.5 px-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cycles are kept private unless explicitly shared</span>
        </div>
      </div>

      {/* ================= 3. PRIVACY BANNER ================= */}
      <section
        id="cycle-privacy-banner"
        className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0B101E] to-[#0A0E1A] border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
      >
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex-shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Private & Protected Health Record
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed font-medium">
              Only you can see this unless you explicitly choose to share selected information.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Menstrual cycles are sensitive health information. LunaLink stores this under end-to-end sovereignty.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateTo('privacy-sharing')}
          className="self-start sm:self-auto border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/40 whitespace-nowrap"
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Privacy Controls
        </Button>
      </section>

      {/* ================= 3. CYCLE SUMMARY CARDS ================= */}
      <section id="cycle-summary-cards" className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-display">
          Cycle Summary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Current Cycle Day */}
          <Card variant="default" padding="md" className="border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Current Cycle</span>
              <Activity className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                  Day {cycleStats.currentCycleDay}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Started {cycleStats.lastPeriodStart}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-emerald-400">
                Active Cycle Phase
              </span>
            </div>
          </Card>

          {/* Card 2: Last Period */}
          <Card variant="default" padding="md" className="border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Last Period</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-white">
                {new Date(`${cycleStats.lastPeriodStart}T00:00:00`).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {new Date(`${cycleStats.lastPeriodEnd}T00:00:00`).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Recorded flow duration: 5 days
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[10px] font-mono text-rose-300">
                Recorded
              </span>
            </div>
          </Card>

          {/* Card 3: Average Cycle Length */}
          <Card variant="default" padding="md" className="border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Average Cycle</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                  {cycleStats.averageCycleLength}
                </span>
                <span className="text-xs text-slate-400">days</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Typical range: 27 - 29 days
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400">
                Based on previous cycles
              </span>
            </div>
          </Card>

          {/* Card 4: Next Estimated Period */}
          <Card variant="default" padding="md" className="border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Next Period</span>
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-white">
                {new Date(`${cycleStats.nextEstimatedPeriodStart}T00:00:00`).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                In ~14 days (estimated window)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-dashed border-violet-400" />
              <span className="text-[10px] font-mono text-violet-300">
                Estimated
              </span>
            </div>
          </Card>

          {/* Card 5: Cycle History */}
          <Card variant="default" padding="md" className="border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Cycle History</span>
              <History className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                  {cycleStats.totalCyclesRecorded}
                </span>
                <span className="text-xs text-slate-400">cycles</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Regular cycle pattern logged
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-sky-400">
                Sufficient baseline data
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* ================= 4. INTERACTIVE MONTHLY CALENDAR ================= */}
      <section id="cycle-interactive-calendar">
        <MonthlyCalendar
          cycles={cycles}
          stats={cycleStats}
          onOpenLogModal={handleOpenLogModal}
          onQuickMarkDate={handleQuickMarkDate}
        />
      </section>

      {/* ================= 5. TREND VISUALIZATION ================= */}
      <section id="cycle-trend-chart">
        <CycleTrendChart
          cycles={cycles}
          averageCycleLength={cycleStats.averageCycleLength}
        />
      </section>

      {/* ================= 6. CYCLE HISTORY ================= */}
      <section id="cycle-history-table" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white font-display">
              Previous Cycles
            </h2>
            <p className="text-xs text-slate-400">
              Historical record of your logged periods and cycle intervals
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenLogModal()}
            leftIcon={<Plus className="w-3.5 h-3.5 text-rose-400" />}
          >
            Add Past Period
          </Button>
        </div>

        <Card variant="default" padding="none" className="border-slate-800 overflow-hidden">
          {cycles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#080C14] text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Period Dates</th>
                    <th className="py-3 px-4">Flow Duration</th>
                    <th className="py-3 px-4">Cycle Length</th>
                    <th className="py-3 px-4 hidden md:table-cell">Notes</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {cycles.map((cycle, idx) => {
                    const isLatest = idx === 0;

                    return (
                      <tr
                        key={cycle.id}
                        className="hover:bg-[#0B101E]/80 transition-colors"
                      >
                        {/* Period Dates */}
                        <td className="py-3.5 px-4 sm:px-6 font-medium text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                            <span>
                              {cycle.startDate} to {cycle.endDate}
                            </span>
                            {isLatest && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-950/60 text-violet-300 border border-violet-500/30 font-mono">
                                Latest
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Flow Duration */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-slate-200">
                            {cycle.periodDurationDays} {cycle.periodDurationDays === 1 ? 'day' : 'days'}
                          </span>
                        </td>

                        {/* Cycle Length */}
                        <td className="py-3.5 px-4">
                          {cycle.cycleLengthDays ? (
                            <span className="font-mono font-semibold text-violet-300">
                              {cycle.cycleLengthDays} days
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono italic">
                              Current cycle
                            </span>
                          )}
                        </td>

                        {/* Notes */}
                        <td className="py-3.5 px-4 hidden md:table-cell text-slate-400 max-w-xs truncate">
                          {cycle.notes ? (
                            <span>{cycle.notes}</span>
                          ) : (
                            <span className="text-slate-400 italic">None</span>
                          )}
                        </td>

                        {/* Status / Data Type */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/50 text-rose-300 border border-rose-500/30">
                            Recorded
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenLogModal(undefined, cycle)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                              title="Edit Entry"
                              aria-label="Edit Entry"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {deleteConfirmId === cycle.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEntry(cycle.id)}
                                  className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-semibold hover:bg-rose-500"
                                >
                                  Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-1.5 py-1 rounded bg-slate-800 text-slate-300 text-[10px]"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(cycle.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                                title="Delete Entry"
                                aria-label="Delete Entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-950/50 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  No cycles recorded yet
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Log your menstrual periods to view previous cycle lengths and track your health rhythm.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenLogModal()}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Log Your First Period
              </Button>
            </div>
          )}
        </Card>
      </section>

      {/* ================= 7. LOG PERIOD MODAL ================= */}
      <PeriodEntryModal
        isOpen={isLogModalOpen}
        onClose={handleCloseModal}
        onSave={saveCycle}
        onDelete={handleDeleteEntry}
        editingEntry={editingEntry}
        initialDate={prefillDate}
      />
    </div>
  );
};
