import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Toggle } from '../components/ui/Toggle';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { ActiveSession } from '../types';
import {
  User,
  Shield,
  Bell,
  Lock,
  LogOut,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Heart,
  Calendar,
  Activity,
  Sliders,
  Sparkles,
  Smartphone,
  Laptop,
  Tablet,
  Key,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Clock,
  Link2,
  Edit3,
  RotateCcw,
  Download,
  AlertCircle,
  FileText,
  HelpCircle,
} from 'lucide-react';

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess_1',
    device: 'Desktop Mac (Apple Silicon)',
    browser: 'Chrome 124.0 on macOS',
    location: 'Brooklyn, NY (Approximate)',
    ipAddress: '192.168.1.42 (Local Vault)',
    lastActive: 'Active now',
    isCurrent: true,
  },
  {
    id: 'sess_2',
    device: 'iPhone 15 Pro (LunaLink PWA)',
    browser: 'Mobile Safari 17.4',
    location: 'Brooklyn, NY',
    ipAddress: '172.56.21.8',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: 'sess_3',
    device: 'iPad Air 5th Gen',
    browser: 'Mobile Safari 17.2',
    location: 'Brooklyn, NY',
    ipAddress: '192.168.1.55',
    lastActive: '3 days ago',
    isCurrent: false,
  },
];

export const SettingsPage: React.FC = () => {
  const {
    user,
    connection,
    disconnectPartner,
    deleteAccount,
    logout,
    navigateTo,
    showToast,
    healthPermissions,
    toggleHealthPermission,
    careProfile,
    toggleShareCareProfile,
    notificationSettings,
    updateNotificationSettings,
  } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'security'>('account');

  // Modal & Dialog States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isRevokeAllDialogOpen, setIsRevokeAllDialogOpen] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<ActiveSession | null>(null);

  // Active Sessions State
  const [sessions, setSessions] = useState<ActiveSession[]>(() => {
    try {
      const stored = localStorage.getItem('lunalink_sessions_v1');
      return stored ? JSON.parse(stored) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const saveSessions = (newSessions: ActiveSession[]) => {
    setSessions(newSessions);
    try {
      localStorage.setItem('lunalink_sessions_v1', JSON.stringify(newSessions));
    } catch (e) {
      console.warn('Failed to store sessions', e);
    }
  };

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Partner Permissions State
  const [partnerCanEditReminders, setPartnerCanEditReminders] = useState(true);
  const [partnerCanViewNotes, setPartnerCanViewNotes] = useState(true);
  const [partnerCanSuggestCare, setPartnerCanSuggestCare] = useState(true);
  const [partnerCanSuggestEvents, setPartnerCanSuggestEvents] = useState(true);

  // Data Visibility State
  const [incognitoScreenBlur, setIncognitoScreenBlur] = useState(false);
  const [lockScreenPrivacy, setLockScreenPrivacy] = useState(true);
  const [partnerPresenceVisible, setPartnerPresenceVisible] = useState(true);

  // Additional Notification States
  const [cyclePhaseSupportNotif, setCyclePhaseSupportNotif] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [suppliesRemindersNotif, setSuppliesRemindersNotif] = useState(true);
  const [wellnessCheckInsNotif, setWellnessCheckInsNotif] = useState(true);
  const [securityLoginAlerts, setSecurityLoginAlerts] = useState(true);
  const [monthlyPrivacyDigest, setMonthlyPrivacyDigest] = useState(true);

  // Security Toggles
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Handle Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setPasswordSuccess('Password successfully changed. Active credentials updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed successfully', 'success');
    } catch {
      setPasswordError('Failed to change password. Please retry.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle Disconnect Partner
  const handleConfirmDisconnect = async () => {
    setIsDisconnectDialogOpen(false);
    await disconnectPartner();
  };

  // Handle Delete Account
  const handleConfirmDelete = async () => {
    setIsDeleteDialogOpen(false);
    await deleteAccount();
  };

  // Handle Revoke Single Session
  const handleRevokeSingleSession = (session: ActiveSession) => {
    const updated = sessions.filter((s) => s.id !== session.id);
    saveSessions(updated);
    setSessionToRevoke(null);
    showToast(`Session on ${session.device} revoked`, 'info');
  };

  // Handle Revoke All Other Sessions
  const handleConfirmRevokeAllSessions = () => {
    const updated = sessions.filter((s) => s.isCurrent);
    saveSessions(updated);
    setIsRevokeAllDialogOpen(false);
    showToast('All other active sessions have been revoked', 'success');
  };

  // Format date of birth if available
  const formattedDob = user.dateOfBirth
    ? new Date(user.dateOfBirth + 'T00:00:00').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white font-display tracking-tight">
            Account & Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal profile, zero-auto privacy rules, notification channels, and security layers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('user-profile')}
            leftIcon={<User className="w-3.5 h-3.5 text-violet-400" />}
          >
            My Profile
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsLogoutDialogOpen(true)}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 ${
            activeTab === 'account'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 ${
            activeTab === 'privacy'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Privacy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 ${
            activeTab === 'notifications'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 ${
            activeTab === 'security'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: ACCOUNT                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Section: Edit Profile Info */}
          <Card variant="default" padding="lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  Profile Credentials
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your identity details, profile picture, and optional birth date
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditProfileOpen(true)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit Profile
              </Button>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative group flex-shrink-0">
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size="xl"
                  className="ring-4 ring-violet-500/20 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(true)}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow border-2 border-[#090D16]"
                  title="Edit Avatar"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2 flex-1 text-center sm:text-left min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h4 className="text-lg font-bold text-white font-display truncate">
                    {user.name}
                  </h4>
                  <Badge variant="success" size="sm">
                    Verified
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-[#0A0E1A] border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-medium block">
                        Email Address
                      </span>
                      <span className="text-slate-200 font-medium truncate block">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0A0E1A] border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-medium block">
                        Date of Birth (Optional)
                      </span>
                      <span className="text-slate-200 font-medium truncate block">
                        {formattedDob || 'Not specified'}
                      </span>
                    </div>
                    <Badge variant="neutral" size="sm">
                      Optional
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section: Change Password */}
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Key className="w-4 h-4 text-violet-400" />
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  Change Password
                </h3>
                <p className="text-xs text-slate-400">
                  Update your primary account passcode
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <Input
                label="Current Password"
                isPassword
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />

              <Input
                label="New Password (min 8 characters)"
                isPassword
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm New Password"
                isPassword
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                isLoading={isChangingPassword}
              >
                Update Password
              </Button>
            </form>
          </Card>

          {/* Section: Disconnect Partner (Destructive Action) */}
          <Card variant="default" padding="lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-semibold text-white font-display">
                    Partner Connection
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  {connection.status === 'connected' && connection.partner
                    ? `Currently connected with ${connection.partner.name} (${connection.partner.email}).`
                    : 'No active partner connection is currently linked.'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Disconnecting will immediately sever shared spaces, shared reminders, and all shared health access.
                </p>
              </div>

              {connection.status === 'connected' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDisconnectDialogOpen(true)}
                  className="text-amber-400 border-amber-500/40 hover:bg-amber-950/20"
                >
                  Disconnect Partner
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigateTo('connect-partner')}
                >
                  Connect Partner
                </Button>
              )}
            </div>
          </Card>

          {/* Section: Delete Account (Destructive Action) */}
          <div className="p-6 rounded-2xl bg-rose-950/15 border border-rose-500/30 space-y-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <h3 className="text-base font-semibold text-rose-300 font-display">
                  Danger Zone: Delete Account
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Permanently erase your LunaLink account, cycle tracking records, pain trend observations, women's health signals, personal care DNA, and shared space memories. This action is irreversible and cannot be undone.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: PRIVACY                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          {/* Strict Non-Diagnostic & Zero Auto-Sharing Policy Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
              <h4 className="font-semibold text-emerald-300 text-sm">
                Default-Private Architecture
              </h4>
              <p>
                <strong className="text-white">Do not automatically share any health information.</strong> In LunaLink, all health records, cycle information, pain metrics, and care preferences remain strictly private by default. Sharing requires explicit, intentional opt-in and can be revoked at any moment with immediate effect.
              </p>
            </div>
          </div>

          {/* Category: Care Profile Sharing */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-violet-400" />
                <h3 className="text-base font-semibold text-white font-display">
                  Care Profile Sharing
                </h3>
              </div>
              <Badge
                variant={careProfile.isSharedWithPartner ? 'success' : 'neutral'}
                size="sm"
              >
                {careProfile.isSharedWithPartner ? 'Shared with Partner' : 'Strictly Private'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
              <div className="space-y-0.5 max-w-xl">
                <h4 className="text-xs font-semibold text-white">
                  Share Care Profile (Care DNA)
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Allow your connected partner to view your preferred communication style, physical support needs, comfort drink/food preferences, and personal care boundaries.
                </p>
              </div>

              <Toggle
                checked={careProfile.isSharedWithPartner}
                onChange={() => toggleShareCareProfile()}
              />
            </div>
          </Card>

          {/* Category: Health Information Sharing (Zero Auto-Sharing) */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-pink-400" />
                <div>
                  <h3 className="text-base font-semibold text-white font-display">
                    Health Information Sharing
                  </h3>
                  <p className="text-xs text-slate-400">
                    Granular, revocable permissions for health and wellness data
                  </p>
                </div>
              </div>
              <Badge variant="neutral" size="sm">
                Explicit Opt-in Only
              </Badge>
            </div>

            <div className="space-y-3">
              {/* 1. Cycle Information */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-white">
                      Cycle Information
                    </h4>
                    <Badge variant={healthPermissions.cycleInformation ? 'success' : 'neutral'} size="sm">
                      {healthPermissions.cycleInformation ? 'Shared' : 'Private'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Share current cycle phase, predicted period dates, and estimated fertile window. Never shared automatically.
                  </p>
                </div>
                <Toggle
                  checked={healthPermissions.cycleInformation}
                  onChange={() => toggleHealthPermission('cycleInformation')}
                />
              </div>

              {/* 2. Pain Trends & Symptoms */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-white">
                      Pain Trends & Daily Symptoms
                    </h4>
                    <Badge variant={healthPermissions.painTrends ? 'success' : 'neutral'} size="sm">
                      {healthPermissions.painTrends ? 'Shared' : 'Private'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Share daily pain scale ratings, symptom frequencies, and comfort level trends. Kept strictly private by default.
                  </p>
                </div>
                <Toggle
                  checked={healthPermissions.painTrends}
                  onChange={() => toggleHealthPermission('painTrends')}
                />
              </div>

              {/* 3. Care Mode Broadcast */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-white">
                      Care Mode State
                    </h4>
                    <Badge variant={healthPermissions.careMode ? 'success' : 'neutral'} size="sm">
                      {healthPermissions.careMode ? 'Shared' : 'Private'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Allow partner to see when you have activated Care Mode and what practical support you requested.
                  </p>
                </div>
                <Toggle
                  checked={healthPermissions.careMode}
                  onChange={() => toggleHealthPermission('careMode')}
                />
              </div>
            </div>
          </Card>

          {/* Category: Partner Permissions */}
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  Partner Permissions
                </h3>
                <p className="text-xs text-slate-400">
                  Control what your connected partner is allowed to add or suggest
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Partner Can Add Shared Reminders
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Allow partner to add grocery runs, heating pad restocks, or mutual care reminders.
                  </p>
                </div>
                <Toggle
                  checked={partnerCanEditReminders}
                  onChange={(val) => {
                    setPartnerCanEditReminders(val);
                    showToast(`Partner reminder creation ${val ? 'allowed' : 'restricted'}`, 'info');
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Partner Can View Shared Space Notes
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Allow partner to read collaborative notes, date plans, and shared favorite places.
                  </p>
                </div>
                <Toggle
                  checked={partnerCanViewNotes}
                  onChange={(val) => {
                    setPartnerCanViewNotes(val);
                    showToast(`Shared space access ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Partner Can View Care Suggestions
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Allow algorithm-guided, rule-based care ideas based strictly on your shared preferences.
                  </p>
                </div>
                <Toggle
                  checked={partnerCanSuggestCare}
                  onChange={(val) => {
                    setPartnerCanSuggestCare(val);
                    showToast(`Care suggestions ${val ? 'allowed' : 'restricted'}`, 'info');
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Category: Data Visibility */}
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Eye className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  Data Visibility & Screen Privacy
                </h3>
                <p className="text-xs text-slate-400">
                  Privacy screen guards and partner presence status
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Lock Screen Privacy Mode
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Mask health terms from push alerts; show discreet text like "LunaLink Check-in" instead of medical terms.
                  </p>
                </div>
                <Toggle
                  checked={lockScreenPrivacy}
                  onChange={(val) => {
                    setLockScreenPrivacy(val);
                    updateNotificationSettings({ exposeHealthInfoInPreviews: !val });
                    showToast(`Lock screen privacy ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Partner Online Status & Presence
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Show your partner when you were recently active in LunaLink.
                  </p>
                </div>
                <Toggle
                  checked={partnerPresenceVisible}
                  onChange={(val) => {
                    setPartnerPresenceVisible(val);
                    showToast(`Partner presence visibility ${val ? 'enabled' : 'hidden'}`, 'info');
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: NOTIFICATIONS                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Notification Discretion Notice */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex items-start gap-3">
            <Bell className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
              <h4 className="font-semibold text-indigo-300 text-sm">
                Discreet Health Delivery
              </h4>
              <p>
                LunaLink ensures health terminology is never leaked to external notification banners or lock screens. All sensitive events use sanitized previews unless you explicitly choose otherwise.
              </p>
            </div>
          </div>

          {/* 1. Support Notifications */}
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  Support Notifications
                </h3>
                <p className="text-xs text-slate-400">
                  Predictive support window alerts and cycle phase preparation
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Higher-Support Period Approaching Alert
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Notifies your connected partner 1 to 2 days before an estimated premenstrual or higher-support window.
                  </p>
                </div>
                <Toggle
                  checked={notificationSettings.supportPeriodApproaching}
                  onChange={(val) => {
                    updateNotificationSettings({ supportPeriodApproaching: val });
                    showToast(`Support window alert ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Cycle Phase Transition Reminders
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Gentle private reminders for you when entering new cycle phases (Follicular, Ovulatory, Luteal, Menstrual).
                  </p>
                </div>
                <Toggle
                  checked={cyclePhaseSupportNotif}
                  onChange={(val) => {
                    setCyclePhaseSupportNotif(val);
                    showToast(`Phase transition prompts ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Quiet Hours Mode
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Mute non-critical support reminders between 10:00 PM and 8:00 AM.
                  </p>
                </div>
                <Toggle
                  checked={quietHoursEnabled}
                  onChange={(val) => {
                    setQuietHoursEnabled(val);
                    showToast(`Quiet hours ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>
            </div>
          </Card>

          {/* 2. Partner Notifications */}
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Heart className="w-4 h-4 text-rose-400" />
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  Partner Notifications
                </h3>
                <p className="text-xs text-slate-400">
                  Care Mode toggles and connection status updates
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Care Mode State Changes
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Receive immediate notifications when Care Mode is activated or deactivated by your partner.
                  </p>
                </div>
                <Toggle
                  checked={notificationSettings.careModeActivated}
                  onChange={(val) => {
                    updateNotificationSettings({
                      careModeActivated: val,
                      careModeDeactivated: val,
                    });
                    showToast(`Care Mode notifications ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Partner Connection & Invitations
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Alerts when an invite code is used, accepted, or revoked.
                  </p>
                </div>
                <Toggle
                  checked={notificationSettings.partnerInvitation}
                  onChange={(val) => {
                    updateNotificationSettings({
                      partnerInvitation: val,
                      invitationAccepted: val,
                    });
                    showToast(`Connection alerts ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>
            </div>
          </Card>

          {/* 3. Reminder Notifications */}
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Calendar className="w-4 h-4 text-amber-400" />
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  Reminder Notifications
                </h3>
                <p className="text-xs text-slate-400">
                  Shared tasks, comfort supplies, and wellness check-ins
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Shared Practical Reminders
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Due date reminders for shared chores, medication, or mutual appointments.
                  </p>
                </div>
                <Toggle
                  checked={notificationSettings.sharedReminders}
                  onChange={(val) => {
                    updateNotificationSettings({ sharedReminders: val });
                    showToast(`Shared reminders ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Comfort Supplies Restock Alerts
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Nudges to restock favorite herbal teas, hot pads, or comfort items before predicted high-need days.
                  </p>
                </div>
                <Toggle
                  checked={suppliesRemindersNotif}
                  onChange={(val) => {
                    setSuppliesRemindersNotif(val);
                    showToast(`Supplies restock alerts ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Routine Wellness & Check-in Nudges
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Occasional quiet prompts to pause, hydrate, or rest during stressful weeks.
                  </p>
                </div>
                <Toggle
                  checked={wellnessCheckInsNotif}
                  onChange={(val) => {
                    setWellnessCheckInsNotif(val);
                    showToast(`Wellness check-ins ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>
            </div>
          </Card>

          {/* 4. System Notifications */}
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  System Notifications
                </h3>
                <p className="text-xs text-slate-400">
                  Account security, permission audits, and platform notices
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Security & Active Session Login Alerts
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Instant alerts whenever a new browser session or mobile device signs in to your account.
                  </p>
                </div>
                <Toggle
                  checked={securityLoginAlerts}
                  onChange={(val) => {
                    setSecurityLoginAlerts(val);
                    showToast(`Security login alerts ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Monthly Privacy Audit Digest
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Monthly summary showing which health data was accessed or shared.
                  </p>
                </div>
                <Toggle
                  checked={monthlyPrivacyDigest}
                  onChange={(val) => {
                    setMonthlyPrivacyDigest(val);
                    showToast(`Privacy audit digest ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: SECURITY                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Section: Change Password */}
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Key className="w-4 h-4 text-violet-400" />
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  Change Password
                </h3>
                <p className="text-xs text-slate-400">
                  Update your vault authentication password
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <Input
                label="Current Password"
                isPassword
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />

              <Input
                label="New Password (min 8 characters)"
                isPassword
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm New Password"
                isPassword
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                isLoading={isChangingPassword}
              >
                Update Password
              </Button>
            </form>
          </Card>

          {/* Section: Active Sessions */}
          <Card variant="default" padding="lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-3">
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  Active Connected Sessions
                </h3>
                <p className="text-xs text-slate-400">
                  Devices and browsers currently authenticated to your LunaLink vault
                </p>
              </div>

              {sessions.filter((s) => !s.isCurrent).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRevokeAllDialogOpen(true)}
                  className="text-rose-400 border-rose-500/30 hover:bg-rose-950/20"
                >
                  Revoke All Other Sessions
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 flex-shrink-0">
                      {sess.device.includes('iPhone') || sess.device.includes('Android') ? (
                        <Smartphone className="w-4 h-4 text-violet-400" />
                      ) : sess.device.includes('iPad') ? (
                        <Tablet className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Laptop className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-white">
                          {sess.device}
                        </p>
                        {sess.isCurrent && (
                          <Badge variant="success" size="sm">
                            Current Device
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {sess.browser} • {sess.location}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        IP: {sess.ipAddress} • {sess.lastActive}
                      </p>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSessionToRevoke(sess)}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 self-end sm:self-center"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Section: Two-Factor & Biometric Security */}
          <Card variant="default" padding="lg">
            <h3 className="text-base font-semibold text-white font-display mb-4">
              Cryptographic Layers
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Require a one-time passkey confirmation whenever logging in from an unrecognized device.
                  </p>
                </div>
                <Toggle
                  checked={twoFactorEnabled}
                  onChange={(val) => {
                    setTwoFactorEnabled(val);
                    showToast(`2FA ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800">
                <div className="space-y-0.5 max-w-xl">
                  <h4 className="text-xs font-semibold text-white">
                    Biometric Passkey (TouchID / FaceID)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Authenticate quickly using device biometrics or hardware security keys.
                  </p>
                </div>
                <Toggle
                  checked={biometricEnabled}
                  onChange={(val) => {
                    setBiometricEnabled(val);
                    showToast(`Biometric authentication ${val ? 'enabled' : 'disabled'}`, 'info');
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Section: Logout */}
          <Card variant="default" padding="lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white font-display">
                  Session Sign Out
                </h3>
                <p className="text-xs text-slate-400">
                  End your current browser session and lock your encrypted local vault.
                </p>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsLogoutDialogOpen(true)}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRMATION DIALOGS FOR DESTRUCTIVE ACTIONS                               */}
      {/* ========================================================================= */}

      {/* 1. Disconnect Partner Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDisconnectDialogOpen}
        onClose={() => setIsDisconnectDialogOpen(false)}
        onConfirm={handleConfirmDisconnect}
        title="Disconnect Partner?"
        description={`Are you sure you want to disconnect ${connection.partner?.name || 'your partner'}? Both of you will immediately lose access to shared calendar events, shared notes, and all shared health information. This action unlinks your accounts and revokes all mutual permissions.`}
        confirmText="Disconnect Partner"
        cancelText="Keep Connected"
        variant="warning"
      />

      {/* 2. Delete Account Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Permanently Delete Account?"
        description="This action is permanent and completely irreversible. All your encrypted cycle logs, pain records, women's health signals, personal care DNA, and shared memories will be permanently wiped from this device and cannot be recovered."
        requireConfirmationWord="DELETE"
        confirmText="Permanently Delete Account"
        cancelText="Cancel"
        variant="danger"
      />

      {/* 3. Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={() => {
          setIsLogoutDialogOpen(false);
          logout();
        }}
        title="Sign Out of LunaLink?"
        description="Are you sure you want to sign out? Your encrypted local session will be closed. You can log back in anytime with your email credentials."
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        variant="info"
        icon={<LogOut className="w-6 h-6 text-violet-400" />}
      />

      {/* 4. Revoke Single Session Confirmation */}
      {sessionToRevoke && (
        <ConfirmDialog
          isOpen={Boolean(sessionToRevoke)}
          onClose={() => setSessionToRevoke(null)}
          onConfirm={() => handleRevokeSingleSession(sessionToRevoke)}
          title="Revoke Session?"
          description={`Are you sure you want to terminate the active session on ${sessionToRevoke.device} (${sessionToRevoke.browser})? That device will be immediately signed out.`}
          confirmText="Revoke Session"
          cancelText="Cancel"
          variant="warning"
        />
      )}

      {/* 5. Revoke All Other Sessions Confirmation */}
      <ConfirmDialog
        isOpen={isRevokeAllDialogOpen}
        onClose={() => setIsRevokeAllDialogOpen(false)}
        onConfirm={handleConfirmRevokeAllSessions}
        title="Revoke All Other Sessions?"
        description="This will immediately terminate authentication on all other devices (including mobile phones and tablets). Only this current browser session will remain signed in."
        confirmText="Revoke Other Sessions"
        cancelText="Cancel"
        variant="warning"
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
