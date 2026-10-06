import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { NotificationSettingsModal } from '../components/notifications/NotificationSettingsModal';
import { AppNotification, NotificationCategory, NotificationType, UserNotificationSettings } from '../types';
import {
  Bell,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  HeartHandshake,
  Heart,
  Share2,
  Sparkles,
  Calendar,
  Lock,
  ArrowRight,
  Settings,
  Eye,
  EyeOff,
  Layers,
  Check,
  Search,
  PlusCircle,
  Clock,
  RotateCcw,
  Sliders,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Link2,
  FileText,
  AlertCircle,
  Coffee,
} from 'lucide-react';
import { DemoScenarioBar } from '../components/demo/DemoScenarioBar';
import { PartnerNotificationPreviewCard } from '../components/notifications/PartnerNotificationPreviewCard';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markNotificationAsUnread,
    toggleNotificationRead,
    markAllNotificationsAsRead,
    dismissNotification,
    addNotification,
    navigateTo,
    unreadNotificationCount,
    notificationSettings,
    updateNotificationSettings,
    showToast,
    user,
    partner,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'feed' | 'partner_preview' | 'settings'>('feed');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'care' | 'shared' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [expandedReasonId, setExpandedReasonId] = useState<string | null>(null);

  // Determine system category match (connection, privacy, insights, or system)
  const isSystemCategory = (cat?: NotificationCategory) => {
    return cat === 'connection' || cat === 'privacy' || cat === 'insights' || cat === 'system' || !cat;
  };

  // Filter based on active filter tab and search
  const filteredNotifications = notifications.filter((item) => {
    // 1. Tab filter
    let matchesTab = true;
    if (activeFilter === 'all') matchesTab = true;
    else if (activeFilter === 'unread') matchesTab = !item.isRead;
    else if (activeFilter === 'care') matchesTab = item.category === 'care';
    else if (activeFilter === 'shared') matchesTab = item.category === 'shared';
    else if (activeFilter === 'system') matchesTab = isSystemCategory(item.category);

    if (!matchesTab) return false;

    // 2. Search filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q) ||
      (item.discreetMessage && item.discreetMessage.toLowerCase().includes(q)) ||
      (item.actionText && item.actionText.toLowerCase().includes(q))
    );
  });

  // Filter counts
  const allCount = notifications.length;
  const unreadCount = unreadNotificationCount;
  const careCount = notifications.filter((n) => n.category === 'care').length;
  const sharedCount = notifications.filter((n) => n.category === 'shared').length;
  const systemCount = notifications.filter((n) => isSystemCategory(n.category)).length;

  // Icon and visual palette config for notifications
  const getNotificationVisuals = (notif: AppNotification) => {
    switch (notif.type) {
      // CARE
      case 'care_mode_activated':
        return {
          icon: <Heart className="w-4 h-4 text-rose-400" />,
          bgColor: 'bg-rose-950/40 border-rose-500/30',
          categoryLabel: 'Care Mode',
          badgeVariant: 'shared' as const,
          groupName: 'CARE',
        };
      case 'care_mode_deactivated':
        return {
          icon: <Heart className="w-4 h-4 text-slate-400" />,
          bgColor: 'bg-slate-900 border-slate-800',
          categoryLabel: 'Care Mode Ended',
          badgeVariant: 'subtle' as const,
          groupName: 'CARE',
        };
      case 'care_support_reminder':
        return {
          icon: <Heart className="w-4 h-4 text-rose-400" />,
          bgColor: 'bg-rose-950/30 border-rose-500/30',
          categoryLabel: 'Support Reminder',
          badgeVariant: 'subtle' as const,
          groupName: 'CARE',
        };

      // SHARED
      case 'shared_reminder':
        return {
          icon: <Calendar className="w-4 h-4 text-cyan-400" />,
          bgColor: 'bg-cyan-950/30 border-cyan-500/30',
          categoryLabel: 'Shared Reminder',
          badgeVariant: 'shared' as const,
          groupName: 'SHARED',
        };
      case 'shared_memory':
        return {
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
          bgColor: 'bg-amber-950/30 border-amber-500/30',
          categoryLabel: 'Shared Memory',
          badgeVariant: 'default' as const,
          groupName: 'SHARED',
        };
      case 'shared_note':
      case 'shared_update':
        return {
          icon: <Share2 className="w-4 h-4 text-indigo-400" />,
          bgColor: 'bg-indigo-950/30 border-indigo-500/30',
          categoryLabel: 'Shared Note',
          badgeVariant: 'subtle' as const,
          groupName: 'SHARED',
        };

      // CONNECTION
      case 'partner_invitation':
        return {
          icon: <Link2 className="w-4 h-4 text-violet-400" />,
          bgColor: 'bg-violet-950/40 border-violet-500/30',
          categoryLabel: 'Partner Invitation',
          badgeVariant: 'shared' as const,
          groupName: 'CONNECTION',
        };
      case 'partner_connected':
      case 'connection_request':
        return {
          icon: <HeartHandshake className="w-4 h-4 text-violet-400" />,
          bgColor: 'bg-violet-950/40 border-violet-500/30',
          categoryLabel: 'Invitation Accepted',
          badgeVariant: 'shared' as const,
          groupName: 'CONNECTION',
        };

      // PRIVACY
      case 'privacy_change':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          bgColor: 'bg-emerald-950/30 border-emerald-500/30',
          categoryLabel: 'Privacy Audit',
          badgeVariant: 'subtle' as const,
          groupName: 'PRIVACY',
        };

      // INSIGHTS & PREDICTIVE CARE NOTIFICATIONS
      case 'UPCOMING_SUPPORT':
        return {
          icon: <Sparkles className="w-4 h-4 text-sky-400" />,
          bgColor: 'bg-sky-950/40 border-sky-500/30',
          categoryLabel: 'Upcoming Support',
          badgeVariant: 'insights' as const,
          groupName: 'PREDICTIVE',
        };
      case 'DAY_1_SUPPORT':
        return {
          icon: <Heart className="w-4 h-4 text-rose-400" />,
          bgColor: 'bg-rose-950/40 border-rose-500/30',
          categoryLabel: 'Day 1 Support',
          badgeVariant: 'care' as const,
          groupName: 'PREDICTIVE',
        };
      case 'CARE_MODE':
        return {
          icon: <Heart className="w-4 h-4 text-rose-400" />,
          bgColor: 'bg-rose-950/40 border-rose-500/30',
          categoryLabel: 'Care Mode',
          badgeVariant: 'care' as const,
          groupName: 'CARE',
        };
      case 'SHARED_REMINDER':
        return {
          icon: <Calendar className="w-4 h-4 text-cyan-400" />,
          bgColor: 'bg-cyan-950/30 border-cyan-500/30',
          categoryLabel: 'Shared Reminder',
          badgeVariant: 'shared' as const,
          groupName: 'SHARED',
        };
      case 'CARE_SUGGESTION':
        return {
          icon: <Coffee className="w-4 h-4 text-amber-400" />,
          bgColor: 'bg-amber-950/30 border-amber-500/30',
          categoryLabel: 'Care Suggestion',
          badgeVariant: 'care' as const,
          groupName: 'PREDICTIVE',
        };
      case 'support_insight':
        return {
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
          bgColor: 'bg-amber-950/30 border-amber-500/30',
          categoryLabel: 'Support Insight',
          badgeVariant: 'default' as const,
          groupName: 'INSIGHTS',
        };

      default:
        return {
          icon: <Bell className="w-4 h-4 text-slate-400" />,
          bgColor: 'bg-slate-900 border-slate-800',
          categoryLabel: 'System',
          badgeVariant: 'subtle' as const,
          groupName: 'SYSTEM',
        };
    }
  };

  // Trigger test notifications for each exact required type
  const triggerNotification = (type: NotificationType) => {
    switch (type) {
      // 1. CONNECTION: Partner invitation
      case 'partner_invitation':
        if (!notificationSettings.partnerInvitation) {
          showToast('Partner Invitation alerts are currently turned off in Settings.', 'info');
          return;
        }
        addNotification({
          type: 'partner_invitation',
          category: 'connection',
          title: 'Partner Invitation Code Generated',
          message: 'A private connection invite code (LUNA-9823-ALX) is ready to share securely with your partner.',
          timestamp: 'Just now',
          actionUrl: 'connect-partner',
          actionText: 'View Invite',
          containsHealthData: false,
        });
        showToast('Generated: Partner Invitation notification', 'success');
        break;

      // 2. CONNECTION: Invitation accepted
      case 'partner_connected':
        if (!notificationSettings.invitationAccepted) {
          showToast('Invitation Accepted alerts are currently turned off in Settings.', 'info');
          return;
        }
        addNotification({
          type: 'partner_connected',
          category: 'connection',
          title: 'Partner Invitation Accepted',
          message: 'Elena accepted your connection invitation. Your private LunaLink corridor is now active.',
          timestamp: 'Just now',
          actionUrl: 'partner-profile',
          actionText: 'View Partner',
          containsHealthData: false,
        });
        showToast('Generated: Invitation Accepted notification', 'success');
        break;

      // 3. CARE: Care Mode activated
      case 'care_mode_activated':
        if (!notificationSettings.careModeActivated) {
          showToast('Care Mode Activated alerts are currently turned off in Settings.', 'info');
          return;
        }
        addNotification({
          type: 'care_mode_activated',
          category: 'care',
          title: 'Care Mode Activated',
          message: 'Care Mode is active. Shared preferences: Warm drink, Low lighting, and Heating pad.',
          discreetMessage: 'Care Mode is active. Check in gently with partner.',
          timestamp: 'Just now',
          actionUrl: 'care-mode',
          actionText: 'Manage Care Mode',
          containsHealthData: false,
        });
        showToast('Generated: Care Mode Activated notification', 'success');
        break;

      // 4. CARE: Care Mode turned off
      case 'care_mode_deactivated':
        if (!notificationSettings.careModeDeactivated) {
          showToast('Care Mode Deactivated alerts are currently turned off in Settings.', 'info');
          return;
        }
        addNotification({
          type: 'care_mode_deactivated',
          category: 'care',
          title: 'Care Mode Turned Off',
          message: 'Care Mode was turned off. Daily routine resumed.',
          discreetMessage: 'Care Mode concluded. Daily routine resumed.',
          timestamp: 'Just now',
          actionUrl: 'care-mode',
          actionText: 'View Care Mode',
          containsHealthData: false,
        });
        showToast('Generated: Care Mode Turned Off notification', 'success');
        break;

      // 5. CARE: Support reminder
      case 'care_support_reminder':
        if (!notificationSettings.supportReminders) {
          showToast('Support Reminders are currently turned off in Settings.', 'info');
          return;
        }
        addNotification({
          type: 'care_support_reminder',
          category: 'care',
          title: 'Gentle Support Reminder',
          message: 'Check in on comfort levels. A warm cup of chamomile tea and a quiet 15-minute rest would be restorative.',
          discreetMessage: 'Time for a gentle comfort check-in.',
          timestamp: 'Just now',
          actionUrl: 'care-suggestions',
          actionText: 'View Suggestions',
          containsHealthData: false,
        });
        showToast('Generated: Support Reminder notification', 'success');
        break;

      // 6. SHARED: New shared reminder
      case 'shared_reminder':
        if (!notificationSettings.sharedReminders) {
          showToast('Shared Reminder alerts are currently turned off in Settings.', 'info');
          return;
        }
        addNotification({
          type: 'shared_reminder',
          category: 'shared',
          title: 'New Shared Reminder',
          message: 'Alex scheduled "Pick up electrolyte hydration mix & dark chocolate" for tomorrow.',
          timestamp: 'Just now',
          actionUrl: 'shared-calendar',
          actionText: 'Open Calendar',
          containsHealthData: false,
        });
        showToast('Generated: New Shared Reminder notification', 'success');
        break;

      // 7. SHARED: Shared memory
      case 'shared_memory':
        if (!notificationSettings.sharedMemories) {
          showToast('Shared Memory alerts are currently turned off in Settings.', 'info');
          return;
        }
        addNotification({
          type: 'shared_memory',
          category: 'shared',
          title: 'New Shared Memory Added',
          message: 'Elena saved a new heartfelt memory in the Memory Vault: "Evening walk in the rain & lavender tea".',
          timestamp: 'Just now',
          actionUrl: 'memory-vault',
          actionText: 'Open Memory Vault',
          containsHealthData: false,
        });
        showToast('Generated: Shared Memory notification', 'success');
        break;

      // 8. SHARED: Shared note
      case 'shared_note':
        if (!notificationSettings.sharedNotes) {
          showToast('Shared Note alerts are currently turned off in Settings.', 'info');
          return;
        }
        addNotification({
          type: 'shared_note',
          category: 'shared',
          title: 'Shared Note Updated',
          message: 'Elena updated the note: "Comfort Food & Quiet Rest Routine".',
          timestamp: 'Just now',
          actionUrl: 'shared-space',
          actionText: 'View Note',
          containsHealthData: false,
        });
        showToast('Generated: Shared Note notification', 'success');
        break;

      // 9. PRIVACY: Sharing permission changed
      case 'privacy_change':
        if (!notificationSettings.sharingPermissionChanged) {
          showToast('Privacy Change alerts are currently turned off in Settings.', 'info');
          return;
        }
        addNotification({
          type: 'privacy_change',
          category: 'privacy',
          title: 'Sharing Permission Changed',
          message: 'Symptoms & Discomfort visibility was set to Private. Sensitive health records are no longer shared with partner.',
          timestamp: 'Just now',
          actionUrl: 'privacy-sharing',
          actionText: 'Audit Permissions',
          containsHealthData: false,
        });
        showToast('Generated: Sharing Permission Changed notification', 'success');
        break;

      // 10. INSIGHTS: Potential higher-support period approaching
      case 'support_insight':
        if (!notificationSettings.supportPeriodApproaching) {
          showToast('Higher-Support Period alerts are currently turned off in Settings.', 'info');
          return;
        }
        addNotification({
          type: 'support_insight',
          category: 'insights',
          title: 'Potential Higher-Support Period Approaching',
          message: 'Historical cycle patterns suggest a higher-support window is anticipated in ~48 hours. Consider stocking comfort items in advance.',
          discreetMessage: 'A supportive window is approaching in 2 days. Care suggestions available.',
          timestamp: 'Just now',
          actionUrl: 'support-insights',
          actionText: 'View Support Window',
          containsHealthData: true, // Sensitive health prediction
        });
        showToast('Generated: Higher-Support Period Approaching notification', 'success');
        break;

      // PREDICTIVE CARE NOTIFICATIONS
      case 'UPCOMING_SUPPORT':
        addNotification({
          type: 'UPCOMING_SUPPORT',
          category: 'insights',
          title: 'A support day may be approaching',
          message: 'Based on previous cycle patterns, she may appreciate some extra support in the next couple of days.',
          discreetMessage: 'A supportive window may be approaching in the next couple of days.',
          timestamp: 'Just now',
          actionUrl: 'support-insights',
          actionText: 'View Insights',
          containsHealthData: true,
          careSuggestions: [
            'Check in once',
            'Give her some space',
            'Offer her a warm drink',
            'Listen rather than giving advice',
          ],
          reason: 'Based on previous cycle patterns, an estimated period window is approaching in approximately 48 hours.',
          factors: [
            'Previous cycle lengths (28, 29, 29 days)',
            'Estimated period in ~2 days',
            'Care Profile preferences',
          ],
          disclaimer: 'This is an estimate based on previous patterns. It is not a medical prediction.',
          privacyLevel: 'SHARED_WITH_PARTNER',
          targetAudience: 'PARTNER',
        });
        showToast('Triggered: UPCOMING_SUPPORT notification', 'success');
        break;

      case 'DAY_1_SUPPORT':
        addNotification({
          type: 'DAY_1_SUPPORT',
          category: 'care',
          title: 'Today may be a higher-support day',
          message: 'According to past cycle logs, Day 1 often brings higher physical discomfort. A little extra gentleness can go a long way.',
          discreetMessage: 'Today is a designated higher-support day.',
          timestamp: 'Just now',
          actionUrl: 'care-mode',
          actionText: 'View Care Mode',
          containsHealthData: true,
          careSuggestions: [
            'Prepare a warm heating pad',
            'Offer herbal tea or warm broth',
            'Take on dinner or evening chores',
            'Check in without expecting quick replies',
          ],
          reason: 'Historical cycle logs indicate Day 1 has previously presented moderate-to-high cramps and fatigue.',
          factors: [
            'Day 1 period onset recorded',
            'Historical Day 1 discomfort patterns',
            'Care Profile comfort items',
          ],
          disclaimer: 'This is an estimate based on previous patterns. It is not a medical prediction.',
          privacyLevel: 'SHARED_WITH_PARTNER',
          targetAudience: 'PARTNER',
        });
        showToast('Triggered: DAY_1_SUPPORT notification', 'success');
        break;

      case 'CARE_MODE':
        addNotification({
          type: 'CARE_MODE',
          category: 'care',
          title: 'Care Mode is active',
          message: 'Care Mode has been activated. Her current comfort preferences: Warm herbal tea, gentle check-ins, and quiet downtime.',
          discreetMessage: 'Care Mode has been activated.',
          timestamp: 'Just now',
          actionUrl: 'care-mode',
          actionText: 'Care Mode Details',
          containsHealthData: false,
          careSuggestions: [
            'Prepare chamomile or peppermint tea',
            'Dim ambient lighting in living spaces',
            'Offer comfort snacks or heating pad',
          ],
          reason: 'Care Mode was activated directly by the user to communicate support preferences.',
          factors: ['Explicit Care Mode activation', 'Saved Care Profile preferences'],
          disclaimer: 'This is an estimate based on previous patterns. It is not a medical prediction.',
          privacyLevel: 'SHARED_WITH_PARTNER',
          targetAudience: 'PARTNER',
        });
        showToast('Triggered: CARE_MODE notification', 'success');
        break;

      case 'SHARED_REMINDER':
        addNotification({
          type: 'SHARED_REMINDER',
          category: 'shared',
          title: 'Shared Reminder: Pick up comfort tea & heating pad',
          message: 'A shared reminder scheduled for today to prepare comfort essentials.',
          timestamp: 'Just now',
          actionUrl: 'shared-calendar',
          actionText: 'View Calendar',
          containsHealthData: false,
          reason: 'Scheduled reminder created in Shared Calendar.',
          factors: ['Shared calendar schedule'],
          disclaimer: 'This is an estimate based on previous patterns. It is not a medical prediction.',
          privacyLevel: 'SHARED_WITH_PARTNER',
          targetAudience: 'BOTH',
        });
        showToast('Triggered: SHARED_REMINDER notification', 'success');
        break;

      case 'CARE_SUGGESTION':
        addNotification({
          type: 'CARE_SUGGESTION',
          category: 'care',
          title: 'Gentle Support Suggestion',
          message: 'A thoughtful, zero-pressure way to support her today based on her Care Profile.',
          timestamp: 'Just now',
          actionUrl: 'care-profile',
          actionText: 'View Preferences',
          containsHealthData: false,
          careSuggestions: [
            'Offer to take care of dinner',
            'Send a gentle text check-in',
            'Keep household environment calm and quiet',
          ],
          reason: 'Generated from her active Care Profile comfort preferences.',
          factors: ['Care Profile preferences', 'Communication preferences'],
          disclaimer: 'This is an estimate based on previous patterns. It is not a medical prediction.',
          privacyLevel: 'SHARED_WITH_PARTNER',
          targetAudience: 'PARTNER',
        });
        showToast('Triggered: CARE_SUGGESTION notification', 'success');
        break;

      default:
        break;
    }
  };

  const toggleSetting = (key: keyof UserNotificationSettings) => {
    updateNotificationSettings({ [key]: !notificationSettings[key] });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* ================= 1. PAGE HEADER ================= */}
      <div
        id="notification-page-header"
        className="pb-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white font-display tracking-tight">
              Notifications
            </h1>
            {unreadNotificationCount > 0 && (
              <Badge variant="shared" size="sm">
                {unreadNotificationCount} Unread
              </Badge>
            )}
            <Badge
              variant={notificationSettings.exposeHealthInfoInPreviews ? 'warning' : 'subtle'}
              size="sm"
              icon={
                notificationSettings.exposeHealthInfoInPreviews ? (
                  <Eye className="w-3 h-3 text-amber-400" />
                ) : (
                  <Lock className="w-3 h-3 text-emerald-400" />
                )
              }
            >
              {notificationSettings.exposeHealthInfoInPreviews
                ? 'Health In Previews: Allowed'
                : 'Discreet Previews Active'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connection updates, Care Mode alerts, shared reminders, and privacy audits
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {unreadNotificationCount > 0 && (
            <Button
              id="mark-all-read-btn"
              variant="secondary"
              size="sm"
              onClick={markAllNotificationsAsRead}
              leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            >
              Mark all as read
            </Button>
          )}

          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'feed'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Alert Feed
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('partner_preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'partner_preview'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-violet-300" />
              Preview as Partner
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Settings
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsModalOpen(true)}
            leftIcon={<Settings className="w-4 h-4 text-slate-400" />}
            className="hidden sm:inline-flex"
          >
            Preferences Modal
          </Button>
        </div>
      </div>

      {/* ================= 1.5 LUNALINK DEMO MODE BAR ================= */}
      <DemoScenarioBar />

      {/* ================= 2. DISCREET HEALTH PRIVACY BANNER ================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0D1527] to-slate-950 border border-slate-800/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border flex-shrink-0 mt-0.5 sm:mt-0 ${
              notificationSettings.exposeHealthInfoInPreviews
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {notificationSettings.exposeHealthInfoInPreviews ? (
              <Eye className="w-4 h-4 text-amber-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-semibold text-white">
                {notificationSettings.exposeHealthInfoInPreviews
                  ? 'Health Details Permitted in Notification Previews'
                  : 'Zero Health Exposure in Notification Previews'}
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {!notificationSettings.exposeHealthInfoInPreviews
                ? 'Clinical cycle terms and private predictions are concealed in notification previews and replaced with neutral support phrases.'
                : 'Cycle specifics are visible in notification previews and alerts as you have explicitly allowed.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            updateNotificationSettings({
              exposeHealthInfoInPreviews: !notificationSettings.exposeHealthInfoInPreviews,
            })
          }
          className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all self-end sm:self-auto cursor-pointer font-medium whitespace-nowrap ${
            notificationSettings.exposeHealthInfoInPreviews
              ? 'border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40'
              : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40'
          }`}
        >
          {notificationSettings.exposeHealthInfoInPreviews
            ? 'Switch to Discreet Masking'
            : 'Allow Health Previews'}
        </button>
      </div>

      {/* ================= 3. TEST / SIMULATOR TOOLBAR ================= */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden">
        <div
          onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-violet-500/15 text-violet-300">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">
                Notification Testing & Simulation Sandbox
              </span>
              <span className="text-[11px] text-slate-400">
                Trigger any of the 10 required alert events to preview delivery, filtering, and discreet health masking
              </span>
            </div>
          </div>
          <span className="text-xs text-violet-400 font-medium hover:text-violet-300">
            {isSimulatorOpen ? 'Hide Test Buttons' : 'Show Test Buttons'}
          </span>
        </div>

        {isSimulatorOpen && (
          <div className="p-4 pt-2 border-t border-slate-800 bg-[#0B101E]/80 space-y-3.5">
            {/* Connection */}
            <div>
              <span className="text-[10px] font-semibold text-violet-400 tracking-wider uppercase block mb-1.5">
                Connection
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => triggerNotification('partner_invitation')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <Link2 className="w-3.5 h-3.5 text-violet-400" />
                  + Partner Invitation
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotification('partner_connected')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-violet-400" />
                  + Invitation Accepted
                </button>
              </div>
            </div>

            {/* Care */}
            <div>
              <span className="text-[10px] font-semibold text-rose-400 tracking-wider uppercase block mb-1.5">
                Care
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => triggerNotification('care_mode_activated')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  + Care Mode Activated
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotification('care_mode_deactivated')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-slate-400" />
                  + Care Mode Turned Off
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotification('care_support_reminder')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  + Support Reminder
                </button>
              </div>
            </div>

            {/* Shared */}
            <div>
              <span className="text-[10px] font-semibold text-cyan-400 tracking-wider uppercase block mb-1.5">
                Shared
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => triggerNotification('shared_reminder')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  + New Shared Reminder
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotification('shared_memory')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  + Shared Memory
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotification('shared_note')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                  + Shared Note
                </button>
              </div>
            </div>

            {/* Privacy & Insights */}
            <div>
              <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase block mb-1.5">
                Privacy & Insights
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => triggerNotification('privacy_change')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  + Sharing Permission Changed
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotification('support_insight')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  + Potential Higher-Support Period Approaching
                </button>
              </div>
            </div>
            {/* Predictive Support Alerts (Prototype) */}
            <div>
              <span className="text-[10px] font-semibold text-violet-400 tracking-wider uppercase block mb-1.5">
                Predictive Partner Support (5 Prototype Types)
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => triggerNotification('UPCOMING_SUPPORT')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-sky-950/50 hover:bg-sky-900/50 text-sky-200 border border-sky-500/40 flex items-center gap-1.5 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  + UPCOMING_SUPPORT (2 Days Before)
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotification('DAY_1_SUPPORT')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-rose-950/50 hover:bg-rose-900/50 text-rose-200 border border-rose-500/40 flex items-center gap-1.5 font-medium"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  + DAY_1_SUPPORT (Cycle Start)
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotification('CARE_MODE')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-rose-950/50 hover:bg-rose-900/50 text-rose-200 border border-rose-500/40 flex items-center gap-1.5 font-medium"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  + CARE_MODE (Active)
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotification('SHARED_REMINDER')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-200 border border-cyan-500/40 flex items-center gap-1.5 font-medium"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  + SHARED_REMINDER
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotification('CARE_SUGGESTION')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-amber-950/50 hover:bg-amber-900/50 text-amber-200 border border-amber-500/40 flex items-center gap-1.5 font-medium"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  + CARE_SUGGESTION
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= 4. TAB VIEWS: FEED vs PARTNER PREVIEW vs IN-PAGE SETTINGS ================= */}
      {activeTab === 'partner_preview' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-white font-display flex items-center gap-2">
                <span>Partner Notification Preview</span>
                <Badge variant="shared" size="sm">Partner View</Badge>
              </h2>
              <p className="text-xs text-slate-400">
                Simulate what your connected partner sees on their screen under the active scenario and privacy settings
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('feed')}>
              Return to Alert Feed
            </Button>
          </div>

          <PartnerNotificationPreviewCard />
        </div>
      ) : activeTab === 'settings' ? (
        /* INLINE SETTINGS VIEW */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-white font-display">Notification Settings</h2>
              <p className="text-xs text-slate-400">
                Configure which alerts LunaLink sends you and your connected partner
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('feed')}>
              Return to Alert Feed
            </Button>
          </div>

          {/* Connection Alerts */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-violet-400" />
              <span>Connection Alerts</span>
            </h3>
            <div className="rounded-2xl bg-[#0B101E] border border-slate-800 divide-y divide-slate-800/80">
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white block">Partner Invitation</span>
                  <span className="text-xs text-slate-400">
                    Notify when an invite code is generated, sent, or refreshed
                  </span>
                </div>
                <ToggleSwitch
                  id="setting-partner-invitation"
                  checked={notificationSettings.partnerInvitation}
                  onChange={() => toggleSetting('partnerInvitation')}
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white block">Invitation Accepted</span>
                  <span className="text-xs text-slate-400">
                    Notify when partner enters your invite code and links their account
                  </span>
                </div>
                <ToggleSwitch
                  id="setting-invitation-accepted"
                  checked={notificationSettings.invitationAccepted}
                  onChange={() => toggleSetting('invitationAccepted')}
                />
              </div>
            </div>
          </div>

          {/* Care Alerts */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Care Alerts</span>
            </h3>
            <div className="rounded-2xl bg-[#0B101E] border border-slate-800 divide-y divide-slate-800/80">
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white block">Care Mode Activated</span>
                  <span className="text-xs text-slate-400">
                    Notify when Care Mode is triggered and support preferences are shared
                  </span>
                </div>
                <ToggleSwitch
                  id="setting-care-mode-activated"
                  checked={notificationSettings.careModeActivated}
                  onChange={() => toggleSetting('careModeActivated')}
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white block">Care Mode Turned Off</span>
                  <span className="text-xs text-slate-400">
                    Notify when Care Mode concludes and regular routine resumes
                  </span>
                </div>
                <ToggleSwitch
                  id="setting-care-mode-deactivated"
                  checked={notificationSettings.careModeDeactivated}
                  onChange={() => toggleSetting('careModeDeactivated')}
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white block">Support Reminder</span>
                  <span className="text-xs text-slate-400">
                    Gentle check-in prompts (warm drink, rest break, comfort items)
                  </span>
                </div>
                <ToggleSwitch
                  id="setting-support-reminders"
                  checked={notificationSettings.supportReminders}
                  onChange={() => toggleSetting('supportReminders')}
                />
              </div>
            </div>
          </div>

          {/* Shared Space Alerts */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Shared Space Alerts</span>
            </h3>
            <div className="rounded-2xl bg-[#0B101E] border border-slate-800 divide-y divide-slate-800/80">
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white block">New Shared Reminder</span>
                  <span className="text-xs text-slate-400">
                    Alert when partner schedules practical calendar errands, supplies, or appointments
                  </span>
                </div>
                <ToggleSwitch
                  id="setting-shared-reminders"
                  checked={notificationSettings.sharedReminders}
                  onChange={() => toggleSetting('sharedReminders')}
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white block">Shared Memory</span>
                  <span className="text-xs text-slate-400">
                    Alert when partner preserves a moment or photo in the Memory Vault
                  </span>
                </div>
                <ToggleSwitch
                  id="setting-shared-memories"
                  checked={notificationSettings.sharedMemories}
                  onChange={() => toggleSetting('sharedMemories')}
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white block">Shared Note</span>
                  <span className="text-xs text-slate-400">
                    Alert when partner creates or updates a shared space note
                  </span>
                </div>
                <ToggleSwitch
                  id="setting-shared-notes"
                  checked={notificationSettings.sharedNotes}
                  onChange={() => toggleSetting('sharedNotes')}
                />
              </div>
            </div>
          </div>

          {/* Privacy & Insights */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Insights Alerts</span>
            </h3>
            <div className="rounded-2xl bg-[#0B101E] border border-slate-800 divide-y divide-slate-800/80">
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white block">Sharing Permission Changed</span>
                  <span className="text-xs text-slate-400">
                    Audit alert when health data, symptoms, or calendar visibility rules are modified
                  </span>
                </div>
                <ToggleSwitch
                  id="setting-sharing-permissions"
                  checked={notificationSettings.sharingPermissionChanged}
                  onChange={() => toggleSetting('sharingPermissionChanged')}
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-white block">Potential Higher-Support Period Approaching</span>
                  <span className="text-xs text-slate-400">
                    Proactive 24-48 hour advance notification to prepare comfort supplies
                  </span>
                </div>
                <ToggleSwitch
                  id="setting-support-period"
                  checked={notificationSettings.supportPeriodApproaching}
                  onChange={() => toggleSetting('supportPeriodApproaching')}
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3 bg-emerald-950/20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white block">
                      Permit Health Information in Notification Previews
                    </span>
                    <Badge variant={notificationSettings.exposeHealthInfoInPreviews ? 'warning' : 'subtle'} size="sm">
                      {notificationSettings.exposeHealthInfoInPreviews ? 'Permitted' : 'Masked (Recommended)'}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block max-w-lg">
                    By default, LunaLink strictly replaces clinical menstrual health terms with neutral phrases in previews to prevent shoulder-surfing and lockscreen exposure.
                  </span>
                </div>
                <ToggleSwitch
                  id="setting-expose-health-previews"
                  checked={notificationSettings.exposeHealthInfoInPreviews}
                  onChange={() => toggleSetting('exposeHealthInfoInPreviews')}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN NOTIFICATIONS FEED */
        <div className="space-y-4">
          {/* ================= 5. FILTER CONTROLS & SEARCH ================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* The 5 Exact Required Filters: All, Unread, Care, Shared, System */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                id="filter-all"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80">
                  {allCount}
                </span>
              </button>

              <button
                type="button"
                id="filter-unread"
                onClick={() => setActiveFilter('unread')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'unread'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Unread</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 font-semibold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                id="filter-care"
                onClick={() => setActiveFilter('care')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'care'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Care</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80">
                  {careCount}
                </span>
              </button>

              <button
                type="button"
                id="filter-shared"
                onClick={() => setActiveFilter('shared')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'shared'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Shared</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80">
                  {sharedCount}
                </span>
              </button>

              <button
                type="button"
                id="filter-system"
                onClick={() => setActiveFilter('system')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'system'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>System</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80">
                  {systemCount}
                </span>
              </button>
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ================= 6. NOTIFICATIONS LIST ================= */}
          {filteredNotifications.length === 0 ? (
            <Card variant="subtle" padding="lg" className="text-center py-16 bg-slate-900/40 border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-base text-white font-semibold font-display">No notifications found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                {searchQuery
                  ? `No alerts matching "${searchQuery}". Clear your search query to see all notifications.`
                  : activeFilter === 'unread'
                  ? 'All notifications have been read. Use the simulator above to generate test alerts.'
                  : `There are currently no alerts in the ${activeFilter} category.`}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs text-violet-400 hover:text-violet-300 font-medium"
                >
                  Clear search
                </button>
              )}
            </Card>
          ) : (
            <div className="space-y-3" id="notifications-list">
              {filteredNotifications.map((notif) => {
                const visuals = getNotificationVisuals(notif);
                // Health discretion mask: if notification containsHealthData and exposeHealthInfoInPreviews is false
                const isDiscreet =
                  notif.containsHealthData &&
                  !notificationSettings.exposeHealthInfoInPreviews &&
                  Boolean(notif.discreetMessage);

                const displayMessage = isDiscreet ? notif.discreetMessage : notif.message;

                return (
                  <Card
                    key={notif.id}
                    id={`notification-card-${notif.id}`}
                    variant="default"
                    padding="md"
                    className={`transition-all ${
                      !notif.isRead
                        ? 'border-violet-500/40 bg-[#0F172B]/95 shadow-sm'
                        : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5">
                      <div className="flex items-start gap-3.5 min-w-0">
                        {/* 1. Category Icon */}
                        <div
                          className={`p-2.5 rounded-xl border flex-shrink-0 mt-0.5 ${visuals.bgColor}`}
                        >
                          {visuals.icon}
                        </div>

                        {/* 2. Notification Body */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/60">
                              {visuals.groupName}
                            </span>
                            <Badge variant={visuals.badgeVariant} size="sm">
                              {visuals.categoryLabel}
                            </Badge>

                            {/* Title */}
                            <h4 className="text-sm font-semibold text-white font-display">
                              {notif.title}
                            </h4>

                            {/* Read / Unread Indicator Badge */}
                            {!notif.isRead ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                Unread
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-500">Read</span>
                            )}
                          </div>

                          {/* 3. Short Description */}
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                            {displayMessage}
                          </p>

                          {/* Care Suggestions (if provided) */}
                          {notif.careSuggestions && notif.careSuggestions.length > 0 && (
                            <div className="mt-2 space-y-1.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 max-w-xl">
                              <span className="text-[11px] font-semibold text-rose-300 flex items-center gap-1">
                                <Heart className="w-3 h-3 text-rose-400" />
                                <span>Suggested partner support actions:</span>
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                                {notif.careSuggestions.map((sug, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="flex items-center gap-1.5 text-[11px] text-slate-300"
                                  >
                                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                    <span>{sug}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* "Why am I seeing this?" Explainable Accordion */}
                          {(notif.reason || notif.disclaimer) && (
                            <div className="pt-1 max-w-xl">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedReasonId(
                                    expandedReasonId === notif.id ? null : notif.id
                                  )
                                }
                                className="text-[11px] text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Info className="w-3 h-3" />
                                <span>Why am I seeing this?</span>
                                {expandedReasonId === notif.id ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>

                              {expandedReasonId === notif.id && (
                                <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-xs space-y-2 animate-in fade-in-50">
                                  {notif.reason && (
                                    <p className="text-slate-300 leading-relaxed text-[11px]">
                                      {notif.reason}
                                    </p>
                                  )}

                                  {notif.factors && notif.factors.length > 0 && (
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                                        Factors evaluated:
                                      </span>
                                      <ul className="space-y-0.5 text-[11px] text-slate-400">
                                        {notif.factors.map((factor, fIdx) => (
                                          <li key={fIdx} className="flex items-center gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-violet-400" />
                                            <span>{factor}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {notif.disclaimer && (
                                    <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                                      {notif.disclaimer}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Discreet Health Indicator Badge */}
                          {isDiscreet && (
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 pt-0.5">
                              <Lock className="w-3 h-3" />
                              <span>Protected preview: health details concealed for discretion</span>
                            </div>
                          )}

                          {/* 4. Timestamp */}
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-600" />
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 5. Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-start pt-2 sm:pt-0">
                        {/* Action Link (if applicable) */}
                        {notif.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              if (notif.actionUrl) navigateTo(notif.actionUrl);
                            }}
                            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          >
                            {notif.actionText || 'View'}
                          </Button>
                        )}

                        {/* Read / Unread Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleNotificationRead(notif.id)}
                          title={notif.isRead ? 'Mark as unread' : 'Mark as read'}
                          aria-label={notif.isRead ? 'Mark as unread' : 'Mark as read'}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            !notif.isRead
                              ? 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                              : 'text-slate-500 hover:text-violet-400 hover:bg-slate-800'
                          }`}
                        >
                          {!notif.isRead ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <RotateCcw className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Dismiss */}
                        <button
                          type="button"
                          onClick={() => dismissNotification(notif.id)}
                          title="Dismiss notification"
                          aria-label="Dismiss notification"
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Settings Modal (available from header on all tabs) */}
      <NotificationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={notificationSettings}
        onUpdateSettings={updateNotificationSettings}
      />
    </div>
  );
};

const ToggleSwitch: React.FC<{ id?: string; checked: boolean; onChange: () => void }> = ({
  id,
  checked,
  onChange,
}) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-violet-600' : 'bg-slate-800'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
