import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  WOMENS_HEALTH_SIGNALS,
  SignalTypeDefinition,
} from '../../services/womensHealthService';
import {
  WomensHealthSignalEntry,
  WomensHealthSignalType,
  SignalSeverityLevel,
} from '../../types';
import {
  CalendarClock,
  Sparkles,
  Scissors,
  BatteryLow,
  Moon,
  Smile,
  Scale,
  Activity,
  Check,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface SignalTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<WomensHealthSignalEntry, 'id' | 'createdAt'> & { id?: string }) => Promise<void>;
  editingEntry?: WomensHealthSignalEntry | null;
  cycleDayHint?: number;
}

export const SignalTrackerModal: React.FC<SignalTrackerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEntry,
  cycleDayHint,
}) => {
  const [date, setDate] = useState<string>(
    editingEntry ? editingEntry.date : new Date().toISOString().split('T')[0]
  );
  const [generalNotes, setGeneralNotes] = useState<string>(editingEntry?.generalNotes || '');
  
  // Track state of each signal: whether active, severity, subTags, and specific note
  const [activeSignals, setActiveSignals] = useState<
    Record<
      WomensHealthSignalType,
      {
        selected: boolean;
        severity: SignalSeverityLevel;
        subTags: string[];
        notes: string;
      }
    >
  >(() => {
    const initial: Record<
      WomensHealthSignalType,
      {
        selected: boolean;
        severity: SignalSeverityLevel;
        subTags: string[];
        notes: string;
      }
    > = {
      cycle_irregularity: { selected: false, severity: 'moderate', subTags: [], notes: '' },
      acne_skin: { selected: false, severity: 'moderate', subTags: [], notes: '' },
      hair_changes: { selected: false, severity: 'mild', subTags: [], notes: '' },
      fatigue: { selected: false, severity: 'moderate', subTags: [], notes: '' },
      sleep: { selected: false, severity: 'moderate', subTags: [], notes: '' },
      mood: { selected: false, severity: 'moderate', subTags: [], notes: '' },
      weight_changes: { selected: false, severity: 'mild', subTags: [], notes: '' },
      other_symptoms: { selected: false, severity: 'mild', subTags: [], notes: '' },
    };

    if (editingEntry) {
      editingEntry.signals.forEach((sig) => {
        if (initial[sig.type]) {
          initial[sig.type] = {
            selected: true,
            severity: sig.severity,
            subTags: sig.subTags || [],
            notes: sig.notes || '',
          };
        }
      });
    }

    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const toggleSignalSelection = (type: WomensHealthSignalType) => {
    setActiveSignals((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        selected: !prev[type].selected,
      },
    }));
  };

  const setSignalSeverity = (type: WomensHealthSignalType, severity: SignalSeverityLevel) => {
    setActiveSignals((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        severity,
      },
    }));
  };

  const toggleSubTag = (type: WomensHealthSignalType, tag: string) => {
    setActiveSignals((prev) => {
      const currentTags = prev[type].subTags;
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      return {
        ...prev,
        [type]: {
          ...prev[type],
          subTags: newTags,
        },
      };
    });
  };

  const setSignalNotes = (type: WomensHealthSignalType, notes: string) => {
    setActiveSignals((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        notes,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const entries = Object.entries(activeSignals) as [WomensHealthSignalType, {
        selected: boolean;
        severity: SignalSeverityLevel;
        subTags: string[];
        notes: string;
      }][];

      const signalsToSave = entries
        .filter(([, val]) => val.selected)
        .map(([key, val]) => {
          const type = key as WomensHealthSignalType;
          const def = WOMENS_HEALTH_SIGNALS.find((s) => s.type === type);
          return {
            type,
            label: def ? def.label : type,
            severity: val.severity,
            subTags: val.subTags,
            notes: val.notes.trim() || undefined,
          };
        });

      await onSave({
        id: editingEntry?.id,
        date,
        cycleDay: cycleDayHint,
        signals: signalsToSave,
        generalNotes: generalNotes.trim() || undefined,
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCount = (Object.values(activeSignals) as { selected: boolean }[]).filter((s) => s.selected).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingEntry ? 'Edit Health Signal Log' : 'Log Women’s Health Signals'}
      subtitle="Track personal body changes to bring objective observations to healthcare visits."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date and cycle day */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Log Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Estimated Cycle Day
            </label>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
              <span>{cycleDayHint ? `Cycle Day ${cycleDayHint}` : 'Not linked to a period start'}</span>
              <span className="text-[10px] text-slate-500">Auto-detected</span>
            </div>
          </div>
        </div>

        {/* Informational Guidance Banner */}
        <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            Select any signals you noticed today. You have full control over what details to log; these records help you recognize recurring shifts and form concise questions for your physician.
          </p>
        </div>

        {/* Signal Selection Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white uppercase tracking-wider">
              Optional Health Signals ({selectedCount} selected)
            </label>
            <span className="text-[11px] text-slate-400">Tap a card to toggle tracking</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {WOMENS_HEALTH_SIGNALS.map((sig: SignalTypeDefinition) => {
              const state = activeSignals[sig.type];
              const isSelected = state.selected;

              return (
                <div
                  key={sig.type}
                  className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#121B30] border-violet-500/50 shadow-sm shadow-violet-950/40 ring-1 ring-violet-500/30'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                          {getSignalIcon(sig.type)}
                        </div>
                        <span className="text-xs font-semibold text-white">{sig.label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSignalSelection(sig.type)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-violet-600 text-white'
                            : 'border border-slate-700 hover:border-slate-500 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                      {sig.description}
                    </p>
                  </div>

                  {/* Expanded Controls if selected */}
                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-2.5 animate-in fade-in duration-150">
                      {/* Severity Selector */}
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                          Intensity / Impact
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          {(['mild', 'moderate', 'notable'] as SignalSeverityLevel[]).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setSignalSeverity(sig.type, lvl)}
                              className={`py-1 rounded text-[10px] font-medium capitalize transition-colors ${
                                state.severity === lvl
                                  ? lvl === 'mild'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : lvl === 'moderate'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-slate-800/70 text-slate-400 border border-slate-700/60 hover:text-white'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sub-tag chips */}
                      {sig.subTags && sig.subTags.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                            Specific Details
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {sig.subTags.map((tag) => {
                              const isTagActive = state.subTags.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => toggleSubTag(sig.type, tag)}
                                  className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                                    isTagActive
                                      ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40 font-medium'
                                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-slate-200'
                                  }`}
                                >
                                  {tag}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Signal Note */}
                      <div>
                        <input
                          type="text"
                          placeholder="Optional specific detail..."
                          value={state.notes}
                          onChange={(e) => setSignalNotes(sig.type, e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* General Entry Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>General Notes for Today (Optional)</span>
          </label>
          <textarea
            rows={2}
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="E.g., High work deadline stress, changed skincare routine, or notable changes observed..."
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isSubmitting}
            disabled={selectedCount === 0 && !generalNotes.trim()}
          >
            {editingEntry ? 'Update Signal Entry' : 'Save Health Signals'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
