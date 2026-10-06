import React from 'react';
import { useApp } from '../context/AppContext';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { HeroGraphic } from '../components/landing/HeroGraphic';
import { PrivacyFlowDiagram } from '../components/landing/PrivacyFlowDiagram';
import {
  ShieldCheck,
  Lock,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Sparkles,
  Users2,
  CheckCircle2,
  XCircle,
  Eye,
  KeyRound,
  FileText,
  UserPlus,
  Compass,
  Heart,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useApp();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080C15] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 1. Navbar */}
      <PublicNavbar />

      <main className="flex-1">
        {/* ================= 2. HERO SECTION ================= */}
        <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 overflow-hidden border-b border-slate-800/60">
          {/* Subtle Lunar Background Radiance */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-violet-900/20 via-indigo-900/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Copy & CTAs */}
              <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                <div className="inline-flex items-center gap-2 self-start">
                  <Badge
                    variant="shared"
                    size="md"
                    icon={<Sparkles className="w-3.5 h-3.5 text-violet-400" />}
                  >
                    Designed Strictly for Two People
                  </Badge>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white font-display leading-[1.12]">
                  One connection. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-200 to-sky-200">
                    Your private space.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                  LunaLink helps two people connect, share intentionally, and stay in control of their information.
                </p>

                {/* Core Action CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => navigateTo('signup')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Get Started
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => scrollToSection('how-it-works')}
                  >
                    See How It Works
                  </Button>
                </div>

                {/* Pitch Trust Highlights */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>Granular privacy control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>Strictly two people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Zero social feeds</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visually Impressive CSS/Component Hero Graphic */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <HeroGraphic />
              </div>

            </div>
          </div>
        </section>

        {/* ================= 3. WHY LUNALINK SECTION ================= */}
        <section id="why-lunalink" className="py-20 sm:py-28 bg-[#0A0E1A] border-b border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="neutral" size="sm" className="mb-3">
                The Core Thesis
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-display tracking-tight">
                Why LunaLink
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                Modern tools are built for public exposure or corporate meetings. LunaLink was built specifically for the intimacy, discretion, and autonomy of two people.
              </p>
            </div>

            {/* Pitch Problem vs Solution 3-Column Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Problem 1 vs LunaLink */}
              <div className="p-6 rounded-2xl bg-[#0C1222] border border-slate-800 hover:border-violet-500/40 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                    <span className="text-xs font-mono uppercase text-rose-400 font-semibold flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> Social Media
                    </span>
                    <span className="text-[11px] font-mono text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-500/30">
                      The Antidote
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white font-display mb-2">
                    Broadcast vs. Intimacy
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Social networks demand public performance, follower counts, and algorithmic attention. LunaLink eliminates all audiences: no followers, no public directory, and zero broadcasting.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Strictly 1-to-1 isolated channel</span>
                </div>
              </div>

              {/* Problem 2 vs LunaLink */}
              <div className="p-6 rounded-2xl bg-[#0C1222] border border-slate-800 hover:border-indigo-500/40 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                    <span className="text-xs font-mono uppercase text-rose-400 font-semibold flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> Messaging Apps
                    </span>
                    <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                      Structure
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white font-display mb-2">
                    Chat Clutter vs. Sanctuary
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Messaging apps bury flight numbers, gate codes, packing lists, and medical reminders under 10,000 text bubbles. LunaLink provides a structured, calm shared sanctuary where mutual essentials stay organized.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Organized records, zero scrollback hunt</span>
                </div>
              </div>

              {/* Problem 3 vs LunaLink */}
              <div className="p-6 rounded-2xl bg-[#0C1222] border border-slate-800 hover:border-sky-500/40 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                    <span className="text-xs font-mono uppercase text-rose-400 font-semibold flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> All-or-Nothing
                    </span>
                    <span className="text-[11px] font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                      Sovereignty
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white font-display mb-2">
                    Forced Exposure vs. Granular Choice
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Traditional apps force binary access: you either surrender your entire device or share nothing. LunaLink gives each partner independent, category-by-category toggle control with immediate unilateral revocation.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Live toggles & unilateral revocation</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. CORE FEATURES SECTION ================= */}
        <section id="features" className="py-20 sm:py-28 bg-[#080C15] border-b border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="neutral" size="sm" className="mb-3">
                Core Capabilities
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-display tracking-tight">
                Core Features
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                Built specifically around the needs of couples, close confidants, and intentional duos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1: Private Connection */}
              <Card variant="default" padding="lg" className="hover:border-violet-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-300 inline-block">
                      <Lock className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-violet-300 bg-violet-950/60 px-2.5 py-1 rounded-full border border-violet-500/30">
                      1-to-1 Architecture
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white font-display tracking-tight mb-2">
                    Private Connection
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    Connect with the person who matters through a controlled private space.
                  </p>
                </div>

                {/* Feature Micro-Preview */}
                <div className="p-3 rounded-xl bg-[#0A0E1A] border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-violet-400" />
                    <span>Single-Party Link Verification</span>
                  </div>
                  <Badge variant="success" size="sm">Active Corridor</Badge>
                </div>
              </Card>

              {/* Feature 2: Intentional Sharing */}
              <Card variant="default" padding="lg" className="hover:border-indigo-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 inline-block">
                      <SlidersHorizontal className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-500/30">
                      Selective Disclosure
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white font-display tracking-tight mb-2">
                    Intentional Sharing
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    Choose what you want to share instead of sharing everything by default.
                  </p>
                </div>

                {/* Feature Micro-Preview */}
                <div className="p-3 rounded-xl bg-[#0A0E1A] border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-400" />
                    <span>Category-by-Category Toggles</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">Zero forced defaults</span>
                </div>
              </Card>

              {/* Feature 3: Privacy Controls */}
              <Card variant="default" padding="lg" className="hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-300 inline-block">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      Continuous Sovereignty
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white font-display tracking-tight mb-2">
                    Privacy Controls
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    Stay in control of your personal information at every step.
                  </p>
                </div>

                {/* Feature Micro-Preview */}
                <div className="p-3 rounded-xl bg-[#0A0E1A] border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <span>Unilateral Revocation</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Instant cache wipe</span>
                </div>
              </Card>

              {/* Feature 4: Shared Space */}
              <Card variant="default" padding="lg" className="hover:border-sky-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl bg-sky-600/15 border border-sky-500/30 text-sky-300 inline-block">
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-sky-300 bg-sky-950/60 px-2.5 py-1 rounded-full border border-sky-500/30">
                      Unified Sanctuary
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white font-display tracking-tight mb-2">
                    Shared Space
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    Keep important shared information organized in one place.
                  </p>
                </div>

                {/* Feature Micro-Preview */}
                <div className="p-3 rounded-xl bg-[#0A0E1A] border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span>Notes, Itineraries & Passcodes</span>
                  </div>
                  <span className="text-[10px] text-sky-300 font-medium">Bilateral Sync</span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ================= 5. HOW IT WORKS SECTION ================= */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-[#0A0E1A] border-b border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="neutral" size="sm" className="mb-3">
                Simple Onboarding
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-display tracking-tight">
                How It Works
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                Connect and start sharing in four clear, deliberate steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Step 1: Create your account */}
              <div className="relative p-6 rounded-2xl bg-[#0C1222] border border-slate-800/80 flex flex-col justify-between hover:border-violet-500/40 transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center font-display font-semibold text-violet-300 text-sm mb-4">
                    01
                  </div>
                  <h3 className="text-base font-semibold text-white font-display mb-2">
                    Create your account
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sign up with your credentials in seconds. Your account remains isolated and non-discoverable by default.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-violet-400 font-medium">Fast registration</span>
                  <UserPlus className="w-3.5 h-3.5 text-violet-400" />
                </div>
              </div>

              {/* Step 2: Connect your partner */}
              <div className="relative p-6 rounded-2xl bg-[#0C1222] border border-slate-800/80 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center font-display font-semibold text-indigo-300 text-sm mb-4">
                    02
                  </div>
                  <h3 className="text-base font-semibold text-white font-display mb-2">
                    Connect your partner
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Generate an ephemeral invite code or scan a direct QR code. Both parties must mutually accept to establish the connection.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-400 font-medium">Mutual authorization</span>
                  <Users2 className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              </div>

              {/* Step 3: Choose what to share */}
              <div className="relative p-6 rounded-2xl bg-[#0C1222] border border-slate-800/80 flex flex-col justify-between hover:border-sky-500/40 transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-500/30 flex items-center justify-center font-display font-semibold text-sky-300 text-sm mb-4">
                    03
                  </div>
                  <h3 className="text-base font-semibold text-white font-display mb-2">
                    Choose what to share
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Enable or disable specific categories such as notes, itineraries, or preferences with individual switches.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-sky-400 font-medium">Granular toggles</span>
                  <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                </div>
              </div>

              {/* Step 4: Use your shared space */}
              <div className="relative p-6 rounded-2xl bg-[#0C1222] border border-slate-800/80 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center font-display font-semibold text-emerald-300 text-sm mb-4">
                    04
                  </div>
                  <h3 className="text-base font-semibold text-white font-display mb-2">
                    Use your shared space
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Collaborate on mutual notes, trip schedules, emergency contacts, and shared memories in a quiet, distraction-free environment.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-medium">Synchronized sanctuary</span>
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. PRIVACY FIRST SECTION ================= */}
        <section id="privacy-first" className="py-20 sm:py-28 bg-[#080C15] border-b border-slate-800/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-violet-600/15 border border-violet-500/30 text-violet-300 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white font-display tracking-tight leading-tight">
                Connection should never mean giving up control.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
                In most apps, closeness comes at the price of complete surveillance. LunaLink rejects the false trade-off between intimacy and personal autonomy. You can share what brings you together while keeping what is yours strictly protected.
              </p>
            </div>

            {/* Visual: MY INFORMATION → MY CONTROL & SHARED INFORMATION → MUTUAL SPACE */}
            <PrivacyFlowDiagram />

            {/* Privacy Pillars Grid */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="p-5 rounded-xl bg-[#0C1222] border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 mb-3">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white font-display mb-1.5">
                  Unilateral Revocation
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You can toggle off any shared field or disconnect entirely at any time. When you disconnect, remote cached access is instantly terminated.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0C1222] border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white font-display mb-1.5">
                  Independent Toggles
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  One partner deciding to share their food preferences does not coerce the other. Both individuals maintain separate permission states.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0C1222] border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-300 mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white font-display mb-1.5">
                  Zero Algorithmic Profiling
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No advertising trackers, no engagement algorithms, and no recommendations. Your private shared sanctuary exists purely for the two of you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6.5 THE FOUR CORE PILLARS & STARTUP SAFETY FOUNDATION ================= */}
        <section id="pillars" className="py-20 sm:py-28 bg-[#090E1B] border-b border-slate-800/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="shared" size="sm" className="mb-3">
                Architectural Framework
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white font-display tracking-tight">
                The Four Pillars of LunaLink
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                A purpose-built ecosystem designed to connect self-understanding with partner empathy, while giving you complete data sovereignty.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* Pillar 1 */}
              <div className="p-6 rounded-2xl bg-[#0D1424] border border-slate-800/90 flex flex-col justify-between hover:border-rose-500/40 transition-all group">
                <div>
                  <div className="p-3 rounded-xl bg-rose-600/15 border border-rose-500/30 text-rose-400 w-fit mb-4 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold">Pillar 1</span>
                  <h3 className="text-lg font-semibold text-white font-display mt-1 mb-2">
                    Understand Yourself
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Track your cycle phases, log physical symptoms, and recognize recurring bodily patterns without external judgment.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Cycle & Phase Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Symptoms & Pain Journal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Personal Health Patterns</span>
                  </div>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-6 rounded-2xl bg-[#0D1424] border border-slate-800/90 flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
                <div>
                  <div className="p-3 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 w-fit mb-4 group-hover:scale-105 transition-transform">
                    <Users2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">Pillar 2</span>
                  <h3 className="text-lg font-semibold text-white font-display mt-1 mb-2">
                    How You Want Support
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Define your Care DNA and comfort boundaries so your partner knows exactly what helps before awkward moments arise.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Care DNA Profiling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Comfort Preferences</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Partner Connection Space</span>
                  </div>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-6 rounded-2xl bg-[#0D1424] border border-slate-800/90 flex flex-col justify-between hover:border-violet-500/40 transition-all group">
                <div>
                  <div className="p-3 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-400 w-fit mb-4 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 font-semibold">Pillar 3</span>
                  <h3 className="text-lg font-semibold text-white font-display mt-1 mb-2">
                    Prepare Support
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Equip your partner with proactive guidance, one-tap Care Mode, curated care suggestions, and shared reminder dates.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span>Predictive Support Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span>One-Tap Care Mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span>Shared Calendar & Errands</span>
                  </div>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-6 rounded-2xl bg-[#0D1424] border border-slate-800/90 flex flex-col justify-between hover:border-sky-500/40 transition-all group">
                <div>
                  <div className="p-3 rounded-xl bg-sky-600/15 border border-sky-500/30 text-sky-400 w-fit mb-4 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-semibold">Pillar 4</span>
                  <h3 className="text-lg font-semibold text-white font-display mt-1 mb-2">
                    Stay In Control
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Granular consent switches for every single data category with unilateral, instant revocation anytime.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Zero Automatic Health Sharing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Category-by-Category Toggles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Unilateral Revocation & Wipe</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Startup & Clinical Safety Boundaries Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B101E] to-[#0A0D18] border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                      Safety & Scope Distinction
                    </h3>
                    <p className="text-xs text-slate-400">
                      Clear operational boundaries established for clinical integrity and user trust.
                    </p>
                  </div>
                </div>
                <Badge variant="subtle" size="sm" className="self-start sm:self-auto font-mono text-amber-300 border-amber-500/30">
                  Non-Medical Standard
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* What LunaLink IS */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300 font-display">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>What LunaLink IS</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>A personalized women's-health and care platform:</strong> Focused on holistic self-understanding and supportive relationships.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>A support and personalization system:</strong> Translating personal preferences into clear, gentle partner actions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>A tool for organizing health information:</strong> Equipping users with exportable data summaries to review with licensed practitioners.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>An emotional sanctuary:</strong> Preserving appreciation notes and shared memories alongside physical wellness.</span>
                    </li>
                  </ul>
                </div>

                {/* What LunaLink IS NOT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-rose-300 font-display">
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>What LunaLink IS NOT</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span><strong>NOT a doctor replacement or medical service:</strong> Does not offer triage, urgent advice, or medical interventions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span><strong>NOT a PCOS diagnostic machine:</strong> Does not diagnose endocrine, reproductive, or gynecological pathologies.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span><strong>NOT a medication-prescribing AI:</strong> Never recommends or dispenses pharmaceuticals or treatment dosages.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span><strong>NOT just a period tracker, couples app, or chatbot:</strong> It is an intentional 1-to-1 care-sharing infrastructure.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 7. CALL TO ACTION SECTION ================= */}
        <section id="cta" className="py-20 sm:py-28 bg-[#0A0E1A] relative overflow-hidden">
          {/* Subtle Lunar Ambient Halo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12),transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <Card variant="glow" padding="lg" className="border-violet-500/40 py-12 px-6 sm:px-12">
              <div className="max-w-2xl mx-auto space-y-6">
                <Badge variant="shared" size="md" className="mx-auto">
                  Start In Under 60 Seconds
                </Badge>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white font-display tracking-tight">
                  Ready to create your private connection?
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Step into a calm, one-to-one digital sanctuary designed around explicit consent, mutual trust, and total control.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => navigateTo('signup')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Get Started
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigateTo('login')}
                  >
                    Sign In to Existing Space
                  </Button>
                </div>

                <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    No credit card required
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Strictly two people
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Unilateral control guaranteed
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <PublicFooter />
    </div>
  );
};
