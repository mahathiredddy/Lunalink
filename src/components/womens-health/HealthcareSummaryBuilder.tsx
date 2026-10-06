import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  HealthcareSummarySelection,
  WomensHealthSignalEntry,
  CycleEntry,
  SymptomEntry,
} from '../../types';
import {
  womensHealthService,
  DEFAULT_DOCTOR_QUESTIONS,
} from '../../services/womensHealthService';
import {
  FileText,
  Printer,
  Copy,
  Download,
  Share2,
  Check,
  Plus,
  Trash2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Activity,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Eye,
  Sliders,
} from 'lucide-react';

interface HealthcareSummaryBuilderProps {
  selection: HealthcareSummarySelection;
  onUpdateSelection: (updates: Partial<HealthcareSummarySelection>) => void;
  signals: WomensHealthSignalEntry[];
  cycles: CycleEntry[];
  symptoms: SymptomEntry[];
  patientName?: string;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const HealthcareSummaryBuilder: React.FC<HealthcareSummaryBuilderProps> = ({
  selection,
  onUpdateSelection,
  signals,
  cycles,
  symptoms,
  patientName = 'Alex Rivera',
  onShowToast,
}) => {
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Checkbox toggles
  const handleToggle = (key: keyof HealthcareSummarySelection) => {
    onUpdateSelection({ [key]: !selection[key] });
  };

  // Add custom question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionInput.trim()) return;
    const updated = [...selection.questions, newQuestionInput.trim()];
    onUpdateSelection({ questions: updated });
    setNewQuestionInput('');
  };

  // Remove question
  const handleRemoveQuestion = (index: number) => {
    const updated = selection.questions.filter((_, i) => i !== index);
    onUpdateSelection({ questions: updated });
  };

  // Add pre-crafted prompt
  const handleAddPresetQuestion = (q: string) => {
    if (selection.questions.includes(q)) return;
    onUpdateSelection({ questions: [...selection.questions, q] });
  };

  // Generate plain text document
  const summaryDocumentText = womensHealthService.generateSummaryDocument(
    selection,
    signals,
    cycles,
    symptoms,
    patientName
  );

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryDocumentText);
      setCopied(true);
      onShowToast('Healthcare summary copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      onShowToast('Failed to copy to clipboard', 'error');
    }
  };

  // Download text file
  const handleDownload = () => {
    const blob = new Blob([summaryDocumentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lunalink-health-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Healthcare summary downloaded successfully', 'success');
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  // Calculate cycle stats for preview
  const cycleLengths = cycles.filter((c) => c.cycleLengthDays).map((c) => c.cycleLengthDays as number);
  const avgCycleLength =
    cycleLengths.length > 0 ? (cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length).toFixed(1) : '28.0';
  const minCycleLength = cycleLengths.length > 0 ? Math.min(...cycleLengths) : '28';
  const maxCycleLength = cycleLengths.length > 0 ? Math.max(...cycleLengths) : '28';

  // Calculate pain stats
  const painScores = symptoms.map((s) => s.painLevel);
  const avgPain = painScores.length > 0 ? (painScores.reduce((a, b) => a + b, 0) / painScores.length).toFixed(1) : '0';
  const highPainDays = painScores.filter((p) => p >= 6).length;

  return (
    <div className="space-y-6">
      {/* 1. Builder Controls & Configuration */}
      <Card variant="default" padding="md" className="bg-[#0C1222]/90 border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-400" />
              <span>Customize Healthcare Conversation Summary</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select exactly which records and questions you want included. You have 100% control over the summary content.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 flex-shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export / Share Summary</span>
          </Button>
        </div>

        {/* Mandatory Disclaimer Badge */}
        <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300">
            <strong className="text-white">Notice:</strong> LunaLink does not replace a doctor or diagnose medical conditions. This summary organizes your observed records to facilitate productive dialogue during your appointment.
          </p>
        </div>

        {/* Section Checkboxes */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-white uppercase tracking-wider block">
            Select Information to Include
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Cycle History */}
            <div
              onClick={() => handleToggle('includeCycleHistory')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                selection.includeCycleHistory
                  ? 'bg-[#121B30] border-violet-500/50 ring-1 ring-violet-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-semibold text-white">Cycle history</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Recorded cycle lengths, recent dates, duration, and range variations.
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                  selection.includeCycleHistory ? 'bg-violet-600 text-white' : 'border border-slate-700'
                }`}
              >
                {selection.includeCycleHistory && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Symptom Trends */}
            <div
              onClick={() => handleToggle('includeSymptomTrends')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                selection.includeSymptomTrends
                  ? 'bg-[#121B30] border-violet-500/50 ring-1 ring-violet-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-semibold text-white">Symptom trends</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Frequency of fatigue, skin changes, sleep shifts, and other tracked signals.
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                  selection.includeSymptomTrends ? 'bg-violet-600 text-white' : 'border border-slate-700'
                }`}
              >
                {selection.includeSymptomTrends && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Pain History */}
            <div
              onClick={() => handleToggle('includePainHistory')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                selection.includePainHistory
                  ? 'bg-[#121B30] border-violet-500/50 ring-1 ring-violet-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-white">Pain history</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Average pain levels (0-10), high pain instances, and reported locations.
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                  selection.includePainHistory ? 'bg-violet-600 text-white' : 'border border-slate-700'
                }`}
              >
                {selection.includePainHistory && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Changes Over Time */}
            <div
              onClick={() => handleToggle('includeChangesOverTime')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                selection.includeChangesOverTime
                  ? 'bg-[#121B30] border-violet-500/50 ring-1 ring-violet-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-white">Changes over time</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Multi-month patterns, cycle shifts, and non-diagnostic discussion notes.
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                  selection.includeChangesOverTime ? 'bg-violet-600 text-white' : 'border border-slate-700'
                }`}
              >
                {selection.includeChangesOverTime && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Questions for Doctor */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div
              onClick={() => handleToggle('includeQuestions')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                  selection.includeQuestions ? 'bg-violet-600 text-white' : 'border border-slate-700'
                }`}
              >
                {selection.includeQuestions && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-xs font-semibold text-white">
                Questions for a healthcare professional ({selection.questions.length})
              </span>
            </div>
          </div>

          {selection.includeQuestions && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 animate-in fade-in duration-150">
              {/* Question list */}
              <div className="space-y-2">
                {selection.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  >
                    <span className="font-mono text-violet-400 font-semibold flex-shrink-0">
                      Q{idx + 1}:
                    </span>
                    <span className="flex-1">{q}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Remove question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add custom question */}
              <form onSubmit={handleAddQuestion} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Type a custom question for your doctor..."
                  value={newQuestionInput}
                  onChange={(e) => setNewQuestionInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
                <Button variant="outline" size="sm" type="submit" disabled={!newQuestionInput.trim()}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Add Question</span>
                </Button>
              </form>

              {/* Prompt Suggestions */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  Suggested discussion prompts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_DOCTOR_QUESTIONS.filter((q) => !selection.questions.includes(q)).map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddPresetQuestion(q)}
                      className="px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 transition-colors flex items-center gap-1 text-left"
                    >
                      <Plus className="w-3 h-3 text-violet-400 flex-shrink-0" />
                      <span className="line-clamp-1">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Patient visit notes */}
        <div className="pt-2 border-t border-slate-800">
          <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
            Personal Visit Notes / Appointment Goal (Optional)
          </label>
          <input
            type="text"
            value={selection.additionalPatientNotes || ''}
            onChange={(e) => onUpdateSelection({ additionalPatientNotes: e.target.value })}
            placeholder="E.g., Routine annual visit. Discuss cycle timing, hormone panels, or energy support."
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </Card>

      {/* 2. Live Summary Preview */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Eye className="w-4 h-4 text-violet-400" />
              <span>Healthcare Conversation Summary Preview</span>
            </h4>
            <p className="text-xs text-slate-400">
              Live preview reflecting exactly what will appear in print or exported copies
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Preview</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
              className="text-xs flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export / Share</span>
            </Button>
          </div>
        </div>

        {/* The Live Document Paper Preview */}
        <div
          id="healthcare-summary-preview"
          className="p-6 sm:p-8 rounded-2xl bg-[#090D1A] border border-slate-700/80 shadow-xl space-y-6 text-slate-200"
        >
          {/* Header */}
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-400 font-mono">
                  LUNALINK HEALTH REPORT
                </span>
                <Badge variant="subtle" size="sm">
                  Patient Summary
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-white font-display mt-0.5">
                Healthcare Conversation Summary
              </h2>
            </div>
            <div className="text-right text-xs text-slate-400 font-mono">
              <div>Patient: <strong className="text-white">{patientName}</strong></div>
              <div>Prepared: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
            </div>
          </div>

          {/* Mandatory Medical Disclaimer Banner */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <strong className="text-white">Clinical Scope Notice:</strong>{' '}
              LunaLink does not replace a doctor or diagnose medical conditions. This summary is intended solely to support structured, factual conversation between patient and clinician.
            </div>
          </div>

          {/* Visit Notes */}
          {selection.additionalPatientNotes && (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="font-semibold text-slate-300 block mb-0.5">Patient Consultation Goal:</span>
              <p className="text-slate-300 italic">&quot;{selection.additionalPatientNotes}&quot;</p>
            </div>
          )}

          {/* 1. Cycle History Section */}
          {selection.includeCycleHistory && (
            <div className="space-y-2.5 border-b border-slate-800/80 pb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>1. Cycle History & Timing Metrics</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Average Cycle Length</span>
                  <span className="text-sm font-bold text-white font-mono">{avgCycleLength} days</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Recorded Cycle Range</span>
                  <span className="text-sm font-bold text-white font-mono">{minCycleLength} - {maxCycleLength} days</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Cycles Logged</span>
                  <span className="text-sm font-bold text-white font-mono">{cycles.length} cycles</span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Recent Cycle Records:</span>
                <div className="space-y-1 text-xs">
                  {cycles.slice(0, 3).map((c, i) => (
                    <div key={c.id} className="flex items-center justify-between p-1.5 rounded bg-slate-900/40 border border-slate-800 text-slate-300">
                      <span>Cycle {i + 1} (Start: {c.startDate})</span>
                      <span className="font-mono text-slate-400">
                        {c.cycleLengthDays ? `${c.cycleLengthDays} days length` : 'Current'} • {c.periodDurationDays} days flow
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Symptom Trends Section */}
          {selection.includeSymptomTrends && (
            <div className="space-y-2.5 border-b border-slate-800/80 pb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2. Women&apos;s Health Signals & Frequency</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {signals.slice(0, 4).map((entry) => (
                  <div key={entry.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-slate-400 text-[11px]">{entry.date}</span>
                      {entry.cycleDay && <Badge variant="subtle" size="sm">Day {entry.cycleDay}</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {entry.signals.map((s, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                          {s.label} ({s.severity})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Pain History Section */}
          {selection.includePainHistory && (
            <div className="space-y-2.5 border-b border-slate-800/80 pb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Flame className="w-3.5 h-3.5" />
                <span>3. Pain & Discomfort History</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Average Pain Score</span>
                  <span className="text-sm font-bold text-white font-mono">{avgPain} / 10</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">High Pain Days (≥6/10)</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">{highPainDays} recorded</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Primary Locations</span>
                  <span className="text-xs font-medium text-slate-200 truncate block">Lower abdomen, Lower back</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. Changes Over Time */}
          {selection.includeChangesOverTime && (
            <div className="space-y-2.5 border-b border-slate-800/80 pb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>4. Changes Observed Over Time</span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Cycle duration varied between 28 and 34 days over the last 3 recorded cycles.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Acne changes (cystic jawline breakouts) noted in both late luteal and mid-cycle phases.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Fatigue and restless sleep clusters logged together on multiple dates.</span>
                </p>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-violet-300 font-medium mt-1">
                  Summary note: &quot;You may want to discuss these changes with a qualified healthcare professional.&quot;
                </div>
              </div>
            </div>
          )}

          {/* 5. Questions for Doctor */}
          {selection.includeQuestions && selection.questions.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>5. Patient Discussion Questions</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                {selection.questions.map((q, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2 text-slate-200">
                    <span className="font-mono text-pink-400 font-bold">Q{idx + 1}:</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Export / Share Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export / Share Summary"
        subtitle="Download or copy your customized health conversation summary."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p>
              LunaLink does not replace a doctor or diagnose medical conditions. This summary is intended solely to support your conversation with your doctor.
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Copy to clipboard button */}
            <button
              type="button"
              onClick={() => {
                handleCopy();
                setIsExportModalOpen(false);
              }}
              className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-600/20 text-violet-400 group-hover:bg-violet-600/30">
                  <Copy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">Copy Text to Clipboard</span>
                  <span className="text-[11px] text-slate-400">Easy to paste into doctor portals or personal notes</span>
                </div>
              </div>
              <Check className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </button>

            {/* Download Text Document */}
            <button
              type="button"
              onClick={() => {
                handleDownload();
                setIsExportModalOpen(false);
              }}
              className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600/30">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">Download Summary Document (.txt)</span>
                  <span className="text-[11px] text-slate-400">Formatted clinical report text file</span>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </button>

            {/* Print / Save as PDF */}
            <button
              type="button"
              onClick={() => {
                setIsExportModalOpen(false);
                setTimeout(handlePrint, 300);
              }}
              className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400 group-hover:bg-rose-600/30">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">Print / Save as PDF</span>
                  <span className="text-[11px] text-slate-400">Clean physical copy or PDF printout for appointments</span>
                </div>
              </div>
              <Printer className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsExportModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
