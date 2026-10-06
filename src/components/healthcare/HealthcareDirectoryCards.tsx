import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  HEALTHCARE_SPECIALTIES,
  HEALTHCARE_PLATFORM_FEATURES,
  HealthcareSpecialtyInfo,
  HealthcarePlatformFeature,
} from '../../services/healthcareService';
import {
  Stethoscope,
  Activity,
  Apple,
  Brain,
  CalendarCheck,
  Video,
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface HealthcareDirectoryCardsProps {
  onNavigateToSummaryBuilder: () => void;
}

export const HealthcareDirectoryCards: React.FC<HealthcareDirectoryCardsProps> = ({
  onNavigateToSummaryBuilder,
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<HealthcareSpecialtyInfo | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<HealthcarePlatformFeature | null>(null);

  const getSpecialtyIcon = (id: string) => {
    switch (id) {
      case 'gynecologist':
        return <Stethoscope className="w-5 h-5 text-rose-400" />;
      case 'endocrinologist':
        return <Activity className="w-5 h-5 text-violet-400" />;
      case 'dietitian':
        return <Apple className="w-5 h-5 text-emerald-400" />;
      case 'mental_health':
        return <Brain className="w-5 h-5 text-sky-400" />;
      default:
        return <Stethoscope className="w-5 h-5 text-violet-400" />;
    }
  };

  const getFeatureIcon = (id: string) => {
    switch (id) {
      case 'professional-discovery':
        return <Search className="w-5 h-5 text-violet-400" />;
      case 'appointment-booking':
        return <CalendarCheck className="w-5 h-5 text-amber-400" />;
      case 'telehealth':
        return <Video className="w-5 h-5 text-rose-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Clinical Specialists Expansion Cards */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-violet-400" />
              <span>Specialized Care Disciplines</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Future integration hubs connecting your LunaLink observations to specific medical specialties.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Future-Ready Expansion Area
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HEALTHCARE_SPECIALTIES.map((spec) => (
            <Card
              key={spec.id}
              variant="default"
              padding="md"
              className="bg-[#0C1222]/90 border-slate-800 hover:border-violet-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header with Icon & 'Coming soon' Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 group-hover:scale-105 transition-transform">
                      {getSpecialtyIcon(spec.id)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">
                        {spec.title}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Clinical Partnership
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-300">
                    Coming soon
                  </span>
                </div>

                {/* Role Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {spec.roleDescription}
                </p>

                {/* What to discuss snippet */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    Key Discussion Topics:
                  </span>
                  <ul className="space-y-1">
                    {spec.whatToDiscuss.slice(0, 2).map((topic, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                        <span className="text-violet-400 mt-0.5">•</span>
                        <span className="line-clamp-1">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedSpecialty(spec)}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>View Specialty Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToSummaryBuilder}
                  className="text-xs flex items-center gap-1"
                >
                  <span>Build Summary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Platform Expansion: Discovery, Booking, Telehealth */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Platform Care Integrations</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Architectural foundation for verified provider discovery, scheduling, and encrypted consultations.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Roadmap Features
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HEALTHCARE_PLATFORM_FEATURES.map((feat) => (
            <Card
              key={feat.id}
              variant="default"
              padding="md"
              className="bg-[#0C1222]/90 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700">
                    {getFeatureIcon(feat.id)}
                  </div>
                  <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Coming soon
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-300 block uppercase tracking-wider text-[10px]">
                    Patient Guarantee:
                  </span>
                  <p className="text-slate-400 leading-snug">
                    {feat.patientSafetyPrinciples[0]}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFeature(feat)}
                  className="w-full text-xs text-slate-300 hover:text-white flex items-center justify-center gap-1"
                >
                  <span>Learn About Integration</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Modal: Specialty Guide Details */}
      {selectedSpecialty && (
        <Modal
          isOpen={!!selectedSpecialty}
          onClose={() => setSelectedSpecialty(null)}
          title={`${selectedSpecialty.title} — Consultation Preparation`}
          subtitle="How to leverage your LunaLink records for high-value dialogue with this specialist."
          maxWidth="md"
        >
          <div className="space-y-4 text-xs text-slate-200">
            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 flex items-start gap-2.5 text-violet-200">
              <ShieldCheck className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-white">LunaLink supports professional care. It does not replace it.</strong>{' '}
                This guide provides structured suggestions to help you frame your personal questions.
              </p>
            </div>

            {/* Relevance to LunaLink */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="font-semibold text-white uppercase tracking-wider text-[10px] block font-mono">
                Why Consult a {selectedSpecialty.title}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedSpecialty.relevanceToLunaLink}
              </p>
            </div>

            {/* Topics to Discuss */}
            <div className="space-y-2">
              <span className="font-semibold text-white uppercase tracking-wider text-[10px] block font-mono">
                Suggested Topics to Discuss:
              </span>
              <ul className="space-y-1.5 pl-1">
                {selectedSpecialty.whatToDiscuss.map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Summary Focus */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-white uppercase tracking-wider text-[10px] block font-mono">
                Recommended Summary Modules:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSpecialty.suggestedSummaryFocus.map((f, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Coming Soon notice */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Direct appointment scheduling:</span>
              <span className="font-mono text-violet-300 font-semibold">Coming soon</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setSelectedSpecialty(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedSpecialty(null);
                  onNavigateToSummaryBuilder();
                }}
              >
                Open Health Summary
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. Modal: Platform Feature Architecture & Safety */}
      {selectedFeature && (
        <Modal
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          title={`${selectedFeature.title} — Integration Architecture`}
          subtitle="Future-ready standards ensuring clinical privacy and interoperability."
          maxWidth="md"
        >
          <div className="space-y-4 text-xs text-slate-200">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white uppercase tracking-wider text-[10px] font-mono">
                  Future Technical Standard:
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Coming soon
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedFeature.futureArchitecture}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-white uppercase tracking-wider text-[10px] block font-mono">
                Patient Protection Commitments:
              </span>
              <ul className="space-y-2 pl-1">
                {selectedFeature.patientSafetyPrinciples.map((principle, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{principle}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p>
                LunaLink does not create mock or simulated doctor bookings. Certified clinic integrations will be activated once interoperability pilots commence.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedFeature(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
