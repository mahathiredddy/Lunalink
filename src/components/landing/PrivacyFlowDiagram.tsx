import React from 'react';
import {
  Lock,
  ArrowRight,
  Shield,
  Layers,
  FileText,
  User,
  Sliders,
  CheckCircle2,
  Calendar,
  KeyRound,
  Eye,
  ShieldCheck,
} from 'lucide-react';

export const PrivacyFlowDiagram: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tier 1: MY INFORMATION → MY CONTROL */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0C1222] border border-violet-500/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider font-display">
              Stream 01 • Personal Sovereignty
            </h4>
          </div>
          <span className="text-[11px] font-mono text-violet-300 bg-violet-950/60 px-2.5 py-1 rounded-full border border-violet-500/30">
            Unilateral Boundary
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Source Box: MY INFORMATION */}
          <div className="md:col-span-5 p-4 rounded-xl bg-[#0A0E1A] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider font-display">
              <User className="w-4 h-4" />
              <span>MY INFORMATION</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Personal journal, private schedule, real-time location, contact numbers, health logs.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-slate-400" /> Private by default
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                Isolated Client Storage
              </span>
            </div>
          </div>

          {/* Direction Indicator */}
          <div className="md:col-span-2 flex flex-col items-center justify-center py-2 md:py-0">
            <div className="flex items-center gap-1 text-violet-400 font-mono text-xs">
              <span className="hidden md:inline font-semibold">FLOWS TO</span>
              <ArrowRight className="w-4 h-4 animate-pulse rotate-90 md:rotate-0" />
            </div>
            <span className="text-[10px] text-slate-400 text-center mt-1">
              Zero automated leaks
            </span>
          </div>

          {/* Destination Box: MY CONTROL */}
          <div className="md:col-span-5 p-4 rounded-xl bg-[#0A0E1A] border border-violet-500/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider font-display">
              <Sliders className="w-4 h-4" />
              <span>MY CONTROL</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Independent granular toggles. You decide every field. Revoke access instantly with a single tap.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Instant Revocation
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300">
                No coerced consent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 2: SHARED INFORMATION → MUTUAL SPACE */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0C1222] border border-indigo-500/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider font-display">
              Stream 02 • Mutual Collaboration
            </h4>
          </div>
          <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-500/30">
            Mutual Handshake Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Source Box: SHARED INFORMATION */}
          <div className="md:col-span-5 p-4 rounded-xl bg-[#0A0E1A] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider font-display">
              <FileText className="w-4 h-4" />
              <span>SHARED INFORMATION</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Vacation flights, mutual packing checklists, apartment door codes, dining preferences.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-indigo-200 flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5 text-indigo-400" /> Both can view & edit
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-indigo-200">
                Explicitly approved
              </span>
            </div>
          </div>

          {/* Direction Indicator */}
          <div className="md:col-span-2 flex flex-col items-center justify-center py-2 md:py-0">
            <div className="flex items-center gap-1 text-indigo-400 font-mono text-xs">
              <span className="hidden md:inline font-semibold">SYNCS TO</span>
              <ArrowRight className="w-4 h-4 animate-pulse rotate-90 md:rotate-0" />
            </div>
            <span className="text-[10px] text-slate-400 text-center mt-1">
              Mutual consent channel
            </span>
          </div>

          {/* Destination Box: MUTUAL SPACE */}
          <div className="md:col-span-5 p-4 rounded-xl bg-[#0A0E1A] border border-indigo-500/40 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider font-display">
              <Layers className="w-4 h-4" />
              <span>MUTUAL SPACE</span>
            </div>
            <p className="text-[11px] text-slate-300">
              A private shared sanctuary where only the two connected partners have visibility and access.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-sky-950/60 border border-sky-500/30 text-[10px] text-sky-200 flex items-center gap-1">
                <Eye className="w-2.5 h-2.5 text-sky-400" /> Strictly 2 People
              </span>
              <span className="px-2 py-0.5 rounded-md bg-sky-950/60 border border-sky-500/30 text-[10px] text-sky-200 flex items-center gap-1">
                <KeyRound className="w-2.5 h-2.5 text-sky-400" /> Zero 3rd-party access
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Guarantee */}
      <div className="p-3 rounded-xl bg-[#0A0E1A] border border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
        <span className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          No corporate ad profiles or public feeds
        </span>
        <span className="hidden sm:inline text-slate-700">•</span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <Lock className="w-4 h-4 text-violet-400" />
          Disconnecting unlinks all shared sync caches immediately
        </span>
      </div>
    </div>
  );
};
