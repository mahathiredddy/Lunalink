import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MemoryCard } from '../components/memory/MemoryCard';
import { CreateMemoryModal } from '../components/memory/CreateMemoryModal';
import { ViewMemoryModal } from '../components/memory/ViewMemoryModal';
import { MemoryItem, MemoryCategory } from '../types';
import {
  Sparkles,
  Heart,
  FileText,
  Lock,
  HeartHandshake,
  Plus,
  Search,
  ShieldCheck,
  Bookmark,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const MemoryVaultPage: React.FC = () => {
  const {
    memories,
    partner,
    connectionState,
    saveMemory,
    deleteMemory,
    toggleShareMemory,
    navigateTo,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'all' | MemoryCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [viewingMemory, setViewingMemory] = useState<MemoryItem | null>(null);

  const partnerName = partner?.name?.split(' ')[0] || 'Partner';

  // Filter memories based on active section and search
  const filteredMemories = memories.filter((item) => {
    const matchesSection = activeSection === 'all' || item.category === activeSection;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesSearch;
  });

  // Section Counts
  const notesCount = memories.filter((m) => m.category === 'notes').length;
  const appreciationCount = memories.filter((m) => m.category === 'appreciation').length;
  const memoriesCount = memories.filter((m) => m.category === 'memories').length;
  const sharedCount = memories.filter((m) => m.isSharedWithPartner).length;
  const privateCount = memories.filter((m) => !m.isSharedWithPartner).length;

  const handleOpenCreateModal = () => {
    setEditingMemory(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (memory: MemoryItem) => {
    setEditingMemory(memory);
    setIsCreateModalOpen(true);
  };

  const handleSave = async (
    data: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingMemory) {
      await saveMemory({ ...data, id: editingMemory.id });
    } else {
      await saveMemory(data);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ================= 1. PAGE HEADER ================= */}
      <div
        id="memory-vault-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80"
      >
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white font-display tracking-tight">
              Memory Vault
            </h1>
            <Badge variant="shared" size="sm" icon={<Heart className="w-3.5 h-3.5 text-rose-400" />}>
              Shared Moments & Gratitude
            </Badge>
            <Badge variant="subtle" size="sm" icon={<Lock className="w-3 h-3 text-emerald-400" />}>
              Strictly Encrypted
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Keep the moments that matter.
          </p>
        </div>

        {/* Action Button: Create Memory */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreateModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Memory
          </Button>
        </div>
      </div>

      {/* ================= 2. PRIVACY & PURPOSE BANNER ================= */}
      <div className="p-4.5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0C1222] to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white font-display">
              A private haven for appreciation, shared memories, and quiet thoughts
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              LunaLink stores these moments separate from cycle logs. Private entries remain visible only to you.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono flex-shrink-0 self-end sm:self-auto">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            {sharedCount} Shared with {partnerName}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            {privateCount} Private
          </span>
        </div>
      </div>

      {/* ================= 3. SECTIONS NAVIGATION ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* The 3 Core Sections: Notes, Appreciation, Memories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveSection('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeSection === 'all'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Moments</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80">
              {memories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('notes')}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeSection === 'notes'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            <span>1. Notes</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80">
              {notesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('appreciation')}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeSection === 'appreciation'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>2. Appreciation</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80">
              {appreciationCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('memories')}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeSection === 'memories'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Memories</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80">
              {memoriesCount}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, memories..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* ================= 4. MEMORIES GRID & EMPTY STATE ================= */}
      {filteredMemories.length === 0 ? (
        <Card
          variant="subtle"
          padding="lg"
          className="text-center py-16 border-dashed border-slate-800 bg-slate-900/40"
        >
          <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-white font-display">
            Your Memory Vault is waiting for its first memory.
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            Record a shared note, an expression of gratitude, or a quiet moment that grounded you.
            You choose whether each entry stays private or is shared with {partnerName}.
          </p>

          <div className="mt-6 flex justify-center">
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenCreateModal}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Memory
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              partnerName={partnerName}
              onView={(mem) => setViewingMemory(mem)}
              onEdit={handleOpenEditModal}
              onDelete={deleteMemory}
              onToggleShare={toggleShareMemory}
            />
          ))}
        </div>
      )}

      {/* ================= 5. QUICK LINK TO SHARED CALENDAR & CARE MODE ================= */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Shared moments are only visible to your securely linked partner.</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigateTo('shared-calendar')}
            className="text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Shared Practical Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateMemoryModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingMemory(null);
        }}
        onSave={handleSave}
        initialData={editingMemory}
        partnerName={partnerName}
      />

      <ViewMemoryModal
        isOpen={!!viewingMemory}
        onClose={() => setViewingMemory(null)}
        memory={viewingMemory}
        partnerName={partnerName}
        onEdit={(mem) => {
          setViewingMemory(null);
          handleOpenEditModal(mem);
        }}
        onDelete={(id) => {
          deleteMemory(id);
          setViewingMemory(null);
        }}
        onToggleShare={toggleShareMemory}
      />
    </div>
  );
};
