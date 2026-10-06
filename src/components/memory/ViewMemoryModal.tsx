import React from 'react';
import { MemoryItem } from '../../types';
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
  Edit2,
  Trash2,
  Share2,
} from 'lucide-react';

interface ViewMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: MemoryItem | null;
  partnerName: string;
  onEdit: (memory: MemoryItem) => void;
  onDelete: (id: string) => void;
  onToggleShare: (id: string) => void;
}

export const ViewMemoryModal: React.FC<ViewMemoryModalProps> = ({
  isOpen,
  onClose,
  memory,
  partnerName,
  onEdit,
  onDelete,
  onToggleShare,
}) => {
  if (!isOpen || !memory) return null;

  const getCategoryDetails = (category: MemoryItem['category']) => {
    switch (category) {
      case 'appreciation':
        return {
          label: 'Appreciation',
          icon: <Heart className="w-3.5 h-3.5 text-rose-400" />,
          variant: 'shared' as const,
        };
      case 'memories':
        return {
          label: 'Memory',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
          variant: 'default' as const,
        };
      case 'notes':
      default:
        return {
          label: 'Note',
          icon: <FileText className="w-3.5 h-3.5 text-violet-400" />,
          variant: 'subtle' as const,
        };
    }
  };

  const cat = getCategoryDetails(memory.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Optional Image */}
        {memory.imagePlaceholder && (
          <div className="relative w-full h-56 bg-slate-950 overflow-hidden">
            <img
              src={memory.imagePlaceholder}
              alt={memory.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 text-slate-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {!memory.imagePlaceholder && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={cat.variant} size="sm" icon={cat.icon}>
                  {cat.label}
                </Badge>
                {memory.isSharedWithPartner ? (
                  <Badge variant="shared" size="sm" icon={<HeartHandshake className="w-3 h-3 text-violet-400" />}>
                    Shared with {partnerName}
                  </Badge>
                ) : (
                  <Badge variant="subtle" size="sm" icon={<Lock className="w-3 h-3 text-emerald-400" />}>
                    Private (Only You)
                  </Badge>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{memory.date}</span>
              <span>•</span>
              <span>Added by {memory.authorName || 'Alex'}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight leading-snug">
              {memory.title}
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif whitespace-pre-wrap">
              "{memory.message}"
            </p>
          </div>

          {/* Privacy Status Card */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-2.5">
              {memory.isSharedWithPartner ? (
                <>
                  <HeartHandshake className="w-4 h-4 text-violet-400" />
                  <span className="text-slate-300">
                    Visible to <strong className="text-white">{partnerName}</strong> in shared space
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">
                    Encrypted and stored strictly on this device
                  </span>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleShare(memory.id)}
              leftIcon={
                memory.isSharedWithPartner ? (
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Share2 className="w-3.5 h-3.5 text-violet-400" />
                )
              }
            >
              {memory.isSharedWithPartner ? 'Make Private' : 'Share with Partner'}
            </Button>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onDelete(memory.id);
                onClose();
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-rose-950/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete from Vault</span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onEdit(memory);
                  onClose();
                }}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
