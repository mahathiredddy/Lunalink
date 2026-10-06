import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  CommunicationPref,
  PhysicalSupportPref,
  ComfortPref,
  EmotionalSupportPref,
  CareProfile,
} from '../types';
import { careProfileService } from '../services/careProfileService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  HeartHandshake,
  MessageSquare,
  Phone,
  Clock,
  Sparkles,
  ShieldCheck,
  Lock,
  Eye,
  Save,
  RotateCcw,
  Check,
  Info,
  Coffee,
  Utensils,
  Flame,
  Moon,
  VolumeX,
  Heart,
  Home,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Share2,
  Users,
  Compass,
} from 'lucide-react';

// Option definitions with descriptions for maximum warmth and clarity
const COMMUNICATION_OPTIONS: { id: CommunicationPref; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'Text me',
    label: 'Text me',
    desc: 'Easier to read and reply when I have energy',
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    id: 'Call me',
    label: 'Call me',
    desc: 'Hearing a familiar voice helps me feel grounded',
    icon: <Phone className="w-4 h-4" />,
  },
  {
    id: 'Check in occasionally',
    label: 'Check in occasionally',
    desc: 'A gentle message every few hours lets me know you care',
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: 'Give me some space',
    label: 'Give me some space',
    desc: 'I might take time to respond, no rush or pressure',
    icon: <Moon className="w-4 h-4" />,
  },
  {
    id: 'Ask before calling',
    label: 'Ask before calling',
    desc: 'Send a quick text first to see if I am ready to talk',
    icon: <HelpCircle className="w-4 h-4" />,
  },
];

const PHYSICAL_SUPPORT_OPTIONS: { id: PhysicalSupportPref; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'Stay nearby',
    label: 'Stay nearby',
    desc: 'Being in the same room or house without needing to chat',
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: 'Give me space',
    label: 'Give me space',
    desc: 'Private quiet time to sleep, rest, or decompress',
    icon: <Moon className="w-4 h-4" />,
  },
  {
    id: 'Ask before visiting',
    label: 'Ask before visiting',
    desc: 'Check in with me first before dropping by in person',
    icon: <HelpCircle className="w-4 h-4" />,
  },
  {
    id: 'Help with practical tasks',
    label: 'Help with practical tasks',
    desc: 'Dishes, meals, filling a water bottle, running small errands',
    icon: <HeartHandshake className="w-4 h-4" />,
  },
];

const COMFORT_OPTIONS: { id: ComfortPref; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'Warm drink',
    label: 'Warm drink',
    desc: 'Herbal tea, hot chocolate, or warm lemon water',
    icon: <Coffee className="w-4 h-4" />,
  },
  {
    id: 'Comfort food',
    label: 'Comfort food',
    desc: 'Soup, warm broth, favorite light snack, or treat',
    icon: <Utensils className="w-4 h-4" />,
  },
  {
    id: 'Heating pad',
    label: 'Heating pad',
    desc: 'Electric heating pad or freshly warmed water bottle',
    icon: <Flame className="w-4 h-4" />,
  },
  {
    id: 'Rest',
    label: 'Rest',
    desc: 'Uninterrupted nap or laying down in cozy blankets',
    icon: <Moon className="w-4 h-4" />,
  },
  {
    id: 'Quiet environment',
    label: 'Quiet environment',
    desc: 'Dimmed lighting, low volume, calm surroundings',
    icon: <VolumeX className="w-4 h-4" />,
  },
  {
    id: 'Other',
    label: 'Other comfort item',
    desc: 'Specific remedy or personal routine',
    icon: <Sparkles className="w-4 h-4" />,
  },
];

const EMOTIONAL_SUPPORT_OPTIONS: { id: EmotionalSupportPref; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'Listen',
    label: 'Listen',
    desc: 'Let me vent or talk through things without judgment',
    icon: <Heart className="w-4 h-4" />,
  },
  {
    id: 'Reassure me',
    label: 'Reassure me',
    desc: 'Remind me that it is okay to rest and things will pass',
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    id: 'Distract me',
    label: 'Distract me',
    desc: 'Funny memes, watching a movie, or talking about random topics',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'Give advice',
    label: 'Give advice',
    desc: 'Offer gentle suggestions or problem-solving ideas',
    icon: <Compass className="w-4 h-4" />,
  },
  {
    id: 'Avoid advice',
    label: 'Avoid advice',
    desc: 'Please do not try to fix or diagnose, just be there',
    icon: <VolumeX className="w-4 h-4" />,
  },
  {
    id: 'Just stay with me',
    label: 'Just stay with me',
    desc: 'Silent supportive company, no performance needed',
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: 'Give me space',
    label: 'Give me space',
    desc: 'Allow me emotional quiet without needing to explain myself',
    icon: <Moon className="w-4 h-4" />,
  },
];

export const CareProfilePage: React.FC = () => {
  const {
    careProfile,
    saveCareProfile,
    resetCareProfile,
    partner,
    connection,
    navigateTo,
  } = useApp();

  // Local working state for seamless editing
  const [formData, setFormData] = useState<CareProfile>(careProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'card' | 'digest'>('card');

  // Keep local state synced if context updates from outside
  useEffect(() => {
    setFormData(careProfile);
    setHasUnsavedChanges(false);
  }, [careProfile]);

  // Track modification
  const markChanged = () => {
    setHasUnsavedChanges(true);
  };

  // Toggle helper for arrays
  const toggleArrayItem = <T extends string>(list: T[], item: T): T[] => {
    markChanged();
    return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
  };

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveCareProfile(formData);
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset handler
  const handleReset = async () => {
    if (window.confirm('Reset all Care Profile preferences back to default suggestions?')) {
      await resetCareProfile();
    }
  };

  // Partner display name
  const partnerName = partner?.name || 'Your Partner';
  const isConnected = connection.status === 'connected';

  // Dynamic preview text
  const partnerSummary = careProfileService.generatePartnerSummary(formData);

  return (
    <div id="care-profile-page" className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-200">
      {/* ================= HEADER SECTION ================= */}
      <section id="care-profile-header" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-300">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
                Your Care Profile
              </h1>
              <Badge variant="purple" size="sm" icon={<Sparkles className="w-3 h-3 text-amber-400" />}>
                Care DNA • Personal Blueprint
              </Badge>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Tell LunaLink how you want to be supported when you need it.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="md"
              type="button"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className={hasUnsavedChanges ? 'ring-2 ring-violet-400/50 shadow-lg shadow-violet-600/20' : ''}
            >
              {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
            </Button>
          </div>
        </div>

        {/* ================= PURPOSE & MEANING CARD ================= */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0E1528] to-[#121A30] border border-slate-800 flex items-start gap-3.5 text-slate-300">
          <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex-shrink-0 mt-0.5">
            <Heart className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
              About Care DNA
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Care DNA stores how you prefer to be supported. This is not simply a health-data page—its purpose is to translate your personal preferences into clear, compassionate, and actionable support for a trusted person.
            </p>
          </div>
        </div>
      </section>

      {/* ================= PRIVACY & SHARING SECTION ================= */}
      <section id="care-profile-privacy">
        <Card
          variant="default"
          padding="lg"
          className={`border transition-all ${
            formData.isSharedWithPartner
              ? 'border-violet-500/50 bg-[#0B1020]'
              : 'border-slate-800 bg-[#090E1A]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg border ${
                  formData.isSharedWithPartner
                    ? 'bg-violet-950/60 border-violet-500/40 text-violet-300'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                }`}>
                  {formData.isSharedWithPartner ? (
                    <Share2 className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </span>
                <h3 className="text-sm font-bold text-white font-display">
                  Privacy & Sharing Control
                </h3>
              </div>

              {/* Explicit privacy statement required */}
              <p className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                Your Care Profile is private by default.
              </p>

              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                {formData.isSharedWithPartner ? (
                  <>
                    Currently shared with <strong className="text-white font-medium">{partnerName}</strong>. They can view these preferences in their Shared Space to know exactly how to support you.
                  </>
                ) : (
                  <>
                    Only you can view these preferences. They will not be shared with anyone unless you choose to enable the switch below.
                  </>
                )}
              </p>
            </div>

            {/* Sharing toggle control */}
            <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  Share with my connected partner
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.isSharedWithPartner}
                  onClick={() => {
                    markChanged();
                    setFormData((prev) => ({
                      ...prev,
                      isSharedWithPartner: !prev.isSharedWithPartner,
                    }));
                  }}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.isSharedWithPartner ? 'bg-violet-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      formData.isSharedWithPartner ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>

              {!isConnected && formData.isSharedWithPartner && (
                <span className="text-[11px] text-amber-400/90 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Connect a partner in Connect Partner to deliver this.
                </span>
              )}
            </div>
          </div>
        </Card>
      </section>

      {/* ================= PREFERENCES SECTIONS GRID ================= */}
      <div className="space-y-8">
        {/* ================= 1. COMMUNICATION ================= */}
        <section id="section-communication" className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center text-xs font-bold font-mono">
                1
              </div>
              <h2 className="text-base font-bold text-white font-display">
                Communication
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Multiple selections allowed
            </span>
          </div>
          <p className="text-xs text-slate-400">
            How should someone reach out when you may be feeling unwell or low on energy?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {COMMUNICATION_OPTIONS.map((opt) => {
              const isSelected = formData.communication.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      communication: toggleArrayItem(prev.communication, opt.id),
                    }))
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-violet-950/30 border-violet-500 text-white shadow-md shadow-violet-950/40'
                      : 'bg-[#090E1A] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-violet-600/30 text-violet-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {opt.icon}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {opt.label}
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-violet-500 border-violet-400 text-white'
                        : 'border-slate-700 bg-slate-800'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= 2. PHYSICAL SUPPORT ================= */}
        <section id="section-physical-support" className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">
                2
              </div>
              <h2 className="text-base font-bold text-white font-display">
                Physical Support
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Select what feels comforting
            </span>
          </div>
          <p className="text-xs text-slate-400">
            What kind of physical proximity and assistance helps you feel cared for?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {PHYSICAL_SUPPORT_OPTIONS.map((opt) => {
              const isSelected = formData.physicalSupport.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      physicalSupport: toggleArrayItem(prev.physicalSupport, opt.id),
                    }))
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500 text-white shadow-md shadow-cyan-950/40'
                      : 'bg-[#090E1A] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-cyan-600/30 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {opt.icon}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {opt.label}
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 border-cyan-400 text-white'
                        : 'border-slate-700 bg-slate-800'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= 3. COMFORT ================= */}
        <section id="section-comfort" className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center text-xs font-bold font-mono">
                3
              </div>
              <h2 className="text-base font-bold text-white font-display">
                Comfort
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Selectable comfort preferences
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Small comforts and physical items that bring tangible relief and ease:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
            {COMFORT_OPTIONS.map((opt) => {
              const isSelected = formData.comfort.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      comfort: toggleArrayItem(prev.comfort, opt.id),
                    }))
                  }
                  className={`p-3 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center gap-2 group ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500 text-white shadow-md shadow-amber-950/40 ring-1 ring-amber-400/40'
                      : 'bg-[#090E1A] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {opt.icon}
                  </div>
                  <span className="text-xs font-semibold leading-tight">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom "Other" Input if Other is selected */}
          {formData.comfort.includes('Other') && (
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-amber-500/30 space-y-1.5 animate-in fade-in">
              <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Describe your other comfort essentials:
              </label>
              <input
                type="text"
                placeholder="e.g. Weighted blanket, fresh cold fruit, lavender essential oil roll-on"
                value={formData.otherComfortDetail || ''}
                onChange={(e) => {
                  markChanged();
                  setFormData((prev) => ({
                    ...prev,
                    otherComfortDetail: e.target.value,
                  }));
                }}
                className="w-full px-3.5 py-2 rounded-xl bg-[#090E1A] border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          )}
        </section>

        {/* ================= 4. EMOTIONAL SUPPORT ================= */}
        <section id="section-emotional-support" className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center text-xs font-bold font-mono">
                4
              </div>
              <h2 className="text-base font-bold text-white font-display">
                Emotional Support
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Choose your emotional stance
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Help your partner understand what kind of emotional presence feels supportive:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {EMOTIONAL_SUPPORT_OPTIONS.map((opt) => {
              const isSelected = formData.emotionalSupport.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      emotionalSupport: toggleArrayItem(prev.emotionalSupport, opt.id),
                    }))
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-rose-950/30 border-rose-500 text-white shadow-md shadow-rose-950/40'
                      : 'bg-[#090E1A] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-rose-600/30 text-rose-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {opt.icon}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {opt.label}
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-rose-500 border-rose-400 text-white'
                        : 'border-slate-700 bg-slate-800'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= 5. IMPORTANT NOTES ================= */}
        <section id="section-important-notes" className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                5
              </div>
              <h2 className="text-base font-bold text-white font-display">
                Important Notes
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Personal nuances & boundaries
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">
              Anything else you want someone supporting you to know?
            </label>
            <textarea
              rows={4}
              placeholder="e.g. When I have intense headaches, bright lights and loud sounds are painful. A warm cup of tea left by the bedside without pressure to chat is the sweetest gesture."
              value={formData.importantNotes}
              onChange={(e) => {
                markChanged();
                setFormData((prev) => ({
                  ...prev,
                  importantNotes: e.target.value,
                }));
              }}
              className="w-full px-4 py-3 rounded-2xl bg-[#090E1A] border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 leading-relaxed resize-none placeholder-slate-500 shadow-inner"
            />
            <p className="text-[11px] text-slate-400">
              Share any specifics like food allergies, favorite soothing playlists, or triggers to avoid.
            </p>
          </div>
        </section>
      </div>

      {/* ================= PREVIEW SECTION: HOW YOUR PARTNER MAY SEE THIS ================= */}
      <section id="care-profile-partner-preview" className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-violet-400" />
              <h2 className="text-lg font-bold text-white font-display">
                How your partner may see this
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Here is how LunaLink formats your Care Profile into clear, actionable care guidance for {partnerName}:
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 select-none self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActivePreviewTab('card')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activePreviewTab === 'card'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Actionable Guide Card
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('digest')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activePreviewTab === 'digest'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Short Text Digest
            </button>
          </div>
        </div>

        {/* Live Partner Preview Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0C1222] via-[#0E172A] to-[#0A0F1D] border border-violet-500/30 shadow-xl shadow-black/50 space-y-5">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-rose-500 flex items-center justify-center text-white font-bold shadow-md shadow-violet-500/30">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display">
                  Support Guide & Care DNA
                </h3>
                <p className="text-[11px] text-slate-400">
                  Curated by you • Prepared for {partnerName}
                </p>
              </div>
            </div>

            {/* Sharing pill */}
            <div>
              {formData.isSharedWithPartner ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active in Shared Space
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                  <Lock className="w-3 h-3" />
                  Private preview (Not yet shared)
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Actionable Quote (Example requirement from prompt) */}
          <div className="p-4 rounded-xl bg-violet-950/25 border border-violet-500/30 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Actionable Partner Summary
            </span>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed italic">
              "{partnerSummary}"
            </p>
          </div>

          {activePreviewTab === 'card' ? (
            /* Detailed Card breakdown */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {/* Communication */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider block flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Reach Out Via
                </span>
                {formData.communication && formData.communication.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {formData.communication.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded-md bg-violet-950/40 border border-violet-500/30 text-violet-200 text-xs font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">No preference set</span>
                )}
              </div>

              {/* Physical Support */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" />
                  Physical Presence
                </span>
                {formData.physicalSupport && formData.physicalSupport.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {formData.physicalSupport.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">No preference set</span>
                )}
              </div>

              {/* Comfort Essentials */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5" />
                  Comfort Essentials
                </span>
                {formData.comfort && formData.comfort.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {formData.comfort.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs font-medium"
                      >
                        {item}
                      </span>
                    ))}
                    {formData.otherComfortDetail && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs italic">
                        {formData.otherComfortDetail}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">No preference set</span>
                )}
              </div>

              {/* Emotional Support */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  Emotional Approach
                </span>
                {formData.emotionalSupport && formData.emotionalSupport.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {formData.emotionalSupport.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded-md bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">No preference set</span>
                )}
              </div>
            </div>
          ) : (
            /* Digest view */
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong className="text-white">Communication:</strong>{' '}
                {formData.communication.join(', ') || 'No preference'}
              </p>
              <p>
                <strong className="text-white">Physical support:</strong>{' '}
                {formData.physicalSupport.join(', ') || 'No preference'}
              </p>
              <p>
                <strong className="text-white">Comforts to offer:</strong>{' '}
                {formData.comfort.join(', ')}
                {formData.otherComfortDetail ? ` (${formData.otherComfortDetail})` : ''}
              </p>
              <p>
                <strong className="text-white">Emotional posture:</strong>{' '}
                {formData.emotionalSupport.join(', ') || 'No preference'}
              </p>
            </div>
          )}

          {/* Notes display in preview */}
          {formData.importantNotes && (
            <div className="p-3.5 rounded-xl bg-[#090E1A] border border-slate-800/90 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Personal Note from You
              </span>
              <p className="italic text-slate-200 leading-relaxed whitespace-pre-wrap">
                "{formData.importantNotes}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================= PERSISTENT BOTTOM SAVE DOCK ================= */}
      <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-[#0B1020]/95 backdrop-blur-md border border-slate-800 shadow-2xl shadow-black flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges ? (
            <span className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              You have unsaved changes
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Preferences up to date
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => {
              setFormData(careProfile);
              setHasUnsavedChanges(false);
            }}
            disabled={!hasUnsavedChanges || isSaving}
          >
            Discard
          </Button>
          <Button
            variant="primary"
            size="md"
            type="button"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};
