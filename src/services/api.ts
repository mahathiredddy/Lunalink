/**
 * API & Database Abstraction Layer for LunaLink
 * 
 * This module isolates all data mutations and queries from the UI layer.
 * When integrating Supabase, simply replace the local storage/mock handlers
 * inside these service methods with calls to `supabase.from('...')` or `supabase.auth`.
 */

import {
  User,
  Partner,
  ConnectionInfo,
  PrivacySettingItem,
  SharedNote,
  SharedPreference,
  SharedActivity,
  AppNotification,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PARTNER,
  INITIAL_CONNECTION,
  INITIAL_PRIVACY_SETTINGS,
  INITIAL_SHARED_NOTES,
  INITIAL_SHARED_PREFERENCES,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
} from './mockData';

const STORAGE_KEYS = {
  USER: 'lunalink_user_v1',
  CONNECTION: 'lunalink_connection_v1',
  PRIVACY: 'lunalink_privacy_v1',
  NOTES: 'lunalink_notes_v1',
  PREFERENCES: 'lunalink_preferences_v1',
  ACTIVITIES: 'lunalink_activities_v1',
  NOTIFICATIONS: 'lunalink_notifications_v1',
  AUTH: 'lunalink_auth_v1',
};

// Safe LocalStorage helpers with fallback
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to store key ${key}`, err);
  }
}

/* ==========================================================================
   1. AUTH SERVICE
   Supabase Equivalent: supabase.auth.signUp, signInWithPassword, signOut
   ========================================================================== */
export const authService = {
  async getCurrentUser(): Promise<User> {
    // Supabase: const { data: { user } } = await supabase.auth.getUser();
    return getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
  },

  async login(email: string): Promise<{ success: boolean; user: User }> {
    // Supabase: await supabase.auth.signInWithPassword({ email, password });
    const user = getStored<User>(STORAGE_KEYS.USER, {
      ...INITIAL_USER,
      email,
    });
    setStored(STORAGE_KEYS.AUTH, { isAuthenticated: true, email });
    return { success: true, user };
  },

  async signUp(name: string, email: string): Promise<{ success: boolean; user: User }> {
    // Supabase: await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    const newUser: User = {
      ...INITIAL_USER,
      id: `usr_${Date.now()}`,
      name,
      email,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStored(STORAGE_KEYS.USER, newUser);
    setStored(STORAGE_KEYS.AUTH, { isAuthenticated: true, email });
    return { success: true, user: newUser };
  },

  async logout(): Promise<void> {
    // Supabase: await supabase.auth.signOut();
    setStored(STORAGE_KEYS.AUTH, { isAuthenticated: false });
  },

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    // Supabase: await supabase.from('profiles').update(updates).eq('id', user.id);
    const current = getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
    const updated = { ...current, ...updates };
    setStored(STORAGE_KEYS.USER, updated);
    return updated;
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    // Supabase: await supabase.auth.resetPasswordForEmail(email);
    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${email}. Check your inbox or spam folder.`,
    };
  },
};

/* ==========================================================================
   2. CONNECTION SERVICE
   Supabase Equivalent: supabase.from('connections').select/insert/update
   ========================================================================== */
export const connectionService = {
  async getConnection(): Promise<ConnectionInfo> {
    // Supabase: await supabase.from('connections').select('*, partner:profiles(*)').single();
    return getStored<ConnectionInfo>(STORAGE_KEYS.CONNECTION, INITIAL_CONNECTION);
  },

  async generateNewInviteCode(): Promise<string> {
    // Supabase: await supabase.rpc('generate_lunalink_invite_token');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = `LUNA-${randomSuffix}-ALX`;
    const connection = getStored<ConnectionInfo>(STORAGE_KEYS.CONNECTION, INITIAL_CONNECTION);
    connection.inviteCode = newCode;
    setStored(STORAGE_KEYS.CONNECTION, connection);
    return newCode;
  },

  async connectWithPartnerCode(code: string): Promise<{ success: boolean; partner?: Partner; error?: string }> {
    // Supabase: await supabase.rpc('accept_partner_invite', { invite_code: code });
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode.startsWith('LUNA-')) {
      return { success: false, error: 'Invalid invite code format. Codes must begin with LUNA-.' };
    }

    const newPartner: Partner = {
      ...INITIAL_PARTNER,
      inviteCode: cleanCode,
      connectedAt: 'Just now',
    };

    const updatedConnection: ConnectionInfo = {
      status: 'connected',
      partner: newPartner,
      inviteCode: 'LUNA-9823-ALX',
      connectedSince: 'Today',
      encryptionStatus: 'Active',
    };

    setStored(STORAGE_KEYS.CONNECTION, updatedConnection);
    return { success: true, partner: newPartner };
  },

  async disconnectPartner(): Promise<void> {
    // Supabase: await supabase.from('connections').delete().eq('id', connectionId);
    const updatedConnection: ConnectionInfo = {
      status: 'disconnected',
      partner: undefined,
      inviteCode: 'LUNA-9823-ALX',
      encryptionStatus: 'Inactive',
    };
    setStored(STORAGE_KEYS.CONNECTION, updatedConnection);
  },

  async simulateToggleConnection(toState: ConnectionInfo['status']): Promise<ConnectionInfo> {
    const current = getStored<ConnectionInfo>(STORAGE_KEYS.CONNECTION, INITIAL_CONNECTION);
    let updated: ConnectionInfo;

    if (toState === 'connected') {
      updated = {
        ...current,
        status: 'connected',
        partner: INITIAL_PARTNER,
        connectedSince: 'Feb 14, 2024',
        encryptionStatus: 'Active',
      };
    } else if (toState === 'pending_sent') {
      updated = {
        ...current,
        status: 'pending_sent',
        partner: undefined,
        pendingPartnerName: 'Elena Chen (Invite Sent)',
        encryptionStatus: 'Inactive',
      };
    } else {
      updated = {
        ...current,
        status: 'disconnected',
        partner: undefined,
        encryptionStatus: 'Inactive',
      };
    }

    setStored(STORAGE_KEYS.CONNECTION, updated);
    return updated;
  },
};

/* ==========================================================================
   3. PRIVACY SERVICE
   Supabase Equivalent: supabase.from('privacy_permissions').upsert(...)
   ========================================================================== */
export const privacyService = {
  async getPrivacySettings(): Promise<PrivacySettingItem[]> {
    return getStored<PrivacySettingItem[]>(STORAGE_KEYS.PRIVACY, INITIAL_PRIVACY_SETTINGS);
  },

  async toggleSetting(settingId: string): Promise<PrivacySettingItem[]> {
    const current = getStored<PrivacySettingItem[]>(STORAGE_KEYS.PRIVACY, INITIAL_PRIVACY_SETTINGS);
    const updated = current.map((item) =>
      item.id === settingId
        ? {
            ...item,
            isShared: !item.isShared,
            lastModified: 'Just now',
          }
        : item
    );
    setStored(STORAGE_KEYS.PRIVACY, updated);
    return updated;
  },

  async saveAllSettings(settings: PrivacySettingItem[]): Promise<PrivacySettingItem[]> {
    setStored(STORAGE_KEYS.PRIVACY, settings);
    return settings;
  },
};

/* ==========================================================================
   4. SHARED SPACE SERVICE
   Supabase Equivalent: supabase.from('shared_notes'), 'shared_preferences'
   ========================================================================== */
export const sharedSpaceService = {
  async getNotes(): Promise<SharedNote[]> {
    return getStored<SharedNote[]>(STORAGE_KEYS.NOTES, INITIAL_SHARED_NOTES);
  },

  async createNote(newNote: Omit<SharedNote, 'id' | 'updatedAt'>): Promise<SharedNote> {
    const current = getStored<SharedNote[]>(STORAGE_KEYS.NOTES, INITIAL_SHARED_NOTES);
    const created: SharedNote = {
      ...newNote,
      id: `note_${Date.now()}`,
      updatedAt: 'Just now',
    };
    const updated = [created, ...current];
    setStored(STORAGE_KEYS.NOTES, updated);
    return created;
  },

  async updateNote(id: string, updates: Partial<SharedNote>): Promise<SharedNote[]> {
    const current = getStored<SharedNote[]>(STORAGE_KEYS.NOTES, INITIAL_SHARED_NOTES);
    const updated = current.map((n) =>
      n.id === id ? { ...n, ...updates, updatedAt: 'Just now' } : n
    );
    setStored(STORAGE_KEYS.NOTES, updated);
    return updated;
  },

  async deleteNote(id: string): Promise<SharedNote[]> {
    const current = getStored<SharedNote[]>(STORAGE_KEYS.NOTES, INITIAL_SHARED_NOTES);
    const updated = current.filter((n) => n.id !== id);
    setStored(STORAGE_KEYS.NOTES, updated);
    return updated;
  },

  async getPreferences(): Promise<SharedPreference[]> {
    return getStored<SharedPreference[]>(STORAGE_KEYS.PREFERENCES, INITIAL_SHARED_PREFERENCES);
  },

  async updatePreference(id: string, myValue: string): Promise<SharedPreference[]> {
    const current = getStored<SharedPreference[]>(STORAGE_KEYS.PREFERENCES, INITIAL_SHARED_PREFERENCES);
    const updated = current.map((p) =>
      p.id === id ? { ...p, myValue, updatedAt: 'Just now' } : p
    );
    setStored(STORAGE_KEYS.PREFERENCES, updated);
    return updated;
  },

  async getActivities(): Promise<SharedActivity[]> {
    return getStored<SharedActivity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  },
};

/* ==========================================================================
   5. NOTIFICATIONS SERVICE
   Supabase Equivalent: supabase.from('notifications').select/update
   ========================================================================== */
export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    return getStored<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  async markAsRead(id: string): Promise<AppNotification[]> {
    const current = getStored<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  async markAsUnread(id: string): Promise<AppNotification[]> {
    const current = getStored<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = current.map((n) => (n.id === id ? { ...n, isRead: false } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  async toggleRead(id: string): Promise<AppNotification[]> {
    const current = getStored<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = current.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  async markAllAsRead(): Promise<AppNotification[]> {
    const current = getStored<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = current.map((n) => ({ ...n, isRead: true }));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  async clearNotification(id: string): Promise<AppNotification[]> {
    const current = getStored<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = current.filter((n) => n.id !== id);
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },
};
