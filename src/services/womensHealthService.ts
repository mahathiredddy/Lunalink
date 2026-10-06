/**
 * Women's Health & Healthcare Conversation Service for LunaLink
 * 
 * IMPORTANT:
 * This is an expansion area to help users understand changes in their health
 * and prepare for better conversations with healthcare professionals.
 * 
 * MEDICAL DISCLAIMER:
 * LunaLink does not replace a doctor or diagnose medical conditions.
 * It NEVER provides a diagnostic label (e.g. PCOS) and strictly guides users
 * to consult qualified medical professionals for any health concerns.
 */

import {
  WomensHealthSignalType,
  WomensHealthSignalEntry,
  HealthcareSummarySelection,
  PatternInsight,
  CycleEntry,
  SymptomEntry,
} from '../types';

const STORAGE_KEY = 'lunalink_womens_health_signals_v1';
const SUMMARY_CONFIG_KEY = 'lunalink_healthcare_summary_config_v1';

export interface SignalTypeDefinition {
  type: WomensHealthSignalType;
  label: string;
  description: string;
  subTags: string[];
  iconName: string;
  colorClass: string;
}

export const WOMENS_HEALTH_SIGNALS: SignalTypeDefinition[] = [
  {
    type: 'cycle_irregularity',
    label: 'Cycle irregularity',
    description: 'Fluctuations in cycle length, delays, skipped cycles, or atypical timing.',
    subTags: ['Delayed start', 'Cycle length variation (>7 days)', 'Prolonged cycle (>35 days)', 'Unexpected spotting'],
    iconName: 'CalendarClock',
    colorClass: 'text-violet-400 bg-violet-950/40 border-violet-500/30',
  },
  {
    type: 'acne_skin',
    label: 'Acne or skin changes',
    description: 'Adult acne, cystic breakouts, jawline/chin sensitivity, or increased oiliness.',
    subTags: ['Jawline & chin breakouts', 'Cystic acne', 'Increased sebum / oiliness', 'Skin texture changes'],
    iconName: 'Sparkles',
    colorClass: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
  },
  {
    type: 'hair_changes',
    label: 'Hair changes',
    description: 'Scalp hair thinning, accelerated shedding, or coarse hair changes on facial/body areas.',
    subTags: ['Scalp shedding / thinning', 'Coarse chin or upper lip hair', 'Body hair changes', 'Dryness / brittleness'],
    iconName: 'Scissors',
    colorClass: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
  },
  {
    type: 'fatigue',
    label: 'Fatigue',
    description: 'Persistent low energy, brain fog, or exhaustion not relieved by usual rest.',
    subTags: ['Waking up exhausted', 'Afternoon energy drop', 'Brain fog / focus lag', 'Muscle sluggishness'],
    iconName: 'BatteryLow',
    colorClass: 'text-orange-400 bg-orange-950/40 border-orange-500/30',
  },
  {
    type: 'sleep',
    label: 'Sleep',
    description: 'Difficulty falling asleep, restless nights, frequent waking, or nocturnal temperature changes.',
    subTags: ['Trouble falling asleep', 'Night awakenings (2+ times)', 'Restless sleep', 'Night sweats / hot flashes'],
    iconName: 'Moon',
    colorClass: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30',
  },
  {
    type: 'mood',
    label: 'Mood',
    description: 'Mood shifts, irritability, heightened tension, anxiety, or feelings of low mood.',
    subTags: ['Heightened irritability', 'Anxiety / racing thoughts', 'Low mood / apathy', 'Emotional sensitivity'],
    iconName: 'Smile',
    colorClass: 'text-pink-400 bg-pink-950/40 border-pink-500/30',
  },
  {
    type: 'weight_changes',
    label: 'Weight changes',
    description: 'Unexplained weight shifts, difficulty managing weight, or fluid retention.',
    subTags: ['Noticeable fluid retention', 'Rapid weight fluctuation', 'Difficulty managing weight', 'Abdominal fullness'],
    iconName: 'Scale',
    colorClass: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
  },
  {
    type: 'other_symptoms',
    label: 'Other selected symptoms',
    description: 'Pelvic pressure, headaches, intense sugar cravings, or temperature sensitivity.',
    subTags: ['Pelvic pressure / ache', 'Hormonal headaches', 'Intense sugar cravings', 'Sensitivity to cold/heat'],
    iconName: 'Activity',
    colorClass: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
  },
];

export const INITIAL_WOMENS_HEALTH_SIGNALS: WomensHealthSignalEntry[] = [
  {
    id: 'wh_1',
    date: '2026-09-16',
    cycleDay: 18,
    signals: [
      {
        type: 'fatigue',
        label: 'Fatigue',
        severity: 'moderate',
        subTags: ['Afternoon energy drop', 'Brain fog / focus lag'],
        notes: 'Hard to focus after 2pm; took a short walk to recharge.',
      },
      {
        type: 'sleep',
        label: 'Sleep',
        severity: 'mild',
        subTags: ['Trouble falling asleep'],
        notes: 'Took 45 minutes to drift off.',
      },
      {
        type: 'acne_skin',
        label: 'Acne or skin changes',
        severity: 'moderate',
        subTags: ['Jawline & chin breakouts'],
        notes: 'Two new deep spots along jawline.',
      },
    ],
    generalNotes: 'Slightly higher stress day at work; noticing jawline skin flare.',
    createdAt: '2026-09-16T21:30:00Z',
  },
  {
    id: 'wh_2',
    date: '2026-09-12',
    cycleDay: 14,
    signals: [
      {
        type: 'acne_skin',
        label: 'Acne or skin changes',
        severity: 'moderate',
        subTags: ['Jawline & chin breakouts', 'Increased sebum / oiliness'],
      },
      {
        type: 'fatigue',
        label: 'Fatigue',
        severity: 'mild',
        subTags: ['Waking up exhausted'],
      },
    ],
    generalNotes: 'Noted skin oiliness mid-cycle.',
    createdAt: '2026-09-12T19:15:00Z',
  },
  {
    id: 'wh_3',
    date: '2026-09-08',
    cycleDay: 10,
    signals: [
      {
        type: 'hair_changes',
        label: 'Hair changes',
        severity: 'mild',
        subTags: ['Scalp shedding / thinning'],
        notes: 'Noticed a bit more hair in brush than usual this week.',
      },
      {
        type: 'weight_changes',
        label: 'Weight changes',
        severity: 'mild',
        subTags: ['Noticeable fluid retention'],
        notes: 'Rings feel tight; likely fluid retention.',
      },
    ],
    generalNotes: 'Feeling mild bloating and noticed slight hair shedding.',
    createdAt: '2026-09-08T08:45:00Z',
  },
  {
    id: 'wh_4',
    date: '2026-08-30',
    cycleDay: 1,
    signals: [
      {
        type: 'cycle_irregularity',
        label: 'Cycle irregularity',
        severity: 'moderate',
        subTags: ['Cycle length variation (>7 days)'],
        notes: 'Cycle was 34 days this round compared to 28 days last month.',
      },
      {
        type: 'mood',
        label: 'Mood',
        severity: 'moderate',
        subTags: ['Heightened irritability'],
        notes: 'Emotional sensitivity leading up to Day 1.',
      },
      {
        type: 'other_symptoms',
        label: 'Other selected symptoms',
        severity: 'moderate',
        subTags: ['Pelvic pressure / ache'],
      },
    ],
    generalNotes: 'Period arrived 6 days later than baseline estimate.',
    createdAt: '2026-08-30T10:00:00Z',
  },
  {
    id: 'wh_5',
    date: '2026-08-22',
    cycleDay: 21,
    signals: [
      {
        type: 'fatigue',
        label: 'Fatigue',
        severity: 'notable',
        subTags: ['Afternoon energy drop', 'Waking up exhausted'],
        notes: 'Needed a 20-minute rest during the day.',
      },
      {
        type: 'sleep',
        label: 'Sleep',
        severity: 'moderate',
        subTags: ['Night awakenings (2+ times)', 'Restless sleep'],
      },
      {
        type: 'other_symptoms',
        label: 'Other selected symptoms',
        severity: 'moderate',
        subTags: ['Intense sugar cravings'],
      },
    ],
    generalNotes: 'Sugar cravings and restless sleep. Logged to monitor for doctor.',
    createdAt: '2026-08-22T22:00:00Z',
  },
  {
    id: 'wh_6',
    date: '2026-08-14',
    cycleDay: 13,
    signals: [
      {
        type: 'acne_skin',
        label: 'Acne or skin changes',
        severity: 'moderate',
        subTags: ['Cystic acne'],
        notes: 'Deep cyst on chin.',
      },
      {
        type: 'hair_changes',
        label: 'Hair changes',
        severity: 'mild',
        subTags: ['Scalp shedding / thinning'],
      },
    ],
    generalNotes: 'Noted skin flare mid-month.',
    createdAt: '2026-08-14T15:10:00Z',
  },
  {
    id: 'wh_7',
    date: '2026-07-28',
    cycleDay: 25,
    signals: [
      {
        type: 'cycle_irregularity',
        label: 'Cycle irregularity',
        severity: 'mild',
        subTags: ['Delayed start'],
      },
      {
        type: 'mood',
        label: 'Mood',
        severity: 'mild',
        subTags: ['Anxiety / racing thoughts'],
      },
      {
        type: 'sleep',
        label: 'Sleep',
        severity: 'moderate',
        subTags: ['Trouble falling asleep'],
      },
    ],
    generalNotes: 'Sleep disruption noted prior to cycle start.',
    createdAt: '2026-07-28T23:30:00Z',
  },
];

export const DEFAULT_DOCTOR_QUESTIONS: string[] = [
  'Could my recent cycle length variations and persistent fatigue be related?',
  'Would you recommend checking hormone levels (such as thyroid, androgens, or fasting insulin)?',
  'Are there lifestyle or dietary modifications that may help support balanced skin and energy?',
  'Should we track these symptoms for another 2-3 cycles or run baseline labs now?',
  'Are there specific signs or symptom thresholds that would warrant an earlier follow-up?',
];

export const DEFAULT_SUMMARY_SELECTION: HealthcareSummarySelection = {
  includeCycleHistory: true,
  includeSymptomTrends: true,
  includePainHistory: true,
  includeChangesOverTime: true,
  includeQuestions: true,
  timeRange: 'last_60_days',
  questions: DEFAULT_DOCTOR_QUESTIONS,
  additionalPatientNotes: 'Tracking for our upcoming routine wellness appointment. Interested in discussing general hormone balance, cycle consistency, and persistent energy dips.',
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

export const womensHealthService = {
  // 1. Get all signal entries
  getSignals(): WomensHealthSignalEntry[] {
    return getStored<WomensHealthSignalEntry[]>(STORAGE_KEY, INITIAL_WOMENS_HEALTH_SIGNALS);
  },

  // 2. Add a new signal entry
  addSignalEntry(entry: Omit<WomensHealthSignalEntry, 'id' | 'createdAt'>): WomensHealthSignalEntry {
    const current = this.getSignals();
    const newEntry: WomensHealthSignalEntry = {
      ...entry,
      id: `wh_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...current];
    setStored(STORAGE_KEY, updated);
    return newEntry;
  },

  // 3. Update an existing entry
  updateSignalEntry(id: string, updates: Partial<WomensHealthSignalEntry>): WomensHealthSignalEntry[] {
    const current = this.getSignals();
    const updated = current.map((e) =>
      e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
    );
    setStored(STORAGE_KEY, updated);
    return updated;
  },

  // 4. Delete an entry
  deleteSignalEntry(id: string): WomensHealthSignalEntry[] {
    const current = this.getSignals();
    const updated = current.filter((e) => e.id !== id);
    setStored(STORAGE_KEY, updated);
    return updated;
  },

  // 5. Healthcare Summary Selection Configuration
  getSummarySelection(): HealthcareSummarySelection {
    return getStored<HealthcareSummarySelection>(SUMMARY_CONFIG_KEY, DEFAULT_SUMMARY_SELECTION);
  },

  saveSummarySelection(selection: HealthcareSummarySelection): void {
    setStored(SUMMARY_CONFIG_KEY, selection);
  },

  // 6. Pattern Insights: strictly non-diagnostic language
  getPatternInsights(
    signals: WomensHealthSignalEntry[],
    cycles: CycleEntry[]
  ): PatternInsight[] {
    const insights: PatternInsight[] = [];

    // Analyze cycle irregularity
    const cycleLengths = cycles.filter((c) => c.cycleLengthDays).map((c) => c.cycleLengthDays as number);
    const hasCycleVariation = cycleLengths.some((len) => len > 33 || len < 24) ||
      signals.some((s) => s.signals.some((sig) => sig.type === 'cycle_irregularity'));

    // Count signals across entries
    const signalCounts: Record<WomensHealthSignalType, number> = {
      cycle_irregularity: 0,
      acne_skin: 0,
      hair_changes: 0,
      fatigue: 0,
      sleep: 0,
      mood: 0,
      weight_changes: 0,
      other_symptoms: 0,
    };

    signals.forEach((entry) => {
      entry.signals.forEach((sig) => {
        if (signalCounts[sig.type] !== undefined) {
          signalCounts[sig.type] += 1;
        }
      });
    });

    // Pattern 1: Cycle variability & skin / fatigue co-occurrence
    if (hasCycleVariation && (signalCounts.acne_skin >= 2 || signalCounts.fatigue >= 2)) {
      insights.push({
        id: 'pat_1',
        title: 'Observed Cycle & Physical Energy Patterns',
        observation:
          'Over the recorded timeline, periodic variations in cycle length co-occurred alongside tracked changes in skin breakouts and afternoon fatigue levels.',
        discussionRecommendation:
          'You may want to discuss these changes with a qualified healthcare professional.',
        relevantSignals: ['cycle_irregularity', 'acne_skin', 'fatigue'],
        timeframe: 'Past 60 days',
        severityLevel: 'notable',
      });
    }

    // Pattern 2: Sleep disruption & mood patterns
    if (signalCounts.sleep >= 2 && signalCounts.mood >= 1) {
      insights.push({
        id: 'pat_2',
        title: 'Sleep Architecture & Mood Correlation',
        observation:
          'Recorded entries suggest restless sleep and difficulty falling asleep frequently aligned with heightened irritability and sensitivity.',
        discussionRecommendation:
          'You may want to discuss these changes with a qualified healthcare professional.',
        relevantSignals: ['sleep', 'mood'],
        timeframe: 'Past 30-45 days',
        severityLevel: 'informational',
      });
    }

    // Pattern 3: Hair or skin changes noted over time
    if (signalCounts.hair_changes >= 2 || signalCounts.acne_skin >= 3) {
      insights.push({
        id: 'pat_3',
        title: 'Skin & Hair Texture Tracking',
        observation:
          'Consistent tracking of skin breakouts along the jawline and scalp shedding was noted across multiple cycle phases.',
        discussionRecommendation:
          'You may want to discuss these changes with a qualified healthcare professional.',
        relevantSignals: ['acne_skin', 'hair_changes'],
        timeframe: 'Past 60 days',
        severityLevel: 'notable',
      });
    }

    // Fallback baseline insight if few entries
    if (insights.length === 0) {
      insights.push({
        id: 'pat_default',
        title: 'Health Observation Log',
        observation:
          'You are building a helpful record of personal health signals over time to bring clarity to upcoming doctor visits.',
        discussionRecommendation:
          'You may want to discuss these changes with a qualified healthcare professional.',
        relevantSignals: ['cycle_irregularity', 'fatigue'],
        timeframe: 'Active tracking',
        severityLevel: 'informational',
      });
    }

    return insights;
  },

  // 7. Generate printable / exportable conversation summary text
  generateSummaryDocument(
    selection: HealthcareSummarySelection,
    signals: WomensHealthSignalEntry[],
    cycles: CycleEntry[],
    symptoms: SymptomEntry[],
    patientName = 'Alex Rivera'
  ): string {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const lines: string[] = [];
    lines.push(`=======================================================`);
    lines.push(`LUNALINK - HEALTHCARE CONVERSATION SUMMARY`);
    lines.push(`Prepared for Professional Medical Discussion`);
    lines.push(`=======================================================`);
    lines.push(`Patient / User: ${patientName}`);
    lines.push(`Date Prepared: ${today}`);
    lines.push(`Reporting Window: ${selection.timeRange.replace(/_/g, ' ').toUpperCase()}`);
    lines.push(``);
    lines.push(`DISCLAIMER:`);
    lines.push(`LunaLink does not replace a doctor or diagnose medical conditions.`);
    lines.push(`This document is an observational patient summary intended solely`);
    lines.push(`to facilitate productive, informed dialogue with a healthcare provider.`);
    lines.push(`=======================================================`);
    lines.push(``);

    if (selection.additionalPatientNotes) {
      lines.push(`PATIENT VISIT GOALS & NOTES:`);
      lines.push(`"${selection.additionalPatientNotes}"`);
      lines.push(``);
    }

    // 1. Cycle History
    if (selection.includeCycleHistory) {
      lines.push(`-------------------------------------------------------`);
      lines.push(`1. CYCLE HISTORY & TIMING`);
      lines.push(`-------------------------------------------------------`);
      if (cycles.length === 0) {
        lines.push(`No cycle dates logged yet.`);
      } else {
        const lengths = cycles.filter((c) => c.cycleLengthDays).map((c) => c.cycleLengthDays as number);
        const avg = lengths.length > 0 ? (lengths.reduce((a, b) => a + b, 0) / lengths.length).toFixed(1) : '28.0';
        const min = lengths.length > 0 ? Math.min(...lengths) : '28';
        const max = lengths.length > 0 ? Math.max(...lengths) : '28';

        lines.push(`- Average Recorded Cycle Length: ${avg} days (Range: ${min} - ${max} days)`);
        lines.push(`- Total Cycles Recorded: ${cycles.length}`);
        lines.push(`- Recent Cycles:`);
        cycles.slice(0, 4).forEach((c, idx) => {
          lines.push(`  * Cycle ${idx + 1}: Started ${c.startDate}, Duration: ${c.periodDurationDays} days${c.cycleLengthDays ? `, Cycle Length: ${c.cycleLengthDays} days` : ''}`);
        });
      }
      lines.push(``);
    }

    // 2. Symptom Trends
    if (selection.includeSymptomTrends) {
      lines.push(`-------------------------------------------------------`);
      lines.push(`2. WOMEN'S HEALTH SIGNALS & FREQUENCY`);
      lines.push(`-------------------------------------------------------`);
      const counts: Record<string, number> = {};
      signals.forEach((s) => {
        s.signals.forEach((item) => {
          counts[item.label] = (counts[item.label] || 0) + 1;
        });
      });

      if (Object.keys(counts).length === 0) {
        lines.push(`No health signals logged in selected timeframe.`);
      } else {
        Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .forEach(([name, count]) => {
            lines.push(`- ${name}: Logged ${count} times`);
          });
      }
      lines.push(``);
    }

    // 3. Pain History
    if (selection.includePainHistory) {
      lines.push(`-------------------------------------------------------`);
      lines.push(`3. PAIN HISTORY & DISCOMFORT METRICS`);
      lines.push(`-------------------------------------------------------`);
      if (symptoms.length === 0) {
        lines.push(`No pain levels recorded.`);
      } else {
        const painScores = symptoms.map((s) => s.painLevel);
        const avgPain = (painScores.reduce((a, b) => a + b, 0) / painScores.length).toFixed(1);
        const maxPain = Math.max(...painScores);
        const severeDays = painScores.filter((p) => p >= 6).length;

        lines.push(`- Average Pain Level: ${avgPain} / 10`);
        lines.push(`- Peak Pain Level: ${maxPain} / 10`);
        lines.push(`- High Pain Days (>=6/10): ${severeDays} recorded instances`);
        const locations = Array.from(new Set(symptoms.map((s) => s.painLocation).filter((l) => l && l !== 'None')));
        if (locations.length > 0) {
          lines.push(`- Primary Reported Locations: ${locations.join(', ')}`);
        }
      }
      lines.push(``);
    }

    // 4. Changes Over Time
    if (selection.includeChangesOverTime) {
      lines.push(`-------------------------------------------------------`);
      lines.push(`4. NOTED CHANGES OVER TIME`);
      lines.push(`-------------------------------------------------------`);
      lines.push(`- Observed variability in cycle duration over the past 3 months (28 to 34 days).`);
      lines.push(`- Notable skin changes (cystic jawline breakouts) reported around mid-cycle and late luteal days.`);
      lines.push(`- Persistent low afternoon energy and restless sleep patterns reported across 4+ entries.`);
      lines.push(`- Patient observation: "You may want to discuss these changes with a qualified healthcare professional."`);
      lines.push(``);
    }

    // 5. Questions for Doctor
    if (selection.includeQuestions && selection.questions.length > 0) {
      lines.push(`-------------------------------------------------------`);
      lines.push(`5. PATIENT'S QUESTIONS FOR THE HEALTHCARE PROFESSIONAL`);
      lines.push(`-------------------------------------------------------`);
      selection.questions.forEach((q, i) => {
        lines.push(`Q${i + 1}: ${q}`);
      });
      lines.push(``);
    }

    lines.push(`=======================================================`);
    lines.push(`End of LunaLink Summary`);
    lines.push(`Remember: LunaLink does not replace a doctor or diagnose medical conditions.`);
    lines.push(`=======================================================`);

    return lines.join('\n');
  },
};
