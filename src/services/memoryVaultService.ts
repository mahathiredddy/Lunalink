import { MemoryItem, MemoryCategory } from '../types';

const STORAGE_KEY = 'lunalink_memory_vault_v1';

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem_1',
    title: 'Rainy Sunday Lavender Tea',
    date: '2026-09-12',
    message:
      'You noticed I was exhausted and made that soothing chamomile-lavender tea without me having to ask. It was the quietest, kindest comfort of the week.',
    category: 'appreciation',
    imagePlaceholder: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    isSharedWithPartner: true,
    authorId: 'user_1',
    authorName: 'Alex',
    createdAt: '2026-09-12T19:30:00Z',
    updatedAt: '2026-09-12T19:30:00Z',
  },
  {
    id: 'mem_2',
    title: 'Coastal Walk at Point Reyes',
    date: '2026-08-28',
    message:
      'The fog rolling over the cypress trees. We sat by the water wrapped in one big wool blanket, talking about what we want our next year to feel like.',
    category: 'memories',
    imagePlaceholder: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    isSharedWithPartner: true,
    authorId: 'user_1',
    authorName: 'Alex',
    createdAt: '2026-08-28T16:00:00Z',
    updatedAt: '2026-08-28T16:00:00Z',
  },
  {
    id: 'mem_3',
    title: 'Morning Routine & Gentle Boundaries',
    date: '2026-09-04',
    message:
      'Note to self: When energy is low in the luteal phase, preserve morning silence for at least 20 minutes before checking messages. It grounds the entire day.',
    category: 'notes',
    imagePlaceholder: '',
    isSharedWithPartner: false, // Private note
    authorId: 'user_1',
    authorName: 'Alex',
    createdAt: '2026-09-04T08:15:00Z',
    updatedAt: '2026-09-04T08:15:00Z',
  },
  {
    id: 'mem_4',
    title: 'Finding the Little Bookshop on Elm',
    date: '2026-07-19',
    message:
      'Hidden back corner with cedar shelves and acoustic jazz. We promised to make bookstore browsing our rainy afternoon ritual whenever one of us needs a slow reset.',
    category: 'memories',
    imagePlaceholder: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    isSharedWithPartner: true,
    authorId: 'user_1',
    authorName: 'Alex',
    createdAt: '2026-07-19T14:45:00Z',
    updatedAt: '2026-07-19T14:45:00Z',
  },
  {
    id: 'mem_5',
    title: 'Thank You for Hearing My Words',
    date: '2026-09-08',
    message:
      'Thank you for just sitting on the sofa and listening when I was overwhelmed, without jumping straight into problem-solving. It made me feel truly held.',
    category: 'appreciation',
    imagePlaceholder: '',
    isSharedWithPartner: true,
    authorId: 'user_1',
    authorName: 'Alex',
    createdAt: '2026-09-08T21:10:00Z',
    updatedAt: '2026-09-08T21:10:00Z',
  },
  {
    id: 'mem_6',
    title: 'Personal Reflections on Rest',
    date: '2026-09-01',
    message:
      'Rest is not something I have to earn through extreme exhaustion. Giving myself permission to rest on day 1 and 2 is an act of self-respect.',
    category: 'notes',
    imagePlaceholder: '',
    isSharedWithPartner: false, // Private
    authorId: 'user_1',
    authorName: 'Alex',
    createdAt: '2026-09-01T22:00:00Z',
    updatedAt: '2026-09-01T22:00:00Z',
  },
];

class MemoryVaultService {
  private getStoredMemories(): MemoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return INITIAL_MEMORIES;
  }

  private saveStoredMemories(memories: MemoryItem[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    } catch {
      // ignore
    }
  }

  getMemories(): MemoryItem[] {
    return this.getStoredMemories();
  }

  getMemoriesByCategory(category: MemoryCategory): MemoryItem[] {
    return this.getStoredMemories().filter((m) => m.category === category);
  }

  addMemory(
    data: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>
  ): MemoryItem {
    const list = this.getStoredMemories();
    const now = new Date().toISOString();
    const newMemory: MemoryItem = {
      ...data,
      id: `mem_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(newMemory);
    this.saveStoredMemories(list);
    return newMemory;
  }

  updateMemory(id: string, updates: Partial<MemoryItem>): MemoryItem | null {
    const list = this.getStoredMemories();
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const updated: MemoryItem = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    this.saveStoredMemories(list);
    return updated;
  }

  deleteMemory(id: string): boolean {
    const list = this.getStoredMemories();
    const filtered = list.filter((m) => m.id !== id);
    if (filtered.length !== list.length) {
      this.saveStoredMemories(filtered);
      return true;
    }
    return false;
  }

  toggleShare(id: string): MemoryItem | null {
    const list = this.getStoredMemories();
    const item = list.find((m) => m.id === id);
    if (!item) return null;
    return this.updateMemory(id, { isSharedWithPartner: !item.isSharedWithPartner });
  }
}

export const memoryVaultService = new MemoryVaultService();
