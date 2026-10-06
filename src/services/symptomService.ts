/**
 * Symptoms & Pain Service for LunaLink
 * 
 * Provides isolated storage and trend analysis for personal symptom & pain tracking.
 * 
 * Prepared for Supabase Migration:
 * Replace the local storage calls with standard Supabase queries:
 * 
 * SQL Schema:
 * ```sql
 * CREATE TABLE symptom_entries (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
 *   date DATE NOT NULL,
 *   pain_level SMALLINT NOT NULL CHECK (pain_level >= 0 AND pain_level <= 10),
 *   pain_location TEXT NOT NULL,
 *   symptoms TEXT[] NOT NULL DEFAULT '{}',
 *   other_symptom_detail TEXT,
 *   notes TEXT,
 *   created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
 *   updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
 * );
 * 
 * -- Enable Row Level Security (RLS)
 * ALTER TABLE symptom_entries ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Users manage own symptom records"
 *   ON symptom_entries
 *   FOR ALL
 *   USING (auth.uid() = user_id);
 * ```
 */

import { SymptomEntry, SymptomFrequencyItem, CyclePhaseSymptomMetric, CycleEntry } from '../types';

const STORAGE_KEY = 'lunalink_symptoms_v1';

export const INITIAL_SYMPTOMS: SymptomEntry[] = [
  {
    id: 'symp_1',
    date: '2026-09-17',
    painLevel: 2,
    painLocation: 'Lower back',
    symptoms: ['Fatigue', 'Bloating'],
    notes: 'Mild afternoon fatigue, drank peppermint tea and took an evening walk.',
    cycleDay: 19,
    createdAt: '2026-09-17T18:30:00Z',
  },
  {
    id: 'symp_2',
    date: '2026-09-14',
    painLevel: 3,
    painLocation: 'Head & Temples',
    symptoms: ['Headache', 'Mood changes'],
    notes: 'Busy workday screen headache. Rested eyes in the dark.',
    cycleDay: 16,
    createdAt: '2026-09-14T20:15:00Z',
  },
  {
    id: 'symp_3',
    date: '2026-09-09',
    painLevel: 0,
    painLocation: 'None',
    symptoms: ['Bloating'],
    notes: 'Felt slight digestive bloating after dinner; no physical pain.',
    cycleDay: 11,
    createdAt: '2026-09-09T21:00:00Z',
  },
  {
    id: 'symp_4',
    date: '2026-09-03',
    painLevel: 3,
    painLocation: 'Lower abdomen',
    symptoms: ['Cramps', 'Fatigue'],
    notes: 'Last day of flow; cramps much milder than Day 1.',
    cycleDay: 5,
    createdAt: '2026-09-03T11:00:00Z',
  },
  {
    id: 'symp_5',
    date: '2026-08-31',
    painLevel: 6,
    painLocation: 'Lower abdomen',
    symptoms: ['Cramps', 'Back pain', 'Nausea'],
    notes: 'Day 2 cramping peak. Heating pad provided relief.',
    cycleDay: 2,
    createdAt: '2026-08-31T09:45:00Z',
  },
  {
    id: 'symp_6',
    date: '2026-08-30',
    painLevel: 5,
    painLocation: 'Lower abdomen',
    symptoms: ['Cramps', 'Headache'],
    notes: 'Period began this morning. Took mild pain reliever and rested.',
    cycleDay: 1,
    createdAt: '2026-08-30T08:15:00Z',
  },
  {
    id: 'symp_7',
    date: '2026-08-16',
    painLevel: 2,
    painLocation: 'Pelvis',
    symptoms: ['Bloating', 'Mood changes'],
    notes: 'Mid-cycle ovulation sensations.',
    cycleDay: 15,
    createdAt: '2026-08-16T14:20:00Z',
  },
  {
    id: 'symp_8',
    date: '2026-08-04',
    painLevel: 6,
    painLocation: 'Lower abdomen',
    symptoms: ['Cramps', 'Back pain', 'Fatigue'],
    notes: 'Low energy day during flow.',
    cycleDay: 3,
    createdAt: '2026-08-04T12:00:00Z',
  },
  {
    id: 'symp_9',
    date: '2026-08-02',
    painLevel: 5,
    painLocation: 'Lower abdomen',
    symptoms: ['Cramps', 'Headache'],
    notes: 'Start of previous cycle. Hydrated with warm water.',
    cycleDay: 1,
    createdAt: '2026-08-02T10:00:00Z',
  },
];

export const symptomService = {
  /**
   * Fetch all symptom entries (sorted by date descending)
   */
  async getSymptomEntries(): Promise<SymptomEntry[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SymptomEntry[];
        if (Array.isArray(parsed)) {
          return parsed.sort((a, b) => b.date.localeCompare(a.date));
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SYMPTOMS));
      return [...INITIAL_SYMPTOMS].sort((a, b) => b.date.localeCompare(a.date));
    } catch {
      return [...INITIAL_SYMPTOMS].sort((a, b) => b.date.localeCompare(a.date));
    }
  },

  /**
   * Save (create or update) a symptom entry
   */
  async saveSymptomEntry(
    payload: Omit<SymptomEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<SymptomEntry> {
    const current = await this.getSymptomEntries();
    const now = new Date().toISOString();

    let savedEntry: SymptomEntry;

    if (payload.id) {
      // Update existing
      savedEntry = {
        ...payload,
        id: payload.id,
        updatedAt: now,
      };
      const updatedList = current.map((item) => (item.id === payload.id ? savedEntry : item));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      } catch (err) {
        console.warn('Failed saving symptoms to localStorage', err);
      }
    } else {
      // Create new
      savedEntry = {
        ...payload,
        id: `symp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: now,
        updatedAt: now,
      };
      const updatedList = [savedEntry, ...current];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      } catch (err) {
        console.warn('Failed saving symptoms to localStorage', err);
      }
    }

    return savedEntry;
  },

  /**
   * Delete a symptom entry
   */
  async deleteSymptomEntry(id: string): Promise<void> {
    const current = await this.getSymptomEntries();
    const filtered = current.filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.warn('Failed deleting symptom from localStorage', err);
    }
  },

  /**
   * Clear all entries (for empty-state demonstration)
   */
  async clearAllEntries(): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (err) {
      console.warn('Failed clearing symptoms', err);
    }
  },

  /**
   * Reset to initial sample entries
   */
  async resetDefaultEntries(): Promise<SymptomEntry[]> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SYMPTOMS));
    } catch (err) {
      console.warn('Failed resetting symptoms', err);
    }
    return [...INITIAL_SYMPTOMS].sort((a, b) => b.date.localeCompare(a.date));
  },

  /**
   * Compute symptom frequency distribution
   */
  calculateSymptomFrequency(entries: SymptomEntry[]): SymptomFrequencyItem[] {
    if (entries.length === 0) return [];

    const counts: Record<string, number> = {};
    let totalOccurrences = 0;

    entries.forEach((entry) => {
      entry.symptoms.forEach((s) => {
        counts[s] = (counts[s] || 0) + 1;
        totalOccurrences += 1;
      });
    });

    const items: SymptomFrequencyItem[] = Object.entries(counts).map(([symptom, count]) => ({
      symptom,
      count,
      percentage: totalOccurrences > 0 ? Math.round((count / entries.length) * 100) : 0,
    }));

    return items.sort((a, b) => b.count - a.count);
  },

  /**
   * Calculate symptom metrics across cycle phases
   */
  calculateCyclePhaseMetrics(
    entries: SymptomEntry[],
    cycles: CycleEntry[]
  ): CyclePhaseSymptomMetric[] {
    const phases: Record<'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal', { totalPain: number; count: number; symptoms: Record<string, number> }> = {
      Menstrual: { totalPain: 0, count: 0, symptoms: {} },
      Follicular: { totalPain: 0, count: 0, symptoms: {} },
      Ovulatory: { totalPain: 0, count: 0, symptoms: {} },
      Luteal: { totalPain: 0, count: 0, symptoms: {} },
    };

    // Determine cycle day for an entry based on nearest prior cycle start
    const sortedCycles = [...cycles].sort((a, b) => b.startDate.localeCompare(a.startDate));

    entries.forEach((entry) => {
      let cycleDay = entry.cycleDay;
      if (!cycleDay && sortedCycles.length > 0) {
        // Find most recent cycle starting on or before entry.date
        const priorCycle = sortedCycles.find((c) => c.startDate <= entry.date);
        if (priorCycle) {
          const entryTime = new Date(entry.date).getTime();
          const cycleStartTime = new Date(priorCycle.startDate).getTime();
          const diffDays = Math.floor((entryTime - cycleStartTime) / (1000 * 60 * 60 * 24)) + 1;
          if (diffDays >= 1 && diffDays <= 45) {
            cycleDay = diffDays;
          }
        }
      }

      if (!cycleDay) cycleDay = 15; // default midpoint if unmapped

      let phaseKey: 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal' = 'Luteal';
      if (cycleDay >= 1 && cycleDay <= 5) {
        phaseKey = 'Menstrual';
      } else if (cycleDay >= 6 && cycleDay <= 12) {
        phaseKey = 'Follicular';
      } else if (cycleDay >= 13 && cycleDay <= 16) {
        phaseKey = 'Ovulatory';
      } else {
        phaseKey = 'Luteal';
      }

      phases[phaseKey].totalPain += entry.painLevel;
      phases[phaseKey].count += 1;
      entry.symptoms.forEach((s) => {
        phases[phaseKey].symptoms[s] = (phases[phaseKey].symptoms[s] || 0) + 1;
      });
    });

    const phaseConfig: { phase: 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal'; dayRange: string }[] = [
      { phase: 'Menstrual', dayRange: 'Days 1 – 5' },
      { phase: 'Follicular', dayRange: 'Days 6 – 12' },
      { phase: 'Ovulatory', dayRange: 'Days 13 – 16' },
      { phase: 'Luteal', dayRange: 'Days 17 – 28+' },
    ];

    return phaseConfig.map(({ phase, dayRange }) => {
      const data = phases[phase];
      const avgPain = data.count > 0 ? Number((data.totalPain / data.count).toFixed(1)) : 0;
      let topSymptom = 'None logged';
      let topCount = 0;
      Object.entries(data.symptoms).forEach(([s, count]) => {
        if (count > topCount) {
          topCount = count;
          topSymptom = s;
        }
      });

      return {
        phase,
        dayRange,
        avgPain,
        entryCount: data.count,
        topSymptom: topCount > 0 ? topSymptom : 'Mild',
      };
    });
  },
};
