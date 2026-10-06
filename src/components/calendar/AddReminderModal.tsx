import React, { useState, useEffect } from 'react';
import { SharedReminder, ReminderCategory, ReminderRepeat } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  X,
  Calendar,
  Clock,
  Tag,
  Repeat,
  FileText,
  Lock,
  HeartHandshake,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminderData: Omit<SharedReminder, 'id' | 'createdAt' | 'isCompleted'>) => Promise<void>;
  initialData?: SharedReminder | null;
  prefillDate?: string;
  partnerName?: string;
}

const CATEGORIES: { id: ReminderCategory; label: string; icon: string; color: string }[] = [
  { id: 'Support', label: 'Support', icon: '🤍', color: 'text-violet-400 bg-violet-950/60 border-violet-500/30' },
  { id: 'Supplies', label: 'Supplies', icon: '🛍️', color: 'text-amber-400 bg-amber-950/60 border-amber-500/30' },
  { id: 'Appointment', label: 'Appointment', icon: '🩺', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30' },
  { id: 'Personal', label: 'Personal', icon: '🔒', color: 'text-slate-300 bg-slate-900 border-slate-700' },
  { id: 'Other', label: 'Other', icon: '📝', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' },
];

const REPEAT_OPTIONS: { id: ReminderRepeat; label: string }[] = [
  { id: 'None', label: 'Does not repeat' },
  { id: 'Daily', label: 'Daily' },
  { id: 'Weekly', label: 'Weekly' },
  { id: 'Monthly', label: 'Monthly' },
];

const QUICK_EXAMPLES = [
  { title: 'Pick up comfort supplies', category: 'Supplies' as ReminderCategory, time: '6:00 PM', share: true },
  { title: 'Appointment', category: 'Appointment' as ReminderCategory, time: '10:30 AM', share: true },
  { title: 'Check in', category: 'Support' as ReminderCategory, time: 'Evening', share: true },
  { title: 'Personal cycle reflections', category: 'Personal' as ReminderCategory, time: 'Morning', share: false },
];

export const AddReminderModal: React.FC<AddReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  prefillDate,
  partnerName = 'Alex',
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-14');
  const [time, setTime] = useState('6:00 PM');
  const [category, setCategory] = useState<ReminderCategory>('Support');
  const [repeat, setRepeat] = useState<ReminderRepeat>('None');
  const [notes, setNotes] = useState('');
  // IMPORTANT PERMISSION RULE: Default should be OFF for private information.
  const [isSharedWithPartner, setIsSharedWithPartner] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date);
      setTime(initialData.time || '6:00 PM');
      setCategory(initialData.category);
      setRepeat(initialData.repeat);
      setNotes(initialData.notes || '');
      setIsSharedWithPartner(initialData.isSharedWithPartner);
    } else {
      setTitle('');
      setDate(prefillDate || '2026-09-14');
      setTime('6:00 PM');
      setCategory('Support');
      setRepeat('None');
      setNotes('');
      // Default strictly OFF for privacy
      setIsSharedWithPartner(false);
    }
    setError(null);
  }, [initialData, prefillDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a reminder title');
      return;
    }
    if (!date) {
      setError('Please select a valid date');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        title: title.trim(),
        date,
        time: time.trim() || 'All day',
        category,
        repeat,
        notes: notes.trim() || undefined,
        isSharedWithPartner,
        createdBy: initialData?.createdBy || 'user',
        createdByName: initialData?.createdByName || 'You',
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save reminder');
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyPreset = (preset: typeof QUICK_EXAMPLES[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setTime(preset.time);
    setIsSharedWithPartner(preset.share);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#0C111F] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/90 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white font-display">
                {initialData ? 'Edit Reminder' : 'Add Reminder'}
              </h2>
              <p className="text-xs text-slate-400">
                Coordinate practical support and personal reminders
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick presets (only for new reminders) */}
          {!initialData && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Suggestions:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_EXAMPLES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-violet-500/40 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{preset.title}</span>
                    <span className="text-[10px] text-slate-400">({preset.time})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pick up comfort supplies, Doctor appointment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm transition-colors"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-violet-400" />
                Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Time
              </label>
              <input
                type="text"
                placeholder="e.g. 6:00 PM, 10:30 AM, Evening"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* Category selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1 ${
                      isSelected
                        ? 'border-violet-500 bg-violet-600/20 text-white ring-1 ring-violet-500'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Repeat Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-emerald-400" />
              Repeat
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REPEAT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRepeat(opt.id)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer text-center ${
                    repeat === opt.id
                      ? 'border-violet-500 bg-violet-600/20 text-violet-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Specific brand of ginger tea, calm music on ride home..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs transition-colors resize-none"
            />
          </div>

          {/* ================= CRITICAL PERMISSION CONTROL ================= */}
          <div className="p-4 rounded-xl bg-[#090D18] border border-violet-500/30 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-violet-400" />
                  <label htmlFor="share-toggle" className="text-xs font-semibold text-white cursor-pointer">
                    Share this reminder with my partner
                  </label>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Default is <strong className="text-slate-200">OFF</strong> for private information. When enabled, {partnerName} will see this reminder in their Shared Calendar so you can coordinate support.
                </p>
              </div>

              {/* iOS-style toggle switch */}
              <button
                id="share-toggle"
                type="button"
                role="switch"
                aria-checked={isSharedWithPartner}
                onClick={() => setIsSharedWithPartner(!isSharedWithPartner)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isSharedWithPartner ? 'bg-violet-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isSharedWithPartner ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3 h-3 text-emerald-400" />
                Status:
              </span>
              {isSharedWithPartner ? (
                <span className="text-violet-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                  Shared with {partnerName}
                </span>
              ) : (
                <span className="text-slate-400 font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Private to You Only
                </span>
              )}
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Reminder' : 'Add Reminder'}
          </Button>
        </div>
      </div>
    </div>
  );
};
