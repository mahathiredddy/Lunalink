import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { CareModeOption } from '../types';
import {
  CARE_MODE_OPTIONS_META,
  careModeService,
} from '../services/careModeService';
import {
  HeartHandshake,
  SunDim,
  HandHelping,
  MessageCircle,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  Edit3,
  Power,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Info,
  SlidersHorizontal,
  Send,
  Bell,
  Heart,
} from 'lucide-react';

export const CareModePage: React.FC = () => {
  const {
    careMode,
    activateCareMode,
    deactivateCareMode,
    updateCareModeNote,
    connection,
    partner,
    healthPermissions,
    toggleHealthPermission,
    careProfile,
    navigateTo,
    cycleStats,
  } = useApp();

  // Activating Screen / Flow State
  const [isActivatingFlowOpen, setIsActivatingFlowOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<CareModeOption[]>([
    "I'm having a difficult day",
  ]);
  const [personalNote, setPersonalNote] = useState('');

  // Turn Off Confirmation Modal
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Edit Note Modal while Active
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [editingNoteValue, setEditingNoteValue] = useState('');

  // Elapsed duration updater (every 30 seconds)
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!careMode.isActive) return;
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, [careMode.isActive]);

  const isConnected = connection.status === 'connected' && !!partner;
  const isCareModeSharingPermitted = healthPermissions.careMode;

  // Toggle option selection in activating screen
  const toggleOption = (option: CareModeOption) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        // Prevent deselecting all: keep at least 1
        if (prev.length === 1) return prev;
        return prev.filter((o) => o !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  // Open activation flow
  const handleStartActivation = () => {
    setSelectedOptions(
      (careMode.options && careMode.options.length > 0) ? careMode.options : ["I'm having a difficult day"]
    );
    setPersonalNote(careMode.note || '');
    setIsActivatingFlowOpen(true);
  };

  // Confirm activation
  const handleConfirmActivation = async () => {
    await activateCareMode(selectedOptions, personalNote);
    setIsActivatingFlowOpen(false);
  };

  // Confirm deactivation
  const handleConfirmDeactivation = async () => {
    await deactivateCareMode();
    setShowDeactivateModal(false);
  };

  // Save edited note while active
  const handleSaveEditedNote = async () => {
    await updateCareModeNote(editingNoteValue);
    setShowEditNoteModal(false);
  };

  // Helper icon renderer
  const renderOptionIcon = (id: CareModeOption) => {
    switch (id) {
      case "I'm having a difficult day":
        return <SunDim className="w-5 h-5 text-amber-400" />;
      case 'I may need emotional support':
        return <HeartHandshake className="w-5 h-5 text-rose-400" />;
      case 'I may need practical help':
        return <HandHelping className="w-5 h-5 text-emerald-400" />;
      case 'Please check in':
        return <MessageCircle className="w-5 h-5 text-sky-400" />;
      case 'Please give me space':
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'Use my Care Profile':
        return <HeartHandshake className="w-5 h-5 text-violet-400" />;
      default:
        return <Heart className="w-5 h-5 text-violet-400" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* ================= 1. PAGE HEADER ================= */}
      <header id="care-mode-header" className="space-y-2 border-b border-slate-800/80 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
                Care Mode
              </h1>
              {careMode.isActive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-300 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700/60 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  Off
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-slate-300 mt-1">
              Let someone you trust know how to support you.
            </p>
          </div>

          {/* Connected Partner Mini Pill */}
          <div className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B101E] border border-slate-800 text-xs text-slate-300">
            {isConnected && partner ? (
              <>
                <Avatar src={partner.avatar} name={partner.name} size="xs" />
                <span>Connected with <strong className="text-white">{partner.name}</strong></span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Solo Mode (Private)</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= 2. NON-EMERGENCY MEDICAL DISCLAIMER ================= */}
      <aside
        id="care-mode-disclaimer"
        aria-label="Care Mode Medical Notice"
        className="rounded-2xl bg-[#0D1424] border border-slate-800/90 p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-slate-300"
      >
        <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-200">
            Care Mode is designed for communication and support. It is not an emergency medical service.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            If you or someone you care for is experiencing severe, sudden, or urgent clinical distress, please consult a qualified healthcare provider or contact emergency services immediately.
          </p>
        </div>
      </aside>

      {/* ================= 3. MAIN STATE: LARGE VISUAL STATUS CARD ================= */}
      {!careMode.isActive ? (
        /* INACTIVE STATE CARD */
        <section id="care-mode-inactive-card" aria-label="Care Mode Status">
          <Card
            variant="default"
            padding="lg"
            className="relative overflow-hidden border-slate-800/90 bg-gradient-to-b from-[#0F162A] to-[#0A0E1A] text-center py-10 sm:py-14"
          >
            {/* Calming background glow */}
            <div className="absolute inset-0 bg-radial from-violet-900/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative max-w-xl mx-auto space-y-6">
              {/* Resting Visual Orb */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl flex items-center justify-center text-slate-400 transition-transform hover:scale-105 duration-300">
                <Power className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500" />
              </div>

              {/* Status Header */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span>Status: Standing By</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
                  Care Mode is off
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
                  When you need additional care, activating Care Mode sends a gentle, clear signal to your trusted person without requiring lengthy explanations.
                </p>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  id="activate-care-mode-button"
                  onClick={handleStartActivation}
                  leftIcon={<Power className="w-5 h-5 text-violet-200" />}
                  className="w-full sm:w-auto min-h-[52px] px-8 text-base shadow-lg shadow-violet-950/50 hover:shadow-violet-600/30"
                >
                  Activate Care Mode
                </Button>
              </div>

              {/* Privacy Reassurance Note */}
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Only information explicitly permitted by you will ever be shared.</span>
              </p>
            </div>
          </Card>
        </section>
      ) : (
        /* ACTIVATED STATE CARD */
        <section id="care-mode-active-card" aria-label="Care Mode Active Status">
          <Card
            variant="default"
            padding="lg"
            className="relative overflow-hidden border-rose-500/40 bg-gradient-to-b from-rose-950/20 via-[#0F162A] to-[#0A0E1A] shadow-2xl shadow-rose-950/30"
          >
            {/* Radiant pulse ambient aura */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-6 sm:space-y-8">
              {/* Top Banner: Status + Turn Off Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div className="flex items-start sm:items-center gap-4">
                  {/* Pulsing Beacon Orb */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shadow-inner">
                      <HeartHandshake className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                        Live Status
                      </span>
                      <Badge variant="warning" size="sm" icon={<HeartHandshake className="w-3 h-3 text-rose-400" />}>
                        Care Mode Active
                      </Badge>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
                      Care Mode is on
                    </h2>

                    <p className="text-xs sm:text-sm text-rose-200/90 font-medium">
                      Your selected support preferences can now guide your trusted person.
                    </p>
                  </div>
                </div>

                {/* Turn Off Care Mode Button */}
                <div className="self-start sm:self-auto">
                  <Button
                    variant="danger"
                    size="md"
                    id="turn-off-care-mode-button"
                    onClick={() => setShowDeactivateModal(true)}
                    leftIcon={<Power className="w-4 h-4" />}
                    className="w-full sm:w-auto min-h-[44px]"
                  >
                    Turn Off Care Mode
                  </Button>
                </div>
              </div>

              {/* Status Details Grid: Activation Time, Partner Notification, Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Activation Time Card */}
                <div className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Clock className="w-4 h-4 text-violet-400" />
                    <span className="uppercase tracking-wider font-semibold">Activation Time</span>
                  </div>
                  <p className="text-base font-bold text-white">
                    {careModeService.formatActivationTime(careMode.activatedAt)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {careModeService.formatActiveDuration(careMode.activatedAt)}
                  </p>
                </div>

                {/* 2. Partner Notification Status Card */}
                <div className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Bell className="w-4 h-4 text-sky-400" />
                    <span className="uppercase tracking-wider font-semibold">Partner Notification</span>
                  </div>
                  {isConnected && partner ? (
                    isCareModeSharingPermitted ? (
                      <div>
                        <p className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Delivered to {partner.name}</span>
                        </p>
                        <p className="text-xs text-slate-400">
                          Notified via LunaLink encrypted channel
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-amber-300 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          <span>Sharing Disabled</span>
                        </p>
                        <p className="text-xs text-slate-400">
                          Care Mode sharing toggle is currently OFF
                        </p>
                      </div>
                    )
                  ) : (
                    <div>
                      <p className="text-base font-bold text-slate-300">Solo Mode</p>
                      <p className="text-xs text-slate-400">Recorded in personal care log</p>
                    </div>
                  )}
                </div>

                {/* 3. Selected Support Count */}
                <div className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="uppercase tracking-wider font-semibold">Active Signals</span>
                  </div>
                  <p className="text-base font-bold text-white">
                    {(careMode.options || []).length} Preference{(careMode.options || []).length === 1 ? '' : 's'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Explicitly selected for this session
                  </p>
                </div>
              </div>

              {/* Care Mode Permission Warning if Partner is Connected but Care Mode sharing is OFF */}
              {isConnected && !isCareModeSharingPermitted && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-semibold text-amber-200">
                        Care Mode sharing is turned off in your permissions.
                      </p>
                      <p className="text-amber-300/80">
                        {partner?.name} will not see that Care Mode is active until you enable it.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleHealthPermission('careMode')}
                    className="self-start sm:self-auto border-amber-500/40 text-amber-200 hover:bg-amber-950/60"
                  >
                    Enable Care Mode Sharing
                  </Button>
                </div>
              )}

              {/* Selected Support Preferences Display */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Selected Support Preferences
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(careMode.options || []).map((option) => {
                    const meta = CARE_MODE_OPTIONS_META.find((m) => m.id === option);
                    return (
                      <div
                        key={option}
                        className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800/90 flex items-start gap-3.5"
                      >
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 mt-0.5">
                          {renderOptionIcon(option)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white leading-snug">
                            {option}
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {meta?.description || 'Custom support guidance.'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optional Personal Note Display */}
              {careMode.note && (
                <div className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-violet-400" />
                      Your Note to {partner ? partner.name : 'Your Log'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNoteValue(careMode.note || '');
                        setShowEditNoteModal(true);
                      }}
                      className="text-xs text-violet-400 hover:text-violet-300 font-medium"
                    >
                      Edit Note
                    </button>
                  </div>
                  <p className="text-sm text-slate-200 italic bg-[#0E1528] p-3 rounded-xl border border-slate-800">
                    &ldquo;{careMode.note}&rdquo;
                  </p>
                </div>
              )}

              {/* Shared Information Transparency Section */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      What Information Is Shared
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Only information explicitly permitted by you is visible to your partner.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateTo('privacy-sharing')}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    className="text-xs text-violet-400"
                  >
                    Manage Permissions
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* 1. What IS Shared */}
                  <div className="p-4 rounded-2xl bg-emerald-950/15 border border-emerald-500/25 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Shared in this session:</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-300 pl-6 list-disc">
                      <li>Active Care Mode indicator</li>
                      <li>Selected support preferences ({(careMode.options || []).length} items)</li>
                      {careMode.note ? <li>Personal note: &ldquo;{careMode.note}&rdquo;</li> : <li>No personal note added</li>}
                      {(careMode.options || []).includes('Use my Care Profile') && healthPermissions.careProfile ? (
                        <li className="text-emerald-300 font-medium">Care Profile comfort essentials & communication styles</li>
                      ) : (careMode.options || []).includes('Use my Care Profile') ? (
                        <li className="text-amber-300">Care Profile requested, but locked by privacy settings</li>
                      ) : null}
                    </ul>
                  </div>

                  {/* 2. What REMAINS PRIVATE */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-slate-300 font-semibold">
                      <Lock className="w-4 h-4 text-violet-400" />
                      <span>Remains strictly private:</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-400 pl-6 list-disc">
                      <li>Intimate symptom & pain journal entries</li>
                      <li>Cycle phase days & predictions (unless Cycle Sharing enabled)</li>
                      <li>Private notes & unshared reminders</li>
                      <li>All personal health history</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* ================= 4. PARTNER PERSPECTIVE PREVIEW ================= */}
      {isConnected && partner && (
        <section id="care-mode-partner-preview" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-violet-400" />
              What {partner.name} Sees
            </h2>
            <span className="text-[11px] text-slate-400">Live preview of partner&apos;s view</span>
          </div>

          <Card
            variant="default"
            padding="md"
            className="border-slate-800 bg-[#0B101E] relative overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <Avatar src={partner.avatar} name={partner.name} size="md" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">{partner.name}&apos;s Screen</span>
                  {careMode.isActive && isCareModeSharingPermitted ? (
                    <Badge variant="warning" size="sm">
                      Care Mode Alert Received
                    </Badge>
                  ) : careMode.isActive && !isCareModeSharingPermitted ? (
                    <Badge variant="private" size="sm">
                      Hidden by Privacy Rules
                    </Badge>
                  ) : (
                    <Badge variant="secondary" size="sm">
                      Standard Overview
                    </Badge>
                  )}
                </div>

                {careMode.isActive && isCareModeSharingPermitted ? (
                  <div className="p-4 rounded-xl bg-[#0D1527] border border-rose-500/30 space-y-2.5">
                    <p className="text-sm font-semibold text-rose-200 flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-rose-400" />
                      <span>Care Mode is on • Extra support requested</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {careMode.options.map((opt) => (
                        <span
                          key={opt}
                          className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                    {careMode.note && (
                      <p className="text-xs text-slate-300 italic border-l-2 border-rose-400/50 pl-2.5">
                        &ldquo;{careMode.note}&rdquo;
                      </p>
                    )}
                    {careMode.options.includes('Use my Care Profile') && healthPermissions.careProfile && (
                      <div className="text-xs text-violet-300 pt-1 flex items-center gap-1.5">
                        <HeartHandshake className="w-3.5 h-3.5" />
                        <span>Care Profile guidance unlocked for partner</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No active Care Mode alert is currently displayed on your partner&apos;s device.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* ================= 5. WHEN ACTIVATING: CONFIRMATION SCREEN / MODAL ================= */}
      <Modal
        isOpen={isActivatingFlowOpen}
        onClose={() => setIsActivatingFlowOpen(false)}
        title="What would you like your partner to know?"
        subtitle="Select the support you need right now. Multiple selections are allowed."
        maxWidth="lg"
      >
        <div className="space-y-6">
          {/* Options Grid (High tap target, simple 1-click toggling) */}
          <div className="space-y-2.5">
            {CARE_MODE_OPTIONS_META.map((meta) => {
              const isSelected = selectedOptions.includes(meta.id);
              return (
                <button
                  type="button"
                  key={meta.id}
                  onClick={() => toggleOption(meta.id)}
                  aria-pressed={isSelected}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 min-h-[64px] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                    isSelected
                      ? 'bg-[#141C33] border-violet-500 shadow-md shadow-violet-950/40 text-white'
                      : 'bg-[#0B101E] border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-[#0E1528]'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>

                  {/* Icon */}
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex-shrink-0">
                    {renderOptionIcon(meta.id)}
                  </div>

                  {/* Content */}
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white leading-snug">
                      {meta.label}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {meta.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional: Add a note */}
          <div className="space-y-2">
            <label
              htmlFor="care-mode-activation-note"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
            >
              Add a note (Optional)
            </label>
            <textarea
              id="care-mode-activation-note"
              rows={3}
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="e.g. Resting on the couch with a hot water bottle, feel free to drop off tea later..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
            />
            {/* Quick Suggestions for rapid 1-tap addition */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-slate-400">Quick suggestions:</span>
              {[
                'Resting right now',
                'Feeling very fatigued',
                'Phone on silent',
                'A warm tea would be wonderful',
              ].map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => setPersonalNote(suggestion)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Note within confirmation */}
          <div className="p-3.5 rounded-xl bg-[#0B101E] border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Strict Privacy Notice:</strong> Only the support options you have selected above and your note will be shown to your partner. No medical logs or cycle entries will be shared.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsActivatingFlowOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              id="confirm-activate-care-mode-button"
              onClick={handleConfirmActivation}
              leftIcon={<Power className="w-4 h-4 text-white" />}
              className="min-h-[48px]"
            >
              Activate Care Mode
            </Button>
          </div>
        </div>
      </Modal>

      {/* ================= 6. TURN OFF CONFIRMATION MODAL ================= */}
      <Modal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        title="Turn off Care Mode?"
        subtitle="Are you ready to deactivate Care Mode?"
        maxWidth="sm"
      >
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Turning off Care Mode will signal that you are feeling better or no longer need active support.
            </p>
            {isConnected && isCareModeSharingPermitted && (
              <p className="text-slate-400">
                {partner?.name} will see that Care Mode has ended.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowDeactivateModal(false)}
            >
              Keep Care Mode Active
            </Button>
            <Button
              variant="danger"
              size="md"
              id="confirm-turn-off-care-mode"
              onClick={handleConfirmDeactivation}
              leftIcon={<Power className="w-4 h-4" />}
            >
              Turn Off Care Mode
            </Button>
          </div>
        </div>
      </Modal>

      {/* ================= 7. EDIT NOTE MODAL WHILE ACTIVE ================= */}
      <Modal
        isOpen={showEditNoteModal}
        onClose={() => setShowEditNoteModal(false)}
        title="Update Note"
        subtitle="Change the message visible to your trusted person."
        maxWidth="md"
      >
        <div className="space-y-4">
          <textarea
            rows={3}
            value={editingNoteValue}
            onChange={(e) => setEditingNoteValue(e.target.value)}
            placeholder="Add or update your note..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E1A] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowEditNoteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveEditedNote}
            >
              Save Note
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
