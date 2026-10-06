import React from 'react';
import { useApp } from '../../context/AppContext';
import { DemoScenario } from '../../types';
import {
  Sparkles,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Calendar,
  Clock,
  CheckCircle2,
  Info,
  Layers,
} from 'lucide-react';

export const DemoScenarioBar: React.FC = () => {
  const {
    demoScenario,
    setDemoScenario,
    user,
    toggleNotificationSharingEnabled,
    toggleShareCycleSupportInsights,
    hasSufficientHistory,
  } = useApp();

  const scenarios: { id: DemoScenario; label: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'normal',
      label: 'Live Data',
      description: 'Uses real recorded cycles and symptoms',
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: 'two_days_before',
      label: '2 Days Before',
      description: 'Simulates estimated period in 48 hours',
      icon: <Clock className="w-3.5 h-3.5 text-sky-400" />,
    },
    {
      id: 'estimated_period_day',
      label: 'Estimated Day',
      description: 'Simulates estimated period arrival day',
      icon: <Calendar className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      id: 'day_1',
      label: 'Day 1 of Cycle',
      description: 'Simulates Day 1 period onset',
      icon: <Heart className="w-3.5 h-3.5 text-rose-400" />,
    },
    {
      id: 'high_day_1_pain',
      label: 'High Day 1 Pain',
      description: 'Day 1 + historical discomfort patterns',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />,
    },
    {
      id: 'insufficient_history',
      label: 'Insufficient History',
      description: 'Simulates <2 recorded cycles',
      icon: <Info className="w-3.5 h-3.5 text-slate-400" />,
    },
    {
      id: 'care_mode_active',
      label: 'Care Mode Active',
      description: 'Simulates user-activated Care Mode',
      icon: <Sparkles className="w-3.5 h-3.5 text-violet-400" />,
    },
  ];

  return (
    <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-br from-[#11162B] via-[#0E1326] to-[#0A0D1D] p-4 sm:p-5 shadow-xl shadow-black/40 space-y-4">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-violet-600/30 border border-violet-500/40 text-violet-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                LunaLink Demo Mode
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Interactive Test Bench
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Select any scenario to evaluate proactive, consent-based partner notifications in real time.
            </p>
          </div>
        </div>

        {/* Active Scenario Indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Active:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-violet-300 border border-violet-500/30 font-medium text-[11px]">
            {scenarios.find((s) => s.id === demoScenario)?.label}
          </span>
        </div>
      </div>

      {/* Scenario Selection Pills */}
      <div>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
          Test Scenarios:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {scenarios.map((scenario) => {
            const isSelected = demoScenario === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setDemoScenario(scenario.id)}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-violet-500 bg-violet-950/60 text-white shadow-md shadow-violet-950/40 ring-1 ring-violet-500/40'
                    : 'border-slate-800/80 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-1.5 w-full mb-1">
                  {scenario.icon}
                  <span className="text-xs font-medium truncate">{scenario.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {scenario.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Partner Permissions Quick Controls (Crucial for Consent Verification) */}
      <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Toggle 1: Allow Partner Support Notifications */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck
                className={`w-4 h-4 ${
                  user.notificationSharingEnabled ? 'text-emerald-400' : 'text-slate-500'
                }`}
              />
              <span className="text-xs font-semibold text-white">
                Partner Support Notifications
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {user.notificationSharingEnabled
                ? 'Enabled: Partner receives gentle advance alerts'
                : 'Disabled: 0 notifications delivered to partner (Default)'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleNotificationSharingEnabled()}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              user.notificationSharingEnabled
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {user.notificationSharingEnabled ? 'Enabled (ON)' : 'Disabled (OFF)'}
          </button>
        </div>

        {/* Toggle 2: Share Cycle-Related Support Insights */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Heart
                className={`w-4 h-4 ${
                  user.shareCycleSupportInsights ? 'text-rose-400' : 'text-slate-500'
                }`}
              />
              <span className="text-xs font-semibold text-white">
                Cycle-Related Support Insights
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {user.shareCycleSupportInsights
                ? 'Permits discomfort pattern context in Day 1 notifications'
                : 'General comfort suggestions only (Default: OFF)'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleShareCycleSupportInsights()}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              user.shareCycleSupportInsights
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 hover:bg-rose-900/40'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {user.shareCycleSupportInsights ? 'Enabled (ON)' : 'Disabled (OFF)'}
          </button>
        </div>
      </div>

      {/* Safety & Prototype Notice */}
      <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-300">LunaLink Demo Note:</strong> Push notifications are
          simulated in-app and not yet delivered through mobile OS push. Raw health data and notes are
          never exposed to partners.
        </span>
      </div>
    </div>
  );
};
