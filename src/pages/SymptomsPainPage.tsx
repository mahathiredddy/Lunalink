import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SymptomEntry } from '../types';
import { symptomService } from '../services/symptomService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PainTrendChart } from '../components/symptoms/PainTrendChart';
import { SymptomFrequencyChart } from '../components/symptoms/SymptomFrequencyChart';
import { CycleChangesChart } from '../components/symptoms/CycleChangesChart';
import { SymptomHistoryList } from '../components/symptoms/SymptomHistoryList';
import { SymptomEntryModal } from '../components/symptoms/SymptomEntryModal';
import {
  HeartPulse,
  Plus,
  Lock,
  Info,
  Calendar,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Trash,
} from 'lucide-react';

export const SymptomsPainPage: React.FC = () => {
  const {
    symptoms,
    saveSymptom,
    deleteSymptom,
    clearAllSymptoms,
    resetSymptoms,
    cycles,
    cycleStats,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [entryToEdit, setEntryToEdit] = useState<SymptomEntry | null>(null);

  // Computed metrics
  const frequencyData = symptomService.calculateSymptomFrequency(symptoms);
  const cyclePhaseMetrics = symptomService.calculateCyclePhaseMetrics(symptoms, cycles);

  const handleOpenAddModal = () => {
    setEntryToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: SymptomEntry) => {
    setEntryToEdit(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEntryToEdit(null);
  };

  const hasData = symptoms.length > 0;

  return (
    <div id="symptoms-pain-page" className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* ================= HEADER SECTION ================= */}
      <section id="symptoms-header" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
                How have you been feeling?
              </h1>
              <Badge variant="private" size="sm" icon={<Lock className="w-3 h-3 text-emerald-400" />}>
                Personal Health • Private
              </Badge>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Track what you experience and understand your patterns over time.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenAddModal}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Entry
            </Button>
          </div>
        </div>

        {/* ================= IMPORTANT MEDICAL DISCLAIMER BANNER ================= */}
        <div
          id="medical-disclaimer-banner"
          className="p-4 rounded-xl bg-[#0C1222] border border-slate-800 flex items-start gap-3 text-slate-300"
        >
          <div className="p-2 rounded-lg bg-violet-600/15 border border-violet-500/30 text-violet-400 flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-white">
              Personal Tracking & Health Context
            </p>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              These trends help you understand your personal history. They are not a medical diagnosis.
            </p>
          </div>
        </div>
      </section>

      {/* ================= EMPTY STATE OR CONTENT ================= */}
      {!hasData ? (
        <section id="symptoms-empty-state">
          <Card variant="default" padding="lg" className="border-slate-800 text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white font-display">
                  You haven't logged any symptoms yet.
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Record pain levels, symptoms like cramps or fatigue, and notes whenever convenient. Your logs will build informative trend insights over time.
                </p>
              </div>
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleOpenAddModal}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Entry
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={resetSymptoms}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Load Sample Data
                </Button>
              </div>
            </div>
          </Card>
        </section>
      ) : (
        <>
          {/* ================= QUICK STATUS & CURRENT CONTEXT ================= */}
          <section id="symptoms-quick-summary" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card variant="default" padding="md" className="border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                Total Logs Recorded
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {symptoms.length}
                </span>
                <span className="text-xs text-slate-400">entries on file</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Stored privately in your encrypted local space
              </span>
            </Card>

            <Card variant="default" padding="md" className="border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                Current Cycle Day
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-rose-300">
                  Day {cycleStats.currentCycleDay}
                </span>
                <span className="text-xs text-slate-400">Luteal phase</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Last recorded period: {cycleStats.lastPeriodStart}
              </span>
            </Card>

            <Card variant="default" padding="md" className="border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Most Reported Symptom
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {frequencyData[0]?.symptom || 'None'}
                  </span>
                  {frequencyData[0] && (
                    <span className="text-xs font-mono text-violet-300">
                      ({frequencyData[0].percentage}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400">
                <span>Top physical sensation</span>
                <button
                  type="button"
                  onClick={clearAllSymptoms}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                  title="Clear entries to test empty state"
                >
                  Test Empty State
                </button>
              </div>
            </Card>
          </section>

          {/* ================= TREND SECTION ================= */}
          <section id="symptoms-trend-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-display tracking-tight">
                  Trends & Patterns
                </h2>
                <p className="text-xs text-slate-400">
                  Visual insights into your pain variations, symptom frequency, and cycle phase shifts
                </p>
              </div>
            </div>

            {/* 1. Pain Trends Chart */}
            <PainTrendChart entries={symptoms} />

            {/* 2. Symptom Frequency Chart & 3. Changes Across Cycles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SymptomFrequencyChart
                frequencyData={frequencyData}
                totalLogsCount={symptoms.length}
              />
              <CycleChangesChart
                metrics={cyclePhaseMetrics}
                totalLogsCount={symptoms.length}
              />
            </div>
          </section>

          {/* ================= HISTORY SECTION ================= */}
          <section id="symptoms-history-section" className="space-y-4 pt-2">
            <SymptomHistoryList
              entries={symptoms}
              onEdit={handleOpenEditModal}
              onDelete={deleteSymptom}
              onAddNew={handleOpenAddModal}
            />
          </section>
        </>
      )}

      {/* ================= LOG / EDIT MODAL ================= */}
      <SymptomEntryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        entryToEdit={entryToEdit}
        onSave={saveSymptom}
        onDelete={deleteSymptom}
        currentCycleDay={cycleStats.currentCycleDay}
      />
    </div>
  );
};
