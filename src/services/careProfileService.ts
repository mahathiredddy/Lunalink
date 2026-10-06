import { CareProfile } from '../types';

const STORAGE_KEY = 'lunalink_care_dna_profile';

export const DEFAULT_CARE_PROFILE: CareProfile = {
  id: 'care_profile_user_1',
  userId: 'user_1',
  isSharedWithPartner: false, // strictly private by default as required
  communication: ['Text me', 'Check in occasionally'],
  physicalSupport: ['Stay nearby', 'Help with practical tasks'],
  comfort: ['Warm drink', 'Heating pad', 'Quiet environment'],
  otherComfortDetail: '',
  emotionalSupport: ['Listen', 'Reassure me', 'Avoid advice'],
  importantNotes: 'When I need support, please check in once and give me space if I do not respond right away. A warm cup of tea or a hot water bottle is always comforting.',
  lastSavedAt: new Date().toISOString(),
};

/**
 * Care Profile / Care DNA Service
 * Manages how personal support preferences are stored and translated
 * into actionable, empathic support for a trusted partner.
 */
export const careProfileService = {
  /**
   * Get the current user's Care Profile from localStorage or default
   */
  getProfile(): CareProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_CARE_PROFILE,
          ...parsed,
          communication: Array.isArray(parsed.communication) ? parsed.communication : DEFAULT_CARE_PROFILE.communication,
          physicalSupport: Array.isArray(parsed.physicalSupport) ? parsed.physicalSupport : DEFAULT_CARE_PROFILE.physicalSupport,
          comfort: Array.isArray(parsed.comfort) ? parsed.comfort : DEFAULT_CARE_PROFILE.comfort,
          emotionalSupport: Array.isArray(parsed.emotionalSupport) ? parsed.emotionalSupport : DEFAULT_CARE_PROFILE.emotionalSupport,
          // ensure privacy default rule if not explicitly set
          isSharedWithPartner: Boolean(parsed.isSharedWithPartner),
        };
      }
    } catch (e) {
      console.warn('Failed to parse care profile from storage, using defaults', e);
    }
    return DEFAULT_CARE_PROFILE;
  },

  /**
   * Save Care Profile preferences
   */
  saveProfile(updates: Partial<CareProfile>): CareProfile {
    const current = this.getProfile();
    const updated: CareProfile = {
      ...current,
      ...updates,
      lastSavedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist care profile', e);
    }
    return updated;
  },

  /**
   * Reset Care Profile to clean initial state
   */
  resetToDefault(): CareProfile {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return DEFAULT_CARE_PROFILE;
  },

  /**
   * Synthesize a warm, actionable summary of how the partner views this profile
   */
  generatePartnerSummary(profile: CareProfile): string {
    const comm = profile.communication;
    const phys = profile.physicalSupport;
    const emot = profile.emotionalSupport;

    const parts: string[] = [];

    // Communication synthesis
    if (comm.includes('Give me some space')) {
      parts.push('Please give me space to rest without feeling pressured to reply');
    } else if (comm.includes('Text me') && comm.includes('Check in occasionally')) {
      parts.push('A gentle text check-in is wonderful, but give me space if I do not answer right away');
    } else if (comm.includes('Text me')) {
      parts.push('Texting works best for me rather than calling unexpectedly');
    } else if (comm.includes('Call me')) {
      parts.push('A short voice call helps me feel grounded');
    } else if (comm.includes('Ask before calling')) {
      parts.push('Please send a quick text before calling');
    }

    // Physical support synthesis
    if (phys.includes('Stay nearby') && phys.includes('Help with practical tasks')) {
      parts.push('quietly staying nearby and helping with small practical tasks makes a huge difference');
    } else if (phys.includes('Give me space')) {
      parts.push('having some quiet alone time helps me recharge');
    } else if (phys.includes('Ask before visiting')) {
      parts.push('please ask before dropping by in person');
    } else if (phys.includes('Help with practical tasks')) {
      parts.push('handling practical tasks like snacks or meals takes off a lot of stress');
    }

    // Emotional support synthesis
    if (emot.includes('Listen') && emot.includes('Avoid advice')) {
      parts.push('just listening and holding space is much better than trying to solve or advise');
    } else if (emot.includes('Reassure me')) {
      parts.push('gentle reassurance and warmth help me feel safe');
    } else if (emot.includes('Distract me')) {
      parts.push('lighthearted distraction or watching a favorite show together helps shift my focus');
    } else if (emot.includes('Just stay with me')) {
      parts.push('your presence without any pressure is comforting');
    }

    if (parts.length === 0) {
      return 'When I need support, please check in gently and ask how you can help.';
    }

    return `When I need support: ${parts.join('. Also, ')}.`;
  },
};

/**
 * =========================================================================
 * SUPABASE POSTGRESQL SCHEMA SPECIFICATION (Care DNA / Care Profiles)
 * =========================================================================
 *
 * CREATE TABLE public.care_profiles (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
 *   is_shared_with_partner BOOLEAN NOT NULL DEFAULT false,
 *   communication TEXT[] NOT NULL DEFAULT '{}',
 *   physical_support TEXT[] NOT NULL DEFAULT '{}',
 *   comfort TEXT[] NOT NULL DEFAULT '{}',
 *   other_comfort_detail TEXT,
 *   emotional_support TEXT[] NOT NULL DEFAULT '{}',
 *   important_notes TEXT DEFAULT '',
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   updated_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * ALTER TABLE public.care_profiles ENABLE ROW LEVEL SECURITY;
 *
 * -- Owner has full access:
 * CREATE POLICY "Users can manage their own care profile"
 *   ON public.care_profiles FOR ALL
 *   USING (auth.uid() = user_id);
 *
 * -- Connected partner can view ONLY if user has enabled sharing:
 * CREATE POLICY "Partner can view care profile if explicitly shared"
 *   ON public.care_profiles FOR SELECT
 *   USING (
 *     is_shared_with_partner = true
 *     AND EXISTS (
 *       SELECT 1 FROM public.partner_connections
 *       WHERE status = 'connected'
 *         AND ((user_a_id = auth.uid() AND user_b_id = care_profiles.user_id)
 *           OR (user_b_id = auth.uid() AND user_a_id = care_profiles.user_id))
 *     )
 *   );
 */
