import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppPage } from '../../types';
import { Logo } from '../ui/Logo';
import { Avatar } from '../ui/Avatar';
import {
  LayoutDashboard,
  Calendar,
  HeartPulse,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Link2,
  UserCheck,
  Bell,
  Settings,
  User as UserIcon,
  LogOut,
  ChevronRight,
  ExternalLink,
  Power,
  Lightbulb,
  CalendarDays,
  Bookmark,
  Stethoscope,
  BriefcaseMedical,
} from 'lucide-react';

interface AppSidebarProps {
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ onCloseMobile }) => {
  const {
    currentPage,
    navigateTo,
    user,
    partner,
    connection,
    unreadNotificationCount,
    logout,
    setConnectionStatusDirectly,
    careMode,
  } = useApp();

  const handleNav = (page: AppPage) => {
    navigateTo(page);
    if (onCloseMobile) onCloseMobile();
  };

  interface NavItem {
    id: AppPage;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    isHighlighted?: boolean;
  }

  const navSections: {
    title?: string;
    items: NavItem[];
  }[] = [
    {
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Understand Yourself',
      items: [
        {
          id: 'cycle-calendar',
          label: 'My Cycle',
          icon: <Calendar className="w-4 h-4 text-rose-400" />,
        },
        {
          id: 'symptoms-pain',
          label: 'Symptoms & Pain',
          icon: <HeartPulse className="w-4 h-4 text-amber-400" />,
        },
        {
          id: 'womens-health',
          label: "Women's Health",
          icon: <Stethoscope className="w-4 h-4 text-pink-400" />,
        },
        {
          id: 'healthcare',
          label: 'Healthcare',
          icon: <BriefcaseMedical className="w-4 h-4 text-cyan-400" />,
        },
      ],
    },
    {
      title: 'How You Want Support',
      items: [
        {
          id: 'care-profile',
          label: 'Care Profile & DNA',
          icon: <HeartHandshake className="w-4 h-4 text-emerald-400" />,
        },
        {
          id: 'connect-partner',
          label: 'Partner Connection',
          icon: <Link2 className="w-4 h-4 text-indigo-400" />,
        },
      ],
    },
    {
      title: 'Prepare Support',
      items: [
        {
          id: 'care-mode',
          label: 'Care Mode',
          icon: <Power className={`w-4 h-4 ${careMode.isActive ? 'text-rose-400' : 'text-rose-300'}`} />,
          badge: careMode.isActive ? 'ON' : undefined,
          isHighlighted: careMode.isActive,
        },
        {
          id: 'support-insights',
          label: 'Predictive Support',
          icon: <Sparkles className="w-4 h-4 text-violet-400" />,
        },
        {
          id: 'care-suggestions',
          label: 'Care Suggestions',
          icon: <Lightbulb className="w-4 h-4 text-amber-400" />,
        },
        {
          id: 'shared-calendar',
          label: 'Shared Calendar',
          icon: <CalendarDays className="w-4 h-4 text-sky-400" />,
        },
        {
          id: 'shared-space',
          label: 'Shared Space',
          icon: <Sparkles className="w-4 h-4 text-teal-400" />,
        },
        {
          id: 'memory-vault',
          label: 'Memory Vault',
          icon: <Bookmark className="w-4 h-4 text-rose-400" />,
        },
      ],
    },
    {
      title: 'Stay In Control',
      items: [
        {
          id: 'privacy-sharing',
          label: 'Privacy & Consent',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: <Bell className="w-4 h-4 text-slate-400" />,
          badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
        },
        {
          id: 'user-profile',
          label: 'My Profile',
          icon: <UserIcon className="w-4 h-4 text-slate-400" />,
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="w-4 h-4 text-slate-400" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 h-full bg-[#090E1A] border-r border-slate-800/80 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
        <Logo size="sm" onClick={() => handleNav('dashboard')} className="cursor-pointer" />
        <button
          type="button"
          onClick={() => navigateTo('landing')}
          title="View Public Landing Page"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          aria-label="View Public Landing Page"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Connection Status Card */}
      <div className="px-4 pt-4 pb-2">
        <div
          onClick={() => handleNav(connection.status === 'connected' ? 'partner-profile' : 'connect-partner')}
          className="cursor-pointer group p-3 rounded-xl bg-[#0D1424] border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-3"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleNav(connection.status === 'connected' ? 'partner-profile' : 'connect-partner');
            }
          }}
        >
          {connection.status === 'connected' && partner ? (
            <>
              <Avatar
                src={partner.avatar}
                name={partner.name}
                size="sm"
                statusIndicator="online"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Connected with
                </p>
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-violet-300 transition-colors">
                  {partner.name}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
            </>
          ) : connection.status === 'pending_sent' ? (
            <div className="flex-1">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping mr-2" />
              <span className="text-xs font-medium text-amber-300">Invite Pending</span>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">Awaiting partner response</p>
            </div>
          ) : (
            <div className="flex-1">
              <span className="inline-block w-2 h-2 rounded-full bg-slate-500 mr-2" />
              <span className="text-xs font-medium text-slate-300">No partner linked</span>
              <p className="text-[11px] text-violet-400 font-medium mt-0.5 group-hover:underline">
                Tap to connect →
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links Grouped by Four Core Pillars */}
      <div className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
        {navSections.map((section, sIdx) => (
          <div key={section.title || `section-${sIdx}`} className="space-y-1">
            {section.title && (
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                {section.title}
              </p>
            )}

            {section.items.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-600/15 text-violet-200 border border-violet-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-violet-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.isHighlighted
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-violet-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Safety Boundary Notice */}
        <div className="px-2 pt-2">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 leading-snug">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Personal Support Platform</span>
            </div>
            <p className="text-[10px] text-slate-400">
              LunaLink organizes cycles and partner care. Not a doctor replacement or diagnostic tool.
            </p>
          </div>
        </div>

        {/* Demo State Switcher */}
        <div className="pt-4 px-2">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                State Simulator
              </span>
              <span className="text-[10px] text-violet-400 font-mono">Dev Test</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <button
                onClick={() => setConnectionStatusDirectly('connected')}
                className={`py-1 rounded px-1 transition-colors ${
                  connection.status === 'connected'
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Test with connected partner (Elena)"
              >
                Connected
              </button>
              <button
                onClick={() => setConnectionStatusDirectly('disconnected')}
                className={`py-1 rounded px-1 transition-colors ${
                  connection.status === 'disconnected'
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Test empty state (No partner yet)"
              >
                Empty
              </button>
              <button
                onClick={() => setConnectionStatusDirectly('pending_sent')}
                className={`py-1 rounded px-1 transition-colors ${
                  connection.status === 'pending_sent'
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Test pending invite sent"
              >
                Pending
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080C14]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleNav('user-profile')}
            className="flex items-center gap-2.5 text-left group min-w-0 p-1 rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
          >
            <Avatar src={user.avatar} name={user.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-violet-300 transition-colors">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={logout}
            title="Sign Out"
            aria-label="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};
