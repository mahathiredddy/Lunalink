import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { SharedNote } from '../types';
import {
  Sparkles,
  Plus,
  Pin,
  FileText,
  Clock,
  Heart,
  Sliders,
  User,
  Trash2,
  Calendar,
  Lock,
  Link2,
  ExternalLink,
  Tag,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';

export const SharedSpacePage: React.FC = () => {
  const {
    connection,
    partner,
    user,
    notes,
    preferences,
    activities,
    careProfile,
    createNote,
    deleteNote,
    updatePreference,
    navigateTo,
  } = useApp();

  const isConnected = connection.status === 'connected' && partner;

  // Modals state
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<SharedNote['category']>('general');
  const [newNotePinned, setNewNotePinned] = useState(false);

  // Preference editing state
  const [editingPrefId, setEditingPrefId] = useState<string | null>(null);
  const [editingPrefValue, setEditingPrefValue] = useState('');

  const handleCreateNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    await createNote(newNoteTitle.trim(), newNoteContent.trim(), newNoteCategory, newNotePinned);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteCategory('general');
    setNewNotePinned(false);
    setIsAddNoteModalOpen(false);
  };

  const handleSavePref = async (id: string) => {
    await updatePreference(id, editingPrefValue);
    setEditingPrefId(null);
  };

  if (!isConnected) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-5 animate-in fade-in duration-200">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <Sparkles className="w-8 h-8 text-violet-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-display">
            Shared Space is waiting for your partner
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Shared notes, preferences, and important logistics are only activated when both participants are connected in a mutual corridor.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => navigateTo('connect-partner')}
            leftIcon={<Link2 className="w-4 h-4" />}
          >
            Connect a Partner
          </Button>
        </div>
      </div>
    );
  }

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const regularNotes = notes.filter((n) => !n.isPinned);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-white font-display tracking-tight">
              Shared Space
            </h2>
            <Badge variant="shared" size="sm">
              Linked with {partner.name}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Private collaborative workspace for notes, logistics, preferences, and mutual updates
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddNoteModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Shared Note
        </Button>
      </div>

      {/* ================= CARE DNA / SUPPORT BLUEPRINT (WHEN SHARED) ================= */}
      {careProfile.isSharedWithPartner ? (
        <Card
          variant="glow"
          padding="lg"
          className="border-violet-500/40 bg-gradient-to-br from-[#0C1224] to-[#121A30]"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-violet-600/30 text-violet-300 border border-violet-500/30">
                  <HeartHandshake className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-white font-display">
                  Care DNA • Personal Support Blueprint
                </h3>
                <Badge variant="purple" size="sm">
                  Active Shared
                </Badge>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {careProfile.importantNotes
                  ? `"${careProfile.importantNotes}"`
                  : 'Preferences for comfort, communication, and emotional support.'}
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                {careProfile.communication && careProfile.communication.length > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-violet-950/60 border border-violet-500/30 text-violet-300">
                    Reach: {careProfile.communication.join(', ')}
                  </span>
                )}
                {careProfile.comfort && careProfile.comfort.length > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/30 text-amber-300">
                    Comfort: {careProfile.comfort.join(', ')}
                  </span>
                )}
                {careProfile.emotionalSupport && careProfile.emotionalSupport.length > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-300">
                    Posture: {careProfile.emotionalSupport.join(', ')}
                  </span>
                )}
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigateTo('care-profile')}
              leftIcon={<HeartHandshake className="w-3.5 h-3.5" />}
              className="flex-shrink-0"
            >
              View Care Profile
            </Button>
          </div>
        </Card>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Care Profile is currently private. You can customize and share how you want to be supported anytime.</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateTo('care-profile')}
            className="text-xs text-violet-300 hover:text-white"
          >
            Manage Care DNA
          </Button>
        </div>
      )}

      {/* ================= IMPORTANT UPDATES / PINNED SECTION ================= */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-300 uppercase tracking-wider">
            <Pin className="w-3.5 h-3.5 fill-violet-400" />
            <span>Important & Pinned Notes ({pinnedNotes.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pinnedNotes.map((note) => (
              <Card
                key={note.id}
                variant="glow"
                padding="md"
                className="flex flex-col justify-between group hover:border-violet-500/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-medium text-violet-300 uppercase tracking-wider bg-violet-950/60 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                      {note.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">{note.updatedAt}</span>
                      <button
                        type="button"
                        onClick={() => deleteNote(note.id)}
                        className="opacity-80 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
                        title="Delete note"
                        aria-label={`Delete note titled ${note.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-semibold text-white font-display">
                    {note.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                    {note.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Author: {note.authorName}</span>
                  <span className="flex items-center gap-1 text-violet-400">
                    <Pin className="w-3 h-3 fill-current" /> Pinned
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= GENERAL SHARED NOTES ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Shared Notes & Lists ({regularNotes.length})</span>
          </div>
          <span className="text-xs text-slate-400">Synchronized end-to-end</span>
        </div>

        {notes.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-[#0C1222] border border-dashed border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-center text-violet-400 mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="text-base font-semibold text-white font-display">No shared notes yet</h4>
              <p className="text-xs text-slate-400 mt-1">
                Start sharing essential lists, vacation itineraries, or private reminders in your private space.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddNoteModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create First Shared Note
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {regularNotes.map((note) => (
              <Card
                key={note.id}
                variant="default"
                padding="md"
                className="flex flex-col justify-between group hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="neutral" size="sm">
                      {note.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400">{note.updatedAt}</span>
                      <button
                        type="button"
                        onClick={() => deleteNote(note.id)}
                        className="opacity-80 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
                        title="Delete note"
                        aria-label={`Delete note titled ${note.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-white font-display">
                    {note.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-4 leading-relaxed whitespace-pre-line">
                    {note.content}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>By {note.authorName}</span>
                  <span className="text-[10px] text-slate-400">Shared</span>
                </div>
              </Card>
            ))}

            {/* New Note Placeholder Card */}
            <button
              type="button"
              onClick={() => setIsAddNoteModalOpen(true)}
              className="p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-violet-500/40 hover:bg-violet-950/10 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-violet-300 transition-all min-h-[160px] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <Plus className="w-5 h-5 text-violet-400" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium">Create another shared note</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= SHARED PREFERENCES & ESSENTIALS ================= */}
      <div className="space-y-4 pt-4 border-t border-slate-800/60">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white font-display tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-400" />
              <span>Shared Preferences & Mutual Details</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Quick reference for everyday coordination, travel, and personal comfort
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {preferences.map((pref) => {
            const isEditing = editingPrefId === pref.id;

            return (
              <Card key={pref.id} variant="default" padding="md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white font-display">
                    {pref.title}
                  </span>
                  <Badge variant="neutral" size="sm">
                    {pref.category}
                  </Badge>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Your value */}
                  <div className="p-2.5 rounded-xl bg-[#0A0E1A] border border-slate-800 flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="text-[10px] text-violet-400 font-medium block">
                        Your Preference
                      </span>
                      {isEditing ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={editingPrefValue}
                            onChange={(e) => setEditingPrefValue(e.target.value)}
                            className="bg-slate-900 text-white text-xs px-2 py-1 rounded border border-violet-500 w-full focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                          <Button size="sm" onClick={() => handleSavePref(pref.id)}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-200 mt-0.5 block">
                          {pref.myValue}
                        </span>
                      )}
                    </div>
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPrefId(pref.id);
                          setEditingPrefValue(pref.myValue);
                        }}
                        className="text-[10px] text-slate-400 hover:text-white underline mt-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {/* Partner value */}
                  <div className="p-2.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                    <span className="text-[10px] text-indigo-400 font-medium block">
                      {partner.name}&apos;s Preference
                    </span>
                    <span className="text-slate-300 mt-0.5 block">
                      {pref.partnerValue}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ================= RECENT ACTIVITY LOG ================= */}
      <div className="space-y-4 pt-4 border-t border-slate-800/60">
        <h3 className="text-base font-semibold text-white font-display flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Shared Space Activity Log</span>
        </h3>

        <div className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800/80 divide-y divide-slate-800/60">
          {activities.map((act) => (
            <div key={act.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-200">{act.actorName}</span>{' '}
                <span className="text-slate-400">— {act.description}</span>
              </div>
              <span className="text-[11px] text-slate-400 whitespace-nowrap ml-4">
                {act.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Note Modal */}
      <Modal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        title="Create Shared Note"
        subtitle="This note will be visible to both you and your partner in your private space."
      >
        <form onSubmit={handleCreateNoteSubmit} className="space-y-4">
          <Input
            label="Note Title"
            placeholder="e.g. Vacation Packing List or Apartment Wifi"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-medium text-slate-300">Category</label>
            <div className="flex flex-wrap gap-2">
              {(['general', 'plans', 'places', 'favorites'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setNewNoteCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs capitalize transition-colors ${
                    newNoteCategory === cat
                      ? 'bg-violet-600 text-white font-medium'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-medium text-slate-300">Note Content</label>
            <textarea
              rows={4}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your shared notes, checklist items, or details..."
              className="w-full bg-[#0D1424] text-slate-100 text-sm rounded-xl p-3 border border-slate-700 hover:border-slate-600 focus:border-violet-500 focus:outline-none"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={newNotePinned}
              onChange={(e) => setNewNotePinned(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-violet-600 focus:ring-violet-500/50"
            />
            <span>Pin this note to the top of Shared Space</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddNoteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
