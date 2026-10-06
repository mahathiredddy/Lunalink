import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supportInsightsService } from '../services/supportInsightsService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Activity,
  HeartHandshake,
  Bell,
  BellOff,
  Eye,
  Lock,
  ArrowRight,
  Info,
  Clock,
  CheckCircle2,
  RefreshCw,
  Coffee,
  Sliders,
} from 'lucide-react';
import { DemoScenarioBar } from '../components/demo/DemoScenarioBar';
import { PartnerNotificationPreviewCard } from '../components/notifications/PartnerNotificationPreviewCard';

export const SupportInsightsPage: React.FC = () => {
  const {
    cycles,
    symptoms,
    careProfile,
    cycleStats,
    connection,
    partner,
    healthPermissions,
    supportNotifSettings,
    enableSupportNotifications,
    disableSupportNotifications,
    updateSupportNotifSettings,
    navigateTo,
    showToast,
  } = useApp();

  // State for "Why am I seeing this?" accordion
  const [whyExpanded, setWhyExpanded] = useState<boolean>(true);

  // Allow toggling between realistic pattern history and insufficient history demo
  const [forceInsufficient, setForceInsufficient] = useState<boolean>(false);

  // Generate the insight using the cautious estimation service
  const insight = supportInsightsService.generateInsight(
    cycles,
    symptoms,
    careProfile,
    cycleStats,
    forceInsufficient
  );

  const isPartnerConnected = connection.status === 'connected' && !!partner;
  const isSharingAllowed = isPartnerConnected && healthPermissions.careProfile;

  const handleTestPartnerPreview = () => {
    if (!isPartnerConnected) {
      showToast('Connect a partner first to preview notifications.', 'info');
      return;
    }
    showToast(`Test preview sent to ${partner?.name}: "${insight.partnerMessagePreview}"`, 'success');
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
                Support Insights
              </h1>
              <p className="text-sm text-slate-300 mt-0.5">
                Personalized insights based on your LunaLink history.
              </p>
            </div>
          </div>
        </div>

        {/* Top Actions: History Simulation Toggle & Privacy Indicator */}
        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setForceInsufficient((prev) => !prev)}
            title="Toggle between standard logged history and new account confidence preview"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-violet-400" />
            <span>Mode: {forceInsufficient ? 'Low History (Demo)' : 'Normal History'}</span>
          </button>

          <Badge variant="shared" size="sm" icon={<Lock className="w-3 h-3 text-emerald-400" />}>
            Consent-Based
          </Badge>
        </div>
      </header>

      {/* ================= LUNALINK DEMO MODE BAR ================= */}
      <DemoScenarioBar />

      {/* ================= MANDATORY MEDICAL DISCLAIMER BANNER ================= */}
      <section id="support-insights-disclaimer">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 text-slate-300 text-xs flex items-start gap-3 shadow-sm">
          <Info className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">Non-Medical Support Estimations</p>
            <p className="text-slate-300 leading-relaxed">
              Support Insights is designed solely to help identify potential timeframes where gentle partner assistance or personal comfort measures <span className="text-violet-300 font-medium">may</span> be helpful based on your past logged patterns. This is <span className="underline decoration-slate-600">not</span> a medical diagnosis, <span className="underline decoration-slate-600">not</span> a guarantee, and <span className="underline decoration-slate-600">not</span> a medical prediction.
            </p>
          </div>
        </div>
      </section>

      {/* ================= PRIMARY INSIGHT CARD ================= */}
      <section id="support-insights-main-card">
        {insight.confidence === 'insufficient' ? (
          /* ----- INSUFFICIENT HISTORY STATE ----- */
          <Card
            variant="default"
            padding="lg"
            className="border-slate-800 bg-gradient-to-br from-[#0F1526] to-[#0A0D18] relative overflow-hidden"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary" size="md" icon={<Clock className="w-3.5 h-3.5 text-amber-400" />}>
                  Pattern Confidence: Building
                </Badge>
                <span className="text-xs text-slate-300">0–1 cycles recorded</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Not enough history yet
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Keep using LunaLink to help build your personal pattern history. We never pretend certainty or guess without sufficient personal logs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  How LunaLink calculates support windows:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-violet-400" />
                      Cycle Intervals
                    </span>
                    <p className="text-slate-300">Records 2–3 regular cycle start dates to estimate natural rhythms.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-400" />
                      Symptom History
                    </span>
                    <p className="text-slate-300">Logs how you felt in previous cycles to identify higher-need days.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                      Care DNA
                    </span>
                    <p className="text-slate-300">Uses your saved comfort preferences to tailor gentle support ideas.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigateTo('cycle-calendar')}
                  leftIcon={<Calendar className="w-4 h-4" />}
                >
                  Log Menstrual Cycle
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigateTo('symptoms-pain')}
                  leftIcon={<Activity className="w-4 h-4" />}
                >
                  Log Daily Symptoms
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          /* ----- ACTIVE INSIGHT CARD (CONFIDENCE: SUFFICIENT / MODERATE) ----- */
          <Card
            variant="default"
            padding="lg"
            className="border-violet-500/40 bg-gradient-to-br from-[#121428] via-[#0E1120] to-[#0A0D18] relative overflow-hidden shadow-xl shadow-violet-950/20"
          >
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative space-y-6">
              {/* Header tags: Confidence level & Estimated window */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="md" icon={<Sparkles className="w-3.5 h-3.5 text-violet-300" />}>
                    Support Window Estimate
                  </Badge>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-violet-950/60 border border-violet-500/30 text-violet-300 font-medium">
                    Estimated in ~{insight.estimatedWindow.daysUntil} days
                  </span>
                </div>

                <div className="text-xs text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{insight.confidenceMessage}</span>
                </div>
              </div>

              {/* Main Headline & Supporting Explanation */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
                  {insight.headline}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                  {insight.supportingExplanation}
                </p>
              </div>

              {/* Estimated Window Details Pill Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 text-xs">
                <div>
                  <span className="text-slate-300 text-[11px] block">Estimated Window</span>
                  <span className="font-semibold text-white font-mono mt-0.5 block">
                    {insight.estimatedWindow.startDate} to {insight.estimatedWindow.endDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-300 text-[11px] block">Estimated Cycle Day</span>
                  <span className="font-semibold text-violet-300 font-mono mt-0.5 block">
                    Approx. Day {insight.estimatedWindow.cycleDayEstimate}–28 of 28
                  </span>
                </div>
                <div>
                  <span className="text-slate-300 text-[11px] block">Saved Comfort Essentials</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                    {insight.suggestedComfortItems.join(', ')}
                  </span>
                </div>
              </div>

              {/* ================= "WHY AM I SEEING THIS?" EXPANDABLE ACCORDION ================= */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setWhyExpanded((prev) => !prev)}
                  className="w-full flex items-center justify-between text-left py-2 text-sm font-semibold text-violet-300 hover:text-violet-200 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-violet-400" />
                    <span>Why am I seeing this?</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-200">
                    <span>{whyExpanded ? 'Hide explanation' : 'Show details'}</span>
                    {whyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {whyExpanded && (
                  <div className="mt-3 space-y-4 pt-1 animate-fadeIn">
                    <p className="text-xs text-slate-300">
                      This insight is synthesized cautiously from three private data pillars in your LunaLink vault:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {/* Factor 1: Previous cycle patterns */}
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-violet-300">
                          <Calendar className="w-4 h-4 text-violet-400" />
                          <span>1. Previous Cycle Patterns</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                          {insight.factors.cyclePatterns.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Factor 2: Previous symptom history */}
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                          <Activity className="w-4 h-4 text-rose-400" />
                          <span>2. Previous Symptom History</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                          {insight.factors.symptomPatterns.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Factor 3: User's support preferences */}
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                          <HeartHandshake className="w-4 h-4 text-emerald-400" />
                          <span>3. User's Support Preferences</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                          {insight.factors.carePreferences.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Strict Raw Data Privacy Protection Callout */}
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 flex items-start gap-2.5">
                      <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p>
                        <strong className="text-white font-semibold">Privacy Protection:</strong> We do <strong className="text-emerald-300">NOT</strong> expose raw health data, detailed medical logs, or intimate pain ratings to your partner. Any communication sent to your partner consists strictly of generalized, respectful care suggestions that you have consented to.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </section>

      {/* ================= PARTNER PREPARATION & NOTIFICATIONS ================= */}
      <section id="support-insights-partner-prep" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Partner Preparation
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Choose whether to give your trusted partner advance notice so they can prepare thoughtful support.
            </p>
          </div>

          {supportNotifSettings.enabled ? (
            <Badge variant="primary" size="md" icon={<Bell className="w-3.5 h-3.5 text-violet-300" />}>
              Notifications Active
            </Badge>
          ) : (
            <Badge variant="secondary" size="md" icon={<BellOff className="w-3.5 h-3.5 text-slate-400" />}>
              Notifications Off
            </Badge>
          )}
        </div>

        <Card variant="default" padding="lg" className="border-slate-800 space-y-6">
          {/* Connection Status Checker */}
          {!isPartnerConnected ? (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">No Partner Connected</p>
                <p className="text-xs text-slate-300">
                  Connect with a trusted person to share supportive preparation prompts. Until connected, all insights remain strictly private to you.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigateTo('connect-partner')}
                leftIcon={<HeartHandshake className="w-4 h-4" />}
              >
                Connect Partner
              </Button>
            </div>
          ) : !isSharingAllowed ? (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-200">Partner Sharing Disabled</p>
                <p className="text-xs text-slate-300">
                  You are connected with {partner?.name}, but Care Profile & Support sharing is currently switched off in your Privacy Settings.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigateTo('privacy-sharing')}
                leftIcon={<Lock className="w-4 h-4 text-amber-400" />}
              >
                Adjust Privacy Permissions
              </Button>
            </div>
          ) : (
            /* Connected & Sharing Allowed */
            <div className="space-y-6">
              {/* Partner Notification Preview Card (Interactive Prototype Component) */}
              <PartnerNotificationPreviewCard />

              {/* Toggle Controls: Enable / Disable support notifications */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white">
                    Advance Support Notifications
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xl">
                    When enabled, LunaLink delivers this gentle notice to {partner?.name} 1 day before an estimated higher-support window. All predictive support remains strictly consent-based.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {supportNotifSettings.enabled ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={disableSupportNotifications}
                      leftIcon={<BellOff className="w-4 h-4" />}
                    >
                      Disable support notifications
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={enableSupportNotifications}
                      leftIcon={<Bell className="w-4 h-4" />}
                    >
                      Enable support notifications
                    </Button>
                  )}
                </div>
              </div>

              {/* Advance notice timing option */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Notification Timing Lead:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateSupportNotifSettings({ leadTimeDays: 1 })}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      supportNotifSettings.leadTimeDays === 1
                        ? 'bg-violet-600/20 border-violet-500/40 text-violet-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    1 Day in Advance
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSupportNotifSettings({ leadTimeDays: 2 })}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      supportNotifSettings.leadTimeDays === 2
                        ? 'bg-violet-600/20 border-violet-500/40 text-violet-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    2 Days in Advance
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* ================= ETHICAL LANGUAGE & CONSENT PRINCIPLES ================= */}
      <section id="support-insights-principles">
        <Card variant="subtle" padding="md" className="border-slate-800/80 bg-slate-950/40">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              LunaLink Ethical Support Guarantees
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 space-y-1">
                <span className="font-semibold text-rose-300 block">Strictly Forbidden Clinical Claims</span>
                <p className="text-slate-400 leading-relaxed">
                  LunaLink will never say: <span className="text-rose-400">"You will have severe pain"</span>, <span className="text-rose-400">"You will have a difficult period"</span>, <span className="text-rose-400">"You have PCOS"</span>, or <span className="text-rose-400">"You need medical treatment"</span>.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 space-y-1">
                <span className="font-semibold text-emerald-300 block">Cautious Language Standards</span>
                <p className="text-slate-400 leading-relaxed">
                  We strictly employ probabilistic terms like <span className="text-emerald-400">"may"</span>, <span className="text-emerald-400">"estimated"</span>, and <span className="text-emerald-400">"based on your previous patterns"</span>.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ================= QUICK LINKS ================= */}
      <section id="support-insights-navigation-links" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => navigateTo('care-profile')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-violet-500/40 text-left transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white group-hover:text-violet-300">Care Profile</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-xs text-slate-300 mt-1">Refine your comfort essentials & communication styles.</p>
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
          <p className="text-xs text-slate-300 mt-1">Turn on real-time guidance if you need immediate support.</p>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('symptoms-pain')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-violet-500/40 text-left transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white group-hover:text-violet-300">Symptom Log</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-xs text-slate-300 mt-1">Record daily physical comfort and mood patterns.</p>
        </button>
      </section>
    </div>
  );
};
