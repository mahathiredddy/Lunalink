import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { YourHealthSummaryManager } from '../components/healthcare/YourHealthSummaryManager';
import { HealthcareDirectoryCards } from '../components/healthcare/HealthcareDirectoryCards';
import { healthcareService } from '../services/healthcareService';
import {
  HealthSummarySharingConfig,
  HealthcareRecipient,
} from '../types';
import {
  BriefcaseMedical,
  ShieldCheck,
  FileText,
  Stethoscope,
  Sparkles,
  Share2,
  Lock,
  ArrowRight,
  Plus,
  RefreshCw,
} from 'lucide-react';

export const HealthcarePage: React.FC = () => {
  const { user, showToast, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<'summary' | 'specialties' | 'platform'>('summary');
  const [sharingConfigs, setSharingConfigs] = useState<HealthSummarySharingConfig[]>([]);

  useEffect(() => {
    setSharingConfigs(healthcareService.getSharingConfigs());
  }, []);

  const handleSaveConfig = (
    config: Partial<HealthSummarySharingConfig> & { recipient: HealthcareRecipient }
  ) => {
    const saved = healthcareService.saveSharingConfig(config);
    setSharingConfigs(healthcareService.getSharingConfigs());
    return saved;
  };

  const handleRevokeAccess = (id: string) => {
    healthcareService.revokeAccess(id);
    setSharingConfigs(healthcareService.getSharingConfigs());
  };

  const handleResetSampleData = () => {
    const reset = healthcareService.resetSharingConfigs();
    setSharingConfigs(reset);
    showToast('Healthcare summary share records reset to sample data', 'info');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* 1. Clear Messaging Banner & Safety Boundary */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3.5 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-200/90 leading-relaxed">
          <p className="font-semibold text-white text-sm">
            LunaLink is a personalized women's-health platform and tool for organizing information.
          </p>
          <p className="text-amber-300/80">
            LunaLink is <strong>NOT</strong> a doctor replacement, emergency service, PCOS diagnostic machine, or medication-prescribing AI. This space helps you organize your symptoms, cycle patterns, and wellness notes into clear summaries for your licensed healthcare providers.
          </p>
        </div>
      </div>

      {/* 2. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <BriefcaseMedical className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 font-mono">
              FUTURE-READY EXPANSION
            </span>
            <Badge variant="subtle" size="sm">
              Clinical Integration Hub
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Healthcare
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Bridge your daily cycle and wellness patterns into professional consultations with patient-controlled health summaries.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('womens-health')}
            className="flex items-center gap-1.5 text-xs"
          >
            <Stethoscope className="w-3.5 h-3.5 text-rose-400" />
            <span>Women&apos;s Health</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('summary')}
            className="flex items-center gap-1.5 text-xs shadow-md shadow-violet-950/50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Your Health Summary</span>
          </Button>
        </div>
      </div>

      {/* 3. Section Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'summary'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Your Health Summary</span>
          <Badge variant="subtle" size="sm">
            {sharingConfigs.filter((c) => c.status === 'active').length} Active
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('specialties')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'specialties'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Specialist Disciplines</span>
          <span className="text-[10px] font-mono text-slate-500">Coming soon</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('platform')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'platform'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Discovery, Booking & Telehealth</span>
          <span className="text-[10px] font-mono text-slate-500">Coming soon</span>
        </button>
      </div>

      {/* 4. Tab Views */}
      {activeTab === 'summary' && (
        <YourHealthSummaryManager
          sharingConfigs={sharingConfigs}
          onSaveConfig={handleSaveConfig}
          onRevokeAccess={handleRevokeAccess}
          onShowToast={showToast}
          patientName={user.name}
        />
      )}

      {activeTab === 'specialties' && (
        <HealthcareDirectoryCards
          onNavigateToSummaryBuilder={() => setActiveTab('summary')}
        />
      )}

      {activeTab === 'platform' && (
        <div className="space-y-6">
          <HealthcareDirectoryCards
            onNavigateToSummaryBuilder={() => setActiveTab('summary')}
          />
        </div>
      )}

      {/* Footer Utility */}
      <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <p className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>All clinical summary shares use zero-knowledge, patient-revocable permission passes.</span>
        </p>

        <button
          type="button"
          onClick={handleResetSampleData}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sample Sharing Records</span>
        </button>
      </div>
    </div>
  );
};
