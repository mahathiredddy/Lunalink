import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  AppPage,
  User,
  Partner,
  ConnectionInfo,
  PrivacySettingItem,
  SharedNote,
  SharedPreference,
  SharedActivity,
  AppNotification,
  CycleEntry,
  CycleStats,
  SymptomEntry,
  CareProfile,
  HealthSharingPermissions,
  PartnerConnectionState,
  CareModeState,
  CareModeOption,
  SupportNotificationSettings,
  SharedReminder,
  ReminderActivity,
  MemoryItem,
  UserNotificationSettings,
  WomensHealthSignalEntry,
  HealthcareSummarySelection,
  DemoScenario,
  PartnerSupportNotification,
} from '../types';
import {
  calculateEstimatedPeriod,
  getCurrentCycleDay,
  calculateSupportInsight,
  generatePartnerNotification,
  SupportInsightCalculation,
  getAllowedPartnerInformation,
  getCareSuggestions,
  hasSufficientCycleHistory,
} from '../services/predictiveCareService';
import {
  authService,
  connectionService,
  privacyService,
  sharedSpaceService,
  notificationService,
} from '../services/api';
import { cycleService, INITIAL_CYCLES } from '../services/cycleService';
import { symptomService, INITIAL_SYMPTOMS } from '../services/symptomService';
import { womensHealthService, DEFAULT_SUMMARY_SELECTION } from '../services/womensHealthService';
import { careProfileService } from '../services/careProfileService';
import { partnerConnectionService } from '../services/partnerConnectionService';
import { careModeService } from '../services/careModeService';
import { supportInsightsService } from '../services/supportInsightsService';
import { sharedReminderService } from '../services/sharedReminderService';
import { memoryVaultService } from '../services/memoryVaultService';
import {
  INITIAL_USER,
  INITIAL_PARTNER,
  INITIAL_CONNECTION,
  INITIAL_PRIVACY_SETTINGS,
  INITIAL_SHARED_NOTES,
  INITIAL_SHARED_PREFERENCES,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../services/mockData';

interface ToastInfo {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Navigation
  currentPage: AppPage;
  navigateTo: (page: AppPage) => void;
  
  // Auth state
  isAuthenticated: boolean;
  user: User;
  login: (email: string) => Promise<void>;
  signUp: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;

  // Connection
  connection: ConnectionInfo;
  partner?: Partner;
  connectionState: PartnerConnectionState;
  setConnectionState: (state: PartnerConnectionState) => void;
  generateNewCode: () => Promise<string>;
  connectWithCode: (code: string) => Promise<{ success: boolean; state?: PartnerConnectionState; error?: string }>;
  disconnectPartner: () => Promise<void>;
  setConnectionStatusDirectly: (status: ConnectionInfo['status']) => Promise<void>;
  acceptReceivedInvite: () => Promise<void>;
  declineReceivedInvite: () => Promise<void>;

  // Health Sharing Permissions (Strictly permission-based)
  healthPermissions: HealthSharingPermissions;
  toggleHealthPermission: (key: keyof Omit<HealthSharingPermissions, 'updatedAt'>) => Promise<void>;
  saveHealthPermissions: (permissions: Partial<HealthSharingPermissions>) => Promise<void>;

  // Privacy
  privacySettings: PrivacySettingItem[];
  togglePrivacySetting: (id: string) => Promise<void>;
  savePrivacySettings: (settings: PrivacySettingItem[]) => Promise<void>;

  // Shared Space
  notes: SharedNote[];
  preferences: SharedPreference[];
  activities: SharedActivity[];
  createNote: (title: string, content: string, category: SharedNote['category'], isPinned: boolean) => Promise<void>;
  updateNote: (id: string, updates: Partial<SharedNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  updatePreference: (id: string, value: string) => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  dismissNotification: (id: string) => Promise<void>;

  // Menstrual Health & Cycle Tracking
  cycles: CycleEntry[];
  cycleStats: CycleStats;
  saveCycle: (entry: { id?: string; startDate: string; endDate: string; notes?: string }) => Promise<void>;
  deleteCycle: (id: string) => Promise<void>;

  // Symptoms & Pain Tracking
  symptoms: SymptomEntry[];
  saveSymptom: (entry: Omit<SymptomEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
  deleteSymptom: (id: string) => Promise<void>;
  clearAllSymptoms: () => Promise<void>;
  resetSymptoms: () => Promise<void>;

  // Women's Health & Healthcare Conversation Expansion Area
  womensHealthSignals: WomensHealthSignalEntry[];
  saveWomensHealthSignal: (entry: Omit<WomensHealthSignalEntry, 'id' | 'createdAt'> & { id?: string }) => Promise<void>;
  deleteWomensHealthSignal: (id: string) => Promise<void>;
  healthcareSummarySelection: HealthcareSummarySelection;
  updateHealthcareSummarySelection: (selection: Partial<HealthcareSummarySelection>) => void;
  resetWomensHealthSignals: () => void;

  // Care Profile / Care DNA
  careProfile: CareProfile;
  saveCareProfile: (updates: Partial<CareProfile>) => Promise<void>;
  resetCareProfile: () => Promise<void>;
  toggleShareCareProfile: () => Promise<void>;

  // Care Mode (Core LunaLink Differentiator)
  careMode: CareModeState;
  activateCareMode: (options: CareModeOption[], note?: string) => Promise<void>;
  deactivateCareMode: () => Promise<void>;
  updateCareModeNote: (note: string) => Promise<void>;

  // Support Insights & Predictive Support Notifications
  supportNotifSettings: SupportNotificationSettings;
  enableSupportNotifications: () => void;
  disableSupportNotifications: () => void;
  updateSupportNotifSettings: (settings: Partial<SupportNotificationSettings>) => void;

  // Shared Practical Reminders & Calendar
  reminders: SharedReminder[];
  reminderActivities: ReminderActivity[];
  saveReminder: (data: Omit<SharedReminder, 'id' | 'createdAt' | 'isCompleted'> & { id?: string }) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  toggleCompleteReminder: (id: string) => Promise<void>;
  toggleShareReminder: (id: string, currentShared: boolean) => Promise<void>;

  // Memory Vault
  memories: MemoryItem[];
  saveMemory: (data: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  toggleShareMemory: (id: string) => Promise<void>;

  // Notification Settings & Management
  notificationSettings: UserNotificationSettings;
  updateNotificationSettings: (settings: Partial<UserNotificationSettings>) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  toggleNotificationRead: (id: string) => Promise<void>;
  markNotificationAsUnread: (id: string) => Promise<void>;

  // Predictive Care Notifications & Demo Mode
  demoScenario: DemoScenario;
  setDemoScenario: (scenario: DemoScenario) => void;
  partnerSupportNotification: PartnerSupportNotification | null;
  supportInsightCalculation: SupportInsightCalculation;
  toggleNotificationSharingEnabled: (explicitValue?: boolean) => Promise<void>;
  toggleShareCycleSupportInsights: (explicitValue?: boolean) => Promise<void>;
  hasSufficientHistory: boolean;

  // Feedback Toasts
  toasts: ToastInfo[];
  showToast: (message: string, type?: ToastInfo['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default logged in for smooth exploration
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [connection, setConnection] = useState<ConnectionInfo>(INITIAL_CONNECTION);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingItem[]>(INITIAL_PRIVACY_SETTINGS);
  const [notes, setNotes] = useState<SharedNote[]>(INITIAL_SHARED_NOTES);
  const [preferences, setPreferences] = useState<SharedPreference[]>(INITIAL_SHARED_PREFERENCES);
  const [activities, setActivities] = useState<SharedActivity[]>(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [cycles, setCycles] = useState<CycleEntry[]>(INITIAL_CYCLES);
  const [cycleStats, setCycleStats] = useState<CycleStats>(() => cycleService.calculateStats(INITIAL_CYCLES));
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>(INITIAL_SYMPTOMS);
  const [careProfile, setCareProfile] = useState<CareProfile>(() => careProfileService.getProfile());
  const [careMode, setCareMode] = useState<CareModeState>(() => careModeService.getState());
  const [healthPermissions, setHealthPermissions] = useState<HealthSharingPermissions>(() =>
    partnerConnectionService.getPermissions()
  );
  const [connectionState, setConnectionState] = useState<PartnerConnectionState>(() =>
    INITIAL_CONNECTION.status === 'connected' ? 'connected' : 'no_connection'
  );
  const [supportNotifSettings, setSupportNotifSettings] = useState<SupportNotificationSettings>(() =>
    supportInsightsService.getNotificationSettings()
  );
  const [reminders, setReminders] = useState<SharedReminder[]>(() => sharedReminderService.getReminders());
  const [reminderActivities, setReminderActivities] = useState<ReminderActivity[]>(() =>
    sharedReminderService.getActivities()
  );
  const [memories, setMemories] = useState<MemoryItem[]>(() => memoryVaultService.getMemories());
  const [womensHealthSignals, setWomensHealthSignals] = useState<WomensHealthSignalEntry[]>(() =>
    womensHealthService.getSignals()
  );
  const [healthcareSummarySelection, setHealthcareSummarySelection] = useState<HealthcareSummarySelection>(() =>
    womensHealthService.getSummarySelection()
  );
  const [notificationSettings, setNotificationSettings] = useState<UserNotificationSettings>(() => {
    try {
      const stored = localStorage.getItem('lunalink_notification_settings_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  });
  const [demoScenario, setDemoScenario] = useState<DemoScenario>('normal');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Predictive Care consent toggles (strict consent: default OFF)
  const toggleNotificationSharingEnabled = async (explicitValue?: boolean) => {
    const nextVal = explicitValue !== undefined ? explicitValue : !user.notificationSharingEnabled;
    const updatedUser: User = {
      ...user,
      notificationSharingEnabled: nextVal,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem('lunalink_user_profile_v1', JSON.stringify(updatedUser));
    } catch {
      // ignore
    }
    if (nextVal) {
      showToast('Partner support notifications enabled. Your partner may receive gentle, consent-based guidance.', 'success');
    } else {
      showToast('Partner support notifications turned off. No proactive notifications will be sent to partner.', 'info');
    }
  };

  const toggleShareCycleSupportInsights = async (explicitValue?: boolean) => {
    const nextVal = explicitValue !== undefined ? explicitValue : !user.shareCycleSupportInsights;
    const updatedUser: User = {
      ...user,
      shareCycleSupportInsights: nextVal,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem('lunalink_user_profile_v1', JSON.stringify(updatedUser));
    } catch {
      // ignore
    }
    if (nextVal) {
      showToast('Cycle-related support insights enabled for partner notifications.', 'success');
    } else {
      showToast('Cycle-related support insights disabled. Only general comfort suggestions will be shared.', 'info');
    }
  };

  // Derived predictive calculations
  const hasSufficientHistory = useMemo(() => {
    if (demoScenario === 'insufficient_history') return false;
    return hasSufficientCycleHistory(cycles);
  }, [cycles, demoScenario]);

  const supportInsightCalculation = useMemo(() => {
    return calculateSupportInsight({
      cycles,
      symptoms,
      careProfile,
      user,
      todayDateStr: '2026-09-18',
      demoScenario,
      isCareModeActive: careMode.isActive,
    });
  }, [cycles, symptoms, careProfile, user, demoScenario, careMode.isActive]);

  const partnerSupportNotification = useMemo(() => {
    return generatePartnerNotification({
      cycles,
      symptoms,
      careProfile,
      user,
      todayDateStr: '2026-09-18',
      demoScenario,
      isCareModeActive: careMode.isActive,
    });
  }, [cycles, symptoms, careProfile, user, demoScenario, careMode.isActive]);

  // Load from API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedUser, loadedConn, loadedPriv, loadedNotes, loadedPrefs, loadedActs, loadedNotifs, loadedCycles, loadedSymptoms] =
          await Promise.all([
            authService.getCurrentUser(),
            connectionService.getConnection(),
            privacyService.getPrivacySettings(),
            sharedSpaceService.getNotes(),
            sharedSpaceService.getPreferences(),
            sharedSpaceService.getActivities(),
            notificationService.getNotifications(),
            cycleService.getCycles(),
            symptomService.getSymptomEntries(),
          ]);

        setUser(loadedUser);
        setConnection(loadedConn);
        setPrivacySettings(loadedPriv);
        setNotes(loadedNotes);
        setPreferences(loadedPrefs);
        setActivities(loadedActs);
        setNotifications(loadedNotifs);
        setCycles(loadedCycles);
        setCycleStats(cycleService.calculateStats(loadedCycles));
        setSymptoms(loadedSymptoms);
      } catch (err) {
        console.error('Failed to initialize local data', err);
      }
    }
    loadData();
  }, []);

  const showToast = (message: string, type: ToastInfo['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth
  const login = async (email: string) => {
    const res = await authService.login(email);
    setUser(res.user);
    setIsAuthenticated(true);
    navigateTo('dashboard');
    showToast('Signed in successfully as Alex Rivera', 'success');
  };

  const signUp = async (name: string, email: string) => {
    const res = await authService.signUp(name, email);
    setUser(res.user);
    setIsAuthenticated(true);
    navigateTo('dashboard');
    showToast(`Welcome to LunaLink, ${name}! Your private vault is ready.`, 'success');
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    navigateTo('landing');
    showToast('You have been securely signed out', 'info');
  };

  const deleteAccount = async () => {
    try {
      localStorage.clear();
    } catch (err) {
      console.warn('Could not clear local storage', err);
    }
    await connectionService.disconnectPartner();
    partnerConnectionService.resetPermissions();
    setHealthPermissions(partnerConnectionService.getPermissions());
    setConnection({
      status: 'disconnected',
      partner: undefined,
      inviteCode: 'LUNA-NEW-000',
      encryptionStatus: 'Inactive',
    });
    setConnectionState('no_connection');
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigateTo('landing');
    showToast('Your account and all associated vault records have been permanently deleted.', 'info');
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await authService.updateUserProfile(updates);
    setUser(updated);
    showToast('Profile updated successfully', 'success');
  };

  // Connection
  const generateNewCode = async () => {
    const code = partnerConnectionService.generateUniqueInviteCode();
    setConnection((prev) => ({ ...prev, inviteCode: code }));
    setConnectionState('invitation_sent');
    showToast(`New invite code generated: ${code}`, 'info');
    return code;
  };

  const connectWithCode = async (code: string) => {
    const validation = partnerConnectionService.validateAndConnect(code, connection);
    setConnectionState(validation.state);

    if (validation.state === 'connected' && validation.partner) {
      setConnection({
        status: 'connected',
        partner: validation.partner,
        inviteCode: 'LUNA-9823-ALX',
        connectedSince: 'Just now',
        encryptionStatus: 'Active',
      });
      showToast(`Connected successfully with ${validation.partner.name}!`, 'success');
      return { success: true, state: 'connected' };
    } else {
      const errorMsg = validation.error || 'Unable to connect with this invite code.';
      showToast(errorMsg, 'error');
      return { success: false, state: validation.state, error: errorMsg };
    }
  };

  const disconnectPartner = async () => {
    await connectionService.disconnectPartner();
    partnerConnectionService.resetPermissions();
    setHealthPermissions(partnerConnectionService.getPermissions());
    setConnection({
      status: 'disconnected',
      partner: undefined,
      inviteCode: 'LUNA-9823-ALX',
      encryptionStatus: 'Inactive',
    });
    setConnectionState('no_connection');
    showToast('Partner disconnected. All shared health access immediately revoked.', 'warning');
  };

  const acceptReceivedInvite = async () => {
    const newPartner: Partner = {
      ...INITIAL_PARTNER,
      name: 'Elena Chen',
      inviteCode: 'LUNA-7734-ELN',
      connectedAt: 'Today',
    };
    setConnection({
      status: 'connected',
      partner: newPartner,
      inviteCode: 'LUNA-9823-ALX',
      connectedSince: 'Today',
      encryptionStatus: 'Active',
    });
    setConnectionState('connected');
    showToast('Invitation accepted! You are now connected with Elena Chen.', 'success');
  };

  const declineReceivedInvite = async () => {
    setConnectionState('no_connection');
    showToast('Invitation declined. No connection was established.', 'info');
  };

  const setConnectionStatusDirectly = async (status: ConnectionInfo['status']) => {
    const updated = await connectionService.simulateToggleConnection(status);
    setConnection(updated);
    if (status === 'connected') {
      setConnectionState('connected');
      showToast('Switched to Connected view (with Elena Chen)', 'info');
    } else if (status === 'pending_sent') {
      setConnectionState('invitation_sent');
      showToast('Switched to Pending Invite view', 'info');
    } else {
      setConnectionState('no_connection');
      showToast('Switched to Disconnected / New User view', 'info');
    }
  };

  // Health Sharing Permissions (Strictly permission-based)
  const toggleHealthPermission = async (key: keyof Omit<HealthSharingPermissions, 'updatedAt'>) => {
    const updated = partnerConnectionService.togglePermission(key);
    setHealthPermissions(updated);
    const labels: Record<keyof Omit<HealthSharingPermissions, 'updatedAt'>, string> = {
      cycleInformation: 'Cycle information',
      painTrends: 'Pain trends',
      careProfile: 'Care Profile',
      careMode: 'Care Mode',
      sharedReminders: 'Shared reminders',
    };
    const label = labels[key];
    showToast(
      `${label} is now ${updated[key] ? 'Shared with partner' : 'Private (not shared)'}`,
      updated[key] ? 'success' : 'info'
    );
  };

  const saveHealthPermissions = async (updates: Partial<HealthSharingPermissions>) => {
    const updated = partnerConnectionService.savePermissions(updates);
    setHealthPermissions(updated);
    showToast('Sharing permissions updated successfully.', 'success');
  };

  // Privacy
  const togglePrivacySetting = async (id: string) => {
    const updated = await privacyService.toggleSetting(id);
    setPrivacySettings(updated);
    const item = updated.find((i) => i.id === id);
    if (item) {
      showToast(
        `${item.title} is now ${item.isShared ? 'Shared with partner' : 'Private (not shared)'}`,
        item.isShared ? 'success' : 'info'
      );
    }
  };

  const savePrivacySettings = async (newSettings: PrivacySettingItem[]) => {
    const saved = await privacyService.saveAllSettings(newSettings);
    setPrivacySettings(saved);
    showToast('All privacy permissions saved securely', 'success');
  };

  // Shared Space
  const createNote = async (
    title: string,
    content: string,
    category: SharedNote['category'],
    isPinned: boolean
  ) => {
    const created = await sharedSpaceService.createNote({
      title,
      content,
      authorId: user.id,
      authorName: user.name,
      category,
      isPinned,
    });
    setNotes((prev) => [created, ...prev]);
    showToast('Shared note created', 'success');
  };

  const updateNote = async (id: string, updates: Partial<SharedNote>) => {
    const updated = await sharedSpaceService.updateNote(id, updates);
    setNotes(updated);
    showToast('Shared note updated', 'success');
  };

  const deleteNote = async (id: string) => {
    const updated = await sharedSpaceService.deleteNote(id);
    setNotes(updated);
    showToast('Note deleted', 'info');
  };

  const updatePreference = async (id: string, value: string) => {
    const updated = await sharedSpaceService.updatePreference(id, value);
    setPreferences(updated);
    showToast('Preference updated', 'success');
  };

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = async (id: string) => {
    const updated = await notificationService.markAsRead(id);
    setNotifications(updated);
  };

  const markNotificationAsUnread = async (id: string) => {
    const updated = await notificationService.markAsUnread(id);
    setNotifications(updated);
  };

  const toggleNotificationRead = async (id: string) => {
    const updated = await notificationService.toggleRead(id);
    setNotifications(updated);
  };

  const markAllNotificationsAsRead = async () => {
    const updated = await notificationService.markAllAsRead();
    setNotifications(updated);
    showToast('All notifications marked as read', 'info');
  };

  const dismissNotification = async (id: string) => {
    const updated = await notificationService.clearNotification(id);
    setNotifications(updated);
  };

  // Cycle tracking operations
  const saveCycle = async (entry: { id?: string; startDate: string; endDate: string; notes?: string }) => {
    const updated = await cycleService.saveCycle(entry);
    setCycles(updated);
    setCycleStats(cycleService.calculateStats(updated));
    showToast(entry.id ? 'Cycle entry updated' : 'Period logged successfully', 'success');
  };

  const deleteCycle = async (id: string) => {
    const updated = await cycleService.deleteCycle(id);
    setCycles(updated);
    setCycleStats(cycleService.calculateStats(updated));
    showToast('Cycle entry deleted', 'info');
  };

  // Symptoms & Pain
  const saveSymptom = async (
    payload: Omit<SymptomEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const saved = await symptomService.saveSymptomEntry(payload);
    const updatedList = await symptomService.getSymptomEntries();
    setSymptoms(updatedList);
    showToast(payload.id ? 'Symptom log updated' : 'Symptoms recorded successfully', 'success');
  };

  const deleteSymptom = async (id: string) => {
    await symptomService.deleteSymptomEntry(id);
    const updatedList = await symptomService.getSymptomEntries();
    setSymptoms(updatedList);
    showToast('Symptom entry removed', 'info');
  };

  const clearAllSymptoms = async () => {
    await symptomService.clearAllEntries();
    setSymptoms([]);
    showToast('All symptom entries cleared (empty state)', 'info');
  };

  const resetSymptoms = async () => {
    const defaults = await symptomService.resetDefaultEntries();
    setSymptoms(defaults);
    showToast('Restored sample symptom history', 'success');
  };

  // Women's Health & Healthcare Conversation Operations
  const saveWomensHealthSignal = async (
    entry: Omit<WomensHealthSignalEntry, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (entry.id) {
      const updated = womensHealthService.updateSignalEntry(entry.id, entry);
      setWomensHealthSignals(updated);
      showToast('Health signal entry updated', 'success');
    } else {
      const newEntry = womensHealthService.addSignalEntry(entry);
      setWomensHealthSignals(womensHealthService.getSignals());
      showToast('Health signals recorded successfully', 'success');
    }
  };

  const deleteWomensHealthSignal = async (id: string) => {
    const updated = womensHealthService.deleteSignalEntry(id);
    setWomensHealthSignals(updated);
    showToast('Health signal entry deleted', 'info');
  };

  const updateHealthcareSummarySelection = (selection: Partial<HealthcareSummarySelection>) => {
    setHealthcareSummarySelection((prev) => {
      const updated = { ...prev, ...selection };
      womensHealthService.saveSummarySelection(updated);
      return updated;
    });
  };

  const resetWomensHealthSignals = () => {
    localStorage.removeItem('lunalink_womens_health_signals_v1');
    setWomensHealthSignals(womensHealthService.getSignals());
    showToast('Restored sample Women’s Health signals', 'info');
  };

  // Care Profile / Care DNA
  const saveCareProfile = async (updates: Partial<CareProfile>) => {
    const updated = careProfileService.saveProfile(updates);
    setCareProfile(updated);
    showToast('Care Profile preferences saved successfully', 'success');
  };

  const resetCareProfile = async () => {
    const def = careProfileService.resetToDefault();
    setCareProfile(def);
    showToast('Care Profile reset to defaults', 'info');
  };

  const toggleShareCareProfile = async () => {
    const nextState = !careProfile.isSharedWithPartner;
    const updated = careProfileService.saveProfile({ isSharedWithPartner: nextState });
    setCareProfile(updated);
    if (nextState) {
      showToast('Care Profile is now shared with your connected partner', 'success');
    } else {
      showToast('Care Profile is now private (unshared)', 'info');
    }
  };

  const activateCareMode = async (options: CareModeOption[], note?: string) => {
    const isConnected = connection.status === 'connected' && !!connection.partner;
    const isSharingAllowed = isConnected && healthPermissions.careMode;

    const activated = careModeService.activate(options, note, isConnected, isSharingAllowed);
    setCareMode(activated);

    // Create activity record
    const newActivity: SharedActivity = {
      id: `act_${Date.now()}`,
      type: 'shared_update',
      title: 'Care Mode Activated',
      description: options.join(' • ') + (note ? ` — "${note}"` : ''),
      actorName: user.name,
      timestamp: 'Just now',
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Create notification
    if (isConnected) {
      if (healthPermissions.careMode) {
        const partnerName = connection.partner?.name || 'Partner';
        const notif: AppNotification = {
          id: `notif_${Date.now()}`,
          type: 'care_mode_activated',
          category: 'care',
          title: 'Care Mode Active',
          message: `Your trusted person (${partnerName}) has been notified of your support preferences.`,
          timestamp: 'Just now',
          isRead: false,
          actionUrl: 'care-mode',
          actionText: 'View Care Mode',
          containsHealthData: false,
        };
        setNotifications((prev) => [notif, ...prev]);
        showToast('Care Mode is now active. Your trusted person has been gently notified.', 'success');
      } else {
        showToast(
          'Care Mode is on. Partner sharing is currently disabled in your Sharing Permissions.',
          'info'
        );
      }
    } else {
      showToast('Care Mode is active in your personal care space.', 'success');
    }
  };

  const deactivateCareMode = async () => {
    const deactivated = careModeService.deactivate();
    setCareMode(deactivated);

    const newActivity: SharedActivity = {
      id: `act_${Date.now()}`,
      type: 'shared_update',
      title: 'Care Mode Turned Off',
      description: 'Care Mode was deactivated.',
      actorName: user.name,
      timestamp: 'Just now',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast('Care Mode has been turned off.', 'info');
  };

  const updateCareModeNote = async (note: string) => {
    const updated = careModeService.updateNote(note);
    setCareMode(updated);
    showToast('Personal note updated', 'success');
  };

  const updateSupportNotifSettings = (updates: Partial<SupportNotificationSettings>) => {
    setSupportNotifSettings((prev) => {
      const next = { ...prev, ...updates };
      supportInsightsService.saveNotificationSettings(next);
      return next;
    });
  };

  const enableSupportNotifications = () => {
    updateSupportNotifSettings({ enabled: true });
    showToast('Support notifications enabled. Your partner may receive gentle advance guidance.', 'success');
  };

  const disableSupportNotifications = () => {
    updateSupportNotifSettings({ enabled: false });
    showToast('Support notifications disabled.', 'info');
  };

  // Shared Practical Reminders & Calendar Handlers
  const saveReminder = async (
    data: Omit<SharedReminder, 'id' | 'createdAt' | 'isCompleted'> & { id?: string }
  ) => {
    if (data.id) {
      const { id, ...updates } = data;
      const res = sharedReminderService.updateReminder(id, updates);
      if (res.reminder) {
        setReminders(sharedReminderService.getReminders());
        setReminderActivities(sharedReminderService.getActivities());
        showToast(`Reminder "${res.reminder.title}" updated`, 'success');
      }
    } else {
      const res = sharedReminderService.addReminder(data);
      setReminders(sharedReminderService.getReminders());
      setReminderActivities(sharedReminderService.getActivities());
      showToast(
        data.isSharedWithPartner
          ? `Reminder "${res.reminder.title}" added and shared with partner`
          : `Private reminder "${res.reminder.title}" added`,
        'success'
      );
    }
  };

  const deleteReminder = async (id: string) => {
    const res = sharedReminderService.deleteReminder(id);
    if (res.success) {
      setReminders(sharedReminderService.getReminders());
      setReminderActivities(sharedReminderService.getActivities());
      showToast('Reminder deleted', 'info');
    }
  };

  const toggleCompleteReminder = async (id: string) => {
    const res = sharedReminderService.toggleComplete(id);
    if (res.reminder) {
      setReminders(sharedReminderService.getReminders());
      setReminderActivities(sharedReminderService.getActivities());
      showToast(
        res.reminder.isCompleted
          ? `Completed "${res.reminder.title}"`
          : `Reopened "${res.reminder.title}"`,
        'info'
      );
    }
  };

  const toggleShareReminder = async (id: string, currentShared: boolean) => {
    const res = sharedReminderService.updateReminder(id, {
      isSharedWithPartner: !currentShared,
    });
    if (res.reminder) {
      setReminders(sharedReminderService.getReminders());
      setReminderActivities(sharedReminderService.getActivities());
      showToast(
        res.reminder.isSharedWithPartner
          ? `Shared "${res.reminder.title}" with partner`
          : `Made "${res.reminder.title}" private`,
        'info'
      );
    }
  };

  // Memory Vault Handlers
  const saveMemory = async (
    data: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    if (data.id) {
      const { id, ...updates } = data;
      const updated = memoryVaultService.updateMemory(id, updates);
      if (updated) {
        setMemories(memoryVaultService.getMemories());
        showToast(`Memory "${updated.title}" updated`, 'success');
      }
    } else {
      const created = memoryVaultService.addMemory(data);
      setMemories(memoryVaultService.getMemories());
      showToast(
        data.isSharedWithPartner
          ? `Moment "${created.title}" preserved & shared with partner`
          : `Private moment "${created.title}" saved in Vault`,
        'success'
      );

      // If shared with partner, add notification
      if (data.isSharedWithPartner) {
        addNotification({
          type: 'shared_memory',
          category: 'shared',
          title: 'New Shared Moment Added',
          message: `Alex added a new moment to the Vault: "${created.title}".`,
          actionUrl: 'memory-vault',
          actionText: 'Open Memory Vault',
        });
      }
    }
  };

  const deleteMemory = async (id: string) => {
    const success = memoryVaultService.deleteMemory(id);
    if (success) {
      setMemories(memoryVaultService.getMemories());
      showToast('Moment removed from Memory Vault', 'info');
    }
  };

  const toggleShareMemory = async (id: string) => {
    const updated = memoryVaultService.toggleShare(id);
    if (updated) {
      setMemories(memoryVaultService.getMemories());
      showToast(
        updated.isSharedWithPartner
          ? `Shared "${updated.title}" with partner`
          : `Moved "${updated.title}" to private vault`,
        'info'
      );

      if (updated.isSharedWithPartner) {
        addNotification({
          type: 'shared_memory',
          category: 'shared',
          title: 'Moment Shared with Partner',
          message: `Alex shared the moment "${updated.title}" with you.`,
          actionUrl: 'memory-vault',
          actionText: 'Open Memory Vault',
        });
      }
    }
  };

  // Notification Settings & Custom Notification Addition
  const updateNotificationSettings = (updates: Partial<UserNotificationSettings>) => {
    setNotificationSettings((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('lunalink_notification_settings_v1', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast('Notification preferences updated', 'success');
  };

  const addNotification = (
    notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>
  ) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        isAuthenticated,
        user,
        login,
        signUp,
        logout,
        updateProfile,
        deleteAccount,
        connection,
        partner: connection.partner,
        connectionState,
        setConnectionState,
        generateNewCode,
        connectWithCode,
        disconnectPartner,
        setConnectionStatusDirectly,
        acceptReceivedInvite,
        declineReceivedInvite,
        healthPermissions,
        toggleHealthPermission,
        saveHealthPermissions,
        privacySettings,
        togglePrivacySetting,
        savePrivacySettings,
        notes,
        preferences,
        activities,
        createNote,
        updateNote,
        deleteNote,
        updatePreference,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markNotificationAsUnread,
        toggleNotificationRead,
        markAllNotificationsAsRead,
        dismissNotification,
        cycles,
        cycleStats,
        saveCycle,
        deleteCycle,
        symptoms,
        saveSymptom,
        deleteSymptom,
        clearAllSymptoms,
        resetSymptoms,
        womensHealthSignals,
        saveWomensHealthSignal,
        deleteWomensHealthSignal,
        healthcareSummarySelection,
        updateHealthcareSummarySelection,
        resetWomensHealthSignals,
        careProfile,
        saveCareProfile,
        resetCareProfile,
        toggleShareCareProfile,
        careMode,
        activateCareMode,
        deactivateCareMode,
        updateCareModeNote,
        supportNotifSettings,
        enableSupportNotifications,
        disableSupportNotifications,
        updateSupportNotifSettings,
        reminders,
        reminderActivities,
        saveReminder,
        deleteReminder,
        toggleCompleteReminder,
        toggleShareReminder,
        memories,
        saveMemory,
        deleteMemory,
        toggleShareMemory,
        notificationSettings,
        updateNotificationSettings,
        addNotification,
        demoScenario,
        setDemoScenario,
        partnerSupportNotification,
        supportInsightCalculation,
        toggleNotificationSharingEnabled,
        toggleShareCycleSupportInsights,
        hasSufficientHistory,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
