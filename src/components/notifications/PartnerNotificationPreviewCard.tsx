import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Heart,
  ChevronDown,
  ChevronUp,
  Check,
  Info,
  Clock,
  Lock,
  User,
  AlertCircle,
} from 'lucide-react';

export const PartnerNotificationPreviewCard: React.FC = () => {
  const {
    user,
    partner,
    partnerSupportNotification,
    supportInsightCalculation,
    hasSufficientHistory,
    demoScenario,
    toggleNotificationSharingEnabled,
  } = useApp();

  const [isFactorsExpanded, setIsFactorsExpanded] = useState<boolean>(true);

  const isSharingEnabled = Boolean(user.notificationSharingEnabled);
  const partnerName = partner?.name || 'Elena';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Simulation Info Badge */}
      <div className="flex items-center justify-between gap-3 text-xs bg-violet-950/30 border border-violet-500/20 px-4 py-2.5 rounded-xl">
        <div className="flex items-center gap-2 text-violet-200">
          <User className="w-3.5 h-3.5 text-violet-400" />
          <span>Viewing as Connected Partner: <strong>{partnerName}</strong></span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          Recipient: Connected Trusted Person
        </span>
      </div>

      {/* STATE 1: PERMISSION DISABLED (Default: OFF) */}
      {!isSharingEnabled && (
        <Card
          variant="outline"
          padding="lg"
          className="border-amber-500/40 bg-gradient-to-b from-[#16120D] to-[#0E0C09] text-center space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-300">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white font-display">
              Support Notifications Disabled by User
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Her privacy is strictly protected; no notification is delivered. Proactive partner support alerts are <strong>OFF by default</strong> and require her explicit consent.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 text-left space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strict Privacy Protection Active</span>
            </div>
            <p>
              Under LunaLink safety protocols, raw health data, private notes, and cycle history are never shared without deliberate permission.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleNotificationSharingEnabled(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-900/30 transition-all cursor-pointer"
          >
            Enable Partner Notifications for Demo
          </button>
        </Card>
      )}

      {/* STATE 2: INSUFFICIENT CYCLE HISTORY */}
      {isSharingEnabled && !hasSufficientHistory && (
        <Card
          variant="outline"
          padding="lg"
          className="border-slate-800 bg-[#0C101F] text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-300">
            <AlertCircle className="w-6 h-6 text-slate-400" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white font-display">
              Not enough cycle history yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              LunaLink pauses predictive partner notifications until at least 2 cycles have been recorded. Keep recording cycles to help LunaLink understand personal patterns.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-[11px] text-slate-400 text-left">
            <span className="font-semibold text-slate-300 block mb-1">
              Why does LunaLink require this?
            </span>
            <p>
              To prevent ungrounded or misleading alerts, partner notifications remain paused until a personal rhythm is established through at least two recorded cycles.
            </p>
          </div>
        </Card>
      )}

      {/* STATE 3: ACTIVE PARTNER NOTIFICATION CARD (Strict format per requirements) */}
      {isSharingEnabled && hasSufficientHistory && partnerSupportNotification && (
        <div className="rounded-3xl border border-violet-500/30 bg-[#0B0F1F] p-6 sm:p-8 shadow-2xl shadow-violet-950/40 relative overflow-hidden space-y-6">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2 text-violet-300">
              <span className="text-base">🌙</span>
              <span className="text-sm font-semibold tracking-wide font-display text-white">
                LunaLink
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="shared" size="sm">
                Partner Support Alert
              </Badge>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {partnerSupportNotification.timestamp}
              </span>
            </div>
          </div>

          {/* Title & Message */}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold text-white font-display leading-snug">
              {partnerSupportNotification.title.replace('🌙 ', '')}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {partnerSupportNotification.message}
            </p>
          </div>

          {/* How you can support her */}
          {partnerSupportNotification.careSuggestions && partnerSupportNotification.careSuggestions.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-violet-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>How you can support her:</span>
              </h4>

              <div className="space-y-2">
                {partnerSupportNotification.careSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-200"
                  >
                    <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why am I seeing this? */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setIsFactorsExpanded(!isFactorsExpanded)}
              className="w-full flex items-center justify-between text-left py-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-violet-400" />
                Why am I seeing this?
              </span>
              {isFactorsExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isFactorsExpanded && (
              <div className="mt-3 p-3.5 rounded-xl bg-[#080B17] border border-slate-800 text-xs space-y-2.5 animate-in fade-in-50">
                <p className="text-slate-300 leading-relaxed">
                  {partnerSupportNotification.reason}
                </p>

                {/* Factors Used Breakdown */}
                {partnerSupportNotification.factors && partnerSupportNotification.factors.length > 0 && (
                  <div className="pt-1.5 space-y-1.5 border-t border-slate-800/60">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Factors considered:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-400">
                      {partnerSupportNotification.factors.map((factor, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-violet-400" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Non-Medical Disclaimer */}
                <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                  {partnerSupportNotification.disclaimer}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
