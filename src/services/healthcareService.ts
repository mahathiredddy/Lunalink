import {
  HealthSummarySharingConfig,
  HealthcareSpecialty,
} from '../types';

export interface HealthcareSpecialtyInfo {
  id: HealthcareSpecialty;
  title: string;
  roleDescription: string;
  relevanceToLunaLink: string;
  whatToDiscuss: string[];
  suggestedSummaryFocus: string[];
  integrationStatus: 'coming_soon';
}

export const HEALTHCARE_SPECIALTIES: HealthcareSpecialtyInfo[] = [
  {
    id: 'gynecologist',
    title: 'Gynecologist',
    roleDescription: 'Specializes in female reproductive anatomy, pelvic health, and menstrual cycle care.',
    relevanceToLunaLink: 'Review cycle irregularity patterns, severe cramping (dysmenorrhea), pelvic pain history, and structural screening.',
    whatToDiscuss: [
      'Cycle duration variations and flow heaviness patterns',
      'Pelvic pain timing relative to cycle phases',
      'Contraceptive or fertility goals and physical comfort',
    ],
    suggestedSummaryFocus: ['Cycle history', 'Pain history', 'Changes over time'],
    integrationStatus: 'coming_soon',
  },
  {
    id: 'endocrinologist',
    title: 'Endocrinologist',
    roleDescription: 'Specializes in hormone systems, adrenal health, thyroid regulation, and metabolic function.',
    relevanceToLunaLink: 'Evaluate persistent hormonal signals such as hirsutism, jawline cystic acne, severe fatigue, or unexplained weight shifts.',
    whatToDiscuss: [
      'Lab panels (LH/FSH ratio, fasting insulin, DHEA-S, thyroid TSH/Free T4)',
      'Glucose response and energy crashes through the day',
      'Skin and hair texture changes observed across 90-day logs',
    ],
    suggestedSummaryFocus: ['Symptom trends', 'Changes over time', 'Lifestyle & sleep'],
    integrationStatus: 'coming_soon',
  },
  {
    id: 'dietitian',
    title: 'Registered Dietitian',
    roleDescription: 'Specializes in medical nutrition therapy, anti-inflammatory dietary planning, and blood sugar balance.',
    relevanceToLunaLink: 'Support cycle regularity, digestive comfort during luteal phases, and sustainable metabolic wellness.',
    whatToDiscuss: [
      'Nutrient timing to stabilize luteal-phase cravings and fatigue',
      'Gut sensitivity and bloating tracked around cycle days',
      'Supplement strategies (inositol, magnesium, omega-3s, vitamin D)',
    ],
    suggestedSummaryFocus: ['Symptom trends', 'Lifestyle & sleep', 'Questions for clinician'],
    integrationStatus: 'coming_soon',
  },
  {
    id: 'mental_health',
    title: 'Mental Health Professional',
    roleDescription: 'Specializes in behavioral therapy, PMDD / hormonal mood shifts, relationship support, and chronic pain coping.',
    relevanceToLunaLink: 'Address cyclical anxiety, emotional burnout, depressive episodes in late luteal phases, and partnership communication.',
    whatToDiscuss: [
      'Mood shifts correlated with hormonal cycle phases',
      'Emotional boundaries and communication strategies with partners',
      'Somatic and cognitive coping tools for chronic pelvic discomfort',
    ],
    suggestedSummaryFocus: ['Symptom trends', 'Changes over time', 'Patient questions'],
    integrationStatus: 'coming_soon',
  },
];

export interface HealthcarePlatformFeature {
  id: string;
  title: string;
  category: 'discovery' | 'booking' | 'telehealth';
  badge: 'Coming soon';
  description: string;
  futureArchitecture: string;
  patientSafetyPrinciples: string[];
}

export const HEALTHCARE_PLATFORM_FEATURES: HealthcarePlatformFeature[] = [
  {
    id: 'professional-discovery',
    title: 'Professional Discovery',
    category: 'discovery',
    badge: 'Coming soon',
    description: 'A directory of verified clinicians who specialize in menstrual health, hormonal balance, and integrative care.',
    futureArchitecture: 'Direct integration with state medical licensing registries and credentialed practitioner networks.',
    patientSafetyPrinciples: [
      'Zero paid algorithmic doctor placements',
      'Explicit disclosure of clinical board certifications',
      'Patient-led discovery without third-party data tracking',
    ],
  },
  {
    id: 'appointment-booking',
    title: 'Appointment Booking',
    category: 'booking',
    badge: 'Coming soon',
    description: 'Streamlined scheduling directly synchronizing your healthcare summary with clinic calendar systems.',
    futureArchitecture: 'FHIR (Fast Healthcare Interoperability Resources) compliant scheduling connectors with verified clinic EHR systems.',
    patientSafetyPrinciples: [
      'No simulated or mock doctor slots',
      'Instant calendar sync with confirmation from clinic staff',
      'Automated reminder release based on patient sharing preferences',
    ],
  },
  {
    id: 'telehealth',
    title: 'Telehealth',
    category: 'telehealth',
    badge: 'Coming soon',
    description: 'End-to-end encrypted video appointments designed for reviewing cyclical health data comfortably from home.',
    futureArchitecture: 'HIPAA-compliant, peer-to-peer encrypted WebRTC video rooms with integrated split-screen health summary view.',
    patientSafetyPrinciples: [
      'Zero video recording or transcript harvesting',
      'End-to-end encrypted patient-clinician rooms',
      'Seamless summary sharing without screen-sharing hassle',
    ],
  },
];

const HEALTHCARE_STORAGE_KEY = 'lunalink_healthcare_summary_shares';

export const INITIAL_SHARING_CONFIGS: HealthSummarySharingConfig[] = [
  {
    id: 'share-001',
    title: 'Annual Gynecological Consultation',
    recipient: {
      name: 'Dr. Maya Patel, MD, FACOG',
      specialty: 'Obstetrics & Gynecology',
      clinicOrOrganization: 'Northwest Women’s Health Collective',
      emailOrPortalId: 'records@nwwomenshealth.org',
      phone: '(555) 382-9100',
    },
    timing: 'appointment_day',
    expiryDays: 3,
    status: 'scheduled',
    shareKey: 'LUNA-792-GYN',
    lastReleasedAt: undefined,
    expiresAt: '2026-10-15T23:59:59Z',
    includedItems: {
      cycleHistory: true,
      symptomTrends: true,
      painMetrics: true,
      lifestyleAndSleep: false,
      doctorQuestions: true,
      medicationsVitamins: false,
    },
    clinicalNotes: 'Discussing recent cycle variation (28-34 days) and persistent luteal phase fatigue.',
  },
  {
    id: 'share-002',
    title: 'Integrative Nutrition Review',
    recipient: {
      name: 'Elena Rostova, MS, RD, CDN',
      specialty: 'Hormone & Metabolic Nutrition',
      clinicOrOrganization: 'Vitality Integrative Care',
      emailOrPortalId: 'elena@vitalitycare.clinic',
    },
    timing: 'advance_24h',
    expiryDays: 7,
    status: 'active',
    shareKey: 'LUNA-418-NUT',
    lastReleasedAt: '2026-09-17T14:30:00Z',
    expiresAt: '2026-09-24T14:30:00Z',
    includedItems: {
      cycleHistory: true,
      symptomTrends: true,
      painMetrics: false,
      lifestyleAndSleep: true,
      doctorQuestions: true,
      medicationsVitamins: true,
    },
    clinicalNotes: 'Evaluating blood sugar stability and dietary adjustments for energy support.',
  },
];

export const healthcareService = {
  getSharingConfigs(): HealthSummarySharingConfig[] {
    try {
      const stored = localStorage.getItem(HEALTHCARE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_SHARING_CONFIGS;
  },

  saveSharingConfig(config: Partial<HealthSummarySharingConfig> & { recipient: HealthSummarySharingConfig['recipient'] }): HealthSummarySharingConfig {
    const list = this.getSharingConfigs();
    const existingIndex = list.findIndex((item) => item.id === config.id);

    let saved: HealthSummarySharingConfig;

    if (existingIndex >= 0) {
      saved = {
        ...list[existingIndex],
        ...config,
      };
      list[existingIndex] = saved;
    } else {
      const randomKey = `LUNA-${Math.floor(100 + Math.random() * 900)}-${config.recipient.specialty.slice(0, 3).toUpperCase()}`;
      saved = {
        id: config.id || `share-${Date.now()}`,
        title: config.title || `Summary for ${config.recipient.name}`,
        recipient: config.recipient,
        timing: config.timing || 'appointment_day',
        expiryDays: config.expiryDays || 3,
        status: config.status || 'draft',
        shareKey: randomKey,
        lastReleasedAt: config.status === 'active' ? new Date().toISOString() : undefined,
        expiresAt: new Date(Date.now() + (config.expiryDays || 3) * 24 * 60 * 60 * 1000).toISOString(),
        includedItems: config.includedItems || {
          cycleHistory: true,
          symptomTrends: true,
          painMetrics: true,
          lifestyleAndSleep: true,
          doctorQuestions: true,
          medicationsVitamins: false,
        },
        clinicalNotes: config.clinicalNotes,
      };
      list.unshift(saved);
    }

    try {
      localStorage.setItem(HEALTHCARE_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Storage error
    }

    return saved;
  },

  revokeAccess(id: string): HealthSummarySharingConfig | null {
    const list = this.getSharingConfigs();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    list[index].status = 'revoked';
    list[index].expiresAt = new Date().toISOString();

    try {
      localStorage.setItem(HEALTHCARE_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Storage error
    }

    return list[index];
  },

  deleteSharingConfig(id: string): boolean {
    const list = this.getSharingConfigs();
    const filtered = list.filter((item) => item.id !== id);
    try {
      localStorage.setItem(HEALTHCARE_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },

  resetSharingConfigs(): HealthSummarySharingConfig[] {
    try {
      localStorage.setItem(HEALTHCARE_STORAGE_KEY, JSON.stringify(INITIAL_SHARING_CONFIGS));
    } catch {
      // ignore
    }
    return INITIAL_SHARING_CONFIGS;
  },
};
