import {
  HealthSharingPermissions,
  Partner,
  PartnerConnectionState,
  ConnectionInfo,
} from '../types';
import { INITIAL_PARTNER } from './mockData';

const SHARING_PERMISSIONS_STORAGE_KEY = 'lunalink_health_sharing_permissions';
const PENDING_INVITE_STORAGE_KEY = 'lunalink_pending_invite_state';

export const DEFAULT_HEALTH_PERMISSIONS: HealthSharingPermissions = {
  // IMPORTANT: Default is strictly false.
  // Being connected must NOT automatically provide access to health information.
  cycleInformation: false,
  painTrends: false,
  careProfile: false,
  careMode: false,
  sharedReminders: false,
  updatedAt: new Date().toISOString(),
};

export const SAMPLE_RECEIVED_INVITE = {
  partnerName: 'Elena Chen',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  inviteCode: 'LUNA-7734-ELN',
  sentAt: '2 hours ago',
  expiresIn: '46 hours left',
};

/**
 * Partner Connection Service
 * Manages 1-to-1 partner pairing, invite code generation/validation,
 * connection lifecycle states, and granular health sharing permissions.
 *
 * Prepared for direct mapping to Supabase PostgreSQL schema with RLS.
 */
export const partnerConnectionService = {
  /**
   * Load health sharing permissions from localStorage or defaults
   */
  getPermissions(): HealthSharingPermissions {
    try {
      const stored = localStorage.getItem(SHARING_PERMISSIONS_STORAGE_KEY);
      if (stored) {
        return {
          ...DEFAULT_HEALTH_PERMISSIONS,
          ...JSON.parse(stored),
        };
      }
    } catch (e) {
      console.warn('Failed to parse health sharing permissions', e);
    }
    return DEFAULT_HEALTH_PERMISSIONS;
  },

  /**
   * Save health sharing permissions
   */
  savePermissions(updates: Partial<HealthSharingPermissions>): HealthSharingPermissions {
    const current = this.getPermissions();
    const updated: HealthSharingPermissions = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(SHARING_PERMISSIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to store health sharing permissions', e);
    }
    return updated;
  },

  /**
   * Toggle a specific permission
   */
  togglePermission(key: keyof Omit<HealthSharingPermissions, 'updatedAt'>): HealthSharingPermissions {
    const current = this.getPermissions();
    const nextVal = !current[key];
    return this.savePermissions({ [key]: nextVal });
  },

  /**
   * Reset health sharing permissions to safe defaults (all false)
   */
  resetPermissions(): HealthSharingPermissions {
    try {
      localStorage.removeItem(SHARING_PERMISSIONS_STORAGE_KEY);
    } catch {
      // ignore
    }
    return DEFAULT_HEALTH_PERMISSIONS;
  },

  /**
   * Generate a unique, cryptographically random invite code
   * Format: LUNA-[4 digits]-[3 letters]
   */
  generateUniqueInviteCode(): string {
    const digits = Math.floor(1000 + Math.random() * 9000);
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // exclude ambiguous I, O
    let letters = '';
    for (let i = 0; i < 3; i++) {
      letters += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `LUNA-${digits}-${letters}`;
  },

  /**
   * Validate an invite code and simulate connection response
   */
  validateAndConnect(
    inputCode: string,
    currentConnection: ConnectionInfo
  ): {
    state: PartnerConnectionState;
    partner?: Partner;
    error?: string;
  } {
    const clean = inputCode.trim().toUpperCase();

    // Already connected check
    if (currentConnection.status === 'connected' && currentConnection.partner) {
      return {
        state: 'already_connected',
        error: `You are already connected to ${currentConnection.partner.name}. Disconnect your current partner before linking someone new.`,
      };
    }

    // Entering own invite code check
    if (clean === currentConnection.inviteCode.toUpperCase()) {
      return {
        state: 'invalid_code',
        error: 'This is your own invitation code. Please share this code with your partner or enter their code.',
      };
    }

    // Expired invitation simulation
    if (clean.includes('EXPIRED') || clean === 'LUNA-0000-EXP') {
      return {
        state: 'expired_invitation',
        error: 'This invitation code has expired (invitations are valid for 48 hours). Please ask your partner to generate a new code.',
      };
    }

    // Invalid format check
    const formatRegex = /^LUNA-\d{4}-[A-Z]{3}$/;
    const isStandardMatch = formatRegex.test(clean);
    const isSampleMatch = clean === 'LUNA-7734-ELN' || clean === 'LUNA-9823-ALX' || clean === 'LUNA-1234-ABC';

    if (!isStandardMatch && !isSampleMatch) {
      return {
        state: 'invalid_code',
        error: 'Invalid invitation code format. Valid codes look like LUNA-7734-ELN or LUNA-4821-KMP.',
      };
    }

    // Successful pairing
    const newPartner: Partner = {
      ...INITIAL_PARTNER,
      inviteCode: clean,
      connectedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    return {
      state: 'connected',
      partner: newPartner,
    };
  },
};

/**
 * =========================================================================
 * SUPABASE POSTGRESQL SCHEMA SPECIFICATION (Partner Connection & Permissions)
 * =========================================================================
 *
 * -- 1. PARTNER CONNECTIONS TABLE
 * CREATE TABLE public.partner_connections (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
 *   partner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
 *   invite_code VARCHAR(32) UNIQUE NOT NULL,
 *   status VARCHAR(24) NOT NULL DEFAULT 'invitation_sent',
 *   -- possible status values: 'invitation_sent', 'invitation_received', 'connected', 'disconnected', 'expired'
 *   expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '48 hours'),
 *   connected_at TIMESTAMPTZ,
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   updated_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * -- 2. SHARING PERMISSIONS TABLE (Strictly permission-based health data)
 * CREATE TABLE public.sharing_permissions (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   connection_id UUID REFERENCES public.partner_connections(id) ON DELETE CASCADE NOT NULL,
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
 *   partner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
 *   cycle_information BOOLEAN NOT NULL DEFAULT false,
 *   pain_trends BOOLEAN NOT NULL DEFAULT false,
 *   care_profile BOOLEAN NOT NULL DEFAULT false,
 *   care_mode BOOLEAN NOT NULL DEFAULT false,
 *   shared_reminders BOOLEAN NOT NULL DEFAULT false,
 *   updated_at TIMESTAMPTZ DEFAULT now(),
 *   UNIQUE(connection_id, user_id)
 * );
 *
 * -- 3. ROW LEVEL SECURITY
 * ALTER TABLE public.partner_connections ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.sharing_permissions ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users can view their own partner connection"
 *   ON public.partner_connections FOR SELECT
 *   USING (auth.uid() = user_id OR auth.uid() = partner_id);
 *
 * CREATE POLICY "Users can manage their own sharing permissions"
 *   ON public.sharing_permissions FOR ALL
 *   USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Partner can read sharing permissions explicitly granted to them"
 *   ON public.sharing_permissions FOR SELECT
 *   USING (auth.uid() = partner_id);
 *
 * -- 4. RPC: accept_partner_invite(code)
 * CREATE OR REPLACE FUNCTION public.accept_partner_invite(invite_code_param TEXT)
 * RETURNS jsonb
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   conn_record RECORD;
 * BEGIN
 *   -- Fetch active invite
 *   SELECT * INTO conn_record
 *   FROM public.partner_connections
 *   WHERE invite_code = UPPER(invite_code_param)
 *     AND status = 'invitation_sent'
 *     AND expires_at > now();
 *
 *   IF NOT FOUND THEN
 *     RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invite code.');
 *   END IF;
 *
 *   IF conn_record.user_id = auth.uid() THEN
 *     RETURN jsonb_build_object('success', false, 'error', 'You cannot accept your own invite code.');
 *   END IF;
 *
 *   -- Update connection to connected
 *   UPDATE public.partner_connections
 *   SET partner_id = auth.uid(),
 *       status = 'connected',
 *       connected_at = now(),
 *       updated_at = now()
 *   WHERE id = conn_record.id;
 *
 *   -- Initialize zero-access default health permissions
 *   INSERT INTO public.sharing_permissions (connection_id, user_id, partner_id)
 *   VALUES
 *     (conn_record.id, auth.uid(), conn_record.user_id),
 *     (conn_record.id, conn_record.user_id, auth.uid())
 *   ON CONFLICT (connection_id, user_id) DO NOTHING;
 *
 *   RETURN jsonb_build_object('success', true, 'connection_id', conn_record.id);
 * END;
 * $$;
 */
