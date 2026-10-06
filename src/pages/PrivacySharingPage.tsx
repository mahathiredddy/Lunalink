import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Toggle } from '../components/ui/Toggle';
import { Badge } from '../components/ui/Badge';
import { PrivacySettingItem } from '../types';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  FileText,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
} from 'lucide-react';

export const PrivacySharingPage: React.FC = () => {
  const {
    privacySettings,
    togglePrivacySetting,
    savePrivacySettings,
    partner,
    connection,
    showToast,
  } = useApp();

  // Local working copy so user can adjust and click "Save Changes" or toggle live
  const [localSettings, setLocalSettings] = useState<PrivacySettingItem[]>(privacySettings);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync if global privacySettings change from outside
  React.useEffect(() => {
    setLocalSettings(privacySettings);
  }, [privacySettings]);

  const sharedCount = localSettings.filter((s) => s.isShared).length;
  const totalCount = localSettings.length;

  const handleToggle = (id: string) => {
    setLocalSettings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isShared: !item.isShared } : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await savePrivacySettings(localSettings);
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyPreset = (type: 'strict' | 'balanced' | 'open') => {
    let updated: PrivacySettingItem[];
    if (type === 'strict') {
      // Only profile and shared notes
      updated = localSettings.map((s) => ({
        ...s,
        isShared: s.category === 'profile' || s.category === 'notes',
      }));
    } else if (type === 'balanced') {
      // Profile, contact, notes, preferences (no activity tracking)
      updated = localSettings.map((s) => ({
        ...s,
        isShared: s.category !== 'activity',
      }));
    } else {
      // Open
      updated = localSettings.map((s) => ({
        ...s,
        isShared: true,
      }));
    }
    setLocalSettings(updated);
    setHasUnsavedChanges(true);
    showToast(`Applied ${type} privacy template. Click 'Save Changes' to commit.`, 'info');
  };

  const getCategoryIcon = (cat: PrivacySettingItem['category']) => {
    switch (cat) {
      case 'profile':
        return <User className="w-5 h-5 text-violet-400" />;
      case 'contact':
        return <Phone className="w-5 h-5 text-indigo-400" />;
      case 'notes':
        return <FileText className="w-5 h-5 text-sky-400" />;
      case 'activity':
        return <Activity className="w-5 h-5 text-amber-400" />;
      case 'preferences':
        return <Sliders className="w-5 h-5 text-emerald-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-violet-400" />;
    }
  };

  const partnerName = partner ? partner.name : 'Your Partner';

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="pb-4 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-white font-display tracking-tight">
              Privacy & Sharing Controls
            </h2>
            <Badge variant="shared" size="sm">
              Granular Consent
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explicitly choose what information is shared with {partnerName}. Nothing is shared automatically.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={handleSaveChanges}
            isLoading={isSaving}
            disabled={!hasUnsavedChanges}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            {hasUnsavedChanges ? 'Save Changes' : 'Permissions Saved'}
          </Button>
        </div>
      </div>

      {/* ================= PRIVACY SUMMARY CARD ================= */}
      <Card variant="glow" padding="lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-semibold text-white font-display">
                Privacy Summary
              </h3>
            </div>

            <p className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              {sharedCount} of {totalCount} categories are shared.
            </p>

            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              {sharedCount === totalCount
                ? `You are sharing all categories with ${partnerName}. You can revoke individual items anytime.`
                : `${totalCount - sharedCount} categories are strictly private and isolated from ${partnerName}'s view.`}
            </p>
          </div>

          {/* Preset buttons */}
          <div className="flex flex-col gap-2 self-start sm:self-auto min-w-[200px]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Sharing Presets
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleApplyPreset('strict')}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Only essential profile & shared notes"
              >
                High Privacy
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('balanced')}
                className="py-1.5 px-2 rounded-lg bg-violet-900/40 hover:bg-violet-800/50 border border-violet-500/30 text-violet-200 transition-colors"
                title="Balanced notes & preferences, no activity status"
              >
                Balanced
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('open')}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Full bilateral collaboration"
              >
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Visual Progress Ratio Bar */}
        <div className="mt-5 w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(sharedCount / totalCount) * 100}%` }}
          />
        </div>
      </Card>

      {/* ================= ARCHITECTURAL DISTINCTION GUIDE ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800">
          <div className="flex items-center gap-2 text-violet-400 font-semibold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>My Information</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Data you own. You hold unilateral authority to toggle visibility on or off at any moment.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shared Information</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Data made mutually accessible in your Shared Space only while both toggles remain active.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800">
          <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Partner Information</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Data controlled by {partnerName}. You cannot unilaterally force or alter their permissions.
          </p>
        </div>
      </div>

      {/* ================= PERMISSION CATEGORIES LIST ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white font-display">
            Granular Permission Categories
          </h3>
          <span className="text-xs text-slate-400">Live configuration</span>
        </div>

        <div className="space-y-4">
          {localSettings.map((item) => {
            const isShared = item.isShared;

            return (
              <Card
                key={item.id}
                variant="default"
                padding="md"
                className={`transition-all ${
                  isShared
                    ? 'border-violet-500/30 bg-[#0D1426]'
                    : 'border-slate-800/80 bg-[#0A0F1D]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Icon & Description */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-base font-semibold text-white font-display">
                          {item.title}
                        </h4>
                        <Badge
                          variant={isShared ? 'shared' : 'private'}
                          size="sm"
                          icon={isShared ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        >
                          {isShared ? 'Shared' : 'Not Shared'}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                        {item.description}
                      </p>

                      {/* Partner Visibility Notice */}
                      {item.partnerVisibilityNotice && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                          <Info className="w-3 h-3 text-violet-400 flex-shrink-0" />
                          <span>{item.partnerVisibilityNotice}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Toggle Control */}
                  <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-300 sm:hidden">
                        {isShared ? 'Shared with partner' : 'Private'}
                      </span>
                      <Toggle
                        checked={isShared}
                        onChange={() => handleToggle(item.id)}
                        ariaLabel={`Toggle ${item.title}`}
                      />
                    </div>
                    <span className="hidden sm:block text-[11px] font-mono text-slate-400">
                      {isShared ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom Save Reminder Floating Bar if unsaved changes exist */}
      {hasUnsavedChanges && (
        <div className="sticky bottom-6 z-20 p-4 rounded-2xl bg-[#0F162A]/95 border border-violet-500/50 shadow-2xl shadow-black/80 flex items-center justify-between gap-4 backdrop-blur-md animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 text-xs text-slate-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>You have unsaved privacy changes. Click Save to apply them to your active connection.</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveChanges}
            isLoading={isSaving}
          >
            Save Changes Now
          </Button>
        </div>
      )}
    </div>
  );
};
