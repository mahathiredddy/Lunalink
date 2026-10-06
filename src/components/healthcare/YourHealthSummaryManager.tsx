import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  HealthSummarySharingConfig,
  HealthcareRecipient,
  HealthSummarySharingTiming,
} from '../../types';
import {
  ShieldCheck,
  Share2,
  Clock,
  UserCheck,
  Calendar,
  Sparkles,
  Plus,
  Check,
  Lock,
  Eye,
  Key,
  Flame,
  AlertCircle,
  FileText,
  Sliders,
  XCircle,
  ChevronRight,
  Info,
} from 'lucide-react';

interface YourHealthSummaryManagerProps {
  sharingConfigs: HealthSummarySharingConfig[];
  onSaveConfig: (config: Partial<HealthSummarySharingConfig> & { recipient: HealthcareRecipient }) => void;
  onRevokeAccess: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  patientName?: string;
}

export const YourHealthSummaryManager: React.FC<YourHealthSummaryManagerProps> = ({
  sharingConfigs,
  onSaveConfig,
  onRevokeAccess,
  onShowToast,
  patientName = 'Alex Rivera',
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewConfig, setPreviewConfig] = useState<HealthSummarySharingConfig | null>(null);

  // Form State for "What, Who, When" Builder
  const [recipientName, setRecipientName] = useState('');
  const [recipientSpecialty, setRecipientSpecialty] = useState('Gynecologist');
  const [recipientClinic, setRecipientClinic] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  const [timing, setTiming] = useState<HealthSummarySharingTiming>('appointment_day');
  const [expiryDays, setExpiryDays] = useState<number>(3);

  const [includedItems, setIncludedItems] = useState({
    cycleHistory: true,
    symptomTrends: true,
    painMetrics: true,
    lifestyleAndSleep: false,
    doctorQuestions: true,
    medicationsVitamins: false,
  });

  const [clinicalNotes, setClinicalNotes] = useState('');

  const handleToggleItem = (key: keyof typeof includedItems) => {
    setIncludedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleQuickFillProvider = (name: string, specialty: string, clinic: string) => {
    setRecipientName(name);
    setRecipientSpecialty(specialty);
    setRecipientClinic(clinic);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientClinic.trim()) {
      onShowToast('Please provide both provider name and clinic', 'error');
      return;
    }

    onSaveConfig({
      title: `Summary for ${recipientName}`,
      recipient: {
        name: recipientName.trim(),
        specialty: recipientSpecialty,
        clinicOrOrganization: recipientClinic.trim(),
        emailOrPortalId: recipientEmail.trim() || undefined,
      },
      timing,
      expiryDays,
      status: timing === 'link_with_expiry' ? 'active' : 'scheduled',
      includedItems,
      clinicalNotes: clinicalNotes.trim() || undefined,
    });

    onShowToast('Healthcare summary sharing pass configured successfully', 'success');
    setIsCreateModalOpen(false);

    // Reset Form
    setRecipientName('');
    setRecipientClinic('');
    setRecipientEmail('');
    setClinicalNotes('');
  };

  const handleCopyKey = (key?: string) => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    onShowToast(`Secure access code ${key} copied to clipboard`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* 1. Clear Messaging Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#0E1528] to-[#0A0F1E] border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-display">
                Your Health Summary
              </h3>
              <Badge variant="subtle" size="sm">
                Patient-Controlled Sharing
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              <strong className="text-white">LunaLink supports professional care. It does not replace it.</strong>{' '}
              You decide exactly what clinical observations to disclose, which practitioner receives them, and the precise timeframe access remains active.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 flex-shrink-0 text-xs shadow-md shadow-violet-950/50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Configure New Share Pass</span>
        </Button>
      </div>

      {/* 2. Conceptual Pillar Guide: What, Who, When */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Pillar 1: What */}
        <Card variant="subtle" padding="md" className="bg-[#0C1222]/80 border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-violet-400">
            <Sliders className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              1. What Information to Include
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Granular selection across cycle lengths, symptom frequencies, pain scores, sleep metrics, and tailored doctor questions. Private notes stay private.
          </p>
        </Card>

        {/* Pillar 2: Who */}
        <Card variant="subtle" padding="md" className="bg-[#0C1222]/80 border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400">
            <UserCheck className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              2. Who Receives It
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Restricted exclusively to your designated clinician or clinic. No public URLs, no centralized third-party aggregators, and zero marketing brokers.
          </p>
        </Card>

        {/* Pillar 3: When */}
        <Card variant="subtle" padding="md" className="bg-[#0C1222]/80 border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Clock className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              3. When It Is Shared
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Time-bracketed release windows: at appointment check-in, 24 hours in advance, or manual one-click release with automatic 48h to 7d expiration.
          </p>
        </Card>
      </div>

      {/* 3. Configured / Scheduled Summary Passes List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              ACTIVE & SCHEDULED SUMMARY SHARES ({sharingConfigs.length})
            </h4>
            <p className="text-xs text-slate-400">
              Manage ongoing and planned clinical disclosures. Revoke access at any second.
            </p>
          </div>
        </div>

        {sharingConfigs.length === 0 ? (
          <Card variant="subtle" padding="lg" className="text-center py-10 bg-slate-900/40 border-slate-800">
            <Lock className="w-7 h-7 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No active summary shares</p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              You haven&apos;t shared your health summary with any clinicians yet. You can create a temporary pass whenever you have an upcoming consultation.
            </p>
            <div className="mt-4">
              <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Create Summary Pass</span>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {sharingConfigs.map((config) => {
              const includedCount = Object.values(config.includedItems).filter(Boolean).length;
              const isRevoked = config.status === 'revoked';
              const isActive = config.status === 'active';

              return (
                <Card
                  key={config.id}
                  variant="default"
                  padding="md"
                  className={`border transition-all flex flex-col justify-between ${
                    isRevoked
                      ? 'bg-slate-950/50 border-slate-800/60 opacity-75'
                      : isActive
                      ? 'bg-[#0E1528] border-violet-500/40 shadow-sm'
                      : 'bg-[#0C1222] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Recipient & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                          Recipient Provider
                        </span>
                        <h5 className="text-sm font-bold text-white leading-tight">
                          {config.recipient.name}
                        </h5>
                        <p className="text-xs text-violet-300 font-medium">
                          {config.recipient.specialty} • {config.recipient.clinicOrOrganization}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {isActive && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active Pass
                          </span>
                        )}
                        {config.status === 'scheduled' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-violet-950/70 border border-violet-500/40 text-violet-300">
                            <Clock className="w-3 h-3" />
                            Scheduled
                          </span>
                        )}
                        {isRevoked && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-500">
                            <XCircle className="w-3 h-3 text-slate-500" />
                            Access Revoked
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Key Sharing Specs */}
                    <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Sliders className="w-3 h-3 text-violet-400" />
                          Included Modules:
                        </span>
                        <span className="font-semibold text-white">{includedCount} of 6 selected</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Release Timing:
                        </span>
                        <span className="font-medium text-amber-300 capitalize">
                          {config.timing.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {config.shareKey && !isRevoked && (
                        <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800">
                          <span className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Key className="w-3 h-3 text-cyan-400" />
                            Pass Code:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyKey(config.shareKey)}
                            className="font-mono text-cyan-300 hover:text-white bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 text-[11px] transition-colors"
                            title="Click to copy pass code"
                          >
                            {config.shareKey}
                          </button>
                        </div>
                      )}
                    </div>

                    {config.clinicalNotes && (
                      <p className="text-xs text-slate-400 italic line-clamp-2">
                        &quot;{config.clinicalNotes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewConfig(config)}
                      className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Pass Scope</span>
                    </Button>

                    {!isRevoked && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          onRevokeAccess(config.id);
                          onShowToast(`Access for ${config.recipient.name} revoked immediately`, 'info');
                        }}
                        className="text-xs"
                      >
                        Revoke Access
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Modal: Configure New Summary Sharing Pass */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Configure Healthcare Summary Sharing Pass"
        subtitle="You control what is shared, who receives it, and when access expires."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-5 text-slate-200">
          {/* Medical Notice */}
          <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/30 flex items-start gap-2.5 text-xs text-violet-200">
            <Info className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">LunaLink supports professional care. It does not replace it.</strong>{' '}
              This pass gives your selected clinician temporary, read-only access to your chosen records.
            </p>
          </div>

          {/* Section 1: Who Receives It */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider block font-mono">
              1. Who Receives It (Provider & Clinic)
            </label>

            {/* Quick Fill suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400">Quick-fill from common specialties:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFillProvider('Dr. Maya Patel, MD', 'Gynecologist', 'Northwest Women’s Clinic')}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300"
                >
                  + Gynecologist
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillProvider('Dr. David Kim, MD', 'Endocrinologist', 'Metabolic & Hormone Institute')}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300"
                >
                  + Endocrinologist
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillProvider('Elena Rostova, MS, RD', 'Dietitian', 'Integrative Wellness Clinic')}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300"
                >
                  + Dietitian
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillProvider('Sarah Jenkins, LMFT', 'Mental Health Professional', 'Mind-Body Wellness Center')}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300"
                >
                  + Mental Health Professional
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Provider Name *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Dr. Maya Patel, MD"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Specialty</label>
                <select
                  value={recipientSpecialty}
                  onChange={(e) => setRecipientSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Endocrinologist">Endocrinologist</option>
                  <option value="Registered Dietitian">Registered Dietitian</option>
                  <option value="Mental Health Professional">Mental Health Professional</option>
                  <option value="Primary Care Physician">Primary Care Physician</option>
                  <option value="Other Specialist">Other Specialist</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Clinic or Hospital Name *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Northwest Women's Health Clinic"
                  value={recipientClinic}
                  onChange={(e) => setRecipientClinic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Clinic Portal ID or Email (Optional)</label>
                <input
                  type="text"
                  placeholder="E.g., records@nwwomenshealth.org"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: What Information to Include */}
          <div className="space-y-2.5 pt-3 border-t border-slate-800">
            <label className="text-xs font-bold text-white uppercase tracking-wider block font-mono">
              2. What Information to Include (Granular Disclosure)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div
                onClick={() => handleToggleItem('cycleHistory')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  includedItems.cycleHistory
                    ? 'bg-violet-950/40 border-violet-500/60 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400'
                }`}
              >
                <span>Cycle history & timing ranges</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center ${
                    includedItems.cycleHistory ? 'bg-violet-600 text-white' : 'border border-slate-700'
                  }`}
                >
                  {includedItems.cycleHistory && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div
                onClick={() => handleToggleItem('symptomTrends')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  includedItems.symptomTrends
                    ? 'bg-violet-950/40 border-violet-500/60 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400'
                }`}
              >
                <span>Symptom trends & frequency logs</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center ${
                    includedItems.symptomTrends ? 'bg-violet-600 text-white' : 'border border-slate-700'
                  }`}
                >
                  {includedItems.symptomTrends && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div
                onClick={() => handleToggleItem('painMetrics')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  includedItems.painMetrics
                    ? 'bg-violet-950/40 border-violet-500/60 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400'
                }`}
              >
                <span>Pain scale history & locations</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center ${
                    includedItems.painMetrics ? 'bg-violet-600 text-white' : 'border border-slate-700'
                  }`}
                >
                  {includedItems.painMetrics && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div
                onClick={() => handleToggleItem('lifestyleAndSleep')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  includedItems.lifestyleAndSleep
                    ? 'bg-violet-950/40 border-violet-500/60 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400'
                }`}
              >
                <span>Sleep duration & energy notes</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center ${
                    includedItems.lifestyleAndSleep ? 'bg-violet-600 text-white' : 'border border-slate-700'
                  }`}
                >
                  {includedItems.lifestyleAndSleep && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div
                onClick={() => handleToggleItem('doctorQuestions')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  includedItems.doctorQuestions
                    ? 'bg-violet-950/40 border-violet-500/60 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400'
                }`}
              >
                <span>Questions for healthcare professional</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center ${
                    includedItems.doctorQuestions ? 'bg-violet-600 text-white' : 'border border-slate-700'
                  }`}
                >
                  {includedItems.doctorQuestions && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div
                onClick={() => handleToggleItem('medicationsVitamins')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  includedItems.medicationsVitamins
                    ? 'bg-violet-950/40 border-violet-500/60 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400'
                }`}
              >
                <span>Current supplements / vitamins list</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center ${
                    includedItems.medicationsVitamins ? 'bg-violet-600 text-white' : 'border border-slate-700'
                  }`}
                >
                  {includedItems.medicationsVitamins && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: When It Is Shared */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <label className="text-xs font-bold text-white uppercase tracking-wider block font-mono">
              3. When It Is Shared (Access Timing & Expiration)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 cursor-pointer flex items-start gap-2.5 text-xs">
                <input
                  type="radio"
                  name="timing"
                  value="appointment_day"
                  checked={timing === 'appointment_day'}
                  onChange={() => setTiming('appointment_day')}
                  className="mt-0.5 text-violet-600 focus:ring-violet-500"
                />
                <div>
                  <span className="font-semibold text-white block">At Time of Appointment</span>
                  <span className="text-[11px] text-slate-400">
                    Pass unlocks on the scheduled morning and expires after visit.
                  </span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 cursor-pointer flex items-start gap-2.5 text-xs">
                <input
                  type="radio"
                  name="timing"
                  value="advance_24h"
                  checked={timing === 'advance_24h'}
                  onChange={() => setTiming('advance_24h')}
                  className="mt-0.5 text-violet-600 focus:ring-violet-500"
                />
                <div>
                  <span className="font-semibold text-white block">24 Hours in Advance</span>
                  <span className="text-[11px] text-slate-400">
                    Allows clinic nurse or doctor to review records prior to check-in.
                  </span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 cursor-pointer flex items-start gap-2.5 text-xs">
                <input
                  type="radio"
                  name="timing"
                  value="link_with_expiry"
                  checked={timing === 'link_with_expiry'}
                  onChange={() => setTiming('link_with_expiry')}
                  className="mt-0.5 text-violet-600 focus:ring-violet-500"
                />
                <div>
                  <span className="font-semibold text-white block">Active Now (Self-Expiring Pass)</span>
                  <span className="text-[11px] text-slate-400">
                    Generate an instant pass key with strict automatic revocation.
                  </span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 cursor-pointer flex items-start gap-2.5 text-xs">
                <input
                  type="radio"
                  name="timing"
                  value="manual_only"
                  checked={timing === 'manual_only'}
                  onChange={() => setTiming('manual_only')}
                  className="mt-0.5 text-violet-600 focus:ring-violet-500"
                />
                <div>
                  <span className="font-semibold text-white block">Manual Release Only</span>
                  <span className="text-[11px] text-slate-400">
                    Remains strictly dormant until you press &apos;Release Access&apos; in room.
                  </span>
                </div>
              </label>
            </div>

            {/* Expiry Window */}
            <div className="pt-1 flex items-center gap-3">
              <span className="text-xs text-slate-400">Access Expiry Window:</span>
              <div className="flex gap-2">
                {[1, 3, 7].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setExpiryDays(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                      expiryDays === d
                        ? 'bg-violet-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {d} {d === 1 ? 'day' : 'days'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clinical note for doctor */}
          <div className="space-y-1 pt-3 border-t border-slate-800">
            <label className="text-[11px] text-slate-400 block">Personal Consultation Objective (Optional)</label>
            <input
              type="text"
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="E.g., Review recent 34-day cycle shift and discuss hormone lab options."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Modal Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save & Authorize Pass
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. Modal: View Pass Scope & Preview */}
      {previewConfig && (
        <Modal
          isOpen={!!previewConfig}
          onClose={() => setPreviewConfig(null)}
          title={`Sharing Pass Details — ${previewConfig.recipient.name}`}
          subtitle="Review the active clinical permissions granted under this pass."
          maxWidth="md"
        >
          <div className="space-y-4 text-xs text-slate-200">
            <div className="p-3 rounded-xl bg-[#090D1A] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Designated Clinician:</span>
                <strong className="text-white">{previewConfig.recipient.name}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Specialty & Clinic:</span>
                <span className="text-violet-300 font-medium">{previewConfig.recipient.specialty} ({previewConfig.recipient.clinicOrOrganization})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Release Rule:</span>
                <span className="font-mono text-amber-300 capitalize">{previewConfig.timing.replace(/_/g, ' ')}</span>
              </div>
              {previewConfig.shareKey && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Clinician Pass Code:</span>
                  <span className="font-mono text-cyan-300 bg-slate-800 px-2 py-0.5 rounded">{previewConfig.shareKey}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
                Disclosed Modules
              </span>
              <ul className="space-y-1.5 pl-1">
                {Object.entries(previewConfig.includedItems).map(([k, v]) => (
                  <li key={k} className="flex items-center gap-2">
                    {v ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span className={v ? 'text-white' : 'text-slate-500 line-through'}>
                      {k === 'cycleHistory' && 'Cycle history & length variations'}
                      {k === 'symptomTrends' && 'Symptom trends and multi-signal clusters'}
                      {k === 'painMetrics' && 'Pain intensity history and locations'}
                      {k === 'lifestyleAndSleep' && 'Sleep metrics and energy notes'}
                      {k === 'doctorQuestions' && 'Patient questions for consultation'}
                      {k === 'medicationsVitamins' && 'Supplements and vitamins list'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>LunaLink supports professional care. It does not replace it. You can cancel or revoke this pass at any time.</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setPreviewConfig(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
