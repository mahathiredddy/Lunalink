import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SignalTrackerModal } from '../components/womens-health/SignalTrackerModal';
import { SignalTrendsView } from '../components/womens-health/SignalTrendsView';
import { HealthPatternInsights } from '../components/womens-health/HealthPatternInsights';
import { HealthcareSummaryBuilder } from '../components/womens-health/HealthcareSummaryBuilder';
import { womensHealthService, WOMENS_HEALTH_SIGNALS } from '../services/womensHealthService';
import {
  WomensHealthSignalEntry,
} from '../types';
import {
  Heart,
  Plus,
  TrendingUp,
  Sparkles,
  FileText,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Share2,
  ListPlus,
  RefreshCw,
  Trash2,
  Edit2,
  BriefcaseMedical,
} from 'lucide-react';

export const WomensHealthPage: React.FC = () => {
  const {
    womensHealthSignals,
    saveWomensHealthSignal,
    deleteWomensHealthSignal,
    healthcareSummarySelection,
    updateHealthcareSummarySelection,
    resetWomensHealthSignals,
    cycles,
    cycleStats,
    symptoms,
    user,
    showToast,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'trends' | 'insights' | 'summary' | 'log'>('trends');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingSignal, setEditingSignal] = useState<WomensHealthSignalEntry | null>(null);

  // Compute pattern insights dynamically
  const patternInsights = useMemo(() => {
    return womensHealthService.getPatternInsights(womensHealthSignals, cycles);
  }, [womensHealthSignals, cycles]);

  const handleOpenLogModal = (entry?: WomensHealthSignalEntry) => {
    setEditingSignal(entry || null);
    setIsLogModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* 1. Mandatory Clinical & Medical Boundaries Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3.5 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-200/90 leading-relaxed">
          <p className="font-semibold text-white text-sm">
            LunaLink is a personalized support and health pattern tracking platform.
          </p>
          <p className="text-amber-300/80">
            LunaLink is <strong>NOT</strong> a doctor replacement, a PCOS diagnostic machine, or a medication-prescribing AI. This journal helps you log personal observations and recognize cyclical body patterns to empower discussions with your qualified healthcare team.
          </p>
        </div>
      </div>

      {/* 2. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <Heart className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 font-mono">
              HEALTH EXPANSION AREA
            </span>
            <Badge variant="subtle" size="sm">
              Non-Diagnostic
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Women&apos;s Health
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Understand changes in your health and prepare for better conversations with professionals.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('healthcare')}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
          >
            <BriefcaseMedical className="w-3.5 h-3.5 text-cyan-400" />
            <span>Healthcare Sharing Hub</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('summary')}
            className="flex items-center gap-1.5 text-xs"
          >
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            <span>Healthcare Summary</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenLogModal()}
            className="flex items-center gap-1.5 text-xs shadow-md shadow-violet-950/50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Health Signals</span>
          </Button>
        </div>
      </div>

      {/* 3. Section Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('trends')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'trends'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Trend Visualizations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('insights')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap relative ${
            activeTab === 'insights'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Pattern Insights</span>
          {patternInsights.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-violet-400" />
          )}
        </button>

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
          <span>Healthcare Conversation Summary</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('log')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'log'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListPlus className="w-4 h-4" />
          <span>Signal Entries ({womensHealthSignals.length})</span>
        </button>
      </div>

      {/* 4. Tab Content Views */}
      {activeTab === 'trends' && (
        <SignalTrendsView
          signals={womensHealthSignals}
          cycles={cycles}
        />
      )}

      {activeTab === 'insights' && (
        <HealthPatternInsights
          insights={patternInsights}
          onOpenSummaryBuilder={() => setActiveTab('summary')}
        />
      )}

      {activeTab === 'summary' && (
        <HealthcareSummaryBuilder
          selection={healthcareSummarySelection}
          onUpdateSelection={updateHealthcareSummarySelection}
          signals={womensHealthSignals}
          cycles={cycles}
          symptoms={symptoms}
          patientName={user.name}
          onShowToast={showToast}
        />
      )}

      {activeTab === 'log' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white font-display">
                All Logged Health Signal Records
              </h3>
              <p className="text-xs text-slate-400">
                Review, modify, or remove past signal tracking entries
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetWomensHealthSignals}
                className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-slate-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Sample Data</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenLogModal()}
                className="text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Entry</span>
              </Button>
            </div>
          </div>

          {womensHealthSignals.length === 0 ? (
            <Card variant="subtle" padding="lg" className="text-center py-12 bg-slate-900/40 border-slate-800">
              <Heart className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No health signals recorded yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Begin logging optional signals such as cycle irregularity, fatigue, sleep, or skin changes.
              </p>
              <div className="mt-4">
                <Button variant="primary" size="sm" onClick={() => handleOpenLogModal()}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Log First Signal</span>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {womensHealthSignals.map((entry) => (
                <Card
                  key={entry.id}
                  variant="default"
                  padding="sm"
                  className="bg-[#0D1426] border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {entry.date}
                        </span>
                        {entry.cycleDay && (
                          <Badge variant="subtle" size="sm">
                            Day {entry.cycleDay}
                          </Badge>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {entry.signals.length} {entry.signals.length === 1 ? 'signal' : 'signals'} tracked
                        </span>
                      </div>

                      {/* Signals Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {entry.signals.map((sig, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 flex items-center gap-1.5"
                          >
                            <span className="font-medium text-white">{sig.label}</span>
                            <span className="text-[10px] uppercase font-mono text-slate-400">
                              ({sig.severity})
                            </span>
                          </span>
                        ))}
                      </div>

                      {entry.generalNotes && (
                        <p className="text-xs text-slate-400 italic pt-1">
                          &quot;{entry.generalNotes}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-start">
                      <button
                        type="button"
                        onClick={() => handleOpenLogModal(entry)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteWomensHealthSignal(entry.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Signal Tracker Modal */}
      <SignalTrackerModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={saveWomensHealthSignal}
        editingEntry={editingSignal}
        cycleDayHint={cycleStats.currentCycleDay}
      />
    </div>
  );
};
