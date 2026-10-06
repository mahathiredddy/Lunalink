import React, { useState } from 'react';
import {
  Lock,
  Moon,
  Sparkles,
  Link2,
  FileText,
  SlidersHorizontal,
  Check,
  ShieldCheck,
  Wifi,
  MapPin,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const HeroGraphic: React.FC = () => {
  // Interactive toggle to demonstrate "Controlled Information Sharing"
  const [shareLocation, setShareLocation] = useState(false);
  const [shareItinerary, setShareItinerary] = useState(true);

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Subtle Lunar Ambient Halo */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-violet-600/20 via-indigo-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Orbit Rings Decoration */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border border-violet-500/20 border-dashed pointer-events-none animate-[spin_40s_linear_infinite]" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full border border-indigo-500/15 pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 rounded-2xl bg-[#0C1222]/95 border border-slate-800/90 shadow-2xl shadow-violet-950/30 overflow-hidden backdrop-blur-sm">
        
        {/* Top Orbit Header: Lunar Theme & Connection Status */}
        <div className="px-4 py-3 bg-[#0A0E1A] border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
              <Moon className="w-3.5 h-3.5 text-violet-300" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5 font-display">
                LunaLink Orbit
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-violet-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>2-Party Encrypted</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Visual: Two Connected Users with Lunar Bridge */}
          <div className="relative py-3 flex items-center justify-between">
            {/* User A: You */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 shadow-md shadow-violet-900/40">
                <div className="w-12 h-12 rounded-full bg-[#11182C] border-2 border-[#0C1222] flex items-center justify-center text-sm font-semibold text-white font-display">
                  AR
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-violet-600 rounded-full border-2 border-[#0C1222] flex items-center justify-center">
                  <Lock className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-white block">You</span>
                <span className="text-[10px] text-slate-400">Alex</span>
              </div>
            </div>

            {/* Central Connection Conduit & Moon Bridge */}
            <div className="flex-1 mx-3 flex flex-col items-center relative">
              {/* Glowing Line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-500 relative">
                <div className="absolute inset-0 bg-violet-400 blur-[2px] opacity-60" />
              </div>

              {/* Central Lunar Emblem */}
              <div className="my-1.5 p-1.5 rounded-xl bg-[#11182C] border border-violet-500/40 shadow-lg flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-violet-300" />
                <Sparkles className="w-3 h-3 text-amber-300" />
              </div>

              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                Direct Sync Link
              </span>
            </div>

            {/* User B: Partner */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 shadow-md shadow-sky-900/30">
                <div className="w-12 h-12 rounded-full bg-[#11182C] border-2 border-[#0C1222] flex items-center justify-center text-sm font-semibold text-white font-display">
                  EC
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-sky-500 rounded-full border-2 border-[#0C1222] flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-white block">Partner</span>
                <span className="text-[10px] text-slate-400">Elena</span>
              </div>
            </div>
          </div>

          {/* Central Shared Space Sanctuary (Mockup) */}
          <div className="p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                Mutual Shared Sanctuary
              </span>
              <span className="text-[10px] text-violet-300 font-medium">3 Shared Records</span>
            </div>

            {/* Shared Record Items */}
            <div className="space-y-1.5">
              <div className="p-2 rounded-lg bg-[#0C1222] border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                  <span className="truncate">Trip to Kyoto • Flight JL061</span>
                </div>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Mutual
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#0C1222] border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Wifi className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">Home Wi-Fi & Gate Passcode</span>
                </div>
                <span className="text-[10px] font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Encrypted
                </span>
              </div>
            </div>
          </div>

          {/* Controlled Information Sharing Controls (Interactive Demonstration) */}
          <div className="pt-2 border-t border-slate-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-violet-400" />
                Controlled Sharing Toggles
              </span>
              <span className="text-[10px] text-slate-400">Click to test sharing</span>
            </div>

            {/* Interactive Toggle Row 1: Itinerary */}
            <div
              onClick={() => setShareItinerary(!shareItinerary)}
              className="cursor-pointer p-2 rounded-xl bg-[#0A0E1A] hover:bg-slate-800/40 border border-slate-800/80 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-violet-400" />
                <div className="text-left">
                  <p className="text-xs font-medium text-slate-200">Travel Notes & Schedules</p>
                  <p className="text-[10px] text-slate-400">Shared to mutual space</p>
                </div>
              </div>
              <div
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                  shareItinerary ? 'bg-violet-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    shareItinerary ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>

            {/* Interactive Toggle Row 2: Location */}
            <div
              onClick={() => setShareLocation(!shareLocation)}
              className="cursor-pointer p-2 rounded-xl bg-[#0A0E1A] hover:bg-slate-800/40 border border-slate-800/80 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <div className="text-left">
                  <p className="text-xs font-medium text-slate-200">Real-Time Location</p>
                  <p className="text-[10px] text-slate-400">
                    {shareLocation ? 'Currently shared' : 'Kept strictly private to you'}
                  </p>
                </div>
              </div>
              <div
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                  shareLocation ? 'bg-violet-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    shareLocation ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              Unilateral Revocation at Any Time
            </span>
            <span className="font-mono">Zero public feed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
