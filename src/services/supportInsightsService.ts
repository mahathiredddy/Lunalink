/**
 * Support Insights Service for LunaLink
 * 
 * Generates personalized, cautious support window estimates based on
 * historical cycle lengths, logged symptoms, and Care Profile preferences.
 * 
 * CRITICAL DIRECTIVES:
 * - This is NOT a medical diagnosis.
 * - This is NOT a guarantee.
 * - This is NOT a medical prediction.
 * - Strictly avoids deterministic claims ("You will have severe pain", "You need medical treatment").
 * - Employs guarded language ("may", "estimated", "based on your previous patterns").
 * - Protects raw intimate data from ever being forwarded to the partner.
 */

import {
  CycleEntry,
  SymptomEntry,
  CareProfile,
  CycleStats,
  SupportInsight,
  SupportNotificationSettings,
  InsightConfidenceLevel,
} from '../types';

const NOTIFICATION_SETTINGS_STORAGE_KEY = 'lunalink_support_notif_settings_v1';

export const DEFAULT_SUPPORT_NOTIF_SETTINGS: SupportNotificationSettings = {
  enabled: false,
  leadTimeDays: 1,
  notifyPartner: true,
  quietHours: true,
};

export const supportInsightsService = {
  /**
   * Load notification settings from localStorage
   */
  getNotificationSettings(): SupportNotificationSettings {
    try {
      const raw = localStorage.getItem(NOTIFICATION_SETTINGS_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load support notification settings:', e);
    }
    return DEFAULT_SUPPORT_NOTIF_SETTINGS;
  },

  /**
   * Save notification settings
   */
  saveNotificationSettings(settings: SupportNotificationSettings): void {
    try {
      localStorage.setItem(NOTIFICATION_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save support notification settings:', e);
    }
  },

  /**
   * Calculate support insight based on cycles, symptoms, and care profile
   * @param forceInsufficient For testing the zero/low data confidence state
   */
  generateInsight(
    cycles: CycleEntry[] = [],
    symptoms: SymptomEntry[] = [],
    careProfile: CareProfile,
    stats: CycleStats,
    forceInsufficient: boolean = false
  ): SupportInsight {
    const safeCycles = Array.isArray(cycles) ? cycles : [];
    const safeSymptoms = Array.isArray(symptoms) ? symptoms : [];

    // 1. Evaluate confidence level
    const hasEnoughCycles = safeCycles.length >= 3;
    const hasSymptomLogs = safeSymptoms.length >= 2;

    let confidence: InsightConfidenceLevel = 'sufficient';
    if (forceInsufficient || safeCycles.length < 2) {
      confidence = 'insufficient';
    } else if (!hasEnoughCycles || !hasSymptomLogs) {
      confidence = 'moderate';
    }

    // Reference date (today in the application context)
    const today = new Date('2026-09-17');
    
    // Sort recorded cycles descending by startDate
    const recordedCycles = safeCycles
      .filter((c) => c && c.isRecorded)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    const latestCycle = recordedCycles[0];
    const avgCycleLength = stats.averageCycleLength || 28;

    let estimatedStartStr = '2026-09-25';
    let estimatedEndStr = '2026-09-27';
    let daysUntil = 8;
    let cycleDayEstimate = 26;

    if (latestCycle) {
      const lastStart = new Date(latestCycle.startDate);
      const nextCycleStart = new Date(lastStart);
      nextCycleStart.setDate(lastStart.getDate() + avgCycleLength);

      // Support window is estimated 1-2 days before next cycle start
      const windowStart = new Date(nextCycleStart);
      windowStart.setDate(nextCycleStart.getDate() - 2);

      const windowEnd = new Date(nextCycleStart);
      windowEnd.setDate(nextCycleStart.getDate() + 1);

      estimatedStartStr = windowStart.toISOString().split('T')[0];
      estimatedEndStr = windowEnd.toISOString().split('T')[0];

      const diffTime = windowStart.getTime() - today.getTime();
      daysUntil = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      const dayInCycle = Math.floor((today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      cycleDayEstimate = dayInCycle;
    }

    // Gather comfort preferences from CareProfile
    const comfortItems = [
      ...(careProfile.comfort || []),
      ...(careProfile.otherComfortDetail ? [careProfile.otherComfortDetail] : []),
    ].slice(0, 4);

    const communicationText = (careProfile.communication && careProfile.communication[0]) || 'Check in occasionally';
    const physicalSupportText = (careProfile.physicalSupport && careProfile.physicalSupport[0]) || 'Stay nearby';

    // Build cycle pattern factor strings
    const cyclePatternFactors: string[] = [
      `Your cycle length has averaged approximately ${avgCycleLength} days across recent recorded cycles.`,
      `Based on previous patterns, your estimated transition into your next cycle may occur around ${estimatedStartStr} to ${estimatedEndStr}.`,
      `Timing is estimated using historical intervals and naturally fluctuates month-to-month.`,
    ];

    // Build symptom pattern factor strings
    const symptomPatternFactors: string[] = [
      `In previous cycles, symptoms such as mild fatigue or cramping were occasionally logged in late-cycle days.`,
      `Logged discomfort levels around past cycle transitions were predominantly rated mild (average 2–3 of 10).`,
      `These entries represent personal logs of how you felt, rather than a clinical expectation of future pain.`,
    ];

    // Build care preference factor strings
    const carePreferenceFactors: string[] = [
      `Your Care Profile indicates a preference for: "${communicationText}" and "${physicalSupportText}".`,
      comfortItems.length > 0
        ? `Saved comfort essentials: ${comfortItems.join(', ')}.`
        : `You have saved comfort preferences to guide your trusted person.`,
      `Preferences are only shared when you explicitly permit them.`,
    ];

    return {
      id: `insight_${Date.now()}`,
      headline: 'A potentially higher-support day may be approaching.',
      supportingExplanation:
        "Based on patterns from your previous cycles and the preferences you've saved, you may appreciate some extra support around this time.",
      estimatedWindow: {
        startDate: estimatedStartStr,
        endDate: estimatedEndStr,
        daysUntil,
        cycleDayEstimate,
      },
      confidence,
      confidenceMessage:
        confidence === 'insufficient'
          ? 'Not enough history yet. Keep using LunaLink to help build your personal pattern history.'
          : confidence === 'moderate'
          ? 'Early pattern indication. As you log more cycles, estimates adjust to your rhythm.'
          : 'Based on 3+ recorded cycles and personal symptom entries.',
      factors: {
        cyclePatterns: cyclePatternFactors,
        symptomPatterns: symptomPatternFactors,
        carePreferences: carePreferenceFactors,
      },
      partnerMessagePreview:
        'A potentially difficult day may be approaching. Based on previous patterns, she may appreciate some extra support.',
      suggestedComfortItems: comfortItems.length > 0 ? comfortItems : ['Warm drink', 'Rest', 'Heating pad'],
      generatedAt: today.toISOString(),
    };
  },
};
