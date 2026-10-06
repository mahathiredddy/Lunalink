import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { careSuggestionsService } from '../services/careSuggestionsService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  HeartHandshake,
  Lock,
  Eye,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Coffee,
  Moon,
  PhoneOff,
  Sliders,
  Copy,
  Check,
  ShieldCheck,
  Info,
  ArrowRight,
  UserCheck,
  Heart,
  ExternalLink,
  RefreshCw,
  Clock,
  Power,
} from 'lucide-react';
import { AIWordingTone, CareSuggestion } from '../types';

export const CareSuggestionsPage: React.FC = () => {
  const {
    careProfile,
    healthPermissions,
    careMode,
    partner,
    connection,
    navigateTo,
    showToast,
  } = useApp();

  // Active view: 'user_view' or 'partner_view' (What my partner may see)
  const [activeTab, setActiveTab] = useState<'user_view' | 'partner_view'>('partner_view');

  // AI Wording Tone setting
  const [selectedTone, setSelectedTone] = useState<AIWordingTone>('gentle');

  // Expanded state for "Why this suggestion?" accordions
  const [expandedWhy, setExpandedWhy] = useState<Record<string, boolean>>({
    sugg_quiet_checkin: true,
    sugg_comfort_item: true,
  });

  // Copied message feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isPartnerConnected = connection.status === 'connected' && !!partner;

  // Generate suggestions using our rule-based safety engine & AI wording service
  const allSuggestions = careSuggestionsService.generateSuggestions(
    careProfile,
    healthPermissions,
    careMode,
    selectedTone
  );

  const partnerPermittedData = careSuggestionsService.getPartnerPermittedSuggestions(
    careProfile,
    healthPermissions,
    careMode,
    selectedTone
  );

  const toggleWhy = (id: string) => {
    setExpandedWhy((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyMessage = (id: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Sample message copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getCategoryIcon = (category: CareSuggestion['category']) => {
    switch (category) {
      case 'communication':
        return <MessageCircle className="w-4 h-4 text-violet-400" />;
      case 'comfort':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'space':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'timing':
        return <PhoneOff className="w-4 h-4 text-rose-400" />;
      case 'daily_support':
        return <Power className="w-4 h-4 text-rose-400" />;
      default:
        return <Heart className="w-4 h-4 text-violet-400" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-16">
      {/* ================= PAGE HEADER ================= */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
                Care Suggestions
              </h1>
              <p className="text-sm text-slate-300 mt-0.5">
                Small ways to make support feel more personal.
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('partner_view')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'partner_view'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>What my partner may see</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('user_view')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'user_view'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>My Full Controls</span>
          </button>
        </div>
      </header>

      {/* ================= MANDATORY MEDICAL DISCLAIMER ================= */}
      <section id="care-suggestions-disclaimer">
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90 text-slate-300 text-xs flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-violet-400 flex-shrink-0" />
            <p className="text-slate-300">
              <strong className="text-slate-200 font-semibold">Important notice:</strong> Suggestions are personalized guidance, not medical advice.
            </p>
          </div>
          <Badge variant="shared" size="sm" icon={<Lock className="w-3 h-3 text-emerald-400" />}>
            Rule-Based Privacy
          </Badge>
        </div>
      </section>

      {/* ================= AI WORDING & PERSONALIZATION CONTROLS (VISIBLE ON BOTH VIEWS) ================= */}
      <section id="ai-wording-personalization-bar">
        <Card variant="default" padding="sm" className="border-slate-800 bg-slate-950/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-white">AI Wording Tone:</span>
              <span className="text-[11px] text-slate-400 hidden md:inline">
                (Tailors language for warmth and clarity)
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(
                [
                  { id: 'gentle', label: 'Gentle', desc: 'Low-pressure & considerate' },
                  { id: 'warm', label: 'Warm', desc: 'Affectionate & loving' },
                  { id: 'practical', label: 'Practical', desc: 'Direct & action-first' },
                  { id: 'minimal', label: 'Minimal', desc: 'Concise bullet points' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTone(t.id)}
                  title={t.desc}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    selectedTone === t.id
                      ? 'bg-violet-600/30 border border-violet-500/50 text-violet-200'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* ================= TAB 1: PARTNER-FACING VIEW ("What my partner may see") ================= */}
      {activeTab === 'partner_view' && (
        <section id="partner-view-content" className="space-y-6">
          {/* Partner View Context Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/30 via-slate-900/90 to-[#0C1120] border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white font-display">
                  Partner-Facing Preview
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300">
                  Active Filter
                </span>
              </div>
              <p className="text-xs text-slate-300">
                This exact view is what {partner ? partner.name : 'your partner'} sees. It includes <strong className="text-white font-medium">ONLY</strong> information you have explicitly permitted via privacy rules.
              </p>
            </div>

            <Button
              variant="subtle"
              size="sm"
              onClick={() => navigateTo('privacy-sharing')}
              leftIcon={<Lock className="w-3.5 h-3.5 text-emerald-400" />}
            >
              Privacy Settings
            </Button>
          </div>

          {/* Core Partner Guidance Header */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight flex items-center gap-2.5">
              <HeartHandshake className="w-6 h-6 text-violet-400" />
              How you can support her
            </h2>
            <p className="text-sm text-slate-300">
              Based on her Care Profile, she may appreciate:
            </p>
          </div>

          {/* Rule-Based Permission Gate */}
          {!partnerPermittedData.hasCareProfilePermission ? (
            /* User has disabled Care Profile sharing in Privacy Settings */
            <Card variant="default" padding="lg" className="border-amber-500/30 bg-amber-950/15 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-900/30 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-semibold text-white font-display">
                  Care Profile Sharing is Paused
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You have chosen to keep your Care Profile private in your Privacy Settings. Because safety-critical permissions are strictly rule-based, your partner will see gentle generic presence suggestions instead.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigateTo('privacy-sharing')}
                leftIcon={<Lock className="w-4 h-4 text-amber-400" />}
              >
                Enable Care Profile Sharing
              </Button>
            </Card>
          ) : (
            /* Render strictly permitted items */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partnerPermittedData.permitted.map((sugg) => {
                const isExpanded = Boolean(expandedWhy[sugg.id]);
                const isCopied = copiedId === sugg.id;

                return (
                  <Card
                    key={sugg.id}
                    variant="default"
                    padding="md"
                    className="border-slate-800 bg-[#0E1322] hover:border-slate-700/80 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      {/* Top Bar: Icon, Title & Category */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0">
                            {getCategoryIcon(sugg.category)}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-white font-display">
                              {sugg.title}
                            </h3>
                            <span className="text-[11px] text-slate-400 capitalize">
                              {sugg.category.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <Badge variant="shared" size="sm" icon={<Lock className="w-2.5 h-2.5 text-emerald-400" />}>
                          Permitted
                        </Badge>
                      </div>

                      {/* Main Suggestion Text */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {sugg.description}
                      </p>

                      {/* Actionable Partner Tip Box */}
                      <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5">
                        <span className="text-[11px] font-semibold text-violet-300 flex items-center gap-1.5 uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                          Recommended Step:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {sugg.partnerActionItem}
                        </p>
                      </div>

                      {/* Optional Sample Message */}
                      {sugg.sampleMessage && (
                        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                          <span className="text-slate-300 italic truncate">
                            "{sugg.sampleMessage}"
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(sugg.id, sugg.sampleMessage)}
                            title="Copy sample message"
                            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0 text-[11px]"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-300">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* ================= "WHY THIS SUGGESTION?" EXPANDABLE ================= */}
                      <div className="border-t border-slate-800/80 pt-2.5">
                        <button
                          type="button"
                          onClick={() => toggleWhy(sugg.id)}
                          className="w-full flex items-center justify-between text-left py-1 text-xs font-semibold text-violet-300 hover:text-violet-200 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
                            <span>Why this suggestion?</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-slate-200">
                            <span>{isExpanded ? 'Hide' : 'Explain'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="mt-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 leading-relaxed animate-fadeIn">
                            <p>{sugg.whyThisSuggestion}</p>
                            <p className="text-[10px] text-emerald-400/80 mt-1.5 flex items-center gap-1 font-mono">
                              <Lock className="w-3 h-3" />
                              Rule-Based Check: Safe from raw health or pain metric leaks
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ================= TAB 2: USER FULL CONTROLS & AUDIT VIEW ================= */}
      {activeTab === 'user_view' && (
        <section id="user-controls-content" className="space-y-6">
          {/* Privacy & Permission Status Card */}
          <Card variant="default" padding="md" className="border-slate-800 bg-slate-950/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white font-display">
                    Rule-Based Safety Controls
                  </h3>
                  <Badge variant="shared" size="sm">
                    {healthPermissions.careProfile ? 'Care Profile Shared' : 'Care Profile Private'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300">
                  AI suggestions never override your sharing permissions. If you turn off Care Profile sharing, your partner sees zero preference-derived suggestions.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigateTo('care-profile')}
                  leftIcon={<HeartHandshake className="w-3.5 h-3.5" />}
                >
                  Edit Care Profile
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigateTo('privacy-sharing')}
                  leftIcon={<Lock className="w-3.5 h-3.5" />}
                >
                  Privacy Rules
                </Button>
              </div>
            </div>
          </Card>

          {/* List of all generated suggestions with user audit info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-display">
                All Synthesized Suggestions ({allSuggestions.length})
              </h3>
              <span className="text-xs text-slate-400">
                {partnerPermittedData.permitted.length} visible to partner • {partnerPermittedData.hiddenCount} hidden
              </span>
            </div>

            <div className="space-y-3">
              {allSuggestions.map((sugg) => (
                <div
                  key={sugg.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex-shrink-0 mt-0.5">
                      {getCategoryIcon(sugg.category)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-white">{sugg.title}</h4>
                        {sugg.isPermitted ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                            Visible to Partner
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
                            Blocked by Privacy Setting
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {sugg.sourceFactor}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{sugg.description}</p>
                      <p className="text-[11px] text-slate-400 pt-0.5">
                        <strong className="text-violet-300 font-medium">Why: </strong>
                        {sugg.whyThisSuggestion}
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center flex-shrink-0">
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => setActiveTab('partner_view')}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Preview Partner View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= BOTTOM GUIDANCE PRINCIPLES ================= */}
      <section id="care-suggestions-principles">
        <Card variant="subtle" padding="md" className="border-slate-800/80 bg-slate-950/40">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              LunaLink AI Ethics & Safety Boundaries
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 space-y-1">
                <span className="font-semibold text-white block">Rule-Based Overrides</span>
                <p className="text-slate-400 leading-relaxed">
                  Permissions and safety guards are deterministic code rules. The AI cannot share anything you have disabled in your privacy settings.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 space-y-1">
                <span className="font-semibold text-white block">No Raw Medical Data</span>
                <p className="text-slate-400 leading-relaxed">
                  Your partner never sees cycle day numbers, flow amounts, or pain ratings. Only gentle, actionable behavioral guidance is shared.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 space-y-1">
                <span className="font-semibold text-white block">Personalized Wording</span>
                <p className="text-slate-400 leading-relaxed">
                  The AI focuses on wording and explanation so support feels natural, empathetic, and uniquely aligned with your Care DNA.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ================= QUICK LINKS ================= */}
      <section id="care-suggestions-navigation" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => navigateTo('care-profile')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-violet-500/40 text-left transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white group-hover:text-violet-300">Care Profile</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-xs text-slate-300 mt-1">Update comfort items, communication, and physical support needs.</p>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('care-mode')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/40 text-left transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white group-hover:text-rose-300">Care Mode</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-xs text-slate-300 mt-1">Activate real-time support status with a single tap.</p>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('support-insights')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-violet-500/40 text-left transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white group-hover:text-violet-300">Support Insights</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-xs text-slate-300 mt-1">View historical pattern-based support windows.</p>
        </button>
      </section>
    </div>
  );
};
