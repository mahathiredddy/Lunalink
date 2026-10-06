import React, { useState, useEffect } from 'react';
import { MemoryItem, MemoryCategory } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  X,
  Lock,
  HeartHandshake,
  Calendar,
  Sparkles,
  Heart,
  FileText,
  Image as ImageIcon,
  Check,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface CreateMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: MemoryItem | null;
  partnerName: string;
}

const PRESET_ATMOSPHERES = [
  {
    label: 'Warm Tea & Home',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Coastal Breeze',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Quiet Bookstore',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Forest Canopy',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  },
];

export const CreateMemoryModal: React.FC<CreateMemoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  partnerName,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-17');
  const [category, setCategory] = useState<MemoryCategory>('memories');
  const [message, setMessage] = useState('');
  const [imagePlaceholder, setImagePlaceholder] = useState('');
  const [isSharedWithPartner, setIsSharedWithPartner] = useState(true);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date);
      setCategory(initialData.category);
      setMessage(initialData.message);
      setImagePlaceholder(initialData.imagePlaceholder || '');
      setIsSharedWithPartner(initialData.isSharedWithPartner);
    } else {
      setTitle('');
      setDate('2026-09-17');
      setCategory('memories');
      setMessage('');
      setImagePlaceholder('');
      setIsSharedWithPartner(true);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        date: date || '2026-09-17',
        category,
        message: message.trim(),
        imagePlaceholder: imagePlaceholder.trim(),
        isSharedWithPartner,
        authorId: 'user_1',
        authorName: 'Alex',
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white font-display">
                {initialData ? 'Edit Moment' : 'Create Memory'}
              </h3>
              <p className="text-xs text-slate-400">
                Preserve meaningful notes, appreciation, and shared moments
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Section / Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('memories')}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  category === 'memories'
                    ? 'border-amber-500/50 bg-amber-950/25 text-amber-200 shadow-sm'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold">Memories</span>
                <span className="text-[10px] text-slate-400">Meaningful times</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('appreciation')}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  category === 'appreciation'
                    ? 'border-rose-500/50 bg-rose-950/25 text-rose-200 shadow-sm'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold">Appreciation</span>
                <span className="text-[10px] text-slate-400">Gratitude words</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('notes')}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  category === 'notes'
                    ? 'border-violet-500/50 bg-violet-950/25 text-violet-200 shadow-sm'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold">Notes</span>
                <span className="text-[10px] text-slate-400">Shared thoughts</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Rainy Sunday Lavender Tea, Coastal Walk at Point Reyes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs sm:text-sm"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-violet-500 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Message / Words to Keep
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What made you feel supported, or what moment do you want to hold onto? Write honestly and gently..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs sm:text-sm resize-none"
            />
          </div>

          {/* Optional Image Placeholder */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Atmospheric Image Placeholder (Optional)</span>
              </label>
              <button
                type="button"
                onClick={() => setShowImagePicker(!showImagePicker)}
                className="text-[11px] text-violet-400 hover:text-violet-300 cursor-pointer"
              >
                {showImagePicker ? 'Hide presets' : 'Browse serene atmospheres'}
              </button>
            </div>

            {showImagePicker && (
              <div className="grid grid-cols-2 gap-2 mb-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                {PRESET_ATMOSPHERES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setImagePlaceholder(preset.url);
                      setShowImagePicker(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-9 h-9 rounded object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] text-slate-300 truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            )}

            <input
              type="url"
              value={imagePlaceholder}
              onChange={(e) => setImagePlaceholder(e.target.value)}
              placeholder="Paste photo URL or select from presets above..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
            />
            {imagePlaceholder && (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Image attached
                </span>
                <button
                  type="button"
                  onClick={() => setImagePlaceholder('')}
                  className="text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          {/* Privacy & Shared Toggle (Strict Requirement) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isSharedWithPartner
                      ? 'bg-violet-950/40 text-violet-300 border-violet-500/30'
                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {isSharedWithPartner ? (
                    <HeartHandshake className="w-4 h-4 text-violet-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {isSharedWithPartner ? `Shared with ${partnerName}` : 'Private to You'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isSharedWithPartner
                      ? `Visible only to ${partnerName} in your encrypted connection.`
                      : 'Remains strictly private on your device. Never visible to partner.'}
                  </span>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isSharedWithPartner}
                onClick={() => setIsSharedWithPartner(!isSharedWithPartner)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isSharedWithPartner ? 'bg-violet-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isSharedWithPartner ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>
                {isSharedWithPartner
                  ? 'Shared memories do not expose clinical cycle data.'
                  : 'Protected by LunaLink zero-leakage local storage.'}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-2.5">
            <Button variant="ghost" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isSubmitting || !title.trim() || !message.trim()}
            >
              {initialData ? 'Save Changes' : 'Create Memory'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
