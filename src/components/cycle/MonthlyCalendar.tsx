import React, { useState } from 'react';
import { CycleEntry, CycleStats } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Calendar as CalendarIcon,
  Sparkles,
  Info,
  Plus,
  Edit3,
} from 'lucide-react';

interface MonthlyCalendarProps {
  cycles: CycleEntry[];
  stats: CycleStats;
  onOpenLogModal: (prefillDate?: string, entryToEdit?: CycleEntry) => void;
  onQuickMarkDate: (date: string, type: 'start' | 'end') => void;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  cycles,
  stats,
  onOpenLogModal,
  onQuickMarkDate,
}) => {
  // Reference date is September 2026
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 0-indexed: 8 = September
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-13');

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleReturnToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8); // September 2026
    setSelectedDate('2026-09-13');
  };

  // Days in month calculation
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Helper to format date YYYY-MM-DD
  const formatYMD = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Check date properties
  const isRecordedPeriodDay = (dateStr: string) => {
    return cycles.some((c) => dateStr >= c.startDate && dateStr <= c.endDate);
  };

  const getRecordedEntryForDate = (dateStr: string) => {
    return cycles.find((c) => dateStr >= c.startDate && dateStr <= c.endDate);
  };

  const isEstimatedPeriodDay = (dateStr: string) => {
    return (
      dateStr >= stats.nextEstimatedPeriodStart &&
      dateStr <= stats.nextEstimatedPeriodEnd &&
      !isRecordedPeriodDay(dateStr)
    );
  };

  const isEstimatedFertileDay = (dateStr: string) => {
    return (
      dateStr >= stats.estimatedFertileWindowStart &&
      dateStr <= stats.estimatedFertileWindowEnd &&
      !isRecordedPeriodDay(dateStr) &&
      !isEstimatedPeriodDay(dateStr)
    );
  };

  // Inspect selected date status
  const selectedRecordedEntry = getRecordedEntryForDate(selectedDate);
  const isSelectedRecorded = !!selectedRecordedEntry;
  const isSelectedEstimated = isEstimatedPeriodDay(selectedDate);
  const isSelectedFertile = isEstimatedFertileDay(selectedDate);

  return (
    <Card variant="default" padding="lg" className="border-slate-800 space-y-5">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white font-display tracking-tight">
              {monthName}
            </h2>
            <p className="text-xs text-slate-400">
              Interactive menstrual & cycle pattern explorer
            </p>
          </div>
        </div>

        {/* Month Navigation & Today Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReturnToToday}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Today
          </Button>

          <div className="flex items-center bg-[#080C14] border border-slate-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend / Distinction Guide */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 p-3 rounded-xl bg-[#080C14] border border-slate-800/80 text-xs">
        <span className="text-slate-400 text-[11px] font-mono">Legend:</span>

        {/* Recorded Period */}
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-rose-500 border border-rose-400/80 shadow-sm" />
          <span className="text-white font-medium">Recorded Period</span>
          <span className="text-[10px] text-rose-300 font-mono px-1 py-0.2 bg-rose-950/60 rounded border border-rose-500/30">
            Recorded
          </span>
        </div>

        {/* Estimated Period */}
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-violet-950/80 border-2 border-dashed border-violet-400 text-violet-300" />
          <span className="text-slate-300">Upcoming Period</span>
          <span className="text-[10px] text-violet-300 font-mono px-1 py-0.2 bg-violet-950/60 rounded border border-violet-500/30">
            Estimated
          </span>
        </div>

        {/* Estimated Fertile Window */}
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-cyan-950/80 border border-cyan-500/50" />
          <span className="text-slate-300">Fertile Window</span>
          <span className="text-[10px] text-cyan-300 font-mono px-1 py-0.2 bg-cyan-950/60 rounded border border-cyan-500/30">
            Estimated
          </span>
        </div>

        {/* Today Indicator */}
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md border-2 border-white bg-slate-800" />
          <span className="text-slate-400">Today</span>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="space-y-1">
        {/* Day of week headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 py-1 font-mono">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {/* Previous Month trailing days */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => {
            const dayNum = daysInPrevMonth - firstDayOfWeek + i + 1;
            const prevMonthDate =
              currentMonth === 0
                ? formatYMD(currentYear - 1, 11, dayNum)
                : formatYMD(currentYear, currentMonth - 1, dayNum);

            const isRecorded = isRecordedPeriodDay(prevMonthDate);

            return (
              <button
                type="button"
                key={`prev-${i}`}
                onClick={() => setSelectedDate(prevMonthDate)}
                className={`min-h-[50px] sm:min-h-[64px] p-1.5 rounded-xl border text-left transition-all relative flex flex-col justify-between select-none ${
                  selectedDate === prevMonthDate
                    ? 'border-violet-400 bg-slate-900/90 ring-2 ring-violet-500/40'
                    : 'border-slate-800/40 bg-[#080C14]/40 hover:bg-slate-900/40'
                } opacity-40`}
              >
                <span className="text-[11px] text-slate-400">{dayNum}</span>
                {isRecorded && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 self-end" />
                )}
              </button>
            );
          })}

          {/* Current Month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = formatYMD(currentYear, currentMonth, dayNum);
            const isToday = dateStr === '2026-09-13';
            const isSelected = selectedDate === dateStr;

            const isRecorded = isRecordedPeriodDay(dateStr);
            const isEstimated = isEstimatedPeriodDay(dateStr);
            const isFertile = isEstimatedFertileDay(dateStr);

            // Styling variants
            let cellBg = 'bg-[#0B101E] hover:bg-[#0E1528] border-slate-800/70 text-slate-300';
            let statusBadge = null;

            if (isRecorded) {
              cellBg =
                'bg-rose-950/70 hover:bg-rose-950/90 border-rose-500/50 text-white shadow-sm';
              statusBadge = (
                <span className="text-[9px] font-semibold text-rose-300 px-1 py-0.2 rounded bg-rose-900/80 border border-rose-400/40 truncate">
                  Period
                </span>
              );
            } else if (isEstimated) {
              cellBg =
                'bg-violet-950/40 hover:bg-violet-950/60 border-2 border-dashed border-violet-500/50 text-violet-200';
              statusBadge = (
                <span className="text-[9px] font-semibold text-violet-300 px-1 py-0.2 rounded bg-violet-900/60 border border-violet-400/40 truncate">
                  Est.
                </span>
              );
            } else if (isFertile) {
              cellBg =
                'bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-500/30 text-cyan-200';
              statusBadge = (
                <span className="text-[9px] font-semibold text-cyan-300 px-1 py-0.2 rounded bg-cyan-900/50 border border-cyan-400/30 truncate">
                  Fertile
                </span>
              );
            }

            if (isSelected) {
              cellBg += ' ring-2 ring-violet-400 border-violet-400';
            }

            return (
              <button
                type="button"
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`min-h-[52px] sm:min-h-[70px] p-1.5 sm:p-2 rounded-xl border text-left transition-all relative flex flex-col justify-between group select-none ${cellBg}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-semibold rounded-md px-1 ${
                      isToday
                        ? 'bg-white text-slate-900 ring-1 ring-white'
                        : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {isToday && (
                    <span className="hidden sm:inline text-[9px] font-mono font-bold text-violet-300 uppercase">
                      Today
                    </span>
                  )}
                </div>

                <div className="w-full flex items-center justify-between gap-1 mt-1">
                  {statusBadge}
                  {isRecorded && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 ml-auto" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Inspector Card & Action Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-white font-display">
                {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
              {selectedDate === '2026-09-13' && (
                <Badge variant="default" size="sm">
                  Today
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cycle status and quick logging for this date
            </p>
          </div>

          {/* Status on selected date */}
          <div className="flex items-center gap-2">
            {isSelectedRecorded ? (
              <Badge variant="danger" size="sm">
                Recorded Period Day
              </Badge>
            ) : isSelectedEstimated ? (
              <Badge variant="shared" size="sm">
                Estimated Period Day
              </Badge>
            ) : isSelectedFertile ? (
              <Badge variant="default" size="sm">
                Estimated Fertile Window
              </Badge>
            ) : (
              <Badge variant="private" size="sm">
                Regular Cycle Day
              </Badge>
            )}
          </div>
        </div>

        {/* Detailed details for this selected date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-300 space-y-1">
            {isSelectedRecorded && selectedRecordedEntry ? (
              <div>
                <p className="font-medium text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Part of recorded period ({selectedRecordedEntry.startDate} to {selectedRecordedEntry.endDate})</span>
                </p>
                {selectedRecordedEntry.notes && (
                  <p className="text-slate-400 italic text-[11px] mt-0.5">
                    Note: &ldquo;{selectedRecordedEntry.notes}&rdquo;
                  </p>
                )}
              </div>
            ) : isSelectedEstimated ? (
              <p className="text-violet-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>LunaLink estimate: upcoming cycle predicted based on {stats.averageCycleLength}-day average.</span>
              </p>
            ) : isSelectedFertile ? (
              <p className="text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Estimated fertile window based on standard hormonal rhythm estimates.</span>
              </p>
            ) : (
              <p className="text-slate-400">
                No bleeding recorded on this date. You can log a period or mark this date as start/end.
              </p>
            )}
          </div>

          {/* Action Buttons for Selected Date */}
          <div className="flex items-center gap-2 flex-wrap">
            {isSelectedRecorded && selectedRecordedEntry ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onOpenLogModal(undefined, selectedRecordedEntry)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit Recorded Entry
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickMarkDate(selectedDate, 'start')}
                  leftIcon={<Plus className="w-3.5 h-3.5 text-rose-400" />}
                >
                  Mark as Start
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenLogModal(selectedDate)}
                  leftIcon={<CalendarIcon className="w-3.5 h-3.5" />}
                >
                  Log Period Here
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Scientific & Privacy Footnote */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>
            Predictions are estimates calculated from previous cycle history and are not intended for contraception or medical diagnosis.
          </span>
        </div>
      </div>
    </Card>
  );
};
