import React, { useState } from 'react';
import { SharedReminder, ReminderActivity, ReminderCategory, CycleEntry, CycleStats } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Calendar as CalendarIcon,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  Lock,
  HeartHandshake,
  Eye,
  Sparkles,
  Filter,
  History,
  Info,
  Clock,
  Tag,
  Repeat,
  Share2,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SharedMonthlyCalendarProps {
  reminders: SharedReminder[];
  activities: ReminderActivity[];
  partnerName?: string;
  isPartnerConnected: boolean;
  onOpenAddModal: (prefillDate?: string, reminderToEdit?: SharedReminder) => void;
  onToggleComplete: (id: string) => Promise<void>;
  onDeleteReminder: (id: string) => Promise<void>;
  onToggleShare: (id: string, currentShared: boolean) => Promise<void>;
  // Optional cycle context (personal only)
  cycles?: CycleEntry[];
  cycleStats?: CycleStats;
}

export const SharedMonthlyCalendar: React.FC<SharedMonthlyCalendarProps> = ({
  reminders,
  activities,
  partnerName = 'Alex',
  isPartnerConnected,
  onOpenAddModal,
  onToggleComplete,
  onDeleteReminder,
  onToggleShare,
  cycles = [],
  cycleStats,
}) => {
  // Calendar month state (Reference date: September 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = September (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-14'); // Default to Tomorrow (example date)

  // VIEW MODE: 'user_view' (All) vs 'partner_view' (Shared with partner only)
  const [viewMode, setViewMode] = useState<'user_view' | 'partner_view'>('partner_view');

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Optional cycle overlay toggle (Strictly private)
  const [showCycleOverlay, setShowCycleOverlay] = useState<boolean>(false);

  // Activity log expanded state
  const [isActivityExpanded, setIsActivityExpanded] = useState<boolean>(true);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Month navigation handlers
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
    setCurrentMonth(8);
    setSelectedDate('2026-09-13'); // Today
  };

  // Days in month calculation
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const formatYMD = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Filter reminders based on view mode and category filter
  const activeReminders = reminders.filter((r) => {
    // Partner View: SHOW ONLY REMINDERS EXPLICITLY SHARED
    if (viewMode === 'partner_view' && !r.isSharedWithPartner) {
      return false;
    }
    if (selectedCategory !== 'all' && r.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  // Helper to get reminders for a specific date
  const getRemindersForDate = (dateStr: string) => {
    return activeReminders.filter((r) => r.date === dateStr);
  };

  // Cycle day indicators (optional private overlay)
  const isRecordedPeriodDay = (dateStr: string) => {
    return cycles.some((c) => dateStr >= c.startDate && dateStr <= c.endDate);
  };

  const isEstimatedPeriodDay = (dateStr: string) => {
    if (!cycleStats) return false;
    return (
      dateStr >= cycleStats.nextEstimatedPeriodStart &&
      dateStr <= cycleStats.nextEstimatedPeriodEnd &&
      !isRecordedPeriodDay(dateStr)
    );
  };

  const selectedDateReminders = getRemindersForDate(selectedDate);

  const getCategoryBadgeClass = (category: ReminderCategory) => {
    switch (category) {
      case 'Support':
        return 'text-violet-300 bg-violet-950/70 border-violet-500/40';
      case 'Supplies':
        return 'text-amber-300 bg-amber-950/70 border-amber-500/40';
      case 'Appointment':
        return 'text-cyan-300 bg-cyan-950/70 border-cyan-500/40';
      case 'Personal':
        return 'text-slate-300 bg-slate-900 border-slate-700';
      case 'Other':
        return 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40';
      default:
        return 'text-slate-300 bg-slate-900 border-slate-700';
    }
  };

  const getCategoryDotClass = (category: ReminderCategory) => {
    switch (category) {
      case 'Support':
        return 'bg-violet-400';
      case 'Supplies':
        return 'bg-amber-400';
      case 'Appointment':
        return 'bg-cyan-400';
      case 'Personal':
        return 'bg-slate-400';
      case 'Other':
        return 'bg-emerald-400';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= VIEW MODE & PERMISSION NOTICE BANNER ================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/30 via-[#0D1222] to-[#0A0E1A] border border-violet-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-semibold text-white font-display">
              {viewMode === 'partner_view' ? 'Partner-Facing Calendar View' : 'My Full Calendar (Private + Shared)'}
            </h2>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                viewMode === 'partner_view'
                  ? 'bg-violet-950/80 border border-violet-500/40 text-violet-300'
                  : 'bg-slate-800 border border-slate-700 text-slate-300'
              }`}
            >
              {viewMode === 'partner_view' ? 'Shared Only' : 'All Items'}
            </span>
            <Badge variant="shared" size="sm" icon={<Lock className="w-3 h-3 text-emerald-400" />}>
              Explicit Sharing Only
            </Badge>
          </div>
          <p className="text-xs text-slate-300">
            {viewMode === 'partner_view'
              ? `Showing only practical reminders explicitly shared with ${partnerName}. Your private personal health calendar is NOT exposed.`
              : `Viewing all your items. Reminders with a lock icon are strictly private to you.`}
          </p>
        </div>

        {/* View Mode Toggle Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setViewMode('partner_view')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'partner_view'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Partner View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('user_view')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'user_view'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>My Full View</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenAddModal(selectedDate)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Reminder
          </Button>
        </div>
      </div>

      {/* ================= MAIN MONTHLY CALENDAR CARD ================= */}
      <Card variant="default" padding="lg" className="border-slate-800 space-y-5 bg-[#0A0E1A]">
        {/* Calendar Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white font-display tracking-tight">
                {monthName}
              </h3>
              <p className="text-xs text-slate-400">
                Shared practical coordination & support schedule
              </p>
            </div>
          </div>

          {/* Controls: Cycle Overlay Toggle, Today, Prev/Next */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Optional Cycle Overlay Toggle (Private) */}
            <button
              type="button"
              onClick={() => setShowCycleOverlay(!showCycleOverlay)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                showCycleOverlay
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Cycle overlay is visible only to you on this device"
            >
              <span className={`w-2 h-2 rounded-full ${showCycleOverlay ? 'bg-rose-400' : 'bg-slate-500'}`} />
              <span>Cycle Context (Private)</span>
            </button>

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

        {/* Category Filter Chips & Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#080C14] border border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-mono mr-1">Filter:</span>
            {['all', 'Support', 'Supplies', 'Appointment', 'Personal', 'Other'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-violet-600/30 border border-violet-500/50 text-violet-200'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Reminders' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span>Support</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Supplies</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Appointment</span>
            </div>
          </div>
        </div>

        {/* Monthly Grid Table */}
        <div className="space-y-1">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 py-1 font-mono">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {/* Previous Month trailing days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOfWeek + i + 1;
              const prevDate =
                currentMonth === 0
                  ? formatYMD(currentYear - 1, 11, dayNum)
                  : formatYMD(currentYear, currentMonth - 1, dayNum);

              const dateReminders = getRemindersForDate(prevDate);

              return (
                <button
                  type="button"
                  key={`prev-${i}`}
                  onClick={() => setSelectedDate(prevDate)}
                  className={`min-h-[64px] sm:min-h-[82px] p-1.5 rounded-xl border text-left transition-all relative flex flex-col justify-between select-none opacity-40 ${
                    selectedDate === prevDate
                      ? 'border-violet-400 bg-slate-900/90 ring-2 ring-violet-500/40'
                      : 'border-slate-800/40 bg-[#080C14]/40 hover:bg-slate-900/40'
                  }`}
                >
                  <span className="text-[11px] text-slate-400">{dayNum}</span>
                  {dateReminders.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {dateReminders.slice(0, 2).map((r) => (
                        <span key={r.id} className={`w-1.5 h-1.5 rounded-full ${getCategoryDotClass(r.category)}`} />
                      ))}
                    </div>
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

              const dateReminders = getRemindersForDate(dateStr);
              const isPeriodDay = showCycleOverlay && isRecordedPeriodDay(dateStr);
              const isEstimatedDay = showCycleOverlay && isEstimatedPeriodDay(dateStr);

              return (
                <button
                  type="button"
                  key={`cur-${dayNum}`}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`min-h-[64px] sm:min-h-[82px] p-1.5 sm:p-2 rounded-xl border text-left transition-all relative flex flex-col justify-between select-none cursor-pointer group ${
                    isSelected
                      ? 'border-violet-400 bg-slate-900/95 ring-2 ring-violet-500/50 shadow-md'
                      : isToday
                      ? 'border-slate-600 bg-slate-900/60'
                      : 'border-slate-800/80 bg-[#080C14] hover:bg-slate-900/50 hover:border-slate-700'
                  } ${isPeriodDay ? 'bg-rose-950/20' : ''}`}
                >
                  {/* Top Bar inside cell: Day Number + Badges */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-medium ${
                        isSelected
                          ? 'text-white font-bold'
                          : isToday
                          ? 'text-violet-300 font-bold'
                          : 'text-slate-300'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Today indicator */}
                    {isToday && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-violet-600/30 text-violet-300 border border-violet-500/30">
                        Today
                      </span>
                    )}

                    {/* Cycle indicator overlay (if active) */}
                    {isPeriodDay && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Recorded period day (private)" />
                    )}
                    {isEstimatedDay && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 border border-violet-300" title="Estimated window (private)" />
                    )}
                  </div>

                  {/* Reminder Items List / Dots inside cell */}
                  <div className="space-y-1 w-full mt-1">
                    {dateReminders.slice(0, 2).map((rem) => (
                      <div
                        key={rem.id}
                        className={`hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate border ${
                          rem.isCompleted
                            ? 'bg-slate-900/80 border-slate-800 text-slate-500 line-through'
                            : getCategoryBadgeClass(rem.category)
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getCategoryDotClass(rem.category)}`} />
                        <span className="truncate font-medium">{rem.title}</span>
                      </div>
                    ))}

                    {/* Mobile compact dots */}
                    <div className="flex sm:hidden gap-1 flex-wrap">
                      {dateReminders.map((rem) => (
                        <span
                          key={rem.id}
                          className={`w-2 h-2 rounded-full ${getCategoryDotClass(rem.category)} ${
                            rem.isCompleted ? 'opacity-40' : ''
                          }`}
                        />
                      ))}
                    </div>

                    {dateReminders.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-mono hidden sm:block">
                        +{dateReminders.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ================= SELECTED DAY DETAILS & ACTIONS ================= */}
      <section id="selected-day-agenda">
        <Card variant="default" padding="lg" className="border-slate-800 bg-[#0C111F] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white font-display">
                  Reminders for {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedDateReminders.length === 0
                    ? 'No reminders scheduled for this date.'
                    : `${selectedDateReminders.length} reminder${selectedDateReminders.length === 1 ? '' : 's'} scheduled`}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenAddModal(selectedDate)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Reminder
            </Button>
          </div>

          {/* List of Reminders for Selected Date */}
          {selectedDateReminders.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-slate-400 flex items-center justify-center mx-auto">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">No reminders on this day</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Add comfort supplies, an appointment, or a support check-in to coordinate together.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onOpenAddModal(selectedDate)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Reminder
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateReminders.map((rem) => {
                const isDeleting = deleteConfirmId === rem.id;

                return (
                  <div
                    key={rem.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      rem.isCompleted
                        ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Left: Complete Checkbox + Title & Metadata */}
                    <div className="flex items-start gap-3.5">
                      <button
                        type="button"
                        onClick={() => onToggleComplete(rem.id)}
                        aria-label={rem.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                        className="mt-0.5 p-1 text-slate-400 hover:text-violet-400 transition-colors cursor-pointer"
                      >
                        {rem.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 hover:text-white" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`text-sm sm:text-base font-semibold font-display ${
                              rem.isCompleted ? 'text-slate-400 line-through' : 'text-white'
                            }`}
                          >
                            {rem.title}
                          </h4>

                          {/* Category Badge */}
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getCategoryBadgeClass(
                              rem.category
                            )}`}
                          >
                            {rem.category}
                          </span>

                          {/* Repeat indicator */}
                          {rem.repeat !== 'None' && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1">
                              <Repeat className="w-2.5 h-2.5" />
                              {rem.repeat}
                            </span>
                          )}

                          {/* Sharing status badge */}
                          {rem.isSharedWithPartner ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950/70 border border-violet-500/30 text-violet-300 flex items-center gap-1">
                              <HeartHandshake className="w-3 h-3 text-violet-400" />
                              Shared with {partnerName}
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-slate-400" />
                              Private to You
                            </span>
                          )}
                        </div>

                        {/* Time & Creator */}
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {rem.time}
                          </span>
                          <span>•</span>
                          <span>Created by {rem.createdByName}</span>
                          {rem.isCompleted && rem.completedAt && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400 font-medium">Completed</span>
                            </>
                          )}
                        </div>

                        {/* Notes if any */}
                        {rem.notes && (
                          <p className="text-xs text-slate-300 pt-1 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 max-w-xl">
                            {rem.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions (Edit, Share Toggle, Delete) */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                      {/* Toggle share button */}
                      <button
                        type="button"
                        onClick={() => onToggleShare(rem.id, rem.isSharedWithPartner)}
                        title={rem.isSharedWithPartner ? 'Make Private' : `Share with ${partnerName}`}
                        className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                          rem.isSharedWithPartner
                            ? 'bg-violet-950/40 border-violet-500/30 text-violet-300 hover:bg-violet-900/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {rem.isSharedWithPartner ? (
                          <>
                            <HeartHandshake className="w-3.5 h-3.5" />
                            <span className="text-[11px] hidden md:inline">Shared</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span className="text-[11px] hidden md:inline">Share</span>
                          </>
                        )}
                      </button>

                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={() => onOpenAddModal(rem.date, rem)}
                        title="Edit Reminder"
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete button or confirmation */}
                      {isDeleting ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onDeleteReminder(rem.id)}
                            className="px-2 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(rem.id)}
                          title="Delete Reminder"
                          className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </section>

      {/* ================= ACTIVITY HISTORY ACCORDION ================= */}
      <section id="shared-calendar-activity-history">
        <Card variant="subtle" padding="md" className="border-slate-800 bg-[#090D18]">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsActivityExpanded(!isActivityExpanded)}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-violet-400" />
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Shared Calendar Activity History
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {activities.length} entries
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-200">
                <span>{isActivityExpanded ? 'Collapse' : 'Expand'}</span>
                {isActivityExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {isActivityExpanded && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {activities.slice(0, 6).map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between text-xs gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          act.action === 'completed'
                            ? 'bg-emerald-400'
                            : act.action === 'sharing_toggled'
                            ? 'bg-violet-400'
                            : act.action === 'deleted'
                            ? 'bg-rose-400'
                            : 'bg-cyan-400'
                        }`}
                      />
                      <div className="truncate">
                        <span className="font-semibold text-white">{act.actorName}</span>{' '}
                        <span className="text-slate-300">{act.details || act.action}</span>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};
