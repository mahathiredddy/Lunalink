import React from 'react';
import { UserNotificationSettings } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  X,
  Bell,
  ShieldCheck,
  Lock,
  HeartHandshake,
  Heart,
  Share2,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserNotificationSettings;
  onUpdateSettings: (settings: Partial<UserNotificationSettings>) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const toggleSetting = (key: keyof UserNotificationSettings) => {
    onUpdateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white font-display">
                Notification Preferences
              </h3>
              <p className="text-xs text-slate-400">
                Choose which alerts to receive and control health preview privacy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* ============= 1. CRITICAL HEALTH PREVIEW PRIVACY SECTION ============= */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mt-0.5">
                  {settings.exposeHealthInfoInPreviews ? (
                    <Eye className="w-4 h-4 text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-white">
                      Health Information in Previews
                    </h4>
                    {!settings.exposeHealthInfoInPreviews ? (
                      <Badge variant="subtle" size="sm">Discreet Protected</Badge>
                    ) : (
                      <Badge variant="shared" size="sm">Permitted</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {!settings.exposeHealthInfoInPreviews
                      ? 'Health & cycle specifics are concealed in notification previews. Discreet neutral summaries (e.g. "A supportive window is approaching") are displayed instead.'
                      : 'You have explicitly permitted health cycle details to appear directly in notification previews and locksceen banners.'}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.exposeHealthInfoInPreviews}
                onClick={() => toggleSetting('exposeHealthInfoInPreviews')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.exposeHealthInfoInPreviews ? 'bg-amber-600' : 'bg-emerald-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.exposeHealthInfoInPreviews ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Strict LunaLink default: No medical data leaks onto lockscreens or shared previews without explicit permission.</span>
            </div>
          </div>

          {/* ============= 2. CONNECTION ALERTS ============= */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-violet-400" />
              <span>Connection Alerts</span>
            </h4>

            <div className="rounded-xl bg-slate-950 border border-slate-800 divide-y divide-slate-800/60">
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-white block">Partner Invitation</span>
                  <span className="text-[11px] text-slate-400">
                    Notify when an invitation code is created or shared
                  </span>
                </div>
                <ToggleSwitch
                  checked={settings.partnerInvitation}
                  onChange={() => toggleSetting('partnerInvitation')}
                />
              </div>

              <div className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-white block">Invitation Accepted</span>
                  <span className="text-[11px] text-slate-400">
                    Alert when partner accepts and connects to your corridor
                  </span>
                </div>
                <ToggleSwitch
                  checked={settings.invitationAccepted}
                  onChange={() => toggleSetting('invitationAccepted')}
                />
              </div>
            </div>
          </div>

          {/* ============= 3. CARE ALERTS ============= */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Care Alerts</span>
            </h4>

            <div className="rounded-xl bg-slate-950 border border-slate-800 divide-y divide-slate-800/60">
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-white block">Care Mode Activated</span>
                  <span className="text-[11px] text-slate-400">
                    Immediate notification when partner requests comfort support
                  </span>
                </div>
                <ToggleSwitch
                  checked={settings.careModeActivated}
                  onChange={() => toggleSetting('careModeActivated')}
                />
              </div>

              <div className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-white block">Care Mode Turned Off</span>
                  <span className="text-[11px] text-slate-400">
                    Gentle alert when Care Mode concludes and normal routine resumes
                  </span>
                </div>
                <ToggleSwitch
                  checked={settings.careModeDeactivated}
                  onChange={() => toggleSetting('careModeDeactivated')}
                />
              </div>

              <div className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-white block">Support Reminders</span>
                  <span className="text-[11px] text-slate-400">
                    Gentle check-in prompts (warm tea, quiet break, hydration)
                  </span>
                </div>
                <ToggleSwitch
                  checked={settings.supportReminders}
                  onChange={() => toggleSetting('supportReminders')}
                />
              </div>
            </div>
          </div>

          {/* ============= 4. SHARED SPACE ALERTS ============= */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Shared Space & Memory Alerts</span>
            </h4>

            <div className="rounded-xl bg-slate-950 border border-slate-800 divide-y divide-slate-800/60">
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-white block">New Shared Reminder</span>
                  <span className="text-[11px] text-slate-400">
                    Alert when partner schedules practical calendar errands or supplies
                  </span>
                </div>
                <ToggleSwitch
                  checked={settings.sharedReminders}
                  onChange={() => toggleSetting('sharedReminders')}
                />
              </div>

              <div className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-white block">Shared Memory</span>
                  <span className="text-[11px] text-slate-400">
                    Notify when partner preserves a moment in the Memory Vault
                  </span>
                </div>
                <ToggleSwitch
                  checked={settings.sharedMemories}
                  onChange={() => toggleSetting('sharedMemories')}
                />
              </div>

              <div className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-white block">Shared Note</span>
                  <span className="text-[11px] text-slate-400">
                    Alert when partner adds or edits a shared reference note
                  </span>
                </div>
                <ToggleSwitch
                  checked={settings.sharedNotes}
                  onChange={() => toggleSetting('sharedNotes')}
                />
              </div>
            </div>
          </div>

          {/* ============= 5. PRIVACY & INSIGHTS ============= */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Privacy & Support Insights</span>
            </h4>

            <div className="rounded-xl bg-slate-950 border border-slate-800 divide-y divide-slate-800/60">
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-white block">Sharing Permission Changed</span>
                  <span className="text-[11px] text-slate-400">
                    Security audit notice if any health category visibility is toggled
                  </span>
                </div>
                <ToggleSwitch
                  checked={settings.sharingPermissionChanged}
                  onChange={() => toggleSetting('sharingPermissionChanged')}
                />
              </div>

              <div className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-white block">Potential Higher-Support Period Approaching</span>
                  <span className="text-[11px] text-slate-400">
                    Proactive 24-48h heads-up to prepare comfort supplies & quiet time
                  </span>
                </div>
                <ToggleSwitch
                  checked={settings.supportPeriodApproaching}
                  onChange={() => toggleSetting('supportPeriodApproaching')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex items-center justify-end bg-slate-900/90">
          <Button variant="primary" size="md" onClick={onClose}>
            Save & Done
          </Button>
        </div>
      </div>
    </div>
  );
};

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({
  checked,
  onChange,
}) => {
  return (
    <button
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
