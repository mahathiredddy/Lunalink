/**
 * Cycle & Menstrual Health Service for LunaLink
 * 
 * Manages cycle records, history, and client-side estimates.
 * Prepared for Supabase migration: replace localStorage read/writes with
 * `supabase.from('cycle_entries').select/insert/update/delete`.
 * 
 * Note: LunaLink distinguishes recorded data from mathematical estimates.
 * Predictions are explicitly labeled as non-medical estimates based on cycle history.
 */

import { CycleEntry, CycleStats } from '../types';

const STORAGE_KEY = 'lunalink_cycles_v1';

export const INITIAL_CYCLES: CycleEntry[] = [
  {
    id: 'cycle_1',
    startDate: '2026-08-30',
    endDate: '2026-09-03',
    periodDurationDays: 5,
    notes: 'Mild cramping on Day 1. Hydrated well.',
    isRecorded: true,
  },
  {
    id: 'cycle_2',
    startDate: '2026-08-02',
    endDate: '2026-08-06',
    cycleLengthDays: 28,
    periodDurationDays: 5,
    notes: 'Regular flow, normal energy levels.',
    isRecorded: true,
  },
  {
    id: 'cycle_3',
    startDate: '2026-07-04',
    endDate: '2026-07-09',
    cycleLengthDays: 29,
    periodDurationDays: 6,
    notes: 'Travel day at cycle start.',
    isRecorded: true,
  },
  {
    id: 'cycle_4',
    startDate: '2026-06-06',
    endDate: '2026-06-11',
    cycleLengthDays: 28,
    periodDurationDays: 6,
    notes: 'Consistent cycle.',
    isRecorded: true,
  },
  {
    id: 'cycle_5',
    startDate: '2026-05-09',
    endDate: '2026-05-14',
    cycleLengthDays: 28,
    periodDurationDays: 6,
    notes: 'Routine cycle.',
    isRecorded: true,
  },
];

// Helper to compute difference in calendar days
export function diffDays(dateA: string, dateB: string): number {
  const a = new Date(`${dateA}T00:00:00`);
  const b = new Date(`${dateB}T00:00:00`);
  const diffTime = a.getTime() - b.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Format a Date object to YYYY-MM-DD
export function formatDateYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Add days to a YYYY-MM-DD string
export function addDaysYMD(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return formatDateYMD(d);
}

// Recalculate cycle lengths across sorted cycles (newest first)
export function calculateCycleLengths(entries: CycleEntry[]): CycleEntry[] {
  if (!entries || !Array.isArray(entries)) return [];
  // Sort descending by startDate
  const sorted = [...entries].sort((a, b) => (b.startDate > a.startDate ? 1 : -1));
  
  return sorted.map((entry, index) => {
    // Duration of period bleeding
    const periodDurationDays = Math.max(1, diffDays(entry.endDate, entry.startDate) + 1);
    
    // Cycle length is days from this cycle's start to previous newer cycle's start
    // If there is a newer cycle (index > 0):
    if (index > 0) {
      const newerCycle = sorted[index - 1];
      const cycleLength = diffDays(newerCycle.startDate, entry.startDate);
      return {
        ...entry,
        periodDurationDays,
        cycleLengthDays: cycleLength > 0 ? cycleLength : entry.cycleLengthDays,
      };
    }

    return {
      ...entry,
      periodDurationDays,
    };
  });
}

export const cycleService = {
  async getCycles(): Promise<CycleEntry[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CYCLES));
        return calculateCycleLengths(INITIAL_CYCLES);
      }
      const parsed: CycleEntry[] = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return calculateCycleLengths(INITIAL_CYCLES);
      }
      return calculateCycleLengths(parsed);
    } catch {
      return calculateCycleLengths(INITIAL_CYCLES);
    }
  },

  async saveCycle(entry: {
    id?: string;
    startDate: string;
    endDate: string;
    notes?: string;
  }): Promise<CycleEntry[]> {
    const cycles = await this.getCycles();
    const duration = Math.max(1, diffDays(entry.endDate, entry.startDate) + 1);

    let updated: CycleEntry[];
    if (entry.id) {
      // Edit existing
      updated = cycles.map((c) =>
        c.id === entry.id
          ? {
              ...c,
              startDate: entry.startDate,
              endDate: entry.endDate,
              periodDurationDays: duration,
              notes: entry.notes?.trim(),
              isRecorded: true,
            }
          : c
      );
    } else {
      // Add new
      const newEntry: CycleEntry = {
        id: `cycle_${Date.now()}`,
        startDate: entry.startDate,
        endDate: entry.endDate,
        periodDurationDays: duration,
        notes: entry.notes?.trim(),
        isRecorded: true,
      };
      updated = [newEntry, ...cycles];
    }

    const recomputed = calculateCycleLengths(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recomputed));
    } catch (e) {
      console.warn('Failed to persist cycles to localStorage', e);
    }
    return recomputed;
  },

  async deleteCycle(id: string): Promise<CycleEntry[]> {
    const cycles = await this.getCycles();
    const filtered = cycles.filter((c) => c.id !== id);
    const recomputed = calculateCycleLengths(filtered);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recomputed));
    } catch (e) {
      console.warn('Failed to update cycles after deletion', e);
    }
    return recomputed;
  },

  calculateStats(cycles: CycleEntry[], refDateStr: string = '2026-09-13'): CycleStats {
    if (!cycles.length) {
      return {
        currentCycleDay: 1,
        lastPeriodStart: refDateStr,
        lastPeriodEnd: refDateStr,
        averageCycleLength: 28,
        nextEstimatedPeriodStart: addDaysYMD(refDateStr, 28),
        nextEstimatedPeriodEnd: addDaysYMD(refDateStr, 33),
        estimatedFertileWindowStart: addDaysYMD(refDateStr, 12),
        estimatedFertileWindowEnd: addDaysYMD(refDateStr, 16),
        totalCyclesRecorded: 0,
      };
    }

    const sorted = [...cycles].sort((a, b) => (b.startDate > a.startDate ? 1 : -1));
    const latest = sorted[0];

    // Compute average cycle length from existing completed cycles with cycleLengthDays
    const validLengths = sorted
      .map((c) => c.cycleLengthDays)
      .filter((len): len is number => typeof len === 'number' && len >= 20 && len <= 45);

    const averageCycleLength =
      validLengths.length > 0
        ? Math.round(validLengths.reduce((acc, v) => acc + v, 0) / validLengths.length)
        : 28;

    // Current cycle day = days since latest.startDate + 1
    const daysSinceStart = diffDays(refDateStr, latest.startDate);
    const currentCycleDay = daysSinceStart >= 0 ? daysSinceStart + 1 : 1;

    // Average duration of bleeding period
    const avgDuration = Math.round(
      sorted.reduce((acc, c) => acc + (c.periodDurationDays || 5), 0) / sorted.length
    ) || 5;

    // Next estimated period start = latest.startDate + averageCycleLength
    const nextEstimatedPeriodStart = addDaysYMD(latest.startDate, averageCycleLength);
    const nextEstimatedPeriodEnd = addDaysYMD(nextEstimatedPeriodStart, avgDuration - 1);

    // Estimated fertile window: approx 14 days before next expected start (-5 days to +1 day)
    // i.e., ovulation is ~day (averageCycleLength - 14). Window: Day -19 to -13 from next start
    const estimatedFertileWindowStart = addDaysYMD(latest.startDate, Math.max(1, averageCycleLength - 18));
    const estimatedFertileWindowEnd = addDaysYMD(latest.startDate, Math.min(averageCycleLength - 2, averageCycleLength - 12));

    return {
      currentCycleDay,
      lastPeriodStart: latest.startDate,
      lastPeriodEnd: latest.endDate,
      averageCycleLength,
      nextEstimatedPeriodStart,
      nextEstimatedPeriodEnd,
      estimatedFertileWindowStart,
      estimatedFertileWindowEnd,
      totalCyclesRecorded: sorted.length,
    };
  },
};
