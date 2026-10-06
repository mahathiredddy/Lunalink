/**
 * Predictive Care Service for LunaLink
 * 
 * Core prototype logic for proactive partner support notifications.
 * 
 * IMPORTANT PRODUCT PRINCIPLES:
 * - LunaLink is NOT a medical prediction system.
 * - Non-deterministic wording: "may be a higher-support day" rather than "will be a difficult day."
 * - Guarded phrasing: "based on previous patterns" rather than "we know this will happen."
 * - Strict consent: If notificationSharingEnabled === false, NO partner notification is created.
 * - Never expose raw pain logs, private symptoms, or clinical notes unless explicitly permitted.
 * - Insufficient history protection: Never send ungrounded predictions when data is sparse.
 * - Modular design: Pure functions ready for future Supabase table bindings.
 */

import {
  CycleEntry,
  SymptomEntry,
  CareProfile,
  User,
  PredictiveNotificationType,
  PartnerSupportNotification,
  AllowedPartnerSupportInfo,
  DemoScenario,
  NotificationPrivacyLevel,
} from '../types';
import { diffDays, addDaysYMD, formatDateYMD } from './cycleService';

export interface EstimatedPeriodResult {
  nextPeriodDate: string;
  daysUntil: number;
  averageCycleLength: number;
  lastPeriodStart: string;
  isEstimated: boolean;
}

export interface SupportInsightCalculation {
  status: 'sufficient' | 'moderate' | 'insufficient_history';
  headline: string;
  explanation: string;
  currentCycleDay: number | null;
  estimatedNextPeriod: EstimatedPeriodResult | null;
  hasHighDay1Pain: boolean;
  factors: string[];
  careSuggestions: string[];
  disclaimer: string;
  whyAmISeeingThis: string;
}

/**
 * 1. hasSufficientCycleHistory()
 * Returns true only if at least 2 recorded cycles exist.
 */
export function hasSufficientCycleHistory(cycles: CycleEntry[]): boolean {
  if (!cycles || cycles.length === 0) return false;
  const recorded = cycles.filter((c) => c.isRecorded && c.startDate);
  return recorded.length >= 2;
}

/**
 * 2. calculateEstimatedPeriod()
 * Uses previous recorded cycle history to calculate an ESTIMATED next period date.
 */
export function calculateEstimatedPeriod(
  cycles: CycleEntry[],
  todayDateStr: string = '2026-09-18'
): EstimatedPeriodResult | null {
  const recorded = (cycles || [])
    .filter((c) => c && c.isRecorded && c.startDate)
    .sort((a, b) => (b.startDate > a.startDate ? 1 : -1));

  if (recorded.length === 0) return null;

  // Compute average cycle length from recorded intervals or fallback to 28
  let totalIntervals = 0;
  let intervalSum = 0;

  for (let i = 0; i < recorded.length - 1; i++) {
    const diff = diffDays(recorded[i].startDate, recorded[i + 1].startDate);
    if (diff >= 20 && diff <= 45) {
      intervalSum += diff;
      totalIntervals++;
    }
  }

  const averageCycleLength = totalIntervals > 0 ? Math.round(intervalSum / totalIntervals) : 28;
  const lastPeriodStart = recorded[0].startDate;
  const nextPeriodDate = addDaysYMD(lastPeriodStart, averageCycleLength);
  const daysUntil = diffDays(nextPeriodDate, todayDateStr);

  return {
    nextPeriodDate,
    daysUntil,
    averageCycleLength,
    lastPeriodStart,
    isEstimated: true,
  };
}

/**
 * 3. getCurrentCycleDay()
 * Calculates cycle day (1-based) relative to the most recent period start date.
 */
export function getCurrentCycleDay(
  cycles: CycleEntry[],
  todayDateStr: string = '2026-09-18'
): number | null {
  const recorded = (cycles || [])
    .filter((c) => c && c.isRecorded && c.startDate)
    .sort((a, b) => (b.startDate > a.startDate ? 1 : -1));

  if (recorded.length === 0) return null;

  const lastStart = recorded[0].startDate;
  const daysDiff = diffDays(todayDateStr, lastStart);

  if (daysDiff < 0) return null; // Today is before the recorded start
  return daysDiff + 1; // Day 1 when today == lastStart
}

/**
 * 4. getAllowedPartnerInformation()
 * Extracts ONLY explicitly approved preferences and permissions for the partner.
 * Strictly prevents raw health data leaks.
 */
export function getAllowedPartnerInformation(
  careProfile: CareProfile,
  user: {
    notificationSharingEnabled: boolean;
    shareCycleSupportInsights?: boolean;
  }
): AllowedPartnerSupportInfo {
  const isProfileShared = careProfile.isSharedWithPartner;

  return {
    canReceiveNotifications: Boolean(user.notificationSharingEnabled),
    canReceiveCycleInsights: Boolean(user.shareCycleSupportInsights),
    allowedCommunication: isProfileShared ? careProfile.communication || [] : [],
    allowedPhysicalSupport: isProfileShared ? careProfile.physicalSupport || [] : [],
    allowedComfort: isProfileShared ? careProfile.comfort || [] : [],
    allowedEmotionalSupport: isProfileShared ? careProfile.emotionalSupport || [] : [],
  };
}

/**
 * 5. getCareSuggestions()
 * Converts allowed Care Profile preferences into empathetic, actionable partner suggestions.
 */
export function getCareSuggestions(
  careProfile: CareProfile,
  allowedInfo: AllowedPartnerSupportInfo
): string[] {
  const suggestions: string[] = [];

  // If partner is allowed to see Care Profile preferences
  if (careProfile.isSharedWithPartner) {
    // 1. Communication
    if (allowedInfo.allowedCommunication && allowedInfo.allowedCommunication.length > 0) {
      const comm = allowedInfo.allowedCommunication[0];
      if (comm.includes('space') || comm.includes('Space')) {
        suggestions.push('Give her some space');
      } else if (comm.includes('Text') || comm.includes('check in') || comm.includes('Check in')) {
        suggestions.push('Check in once');
      } else if (comm.includes('Call')) {
        suggestions.push('Offer a supportive call');
      } else {
        suggestions.push(`Communication preference: ${comm}`);
      }
    }

    // 2. Physical support
    if (allowedInfo.allowedPhysicalSupport && allowedInfo.allowedPhysicalSupport.length > 0) {
      const phys = allowedInfo.allowedPhysicalSupport[0];
      if (phys.includes('space') || phys.includes('Space')) {
        if (!suggestions.includes('Give her some space')) {
          suggestions.push('Give her some space');
        }
      } else if (phys.includes('nearby') || phys.includes('Nearby')) {
        suggestions.push('Stay nearby in quiet presence');
      } else if (phys.includes('tasks') || phys.includes('practical')) {
        suggestions.push('Take care of light errands or chores');
      } else {
        suggestions.push(`Physical support: ${phys}`);
      }
    }

    // 3. Comfort
    if (allowedInfo.allowedComfort && allowedInfo.allowedComfort.length > 0) {
      allowedInfo.allowedComfort.forEach((c) => {
        if (c.includes('Warm drink') || c.includes('tea')) {
          suggestions.push('Offer her a warm drink');
        } else if (c.includes('Heating pad')) {
          suggestions.push('Keep a warm heating pad handy');
        } else if (c.includes('Rest')) {
          suggestions.push('Encourage unhurried rest');
        } else if (c.includes('food')) {
          suggestions.push('Offer nourishing comfort food');
        } else if (c.includes('Quiet')) {
          suggestions.push('Keep the environment calm and quiet');
        }
      });
    }

    // 4. Emotional support
    if (allowedInfo.allowedEmotionalSupport && allowedInfo.allowedEmotionalSupport.length > 0) {
      allowedInfo.allowedEmotionalSupport.forEach((emo) => {
        if (emo.includes('Listen') || emo.includes('Avoid advice')) {
          suggestions.push('Listen rather than giving advice');
        } else if (emo.includes('Reassure')) {
          suggestions.push('Provide gentle reassurance');
        } else if (emo.includes('stay with me')) {
          suggestions.push('Sit with her in comfortable silence');
        }
      });
    }
  }

  // Fallback defaults if list is empty
  if (suggestions.length === 0) {
    suggestions.push('Check in once');
    suggestions.push('Give her some space');
    suggestions.push('Offer her a warm drink');
    suggestions.push('Listen rather than giving advice');
  }

  // De-duplicate and cap at 4 concise bullet points
  return Array.from(new Set(suggestions)).slice(0, 4);
}

/**
 * 6. calculateSupportInsight()
 * Aggregates cycle history, symptom patterns, and Care Profile into an explainable insight.
 */
export function calculateSupportInsight(params: {
  cycles: CycleEntry[];
  symptoms: SymptomEntry[];
  careProfile: CareProfile;
  user: User;
  todayDateStr?: string;
  demoScenario?: DemoScenario;
  isCareModeActive?: boolean;
}): SupportInsightCalculation {
  const {
    cycles,
    symptoms,
    careProfile,
    user,
    todayDateStr = '2026-09-18',
    demoScenario = 'normal',
    isCareModeActive = false,
  } = params;

  // Handle demo scenario overrides
  const isDemoInsufficient = demoScenario === 'insufficient_history';
  const sufficient = !isDemoInsufficient && hasSufficientCycleHistory(cycles);

  if (!sufficient) {
    return {
      status: 'insufficient_history',
      headline: 'Not enough cycle history yet',
      explanation: 'Keep recording your cycles to help LunaLink understand your personal patterns.',
      currentCycleDay: null,
      estimatedNextPeriod: null,
      hasHighDay1Pain: false,
      factors: [
        'Requires at least 2 recorded cycles to establish historical rhythm',
        'Personal cycle tracking in progress',
      ],
      careSuggestions: [
        'Continue logging start and end dates',
        'Record any recurring comfort preferences in your Care Profile',
      ],
      disclaimer: 'This is an estimate based on previous patterns. It is not a medical prediction.',
      whyAmISeeingThis: 'Estimations remain paused until sufficient personal cycle entries are recorded.',
    };
  }

  let estPeriod = calculateEstimatedPeriod(cycles, todayDateStr);
  let cycleDay = getCurrentCycleDay(cycles, todayDateStr);

  // Apply Demo Scenario adjustments
  if (demoScenario === 'two_days_before' && estPeriod) {
    estPeriod = { ...estPeriod, daysUntil: 2 };
    cycleDay = Math.max(1, estPeriod.averageCycleLength - 2);
  } else if (demoScenario === 'estimated_period_day' && estPeriod) {
    estPeriod = { ...estPeriod, daysUntil: 0 };
    cycleDay = estPeriod.averageCycleLength;
  } else if (demoScenario === 'day_1') {
    cycleDay = 1;
    if (estPeriod) estPeriod = { ...estPeriod, daysUntil: 0 };
  } else if (demoScenario === 'high_day_1_pain') {
    cycleDay = 1;
    if (estPeriod) estPeriod = { ...estPeriod, daysUntil: 0 };
  }

  // Evaluate Day 1 historical pain patterns from symptoms log
  const day1Symptoms = (symptoms || []).filter(
    (s) => s && (s.cycleDay === 1 || s.painLevel >= 5 || (Array.isArray(s.symptoms) && s.symptoms.includes('Cramps')))
  );
  const hasHighDay1Pain = demoScenario === 'high_day_1_pain' || day1Symptoms.length >= 2;

  // Build explainable factors list
  const factors: string[] = [
    `Based on your previous cycle lengths (averaging ~${estPeriod?.averageCycleLength || 28} days)`,
    `Based on ${(cycles || []).filter((c) => c?.isRecorded).length} recorded cycles in your personal history`,
  ];

  if (hasHighDay1Pain) {
    factors.push('Based on previous Day 1 discomfort patterns');
  }

  if (careProfile.isSharedWithPartner) {
    factors.push('Incorporates your saved Care Profile comfort preferences');
  }

  const allowedInfo = getAllowedPartnerInformation(careProfile, user);
  const careSuggestions = getCareSuggestions(careProfile, allowedInfo);

  let headline = 'A support day may be approaching';
  let explanation =
    'Based on previous cycle patterns, you may appreciate some extra support in the next couple of days.';

  if (isCareModeActive || demoScenario === 'care_mode_active') {
    headline = 'Care Mode is active';
    explanation = 'Care Mode has been activated. Partner support suggestions are tuned to your current needs.';
  } else if (cycleDay === 1) {
    headline = 'Today may be a higher-support day';
    explanation = hasHighDay1Pain && user.shareCycleSupportInsights
      ? 'Today is Day 1 of your cycle. You may experience stronger discomfort based on previous patterns.'
      : 'Today is Day 1 of your cycle. Based on previous patterns, extra support may be comforting.';
  }

  return {
    status: 'sufficient',
    headline,
    explanation,
    currentCycleDay: cycleDay,
    estimatedNextPeriod: estPeriod,
    hasHighDay1Pain,
    factors,
    careSuggestions,
    disclaimer: 'This is an estimate based on previous patterns. It is not a medical prediction.',
    whyAmISeeingThis:
      'This calculation is based on your previous cycle history and comfort preferences. It is an estimate, not a medical prediction.',
  };
}

/**
 * 7. generatePartnerNotification()
 * Generates the proactive partner notification payload according to strict consent rules.
 * Returns NULL if notification sharing is disabled or history is insufficient.
 */
export function generatePartnerNotification(params: {
  cycles: CycleEntry[];
  symptoms: SymptomEntry[];
  careProfile: CareProfile;
  user: User;
  todayDateStr?: string;
  demoScenario?: DemoScenario;
  isCareModeActive?: boolean;
}): PartnerSupportNotification | null {
  const {
    cycles,
    symptoms,
    careProfile,
    user,
    todayDateStr = '2026-09-18',
    demoScenario = 'normal',
    isCareModeActive = false,
  } = params;

  // STRICT PRIVACY RULE 1:
  // IF notificationSharingEnabled === false, NO partner support notification is generated.
  if (!user.notificationSharingEnabled) {
    return null;
  }

  // INSUFFICIENT HISTORY CHECK:
  // If user has insufficient cycle history, DO NOT generate a predictive notification to partner.
  const isDemoInsufficient = demoScenario === 'insufficient_history';
  if (isDemoInsufficient || !hasSufficientCycleHistory(cycles)) {
    return null;
  }

  const insight = calculateSupportInsight({
    cycles,
    symptoms,
    careProfile,
    user,
    todayDateStr,
    demoScenario,
    isCareModeActive,
  });

  const allowedInfo = getAllowedPartnerInformation(careProfile, user);
  const careSuggestions = getCareSuggestions(careProfile, allowedInfo);

  const daysUntil = insight.estimatedNextPeriod ? insight.estimatedNextPeriod.daysUntil : 99;
  const cycleDay = insight.currentCycleDay;

  // 1. CARE MODE ACTIVE
  if (isCareModeActive || demoScenario === 'care_mode_active') {
    return {
      id: `partner_notif_care_${Date.now()}`,
      type: 'CARE_MODE',
      title: '🌙 She has activated Care Mode',
      message:
        'She has activated Care Mode. Follow her selected Care Profile preferences to support her gently today.',
      timestamp: 'Just now',
      isRead: false,
      reason: 'Activated directly by her in LunaLink.',
      factors: ['Direct Care Mode activation', 'Permitted Care Profile preferences'],
      privacyLevel: 'shared_with_partner',
      careSuggestions,
      disclaimer: 'This is an estimate based on previous patterns. It is not a medical prediction.',
    };
  }

  // 2. PERIOD DAY 1 ALERT
  if (cycleDay === 1 || demoScenario === 'day_1' || demoScenario === 'high_day_1_pain') {
    let message =
      'Today is Day 1 of her cycle. Based on her previous patterns, she may appreciate some extra support.';

    // If user has high historical Day 1 pain AND explicitly allowed sharing of cycle insights
    if (insight.hasHighDay1Pain && user.shareCycleSupportInsights) {
      message =
        'Today is Day 1 of her cycle. She may experience stronger discomfort today based on previous patterns. Please follow her selected Care Profile preferences.';
    }

    return {
      id: `partner_notif_day1_${Date.now()}`,
      type: 'DAY_1_SUPPORT',
      title: '🌙 Today may be a higher-support day',
      message,
      timestamp: 'Today at 8:00 AM',
      isRead: false,
      reason:
        'This notification is based on her previous cycle history. It is an estimate, not a medical prediction.',
      factors: [
        'Recorded period start date (Day 1)',
        'Historical cycle pattern intervals',
        ...(user.shareCycleSupportInsights && insight.hasHighDay1Pain
          ? ['Previous Day 1 discomfort patterns (explicitly permitted)']
          : []),
      ],
      privacyLevel: 'shared_with_partner',
      careSuggestions,
      disclaimer: 'This is an estimate based on previous patterns. It is not a medical prediction.',
    };
  }

  // 3. UPCOMING PERIOD SUPPORT ALERT (within next 2 days)
  if (daysUntil <= 2 && daysUntil >= 0) {
    return {
      id: `partner_notif_upcoming_${Date.now()}`,
      type: 'UPCOMING_SUPPORT',
      title: '🌙 A support day may be approaching',
      message:
        'Based on previous cycle patterns, she may appreciate some extra support in the next couple of days.',
      timestamp: 'Today at 9:00 AM',
      isRead: false,
      reason:
        'This notification is based on her previous cycle history. It is an estimate, not a medical prediction.',
      factors: [
        `Previous cycle lengths (averaged ~${insight.estimatedNextPeriod?.averageCycleLength || 28} days)`,
        'Recorded period history across recent cycles',
      ],
      privacyLevel: 'shared_with_partner',
      careSuggestions,
      disclaimer: 'This is an estimate based on previous patterns. It is not a medical prediction.',
    };
  }

  // 4. GENERAL CARE SUGGESTION
  return {
    id: `partner_notif_sugg_${Date.now()}`,
    type: 'CARE_SUGGESTION',
    title: '🌙 Thoughtful ways to support her',
    message: 'Here are some ways you can support her today based on her Care Profile preferences.',
    timestamp: 'Yesterday at 6:00 PM',
    isRead: true,
    reason: 'Shared according to her permitted Care Profile preferences.',
    factors: ['Permitted Care Profile preferences'],
    privacyLevel: 'shared_with_partner',
    careSuggestions,
    disclaimer: 'This is an estimate based on previous patterns. It is not a medical prediction.',
  };
}
