import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../ui/Logo';
import { Shield, Lock, EyeOff } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="border-t border-slate-800/80 bg-[#060911] text-slate-400 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800/60">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Logo size="md" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              LunaLink is a private connection platform that allows two connected people to create a shared digital space while maintaining granular control over their own information and privacy.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-violet-400" /> Granular Toggles
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" /> Mutual Consent
              </span>
              <span className="flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-sky-400" /> Zero Public Feeds
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 font-display">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('why-lunalink');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigateTo('landing');
                  }}
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
                >
                  Why LunaLink
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('features');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigateTo('landing');
                  }}
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
                >
                  Core Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigateTo('landing');
                  }}
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('privacy-first');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigateTo('landing');
                  }}
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
                >
                  Privacy First
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Access */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 font-display">
              Account & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('login')}
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('signup')}
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
                >
                  Create Account
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('forgot-password')}
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
                >
                  Password Reset
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('settings')}
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
                >
                  Privacy Manifesto
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} LunaLink Technologies. Connect privately. Share intentionally. Stay in control.</p>
          <div className="flex items-center gap-6">
            <span>Client-side Encrypted Architecture</span>
            <span>Supabase Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
