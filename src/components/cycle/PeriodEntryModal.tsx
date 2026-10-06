import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CycleEntry } from '../../types';
import { diffDays } from '../../services/cycleService';
import { Calendar, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface PeriodEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: { id?: string; startDate: string; endDate: string; notes?: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  editingEntry?: CycleEntry | null;
  initialDate?: string;
}

export const PeriodEntryModal: React.FC<PeriodEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingEntry,
  initialDate,
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setStartDate(editingEntry.startDate);
      setEndDate(editingEntry.endDate);
      setNotes(editingEntry.notes || '');
      setError(null);
      setShowDeleteConfirm(false);
    } else {
      const defaultStart = initialDate || '2026-09-13';
      // Default duration: 5 days
      const d = new Date(`${defaultStart}T00:00:00`);
      d.setDate(d.getDate() + 4);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const defaultEnd = `${year}-${month}-${day}`;

      setStartDate(defaultStart);
      setEndDate(defaultEnd);
      setNotes('');
      setError(null);
      setShowDeleteConfirm(false);
    }
  }, [editingEntry, initialDate, isOpen]);

  // Calculated duration
  const daysDiff = startDate && endDate ? diffDays(endDate, startDate) + 1 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startDate || !endDate) {
      setError('Please provide both period start and end dates.');
      return;
    }

    if (endDate < startDate) {
      setError('Period end date cannot be earlier than the start date.');
      return;
    }

    if (daysDiff > 20) {
      setError('A single period flow duration typically does not exceed 20 days. Please verify dates.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: editingEntry?.id,
        startDate,
        endDate,
        notes: notes.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingEntry?.id || !onDelete) return;
    setIsSubmitting(true);
    try {
      await onDelete(editingEntry.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingEntry ? 'Edit Period Entry' : 'Log Period'}
      subtitle="Record your menstrual flow dates for accurate personal tracking."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Informational badge */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#080C16] border border-slate-800 text-xs">
          <span className="text-slate-400">Data Type:</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/40 text-rose-300 font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            User-Recorded
          </span>
        </div>

        {/* Start and End Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            id="period-start-date"
            label="Period Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          />

          <Input
            id="period-end-date"
            label="Period End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Live Duration Calculation */}
        {daysDiff > 0 && (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-400">Calculated Flow Duration:</span>
            <span className="font-semibold text-white">
              {daysDiff} {daysDiff === 1 ? 'day' : 'days'}
            </span>
          </div>
        )}

        {/* Optional Notes */}
        <div>
          <label htmlFor="period-notes" className="block text-xs font-medium text-slate-300 mb-1.5">
            Optional Notes
          </label>
          <textarea
            id="period-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g. Flow intensity, mild cramping on day 1, energy levels..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#080C14] border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors resize-none"
          />
        </div>

        {/* Privacy reassurance */}
        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
          <span>Only you can see this unless you explicitly choose to share selected information.</span>
        </p>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          {editingEntry && onDelete ? (
            showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Confirm Delete
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            )
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {isSubmitting ? 'Saving...' : editingEntry ? 'Update Entry' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
