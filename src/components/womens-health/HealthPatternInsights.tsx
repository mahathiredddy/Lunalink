import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  PatternInsight,
  WomensHealthSignalType,
} from '../../types';
import {
  AlertCircle,
  HelpCircle,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Clock,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface HealthPatternInsightsProps {
  insights: PatternInsight[];
  onOpenSummaryBuilder: () => void;
}

export const HealthPatternInsights: React.FC<HealthPatternInsightsProps> = ({
  insights,
  onOpenSummaryBuilder,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Mandatory Clinical & Medical Boundaries Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
            Important Medical Scope Notice
          </h4>
          <p className="text-xs text-amber-300/90 leading-relaxed">
            <strong className="text-white font-semibold">
              LunaLink does not replace a doctor or diagnose medical conditions.
            </strong>{' '}
            LunaLink is strictly an observational journal to help you observe recurring signals in your daily life and prepare clear, organized data for discussions with a healthcare professional. It never makes diagnostic claims.
          </p>
        </div>
      </div>

      {/* 2. Detected Pattern Observations */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Observed Health Patterns</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Objective clusters identified in your tracked signals over recent weeks
            </p>
          </div>
          <Badge variant="subtle" size="sm">
            {insights.length} {insights.length === 1 ? 'Pattern Observed' : 'Patterns Observed'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {insights.map((insight) => (
            <Card
              key={insight.id}
              variant="default"
              padding="md"
              className="bg-[#0D1426] border-slate-800 hover:border-violet-500/40 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-white font-display">
                      {insight.title}
                    </span>
                    <Badge
                      variant={insight.severityLevel === 'notable' ? 'warning' : 'subtle'}
                      size="sm"
                    >
                      {insight.timeframe}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {insight.observation}
                  </p>
                </div>
              </div>

              {/* Strict Non-Diagnostic Guided Recommendation */}
              <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/30 flex items-start gap-2.5">
                <Stethoscope className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-violet-200 block">
                    Next Step Recommendation:
                  </span>
                  <p className="text-xs text-violet-300 font-medium">
                    &quot;{insight.discussionRecommendation}&quot;
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 3. Guide on Preparing for Your Consultation */}
      <Card variant="subtle" padding="md" className="bg-slate-900/60 border-slate-800 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">
                Preparing for Better Conversations with Healthcare Providers
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Physicians appreciate clear timelines, concrete symptom frequency, and pre-written questions.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenSummaryBuilder}
            className="flex-shrink-0 text-xs flex items-center gap-1.5"
          >
            <span>Open Summary Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-medium">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span>Track 2–3 Cycles</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Longitudinal timelines provide doctors with patterns rather than single-day anomalies.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-medium">
              <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Form Specific Questions</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ask about potential baseline lab panels (thyroid, hormone ranges, glucose) or lifestyle tweaks.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-medium">
              <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share Structured Notes</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Use the Healthcare Conversation Summary below to print or export exact timeline data.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
