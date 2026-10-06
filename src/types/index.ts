export type AppPage =
  | 'landing'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'dashboard'
  | 'cycle-calendar'
  | 'shared-calendar'
  | 'memory-vault'
  | 'womens-health'
  | 'symptoms-pain'
  | 'care-profile'
  | 'care-mode'
  | 'support-insights'
  | 'care-suggestions'
  | 'connect-partner'
  | 'partner-profile'
  | 'shared-space'
  | 'privacy-sharing'
  | 'notifications'
  | 'healthcare'
  | 'settings'
  | 'user-profile';

export type CommunicationPref =
  | 'Text me'
  | 'Call me'
  | 'Check in occasionally'
  | 'Give me some space'
  | 'Ask before calling';

export type PhysicalSupportPref =
  | 'Stay nearby'
  | 'Give me space'
  | 'Ask before visiting'
  | 'Help with practical tasks';

export type ComfortPref =
  | 'Warm drink'
  | 'Comfort food'
  | 'Heating pad'
  | 'Rest'
  | 'Quiet environment'
  | 'Other';

export type EmotionalSupportPref =
  | 'Listen'
  | 'Reassure me'
  | 'Distract me'
  | 'Give advice'
  | 'Avoid advice'
  | 'Just stay with me'
  | 'Give me space';

export interface CareProfile {
  id: string;
  userId?: string;
  isSharedWithPartner: boolean; // default false: "Your Care Profile is private by default"
  communication: string[]; // CommunicationPref[]
  physicalSupport: string[]; // PhysicalSupportPref[]
  comfort: string[]; // ComfortPref[]
  otherComfortDetail?: string; // custom notes if 'Other' is selected
  emotionalSupport: string[]; // EmotionalSupportPref[]
  importantNotes: string;
  lastSavedAt?: string;
}

export type CareModeOption =
  | "I'm having a difficult day"
  | 'I may need emotional support'
  | 'I may need practical help'
  | 'Please check in'
  | 'Please give me space'
  | 'Use my Care Profile';

export interface CareModeState {
  isActive: boolean;
  activatedAt?: string; // ISO string
  options: CareModeOption[];
  activeOptions?: CareModeOption[]; // Alias for backwards compatibility
  note?: string;
  partnerNotified: boolean;
  notificationStatus: 'sent' | 'delivered' | 'read' | 'pending' | 'permission_disabled' | 'solo';
  lastDeactivatedAt?: string;
}

export type InsightConfidenceLevel = 'sufficient' | 'moderate' | 'insufficient';

export interface SupportInsight {
  id: string;
  headline: string;
  supportingExplanation: string;
  estimatedWindow: {
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    daysUntil: number; // e.g. 2 days away
    cycleDayEstimate: number; // e.g. cycle day 26-28
  };
  confidence: InsightConfidenceLevel;
  confidenceMessage?: string;
  factors: {
    cyclePatterns: string[];
    symptomPatterns: string[];
    carePreferences: string[];
  };
  partnerMessagePreview: string;
  suggestedComfortItems: string[];
  generatedAt: string;
}

export interface SupportNotificationSettings {
  enabled: boolean;
  leadTimeDays: number; // 1 or 2 days in advance
  notifyPartner: boolean;
  quietHours: boolean;
  lastNotifiedAt?: string;
}

export type CareSuggestionCategory = 'communication' | 'comfort' | 'space' | 'timing' | 'daily_support';

export type AIWordingTone = 'gentle' | 'practical' | 'warm' | 'minimal';

export interface CareSuggestion {
  id: string;
  title: string;
  description: string;
  category: CareSuggestionCategory;
  whyThisSuggestion: string;
  ruleBasedPermissionRequired: 'careProfile' | 'generalSupport';
  isPermitted: boolean;
  partnerActionItem: string;
  sampleMessage?: string;
  sourceFactor: string; // e.g., 'Care Profile: Communication', 'Care Profile: Comfort', 'Care Mode: Active', 'Daily Rhythm'
}

export type ReminderCategory =
  | 'Support'
  | 'Supplies'
  | 'Appointment'
  | 'Personal'
  | 'Other';

export type ReminderRepeat = 'None' | 'Daily' | 'Weekly' | 'Monthly';

export interface SharedReminder {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "6:00 PM", "10:30 AM", "Evening"
  category: ReminderCategory;
  repeat: ReminderRepeat;
  notes?: string;
  isSharedWithPartner: boolean; // default OFF for private information
  isCompleted: boolean;
  completedAt?: string;
  createdBy: 'user' | 'partner';
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReminderActivity {
  id: string;
  reminderId: string;
  action: 'created' | 'updated' | 'completed' | 'uncompleted' | 'deleted' | 'sharing_toggled';
  reminderTitle: string;
  actorName: string;
  actorRole: 'user' | 'partner';
  timestamp: string;
  details?: string;
}

export type KnownSymptom =
  | 'Cramps'
  | 'Fatigue'
  | 'Headache'
  | 'Back pain'
  | 'Nausea'
  | 'Mood changes'
  | 'Bloating'
  | 'Other';

export interface SymptomEntry {
  id: string;
  userId?: string; // Supabase auth.users ID
  date: string; // YYYY-MM-DD
  painLevel: number; // 0 (none) to 10 (very severe)
  painLocation: string; // e.g. "Lower abdomen", "Lower back", "Head & Temples", "None", etc.
  symptoms: string[]; // e.g. ['Cramps', 'Fatigue']
  otherSymptomDetail?: string; // custom symptom description if "Other" is chosen
  notes?: string;
  cycleDay?: number; // calculated cycle day if available
  createdAt?: string;
  updatedAt?: string;
}

export interface SymptomFrequencyItem {
  symptom: string;
  count: number;
  percentage: number;
}

export interface CyclePhaseSymptomMetric {
  phase: 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';
  dayRange: string;
  avgPain: number;
  entryCount: number;
  topSymptom: string;
}

export interface CycleEntry {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  cycleLengthDays?: number; // Days from this start date to next cycle start date
  periodDurationDays: number;
  notes?: string;
  isRecorded: boolean; // true for recorded entries
}

export interface CycleStats {
  currentCycleDay: number;
  lastPeriodStart: string;
  lastPeriodEnd: string;
  averageCycleLength: number;
  nextEstimatedPeriodStart: string;
  nextEstimatedPeriodEnd: string;
  estimatedFertileWindowStart: string;
  estimatedFertileWindowEnd: string;
  totalCyclesRecorded: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  partnerId?: string;
  notificationSharingEnabled: boolean; // Default: false (OFF) - "Allow partner to receive support notifications"
  shareCycleSupportInsights: boolean;  // Default: false (OFF) - "Share cycle-related support insights"
  dateOfBirth?: string; // Optional: YYYY-MM-DD
  statusMessage: string;
  timezone: string;
  createdAt: string;
  accountStatus: 'active' | 'pending' | 'restricted';
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  avatar: string;
  connectedAt: string;
  statusMessage: string;
  timezone: string;
  inviteCode: string;
}

export type ConnectionStatus =
  | 'connected'
  | 'pending_sent'
  | 'pending_received'
  | 'disconnected';

export type PartnerConnectionState =
  | 'no_connection'
  | 'invitation_sent'
  | 'invitation_received'
  | 'connected'
  | 'invalid_code'
  | 'expired_invitation'
  | 'already_connected';

export interface HealthSharingPermissions {
  cycleInformation: boolean;
  painTrends: boolean;
  careProfile: boolean;
  careMode: boolean;
  sharedReminders: boolean;
  updatedAt?: string;
}

export interface ConnectionInfo {
  status: ConnectionStatus;
  partner?: Partner;
  inviteCode: string;
  connectedSince?: string;
  pendingPartnerName?: string;
  encryptionStatus: 'Active' | 'Inactive';
  permissions?: HealthSharingPermissions;
}

export type PrivacyCategory =
  | 'profile'
  | 'contact'
  | 'notes'
  | 'activity'
  | 'preferences';

export interface PrivacySettingItem {
  id: string;
  category: PrivacyCategory;
  title: string;
  description: string;
  isShared: boolean;
  partnerIsSharing: boolean;
  partnerVisibilityNotice?: string;
  lastModified: string;
}

export interface SharedNote {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  updatedAt: string;
  isPinned: boolean;
  category: 'general' | 'plans' | 'places' | 'favorites';
}

export interface SharedPreference {
  id: string;
  title: string;
  category: string;
  myValue: string;
  partnerValue: string;
  updatedAt: string;
}

export interface SharedActivity {
  id: string;
  type:
    | 'note_created'
    | 'note_edited'
    | 'privacy_updated'
    | 'preference_updated'
    | 'connection_event'
    | 'care_mode_activated'
    | 'care_mode_deactivated'
    | 'shared_update';
  title: string;
  description: string;
  actorName: string;
  timestamp: string;
}

export type MemoryCategory = 'notes' | 'appreciation' | 'memories';

export interface MemoryItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD or readable
  message: string;
  category: MemoryCategory;
  imagePlaceholder?: string; // photo mood or subtle atmosphere theme
  isSharedWithPartner: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationCategory = 'connection' | 'care' | 'shared' | 'privacy' | 'insights' | 'system';

export type PredictiveNotificationType =
  | 'UPCOMING_SUPPORT'
  | 'DAY_1_SUPPORT'
  | 'CARE_MODE'
  | 'SHARED_REMINDER'
  | 'CARE_SUGGESTION';

export type NotificationType =
  // LUNALINK PREDICTIVE CARE NOTIFICATIONS
  | 'UPCOMING_SUPPORT'
  | 'DAY_1_SUPPORT'
  | 'CARE_MODE'
  | 'SHARED_REMINDER'
  | 'CARE_SUGGESTION'
  // CONNECTION
  | 'partner_invitation'
  | 'partner_connected'
  // CARE
  | 'care_mode_activated'
  | 'care_mode_deactivated'
  | 'care_support_reminder'
  // SHARED
  | 'shared_reminder'
  | 'shared_memory'
  | 'shared_note'
  | 'shared_update'
  // PRIVACY
  | 'privacy_change'
  // INSIGHTS
  | 'support_insight'
  // SYSTEM
  | 'connection_request'
  | 'system';

export type NotificationPrivacyLevel =
  | 'private'
  | 'shared_with_partner'
  | 'discreet_preview'
  | 'consent_required';

export interface AppNotification {
  id: string;
  type: NotificationType;
  predictiveType?: PredictiveNotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  discreetMessage?: string; // Used when exposeHealthInfoInPreviews is false
  timestamp: string;
  isRead: boolean;
  actionUrl?: AppPage;
  actionText?: string;
  containsHealthData?: boolean;
  reason?: string; // "Why am I seeing this?"
  factors?: string[]; // Explainable factors
  privacyLevel?: NotificationPrivacyLevel;
  careSuggestions?: string[]; // "How you can support her" bullet items
  targetAudience?: 'user' | 'partner';
}

export type DemoScenario =
  | 'normal'
  | 'two_days_before'
  | 'estimated_period_day'
  | 'day_1'
  | 'high_day_1_pain'
  | 'insufficient_history'
  | 'care_mode_active';

export interface PartnerSupportNotification {
  id: string;
  type: PredictiveNotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  reason: string;
  factors: string[];
  privacyLevel: NotificationPrivacyLevel;
  careSuggestions: string[];
  disclaimer: string;
  isBlockedByPermission?: boolean;
  blockReason?: string;
}

export interface AllowedPartnerSupportInfo {
  canReceiveNotifications: boolean;
  canReceiveCycleInsights: boolean;
  allowedCommunication?: string[];
  allowedPhysicalSupport?: string[];
  allowedComfort?: string[];
  allowedEmotionalSupport?: string[];
}

export interface UserNotificationSettings {
  // Connection
  partnerInvitation: boolean;
  invitationAccepted: boolean;
  // Care
  careModeActivated: boolean;
  careModeDeactivated: boolean;
  supportReminders: boolean;
  // Shared
  sharedReminders: boolean;
  sharedMemories: boolean;
  sharedNotes: boolean;
  // Privacy
  sharingPermissionChanged: boolean;
  // Insights
  supportPeriodApproaching: boolean;
  // Strict Privacy Control
  exposeHealthInfoInPreviews: boolean; // default false
}

// ==========================================
// WOMEN'S HEALTH & HEALTHCARE CONVERSATIONS
// ==========================================

export type WomensHealthSignalType =
  | 'cycle_irregularity'
  | 'acne_skin'
  | 'hair_changes'
  | 'fatigue'
  | 'sleep'
  | 'mood'
  | 'weight_changes'
  | 'other_symptoms';

export type SignalSeverityLevel = 'mild' | 'moderate' | 'notable';

export interface WomensHealthSignalItem {
  type: WomensHealthSignalType;
  label: string;
  severity: SignalSeverityLevel;
  subTags?: string[];
  notes?: string;
}

export interface WomensHealthSignalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  signals: WomensHealthSignalItem[];
  cycleDay?: number;
  generalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface HealthcareSummarySelection {
  includeCycleHistory: boolean;
  includeSymptomTrends: boolean;
  includePainHistory: boolean;
  includeChangesOverTime: boolean;
  includeQuestions: boolean;
  timeRange: 'last_30_days' | 'last_60_days' | 'last_90_days' | 'all_time';
  questions: string[];
  additionalPatientNotes?: string;
}

export interface PatternInsight {
  id: string;
  title: string;
  observation: string;
  discussionRecommendation: string;
  relevantSignals: WomensHealthSignalType[];
  timeframe: string;
  severityLevel: 'informational' | 'notable';
}

export type HealthcareSpecialty =
  | 'gynecologist'
  | 'endocrinologist'
  | 'dietitian'
  | 'mental_health'
  | 'general_care';

export interface HealthcareRecipient {
  name: string;
  specialty: string;
  clinicOrOrganization: string;
  emailOrPortalId?: string;
  phone?: string;
}

export type HealthSummarySharingTiming =
  | 'appointment_day' // Shared at the start of appointment day
  | 'advance_24h'     // 24 hours prior to consultation
  | 'manual_only'    // Only when patient clicks 'Release Summary'
  | 'link_with_expiry'; // Active now with self-expiring link

export interface HealthSummarySharingConfig {
  id: string;
  title: string;
  recipient: HealthcareRecipient;
  timing: HealthSummarySharingTiming;
  expiryDays: number;
  status: 'draft' | 'scheduled' | 'active' | 'revoked';
  shareKey?: string;
  lastReleasedAt?: string;
  expiresAt?: string;
  includedItems: {
    cycleHistory: boolean;
    symptomTrends: boolean;
    painMetrics: boolean;
    lifestyleAndSleep: boolean;
    doctorQuestions: boolean;
    medicationsVitamins: boolean;
  };
  clinicalNotes?: string;
}


