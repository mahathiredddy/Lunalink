import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppPage } from '../../types';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  ShieldCheck,
  Bell,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentPage, navigateTo, unreadNotificationCount } = useApp();

  const items: { id: AppPage; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'cycle-calendar',
      label: 'Cycle',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'shared-space',
      label: 'Shared',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'privacy-sharing',
      label: 'Privacy',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      id: 'notifications',
      label: 'Alerts',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080C14]/95 backdrop-blur-lg border-t border-slate-800/90 px-2 py-2 flex items-center justify-around select-none">
      {items.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => navigateTo(item.id)}
            aria-label={item.label}
            className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all min-h-[44px] min-w-[48px] ${
              isActive
                ? 'text-violet-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-violet-500 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
