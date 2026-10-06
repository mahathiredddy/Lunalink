import React from 'react';
import { MemoryItem } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Lock,
  HeartHandshake,
  Calendar,
  Sparkles,
  Heart,
  FileText,
  Eye,
  Edit2,
  Trash2,
  Share2,
  Bookmark,
} from 'lucide-react';

interface MemoryCardProps {
  memory: MemoryItem;
  partnerName: string;
  onView: (memory: MemoryItem) => void;
  onEdit: (memory: MemoryItem) => void;
  onDelete: (id: string) => void;
  onToggleShare: (id: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  partnerName,
  onView,
  onEdit,
  onDelete,
  onToggleShare,
}) => {
  const getCategoryConfig = (category: MemoryItem['category']) => {
    switch (category) {
      case 'appreciation':
        return {
          label: 'Appreciation',
          icon: <Heart className="w-3 h-3 text-rose-400" />,
          badgeVariant: 'shared' as const,
          accentBorder: 'hover:border-rose-500/30',
        };
      case 'memories':
        return {
          label: 'Memory',
          icon: <Sparkles className="w-3 h-3 text-amber-400" />,
          badgeVariant: 'default' as const,
          accentBorder: 'hover:border-amber-500/30',
        };
      case 'notes':
      default:
        return {
          label: 'Note',
          icon: <FileText className="w-3 h-3 text-violet-400" />,
          badgeVariant: 'subtle' as const,
          accentBorder: 'hover:border-violet-500/30',
        };
    }
  };

  const config = getCategoryConfig(memory.category);

  return (
    <Card
      variant="default"
      padding="none"
      className={`group flex flex-col justify-between overflow-hidden bg-slate-900/80 border-slate-800 transition-all duration-200 hover:shadow-lg ${config.accentBorder}`}
    >
      {/* Optional atmospheric image placeholder */}
      {memory.imagePlaceholder ? (
        <div className="relative w-full h-44 overflow-hidden bg-slate-950">
          <img
            src={memory.imagePlaceholder}
            alt={memory.title}
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {memory.isSharedWithPartner ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-violet-950/80 backdrop-blur-md text-violet-200 border border-violet-500/30">
                <HeartHandshake className="w-3 h-3 text-violet-400" />
                <span>Shared with {partnerName}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/50">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Private (Only you)</span>
              </span>
            )}
          </div>
        </div>
      ) : null}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row: category + privacy badge (if no image) + date */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Badge variant={config.badgeVariant} size="sm" icon={config.icon}>
                {config.label}
              </Badge>
              {!memory.imagePlaceholder && (
                <>
                  {memory.isSharedWithPartner ? (
                    <Badge variant="shared" size="sm" icon={<HeartHandshake className="w-3 h-3 text-violet-400" />}>
                      Shared with {partnerName}
                    </Badge>
                  ) : (
                    <Badge variant="subtle" size="sm" icon={<Lock className="w-3 h-3 text-emerald-400" />}>
                      Private
                    </Badge>
                  )}
                </>
              )}
            </div>

            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              {memory.date}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onView(memory)}
            className="text-base font-semibold text-white font-display tracking-tight group-hover:text-violet-300 transition-colors cursor-pointer"
          >
            {memory.title}
          </h3>

          {/* Message preview */}
          <p
            onClick={() => onView(memory)}
            className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed cursor-pointer"
          >
            "{memory.message}"
          </p>
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleShare(memory.id)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                memory.isSharedWithPartner
                  ? 'border-violet-500/40 text-violet-300 bg-violet-950/30 hover:bg-violet-900/40'
                  : 'border-slate-700 text-slate-400 bg-slate-800/40 hover:bg-slate-800 hover:text-white'
              }`}
              title={memory.isSharedWithPartner ? 'Make Private' : `Share with ${partnerName}`}
            >
              {memory.isSharedWithPartner ? (
                <>
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Make Private</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3 text-violet-400" />
                  <span>Share with {partnerName}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onView(memory)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="View Moment"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(memory)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit Moment"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(memory.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Delete Moment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
