import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const { navigateTo, isAuthenticated } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigateTo('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080C15]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <Logo
          size="md"
          showSubtitle
          onClick={() => navigateTo('landing')}
          className="hover:opacity-90 transition-opacity"
        />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            type="button"
            onClick={() => scrollToSection('why-lunalink')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Why LunaLink
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('features')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Core Features
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('privacy-first')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            Privacy First
          </button>
        </nav>

        {/* Desktop CTA actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigateTo('dashboard')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('login')}
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigateTo('signup')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0A0F1D] px-4 py-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <button
            type="button"
            onClick={() => scrollToSection('why-lunalink')}
            className="text-left text-sm font-medium text-slate-200 py-2 border-b border-slate-800/60"
          >
            Why LunaLink
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('features')}
            className="text-left text-sm font-medium text-slate-200 py-2 border-b border-slate-800/60"
          >
            Core Features
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="text-left text-sm font-medium text-slate-200 py-2 border-b border-slate-800/60"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('privacy-first')}
            className="text-left text-sm font-medium text-slate-200 py-2 border-b border-slate-800/60 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            Privacy First
          </button>

          <div className="pt-2 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <Button
                variant="primary"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('dashboard');
                }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('login');
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('signup');
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
