import { CareModeOption, CareModeState } from '../types';

const CARE_MODE_STORAGE_KEY = 'lunalink_care_mode_state';

export const DEFAULT_CARE_MODE_STATE: CareModeState = {
  isActive: false,
  activatedAt: undefined,
  options: [],
  activeOptions: [],
  note: '',
  partnerNotified: false,
  notificationStatus: 'pending',
  lastDeactivatedAt: undefined,
};

export const CARE_MODE_OPTIONS_META: {
  id: CareModeOption;
  label: string;
  description: string;
  iconName: 'sun-dim' | 'heart-handshake' | 'helping-hand' | 'message-circle' | 'sparkles' | 'shield-heart';
  badgeColor: string;
}[] = [
  {
    id: "I'm having a difficult day",
    label: "I'm having a difficult day",
    description: 'Signals low energy, discomfort, or physical strain without needing to explain every detail.',
    iconName: 'sun-dim',
    badgeColor: 'amber',
  },
  {
    id: 'I may need emotional support',
    label: 'I may need emotional support',
    description: 'Reassurance, gentle presence, active listening, or simply kind words.',
    iconName: 'heart-handshake',
    badgeColor: 'rose',
  },
  {
    id: 'I may need practical help',
    label: 'I may need practical help',
    description: 'Help with meals, chores, errands, fetching warm items, or keeping life quiet.',
    iconName: 'helping-hand',
    badgeColor: 'emerald',
  },
  {
    id: 'Please check in',
    label: 'Please check in',
    description: 'A gentle message or occasional ping is welcome throughout the day.',
    iconName: 'message-circle',
    badgeColor: 'sky',
  },
  {
    id: 'Please give me space',
    label: 'Please give me space',
    description: 'Quiet downtime to rest without pressure to reply or socialize.',
    iconName: 'sparkles',
    badgeColor: 'indigo',
  },
  {
    id: 'Use my Care Profile',
    label: 'Use my Care Profile',
    description: 'Your trusted partner is invited to reference your saved comfort essentials and preferences.',
    iconName: 'shield-heart',
    badgeColor: 'violet',
  },
];

export const careModeService = {
  /**
   * Load Care Mode state from storage or default
   */
  getState(): CareModeState {
    try {
      const raw = localStorage.getItem(CARE_MODE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const resolvedOptions = Array.isArray(parsed.options)
          ? parsed.options
          : Array.isArray(parsed.activeOptions)
          ? parsed.activeOptions
          : [];
        return {
          ...DEFAULT_CARE_MODE_STATE,
          ...parsed,
          options: resolvedOptions,
          activeOptions: resolvedOptions,
        };
      }
    } catch (e) {
      console.error('Failed to load care mode state:', e);
    }
    return DEFAULT_CARE_MODE_STATE;
  },

  /**
   * Activate Care Mode
   */
  activate(
    options: CareModeOption[],
    note: string = '',
    isConnected: boolean = false,
    careModePermitted: boolean = false
  ): CareModeState {
    const safeOptions: CareModeOption[] =
      Array.isArray(options) && options.length > 0 ? options : ["I'm having a difficult day"];
    const newState: CareModeState = {
      isActive: true,
      activatedAt: new Date().toISOString(),
      options: safeOptions,
      activeOptions: safeOptions,
      note: note.trim(),
      partnerNotified: isConnected && careModePermitted,
      notificationStatus: !isConnected
        ? 'solo'
        : careModePermitted
        ? 'delivered'
        : 'permission_disabled',
    };

    try {
      localStorage.setItem(CARE_MODE_STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to persist care mode activation:', e);
    }

    return newState;
  },

  /**
   * Deactivate Care Mode
   */
  deactivate(): CareModeState {
    const currentState = this.getState();
    const deactivatedState: CareModeState = {
      ...currentState,
      isActive: false,
      lastDeactivatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(CARE_MODE_STORAGE_KEY, JSON.stringify(deactivatedState));
    } catch (e) {
      console.error('Failed to persist care mode deactivation:', e);
    }

    return deactivatedState;
  },

  /**
   * Update personal note while active
   */
  updateNote(note: string): CareModeState {
    const currentState = this.getState();
    const updated: CareModeState = {
      ...currentState,
      note: note.trim(),
    };

    try {
      localStorage.setItem(CARE_MODE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist note update:', e);
    }

    return updated;
  },

  /**
   * Format activation time nicely
   */
  formatActivationTime(isoString?: string): string {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return 'Recently';
    }
  },

  /**
   * Calculate elapsed active duration
   */
  formatActiveDuration(isoString?: string): string {
    if (!isoString) return 'Active just now';
    try {
      const start = new Date(isoString).getTime();
      const now = Date.now();
      const diffMs = Math.max(0, now - start);
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'Active just now';
      if (diffMins < 60) return `Active for ${diffMins} min${diffMins === 1 ? '' : 's'}`;
      const remMins = diffMins % 60;
      return `Active for ${diffHours}h ${remMins > 0 ? `${remMins}m` : ''}`.trim();
    } catch {
      return 'Active';
    }
  },
};
