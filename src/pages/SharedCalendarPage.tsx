import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SharedMonthlyCalendar } from '../components/calendar/SharedMonthlyCalendar';
import { AddReminderModal } from '../components/calendar/AddReminderModal';
import { SharedReminder } from '../types';
import {
  Calendar,
  HeartHandshake,
  Lock,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Clock,
  Heart,
  CalendarDays,
} from 'lucide-react';

export const SharedCalendarPage: React.FC = () => {
  const {
    reminders,
    reminderActivities,
    partner,
    connectionState,
    saveReminder,
    deleteReminder,
    toggleCompleteReminder,
    toggleShareReminder,
    cycles,
    cycleStats,
    navigateTo,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingReminder, setEditingReminder] = useState<SharedReminder | null>(null);
  const [prefillDate, setPrefillDate] = useState<string | undefined>(undefined);

  const isPartnerConnected = connectionState === 'connected';
  const partnerName = partner?.name?.split(' ')[0] || 'Partner';

  const handleOpenAddModal = (date?: string, reminder?: SharedReminder) => {
    if (reminder) {
      setEditingReminder(reminder);
      setPrefillDate(undefined);
    } else {
      setEditingReminder(null);
      setPrefillDate(date || '2026-09-14');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReminder(null);
    setPrefillDate(undefined);
  };

  const handleSaveReminder = async (
    data: Omit<SharedReminder, 'id' | 'createdAt' | 'isCompleted'>
  ) => {
    if (editingReminder) {
      await saveReminder({ ...data, id: editingReminder.id });
    } else {
      await saveReminder(data);
    }
  };

  // Summary Metrics
  const sharedCount = reminders.filter((r) => r.isSharedWithPartner).length;
  const suppliesCount = reminders.filter((r) => r.category === 'Supplies' && !r.isCompleted).length;
  const completedCount = reminders.filter((r) => r.isCompleted).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ================= 1. PAGE HEADER ================= */}
      <div
        id="shared-calendar-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80"
      >
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white font-display tracking-tight">
              Shared Calendar
            </h1>
            <Badge variant="shared" size="sm" icon={<HeartHandshake className="w-3.5 h-3.5 text-violet-400" />}>
              Practical Support
            </Badge>
            <Badge variant="subtle" size="sm" icon={<Lock className="w-3 h-3 text-emerald-400" />}>
              Granular Sharing
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Coordinate comfort supplies, agreed tasks, appointments, and support check-ins.
          </p>
        </div>

        {/* Action Button: Add Reminder */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => handleOpenAddModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Reminder
          </Button>
        </div>
      </div>

      {/* ================= 2. CALENDAR EXPANSION SWITCHER TABS ================= */}
      {/* Expands Cycle Calendar into a shared planning experience */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-violet-600 text-white shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Shared Calendar</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-violet-700/80 text-violet-100">
              {reminders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('cycle-calendar')}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>My Cycle (Personal Health)</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 hidden lg:flex items-center gap-1.5 px-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Health data stays separate from shared items</span>
        </div>
      </div>

      {/* ================= 3. PRIVACY GUARANTEE BANNER ================= */}
      <div className="p-4 rounded-xl bg-[#090E1A] border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-white font-semibold block">
              Personal Health Calendar is Protected
            </span>
            <span className="text-slate-300">
              The shared calendar does NOT expose your personal period flow or symptom logs. You choose exactly which practical reminders to share with {partnerName}.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('privacy-sharing')}
          className="text-violet-400 hover:text-violet-300 text-xs font-semibold flex items-center gap-1 flex-shrink-0 self-end sm:self-auto cursor-pointer"
        >
          <span>Privacy Settings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ================= 4. SUMMARY METRICS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card variant="subtle" padding="sm" className="border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-600/15 text-violet-400 border border-violet-500/30">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-mono">Total Reminders</span>
              <span className="text-lg font-bold text-white font-display">{reminders.length}</span>
            </div>
          </div>
        </Card>

        <Card variant="subtle" padding="sm" className="border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-600/15 text-cyan-400 border border-cyan-500/30">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-mono">Shared with {partnerName}</span>
              <span className="text-lg font-bold text-cyan-300 font-display">{sharedCount}</span>
            </div>
          </div>
        </Card>

        <Card variant="subtle" padding="sm" className="border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-600/15 text-amber-400 border border-amber-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-mono">Comfort Supplies</span>
              <span className="text-lg font-bold text-amber-300 font-display">{suppliesCount}</span>
            </div>
          </div>
        </Card>

        <Card variant="subtle" padding="sm" className="border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-mono">Completed</span>
              <span className="text-lg font-bold text-emerald-300 font-display">{completedCount}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ================= 5. SHARED MONTHLY CALENDAR COMPONENT ================= */}
      <SharedMonthlyCalendar
        reminders={reminders}
        activities={reminderActivities}
        partnerName={partnerName}
        isPartnerConnected={isPartnerConnected}
        onOpenAddModal={handleOpenAddModal}
        onToggleComplete={toggleCompleteReminder}
        onDeleteReminder={deleteReminder}
        onToggleShare={toggleShareReminder}
        cycles={cycles}
        cycleStats={cycleStats}
      />

      {/* ================= 6. CARE SUGGESTIONS QUICK CALLOUT ================= */}
      <Card
        variant="default"
        padding="md"
        className="border-slate-800 bg-gradient-to-r from-violet-950/20 via-slate-900 to-[#0A0E1A] hover:border-violet-500/40 transition-all cursor-pointer"
        onClick={() => navigateTo('care-suggestions')}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white font-display">
                Need ideas on what to schedule?
              </h4>
              <p className="text-xs text-slate-300">
                Explore Care Suggestions to view quiet check-ins, comfort items, and supportive tasks.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('care-suggestions');
            }}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View Care Suggestions
          </Button>
        </div>
      </Card>

      {/* Modal for Add / Edit Reminder */}
      <AddReminderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveReminder}
        initialData={editingReminder}
        prefillDate={prefillDate}
        partnerName={partnerName}
      />
    </div>
  );
};
