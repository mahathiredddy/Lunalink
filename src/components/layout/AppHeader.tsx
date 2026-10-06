import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppPage } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import {
  Menu,
  Bell,
  ShieldCheck,
  Link2,
  Sparkles,
  User,
  CheckCircle2,
  Power,
  HeartHandshake,
} from 'lucide-react';

interface AppHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    currentPage,
    navigateTo,
    user,
    partner,
    connection,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    careMode,
    notificationSettings,
  } = useApp();

  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showNotificationDropdown) {
        setShowNotificationDropdown(false);
      }
    };

    if (showNotificationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNotificationDropdown]);

  const getPageInfo = (page: AppPage) => {
    switch (page) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Your private overview & shared activity',
        };
      case 'cycle-calendar':
        return {
          title: 'My Cycle',
          subtitle: 'Understand your cycle patterns over time',
        };
      case 'symptoms-pain':
        return {
          title: 'Symptoms & Pain',
          subtitle: 'Private menstrual symptom & discomfort tracking',
        };
      case 'care-profile':
        return {
          title: 'Care Profile',
          subtitle: 'Your personal Care DNA and support preferences',
        };
      case 'care-mode':
        return {
          title: 'Care Mode',
          subtitle: 'Let someone you trust know how to support you',
        };
      case 'support-insights':
        return {
          title: 'Support Insights',
          subtitle: 'Personalized insights based on your LunaLink history.',
        };
      case 'care-suggestions':
        return {
          title: 'Care Suggestions',
          subtitle: 'Small ways to make support feel more personal.',
        };
      case 'connect-partner':
        return {
          title: 'Connect Partner',
          subtitle: 'Link securely with an invite code or QR scan',
        };
      case 'partner-profile':
        return {
          title: partner ? `${partner.name}'s Profile` : 'Partner Profile',
          subtitle: 'Mutual connection parameters and shared information',
        };
      case 'shared-space':
        return {
          title: 'Shared Space',
          subtitle: 'Collaborative notes, shared preferences, and timeline',
        };
      case 'privacy-sharing':
        return {
          title: 'Privacy & Sharing',
          subtitle: 'Granular permission controls for your information',
        };
      case 'notifications':
        return {
          title: 'Notification Center',
          subtitle: 'Alerts, connection requests, and privacy updates',
        };
      case 'settings':
        return {
          title: 'Account Settings',
          subtitle: 'Security, profile options, and data management',
        };
      case 'user-profile':
        return {
          title: 'My Profile',
          subtitle: 'Manage your personal identity, contact details, and account credentials',
        };
      default:
        return { title: 'LunaLink', subtitle: 'Private Connection' };
    }
  };

  const pageInfo = getPageInfo(currentPage);

  return (
    <header className="h-16 sm:h-20 border-b border-slate-800/80 bg-[#080C15]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle + Page Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-semibold text-white tracking-tight font-display truncate">
            {pageInfo.title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-400 truncate">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions: Connection Badge, Notification Bell, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Care Mode Active Indicator Pill */}
        {careMode.isActive && (
          <button
            type="button"
            onClick={() => navigateTo('care-mode')}
            title="Care Mode is Active - Click to manage"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold hover:bg-rose-500/25 transition-all cursor-pointer shadow-sm shadow-rose-950/40"
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="hidden sm:inline">Care Mode</span>
            <span className="sm:hidden">Active</span>
          </button>
        )}

        {/* Connection status pill */}
        <div className="hidden md:flex items-center">
          {connection.status === 'connected' ? (
            <Badge variant="shared" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5 text-violet-400" />}>
              Encrypted Link Active
            </Badge>
          ) : connection.status === 'pending_sent' ? (
            <Badge variant="warning" size="sm" icon={<Link2 className="w-3.5 h-3.5 text-amber-400" />}>
              Invite Pending
            </Badge>
          ) : (
            <Badge variant="private" size="sm">
              Single Mode (No Partner)
            </Badge>
          )}
        </div>

        {/* Notifications Popover Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            aria-label="Notifications"
            aria-expanded={showNotificationDropdown}
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-violet-500 rounded-full ring-2 ring-[#080C14]" />
            )}
          </button>

          {/* Notification Quick Dropdown */}
          {showNotificationDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#11182C] border border-slate-700/80 shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-white font-display uppercase tracking-wider">
                    Notifications
                  </h4>
                  {unreadNotificationCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-violet-600/30 text-violet-300 border border-violet-500/30">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowNotificationDropdown(false);
                    navigateTo('notifications');
                  }}
                  className="text-xs text-violet-400 hover:text-violet-300 font-medium"
                >
                  View all
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationAsRead(notif.id);
                      if (notif.actionUrl) {
                        setShowNotificationDropdown(false);
                        navigateTo(notif.actionUrl);
                      }
                    }}
                    className={`p-3.5 hover:bg-slate-800/40 transition-colors cursor-pointer flex items-start gap-3 ${
                      !notif.isRead ? 'bg-violet-950/10' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      {!notif.isRead ? (
                        <span className="block w-2 h-2 rounded-full bg-violet-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                        {notif.containsHealthData &&
                        !notificationSettings.exposeHealthInfoInPreviews &&
                        notif.discreetMessage
                          ? notif.discreetMessage
                          : notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {notif.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Action */}
        <button
          type="button"
          onClick={() => navigateTo('user-profile')}
          aria-label="User Profile"
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-800/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <Avatar src={user.avatar} name={user.name} size="sm" />
          <span className="hidden sm:inline text-xs font-medium text-slate-200">
            {user.name.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
};
