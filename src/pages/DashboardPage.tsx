import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { supportInsightsService } from '../services/supportInsightsService';
import {
  Link2,
  Calendar,
  ShieldCheck,
  Sparkles,
  Bell,
  ArrowRight,
  FileText,
  Clock,
  Lock,
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal,
  UserCheck,
  Activity as ActivityIcon,
  RefreshCw,
  Power,
  Lightbulb,
  Bookmark,
  Heart,
  Stethoscope,
  BriefcaseMedical,
  HeartHandshake,
  CalendarCheck,
  AlertCircle,
  Eye,
  Check,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    user,
    partner,
    connection,
    navigateTo,
    privacySettings,
    activities,
    unreadNotificationCount,
    setConnectionStatusDirectly,
    cycleStats,
    cycles,
    symptoms,
    careProfile,
    careMode,
    reminders,
  } = useApp();

  const [activityFilter, setActivityFilter] = useState<'all' | 'privacy' | 'notes'>('all');

  const isConnected = connection.status === 'connected' && !!partner;
  const sharedCategoriesCount = privacySettings.filter((s) => s.isShared).length;
  const totalCategoriesCount = privacySettings.length || 6;

  // Next upcoming shared/practical reminder
  const nextReminder = useMemo(() => {
    const pending = reminders.filter((r) => !r.isCompleted);
    if (pending.length === 0) return null;
    return [...pending].sort((a, b) => {
      const timeA = a.time.includes(':') ? a.time : '12:00 PM';
      const timeB = b.time.includes(':') ? b.time : '12:00 PM';
      return new Date(`${a.date}T${timeA}`).getTime() - new Date(`${b.date}T${timeB}`).getTime();
    })[0];
  }, [reminders]);

  // Next estimated support insight window
  const supportInsight = useMemo(() => {
    try {
      return supportInsightsService.generateInsight(
        cycles,
        symptoms,
        careProfile,
        cycleStats
      );
    } catch {
      return null;
    }
  }, [cycles, symptoms, careProfile, cycleStats]);

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    if (activityFilter === 'privacy') return act.type.includes('privacy');
    if (activityFilter === 'notes') return act.type.includes('note');
    return true;
  });

  const firstName = user.name.split(' ')[0] || 'there';

  // 12 Full Feature Navigation Items
  const allFeatures = [
    {
      id: 'my-cycle',
      title: 'My Cycle',
      description: 'Menstrual cycle tracking, phase analysis & predictions',
      category: 'Health',
      icon: Calendar,
      accent: 'rose',
      tag: `Day ${cycleStats.currentCycleDay || 18}`,
      route: 'cycle-calendar' as const,
    },
    {
      id: 'symptoms-pain',
      title: 'Symptoms & Pain',
      description: 'Log physical sensations, cramps, pain intensity & triggers',
      category: 'Health',
      icon: ActivityIcon,
      accent: 'amber',
      tag: `${symptoms.length} logs recorded`,
      route: 'symptoms-pain' as const,
    },
    {
      id: 'care-profile',
      title: 'Care Profile',
      description: 'Your personalized comfort preferences & communication guide',
      category: 'Care',
      icon: Heart,
      accent: 'indigo',
      tag: careProfile.isSharedWithPartner ? 'Shared' : 'Private to You',
      route: 'care-profile' as const,
    },
    {
      id: 'partner-connection',
      title: 'Partner Connection',
      description: '1-to-1 pairing, encrypted link & sharing boundaries',
      category: 'Connection',
      icon: Link2,
      accent: 'violet',
      tag: isConnected ? 'Connected' : 'Unpaired',
      route: (isConnected ? 'partner-profile' : 'connect-partner') as 'partner-profile' | 'connect-partner',
    },
    {
      id: 'care-mode',
      title: 'Care Mode',
      description: 'Instant zero-explanation support signal for your partner',
      category: 'Care',
      icon: Power,
      accent: 'rose',
      tag: careMode.isActive ? 'Active Now' : 'Standing By',
      route: 'care-mode' as const,
    },
    {
      id: 'support-insights',
      title: 'Support Insights',
      description: 'Gentle pattern-based advance windows for your partner',
      category: 'Support',
      icon: Sparkles,
      accent: 'violet',
      tag: supportInsight ? `In ~${supportInsight.daysUntilWindow} days` : 'Pattern Ready',
      route: 'support-insights' as const,
    },
    {
      id: 'care-suggestions',
      title: 'Care Suggestions',
      description: 'Personalized comfort recommendations with privacy filtering',
      category: 'Support',
      icon: Lightbulb,
      accent: 'amber',
      tag: 'Permission-Filtered',
      route: 'care-suggestions' as const,
    },
    {
      id: 'shared-calendar',
      title: 'Shared Calendar',
      description: 'Coordinated practical reminders, supplies & appointments',
      category: 'Shared',
      icon: CalendarCheck,
      accent: 'sky',
      tag: `${reminders.length} Reminders`,
      route: 'shared-calendar' as const,
    },
    {
      id: 'memory-vault',
      title: 'Memory Vault',
      description: 'Shared notes, affirmations, gratitude & milestones',
      category: 'Shared',
      icon: Bookmark,
      accent: 'rose',
      tag: 'Private & Shared',
      route: 'memory-vault' as const,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Security notices, partner interactions & care alerts',
      category: 'Account',
      icon: Bell,
      accent: 'sky',
      tag: unreadNotificationCount > 0 ? `${unreadNotificationCount} unread` : 'All clear',
      route: 'notifications' as const,
    },
    {
      id: 'womens-health',
      title: "Women's Health",
      description: 'Longitudinal health signals & life stage context',
      category: 'Health',
      icon: Stethoscope,
      accent: 'rose',
      tag: 'Non-Diagnostic',
      route: 'womens-health' as const,
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      description: 'Patient-controlled summaries prepared for clinician visits',
      category: 'Health',
      icon: BriefcaseMedical,
      accent: 'cyan',
      tag: 'Clinical Prep',
      route: 'healthcare' as const,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* ================= 1. WELCOME & CONTROL CENTER HEADER ================= */}
      <section
        id="dashboard-welcome"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/70"
      >
        <div className="flex items-center gap-3.5 sm:gap-4">
          <Avatar
            src={user.avatar}
            name={user.name}
            size="lg"
            statusIndicator={isConnected ? 'sharing' : 'private'}
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white font-display tracking-tight">
                Good evening, {firstName}
              </h1>
              {isConnected ? (
                <Badge variant="shared" size="sm" icon={<Lock className="w-3 h-3 text-violet-400" />}>
                  Encrypted Space Active
                </Badge>
              ) : (
                <Badge variant="private" size="sm">
                  Solo Mode
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              LunaLink Central Control Center • Coordinated care with sovereign privacy.
            </p>
          </div>
        </div>

        {/* Presentation State Switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-[#0C1222] p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400 px-2 font-mono">Demo mode:</span>
          <button
            type="button"
            onClick={() => setConnectionStatusDirectly('connected')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              isConnected
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Connected
          </button>
          <button
            type="button"
            onClick={() => setConnectionStatusDirectly('disconnected')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              !isConnected
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Not Connected
          </button>
        </div>
      </section>

      {/* ================= 2. PARTNER CONNECTION CARD ================= */}
      <section id="dashboard-connection-card">
        <Card
          variant={isConnected ? 'glow' : 'elevated'}
          padding="lg"
          className="relative overflow-hidden transition-all duration-300"
        >
          {isConnected && partner ? (
            /* CONNECTED STATE */
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                <Avatar
                  src={partner.avatar}
                  name={partner.name}
                  size="xl"
                  statusIndicator="online"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                      Partner Connection:
                    </span>
                    <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-emerald-400" />}>
                      Active • 1-to-1 Encrypted
                    </Badge>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
                    Connected with {partner.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300">
                    Your private shared space is operational. Only information you explicitly share is visible.
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Linked since {connection.connectedSince || partner.connectedAt}
                    </span>
                    <span>•</span>
                    <span>Timezone: {partner.timezone}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigateTo('partner-profile')}
                  leftIcon={<UserCheck className="w-4 h-4 text-violet-400" />}
                >
                  Partner Profile
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigateTo('shared-space')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Go to Shared Space
                </Button>
              </div>
            </div>
          ) : (
            /* NOT CONNECTED STATE */
            <div className="text-center py-6 sm:py-8 max-w-xl mx-auto space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-300 shadow-inner">
                <Link2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Partner Status: Unpaired</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-semibold text-white font-display tracking-tight">
                  Your LunaLink connection starts here.
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  Connect with someone you trust to create your secure, private shared space with zero guesswork.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigateTo('connect-partner')}
                  leftIcon={<Link2 className="w-4 h-4" />}
                >
                  Connect Partner
                </Button>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* ================= 3. PRIMARY DASHBOARD CARDS (PRIORITIZED) ================= */}
      <section id="dashboard-primary-cards" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-display">
              Primary Control Cards
            </h2>
            <p className="text-xs text-slate-400">
              Key operational metrics prioritized for everyday care and peace of mind
            </p>
          </div>
          <span className="text-[11px] text-violet-400 font-mono">
            {isConnected ? '1-to-1 Encrypted' : 'Solo Sanctuary'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* PRIMARY CARD 1: CYCLE (Priority 1) */}
          <Card
            variant="default"
            padding="md"
            className="border-slate-800/90 bg-gradient-to-br from-[#0F1424] via-[#0B101E] to-[#0A0E1A] hover:border-rose-500/40 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-rose-600/15 border border-rose-500/30 text-rose-300 group-hover:scale-105 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-display group-hover:text-rose-200 transition-colors">
                      My Cycle
                    </h3>
                    <p className="text-[11px] text-slate-400">Menstrual Health</p>
                  </div>
                </div>
                <Badge variant="private" size="sm" icon={<Lock className="w-3 h-3 text-emerald-400" />}>
                  Private
                </Badge>
              </div>

              {/* Cycle Metrics: Day & Next Period */}
              <div className="p-3.5 rounded-xl bg-[#080C16] border border-slate-800/80 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Current Day</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white font-display">
                      Day {cycleStats.currentCycleDay || 18}
                    </span>
                    <span className="text-xs text-slate-400">/ {cycleStats.averageCycleLength || 28}d</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((cycleStats.currentCycleDay || 18) / (cycleStats.averageCycleLength || 28)) * 100)}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">Next Estimated Period</span>
                  <span className="font-semibold text-rose-300 font-mono">
                    {cycleStats.nextEstimatedPeriodStart || 'Sept 25, 2026'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/70 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Estimated ~{Math.max(1, (cycleStats.averageCycleLength || 28) - (cycleStats.currentCycleDay || 18))} days away
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('cycle-calendar')}
                className="text-rose-400 hover:text-rose-300 p-0 h-auto"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Open Cycle
              </Button>
            </div>
          </Card>

          {/* PRIMARY CARD 2: CARE MODE (Priority 2) */}
          <Card
            variant="default"
            padding="md"
            className={`border-slate-800/90 transition-all flex flex-col justify-between group ${
              careMode.isActive
                ? 'bg-gradient-to-br from-rose-950/30 via-[#0E1528] to-[#0A0E1A] border-rose-500/40 hover:border-rose-400/60'
                : 'bg-gradient-to-br from-[#0F1424] via-[#0B101E] to-[#0A0E1A] hover:border-violet-500/40'
            }`}
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2.5 rounded-xl border transition-transform group-hover:scale-105 ${
                      careMode.isActive
                        ? 'bg-rose-600/20 border-rose-500/40 text-rose-300'
                        : 'bg-violet-600/15 border-violet-500/30 text-violet-300'
                    }`}
                  >
                    <Power className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-display group-hover:text-violet-200 transition-colors">
                      Care Mode
                    </h3>
                    <p className="text-[11px] text-slate-400">Immediate Support Signal</p>
                  </div>
                </div>

                {careMode.isActive ? (
                  <Badge variant="danger" size="sm" icon={<span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />}>
                    Active
                  </Badge>
                ) : (
                  <Badge variant="subtle" size="sm">
                    Standby
                  </Badge>
                )}
              </div>

              {/* Care Mode Status Details */}
              <div className="p-3.5 rounded-xl bg-[#080C16] border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Signal Status</span>
                  <span
                    className={`text-xs font-semibold ${
                      careMode.isActive ? 'text-rose-300' : 'text-slate-300'
                    }`}
                  >
                    {careMode.isActive ? 'Active — Guiding Partner' : 'Off • Ready When Needed'}
                  </span>
                </div>

                {careMode.isActive && ((careMode.options?.length ?? 0) > 0 || ((careMode.activeOptions?.length ?? 0) > 0)) ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(careMode.options || careMode.activeOptions || []).slice(0, 3).map((opt) => (
                      <span
                        key={opt}
                        className="px-2 py-0.5 rounded-md bg-rose-950/70 border border-rose-500/40 text-[10px] text-rose-200 font-medium truncate max-w-[150px]"
                      >
                        {opt}
                      </span>
                    ))}
                    {(careMode.options || careMode.activeOptions || []).length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{(careMode.options || careMode.activeOptions || []).length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Zero-explanation support signal. Let your trusted partner know how to help today.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/70 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {careMode.isActive ? 'Partner guidance active' : 'No awkward talks needed'}
              </span>
              <Button
                variant={careMode.isActive ? 'danger' : 'secondary'}
                size="sm"
                onClick={() => navigateTo('care-mode')}
                className="p-0 h-auto font-medium"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                {careMode.isActive ? 'Manage Care Mode' : 'Activate Mode'}
              </Button>
            </div>
          </Card>

          {/* PRIMARY CARD 3: SHARED CALENDAR (Priority 4) */}
          <Card
            variant="default"
            padding="md"
            className="border-slate-800/90 bg-gradient-to-br from-[#0F1424] via-[#0B101E] to-[#0A0E1A] hover:border-sky-500/40 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-sky-600/15 border border-sky-500/30 text-sky-300 group-hover:scale-105 transition-transform">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-display group-hover:text-sky-200 transition-colors">
                      Shared Calendar
                    </h3>
                    <p className="text-[11px] text-slate-400">Practical Support Reminders</p>
                  </div>
                </div>

                {nextReminder ? (
                  <Badge variant={nextReminder.isSharedWithPartner ? 'shared' : 'private'} size="sm">
                    {nextReminder.isSharedWithPartner ? 'Shared' : 'Private'}
                  </Badge>
                ) : (
                  <Badge variant="subtle" size="sm">
                    Up to date
                  </Badge>
                )}
              </div>

              {/* Next Shared Reminder Content */}
              <div className="p-3.5 rounded-xl bg-[#080C16] border border-slate-800/80 space-y-1.5">
                <span className="text-xs text-slate-400">Next Reminder</span>
                {nextReminder ? (
                  <div>
                    <p className="text-sm font-semibold text-white truncate">
                      {nextReminder.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="font-mono text-sky-300">{nextReminder.date}</span>
                      <span>•</span>
                      <span>{nextReminder.time}</span>
                      <span>•</span>
                      <span className="text-slate-300 font-medium px-1.5 py-0.2 rounded bg-slate-800/80 text-[10px]">
                        {nextReminder.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No pending reminders scheduled. Add comfort errands or check-ins anytime.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/70 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {reminders.filter((r) => !r.isCompleted).length} pending tasks
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('shared-calendar')}
                className="text-sky-400 hover:text-sky-300 p-0 h-auto"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Open Calendar
              </Button>
            </div>
          </Card>

          {/* PRIMARY CARD 4: SUPPORT INSIGHTS */}
          <Card
            variant="default"
            padding="md"
            className="border-slate-800/90 bg-gradient-to-br from-[#0F1424] via-[#0B101E] to-[#0A0E1A] hover:border-violet-500/40 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-300 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-display group-hover:text-violet-200 transition-colors">
                      Support Insights
                    </h3>
                    <p className="text-[11px] text-slate-400">Upcoming Support Window</p>
                  </div>
                </div>

                <Badge variant="shared" size="sm" icon={<Lock className="w-3 h-3 text-emerald-400" />}>
                  Non-Medical
                </Badge>
              </div>

              {/* Upcoming Support Window Insight */}
              <div className="p-3.5 rounded-xl bg-[#080C16] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Estimated Window</span>
                  <span className="text-xs font-semibold text-violet-300 font-mono">
                    {supportInsight ? `In ~${supportInsight.daysUntilWindow} days` : 'Analyzing'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {supportInsight?.partnerMessagePreview ||
                    'Pattern estimation based on your cycle and Care Profile history.'}
                </p>

                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-violet-950/60 border border-violet-500/30 text-violet-300 font-medium">
                    {supportInsight?.confidence === 'insufficient'
                      ? 'Building Data'
                      : 'Pattern Confidence High'}
                  </span>
                  <span>•</span>
                  <span>{supportInsight?.estimatedWindowStart || 'Sep 23'} - {supportInsight?.estimatedWindowEnd || 'Sep 25'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/70 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Helps partner plan gentle timing
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('support-insights')}
                className="text-violet-400 hover:text-violet-300 p-0 h-auto"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                View Insights
              </Button>
            </div>
          </Card>

          {/* PRIMARY CARD 5: PRIVACY SHARING STATUS (Priority 5) */}
          <Card
            variant="default"
            padding="md"
            className="border-slate-800/90 bg-gradient-to-br from-[#0F1424] via-[#0B101E] to-[#0A0E1A] hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-300 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-display group-hover:text-emerald-200 transition-colors">
                      Privacy & Sovereignty
                    </h3>
                    <p className="text-[11px] text-slate-400">Granular Permission Status</p>
                  </div>
                </div>

                <Badge variant={sharedCategoriesCount > 0 ? 'shared' : 'private'} size="sm">
                  {sharedCategoriesCount > 0 ? 'Selective' : 'Private'}
                </Badge>
              </div>

              {/* Privacy Metrics */}
              <div className="p-3.5 rounded-xl bg-[#080C16] border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Current Sharing</span>
                  <span className="text-xs font-semibold text-emerald-300 font-mono">
                    {sharedCategoriesCount} of {totalCategoriesCount} Categories Shared
                  </span>
                </div>

                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden flex gap-0.5">
                  {privacySettings.map((item) => (
                    <div
                      key={item.id}
                      className={`h-full flex-1 transition-colors duration-300 ${
                        item.isShared ? 'bg-emerald-500' : 'bg-slate-700/60'
                      }`}
                      title={`${item.title}: ${item.isShared ? 'Shared' : 'Private'}`}
                    />
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5">
                  Zero default sharing. You can revoke any permission at any moment without disconnecting.
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/70 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                100% Patient & User Owned
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('privacy-sharing')}
                className="text-emerald-400 hover:text-emerald-300 p-0 h-auto"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Manage Sharing
              </Button>
            </div>
          </Card>

          {/* PRIMARY CARD 6: CARE PROFILE (Care DNA) */}
          <Card
            variant="default"
            padding="md"
            className="border-slate-800/90 bg-gradient-to-br from-[#0F1424] via-[#0B101E] to-[#0A0E1A] hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-display group-hover:text-indigo-200 transition-colors">
                      Care Profile
                    </h3>
                    <p className="text-[11px] text-slate-400">Your Unique Care DNA</p>
                  </div>
                </div>

                <Badge variant={careProfile.isSharedWithPartner ? 'shared' : 'private'} size="sm">
                  {careProfile.isSharedWithPartner ? 'Shared' : 'Private'}
                </Badge>
              </div>

              {/* Care DNA highlights */}
              <div className="p-3.5 rounded-xl bg-[#080C16] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Communication Need</span>
                  <span className="text-xs font-semibold text-indigo-300 capitalize">
                    {careProfile.communicationNeed || 'Gentle Presence'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Comfort Items</span>
                  <span className="text-xs text-slate-300">
                    {careProfile.comfort?.length || 4} saved preferences
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5">
                  Teaches your partner how you like to be supported before high-stress moments arrive.
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/70 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {careProfile.isSharedWithPartner ? 'Visible to partner' : 'Private blueprint'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('care-profile')}
                className="text-indigo-400 hover:text-indigo-300 p-0 h-auto"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                View Care DNA
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* ================= 4. ALL 12 LUNALINK FEATURES NAVIGATION HUB ================= */}
      <section id="dashboard-all-features-hub" className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-display">
              LunaLink Care Tools & Feature Directory
            </h2>
            <p className="text-xs text-slate-400">
              Access all 12 core modules from your central command dashboard
            </p>
          </div>
          <span className="text-[11px] text-slate-400">
            12 of 12 features integrated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {allFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.id}
                type="button"
                id={`feature-card-${feat.id}`}
                onClick={() => navigateTo(feat.route)}
                className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800/80 hover:border-violet-500/40 hover:bg-[#0E1528] transition-all text-left flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className={`p-2.5 rounded-xl border flex-shrink-0 group-hover:scale-105 transition-transform ${
                        feat.accent === 'rose'
                          ? 'bg-rose-600/15 border-rose-500/30 text-rose-300'
                          : feat.accent === 'amber'
                          ? 'bg-amber-600/15 border-amber-500/30 text-amber-300'
                          : feat.accent === 'indigo'
                          ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-300'
                          : feat.accent === 'sky'
                          ? 'bg-sky-600/15 border-sky-500/30 text-sky-300'
                          : feat.accent === 'cyan'
                          ? 'bg-cyan-600/15 border-cyan-500/30 text-cyan-300'
                          : 'bg-violet-600/15 border-violet-500/30 text-violet-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
                        {feat.tag}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-violet-200 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="capitalize">{feat.category}</span>
                  <span className="text-violet-400 group-hover:text-violet-300 font-medium">
                    Open →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= 5. PRIVACY SUMMARY & RECENT ACTIVITY AUDIT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PRIVACY SUMMARY (5 cols on desktop) */}
        <section id="dashboard-privacy-summary" className="lg:col-span-5 space-y-4">
          <Card variant="default" padding="lg" className="border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white font-display">
                      Your Privacy Balance
                    </h2>
                    <p className="text-xs text-slate-400">
                      Sovereignty & sharing overview
                    </p>
                  </div>
                </div>

                <Badge variant={sharedCategoriesCount > 0 ? 'shared' : 'private'} size="sm">
                  Active
                </Badge>
              </div>

              {/* Status Display: "4 of 6 categories shared" */}
              <div className="my-5 p-4 rounded-xl bg-[#0A0E1A] border border-slate-800/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">
                    Sharing Balance
                  </span>
                  <span className="text-sm font-semibold text-violet-300 font-mono">
                    {sharedCategoriesCount} of {totalCategoriesCount} categories shared
                  </span>
                </div>

                {/* Progress Visual */}
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden flex gap-0.5">
                  {privacySettings.map((item) => (
                    <div
                      key={item.id}
                      className={`h-full flex-1 transition-colors duration-300 ${
                        item.isShared ? 'bg-violet-500' : 'bg-slate-700/60'
                      }`}
                      title={`${item.title}: ${item.isShared ? 'Shared' : 'Private'}`}
                    />
                  ))}
                </div>

                {/* Categories quick tag list */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                  {privacySettings.slice(0, 4).map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0E1526] border border-slate-800/60"
                    >
                      <span className="text-slate-300 truncate mr-1.5">{cat.title}</span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          cat.isShared
                            ? 'bg-violet-950/60 text-violet-300 border border-violet-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cat.isShared ? 'Shared' : 'Private'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px] text-slate-400">
                  You retain complete sovereignty. Revoking any permission takes effect immediately across all shared spaces.
                </p>
              </div>
            </div>

            {/* Manage Privacy Button */}
            <div className="pt-5 mt-5 border-t border-slate-800/80">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigateTo('privacy-sharing')}
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Manage Privacy Controls
              </Button>
            </div>
          </Card>
        </section>

        {/* RECENT ACTIVITY (7 cols on desktop) */}
        <section id="dashboard-recent-activity" className="lg:col-span-7 space-y-4">
          <Card variant="default" padding="lg" className="border-slate-800">
            {/* Header with Activity Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-600/15 border border-sky-500/30 text-sky-300">
                  <ActivityIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white font-display">
                    Recent Activity
                  </h2>
                  <p className="text-xs text-slate-400">
                    Audit trail of shared actions & updates
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#0A0E1A] p-1 rounded-xl border border-slate-800/80 self-start sm:self-auto text-xs">
                <button
                  type="button"
                  onClick={() => setActivityFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activityFilter === 'all'
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActivityFilter('privacy')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activityFilter === 'privacy'
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Privacy
                </button>
                <button
                  type="button"
                  onClick={() => setActivityFilter('notes')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activityFilter === 'notes'
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Notes
                </button>
              </div>
            </div>

            {/* Activities List or Polished Empty State */}
            {filteredActivities.length > 0 ? (
              <div className="divide-y divide-slate-800/70">
                {filteredActivities.map((act) => {
                  const isNote = act.type.includes('note');
                  const isPrivacy = act.type.includes('privacy');
                  const isConnection = act.type.includes('connection');

                  return (
                    <div
                      key={act.id}
                      className="py-3.5 first:pt-2 last:pb-1 flex items-start gap-3.5 group hover:bg-[#0B101E]/60 -mx-3 px-3 rounded-xl transition-colors"
                    >
                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                          isNote
                            ? 'bg-indigo-950/60 border-indigo-500/30 text-indigo-400'
                            : isPrivacy
                            ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                            : isConnection
                            ? 'bg-violet-950/60 border-violet-500/30 text-violet-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {isNote ? (
                          <FileText className="w-4 h-4" />
                        ) : isPrivacy ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : isConnection ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <SlidersHorizontal className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                            {act.title}
                          </p>
                          <span className="text-[11px] text-slate-400 whitespace-nowrap font-mono">
                            {act.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {act.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                          <span>By {act.actorName}</span>
                          <span>•</span>
                          <span className="text-emerald-400/80">Encrypted</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* POLISHED EMPTY STATE */
              <div className="text-center py-10 px-4 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    No activities match this filter
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Actions like updating privacy settings, creating shared notes, or connecting with your partner will be logged here.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActivityFilter('all')}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Reset Filter
                </Button>
              </div>
            )}

            {/* Bottom link to view shared space */}
            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Showing {filteredActivities.length} recent events
              </span>
              <button
                type="button"
                onClick={() => navigateTo('shared-space')}
                className="text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition-colors focus:outline-none focus-visible:underline"
              >
                <span>Open Shared Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};
