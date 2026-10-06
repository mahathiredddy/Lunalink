import React, { useState, useEffect } from 'react';
import { SymptomEntry, KnownSymptom } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  Calendar as CalendarIcon,
  Smile,
  AlertCircle,
  Activity,
  Check,
  Trash2,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';

interface SymptomEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryToEdit?: SymptomEntry | null;
  onSave: (payload: Omit<SymptomEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  currentCycleDay?: number;
}

const AVAILABLE_SYMPTOMS: { name: KnownSymptom; description: string }[] = [
  { name: 'Cramps', description: 'Uterine or abdominal contractions' },
  { name: 'Fatigue', description: 'Low energy or sluggishness' },
  { name: 'Headache', description: 'Tension, temples, or migraine' },
  { name: 'Back pain', description: 'Lower or upper lumbar ache' },
  { name: 'Nausea', description: 'Queasiness or digestive discomfort' },
  { name: 'Mood changes', description: 'Sensitivity, irritability, or low mood' },
  { name: 'Bloating', description: 'Fluid retention or abdominal fullness' },
  { name: 'Other', description: 'Custom symptom or body sensation' },
];

const COMMON_LOCATIONS = [
  'Lower abdomen',
  'Lower back',
  'Head & Temples',
  'Pelvis',
  'Breasts / Chest',
  'Joints & Muscles',
  'Whole body',
  'None',
];

export const SymptomEntryModal: React.FC<SymptomEntryModalProps> = ({
  isOpen,
  onClose,
  entryToEdit,
  onSave,
  onDelete,
  currentCycleDay,
}) => {
  const [date, setDate] = useState<string>('');
  const [painLevel, setPainLevel] = useState<number>(0);
  const [painLocation, setPainLocation] = useState<string>('Lower abdomen');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherDetail, setOtherDetail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize or reset form when modal opens or entryToEdit changes
  useEffect(() => {
    if (entryToEdit) {
      setDate(entryToEdit.date);
      setPainLevel(entryToEdit.painLevel);
      if (COMMON_LOCATIONS.includes(entryToEdit.painLocation)) {
        setPainLocation(entryToEdit.painLocation);
        setCustomLocation('');
      } else {
        setPainLocation('Custom');
        setCustomLocation(entryToEdit.painLocation);
      }
      setSelectedSymptoms(entryToEdit.symptoms || []);
      setOtherDetail(entryToEdit.otherSymptomDetail || '');
      setNotes(entryToEdit.notes || '');
    } else {
      // Default to today
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setPainLevel(2); // Gentle default
      setPainLocation('Lower abdomen');
      setCustomLocation('');
      setSelectedSymptoms(['Cramps']);
      setOtherDetail('');
      setNotes('');
    }
    setShowDeleteConfirm(false);
  }, [entryToEdit, isOpen]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleQuickDate = (type: 'today' | 'yesterday') => {
    const d = new Date();
    if (type === 'yesterday') {
      d.setDate(d.getDate() - 1);
    }
    setDate(d.toISOString().split('T')[0]);
  };

  const getPainLevelLabel = (val: number) => {
    if (val === 0) return { label: '0 • No Pain', desc: 'Feeling physically comfortable' };
    if (val <= 3) return { label: `${val} • Mild`, desc: 'Noticeable, easily managed' };
    if (val <= 6) return { label: `${val} • Moderate`, desc: 'Interferes with daily focus' };
    if (val <= 8) return { label: `${val} • Severe`, desc: 'High discomfort, needs rest' };
    return { label: `${val} • Very Severe`, desc: 'Debilitating, intense pain' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setIsSubmitting(true);
    try {
      const finalLocation = painLocation === 'Custom' ? customLocation.trim() || 'Unspecified' : painLocation;

      await onSave({
        id: entryToEdit?.id,
        date,
        painLevel,
        painLocation: finalLocation,
        symptoms: selectedSymptoms,
        otherSymptomDetail: selectedSymptoms.includes('Other') ? otherDetail.trim() : undefined,
        notes: notes.trim() || undefined,
        cycleDay: entryToEdit?.cycleDay || currentCycleDay,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!entryToEdit?.id || !onDelete) return;
    setIsSubmitting(true);
    try {
      await onDelete(entryToEdit.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const painInfo = getPainLevelLabel(painLevel);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={entryToEdit ? 'Edit Symptom & Pain Entry' : 'Log Symptoms & Pain'}
      subtitle="Record what you are experiencing at your own pace. All details remain private to you."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-violet-400" />
              Date of Record
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDate('today')}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate('yesterday')}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                Yesterday
              </button>
            </div>
          </div>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {/* Pain Level Section (Not the sole focus, but clear and comfortable) */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                Pain or Discomfort Level
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Scale from 0 (none) to 10 (very severe)
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
                painLevel === 0
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                  : painLevel <= 3
                  ? 'bg-sky-950/60 text-sky-300 border-sky-500/30'
                  : painLevel <= 6
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                  : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
              }`}>
                {painInfo.label}
              </span>
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-2 pt-1">
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={painLevel}
              onChange={(e) => setPainLevel(parseInt(e.target.value, 10))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (None)</span>
              <span>2</span>
              <span>4</span>
              <span>6</span>
              <span>8</span>
              <span>10 (Severe)</span>
            </div>
          </div>

          {/* Quick buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setPainLevel(val)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition-all ${
                  painLevel === val
                    ? 'bg-rose-500 text-white font-bold ring-2 ring-rose-400/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {val}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPainLevel(0);
                setPainLocation('None');
              }}
              className="px-2.5 py-1 text-xs text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-lg transition-colors ml-auto flex items-center gap-1"
            >
              <Smile className="w-3 h-3" />
              No Pain Today
            </button>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            {painInfo.desc}
          </p>
        </div>

        {/* Pain Location */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-violet-400" />
            Pain Location / Body Focus
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_LOCATIONS.map((loc) => {
              const isSelected = painLocation === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setPainLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    isSelected
                      ? 'bg-violet-600/30 border-violet-500 text-violet-200 font-semibold shadow-sm'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {loc}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPainLocation('Custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                painLocation === 'Custom'
                  ? 'bg-violet-600/30 border-violet-500 text-violet-200 font-semibold'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              Other Location...
            </button>
          </div>
          {painLocation === 'Custom' && (
            <input
              type="text"
              placeholder="Specify body area (e.g. Upper right quadrant, shoulder, joints)"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#090E1A] border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500"
            />
          )}
        </div>

        {/* Symptoms Multi-Select */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Experienced Symptoms (Select all that apply)
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {selectedSymptoms.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AVAILABLE_SYMPTOMS.map(({ name }) => {
              const isSelected = selectedSymptoms.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleSymptom(name)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-violet-600/25 border-violet-500 text-white shadow-sm'
                      : 'bg-[#090E1A] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-slate-100'
                  }`}
                >
                  <span className="text-xs font-medium">{name}</span>
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-violet-500 border-violet-400 text-white'
                      : 'border-slate-700 bg-slate-800'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedSymptoms.includes('Other') && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="Describe other symptom (e.g. Brain fog, dizziness, craving sweets)"
                value={otherDetail}
                onChange={(e) => setOtherDetail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#090E1A] border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
          )}
        </div>

        {/* Optional Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Optional Notes & What Helped
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Took 200mg ibuprofen at noon. Warm herbal tea and a 20-minute rest helped ease cramping."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500 leading-relaxed resize-none"
          />
        </div>

        {/* Delete Confirmation Alert if requested */}
        {showDeleteConfirm && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="text-xs text-rose-200">
                Are you sure you want to delete this symptom record?
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                type="button"
                onClick={handleDelete}
                isLoading={isSubmitting}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div>
            {entryToEdit && onDelete && !showDeleteConfirm && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isSubmitting}
            >
              {entryToEdit ? 'Save Changes' : 'Save Entry'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
