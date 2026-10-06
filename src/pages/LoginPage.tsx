import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/ui/Logo';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigateTo } = useApp();
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate realistic auth delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      await login(email.trim());
    } catch {
      setError('Invalid email or password. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C15] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Brand Bar */}
      <header className="flex items-center justify-between max-w-7xl mx-auto w-full py-4">
        <Logo size="md" onClick={() => navigateTo('landing')} className="cursor-pointer" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateTo('signup')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign Up
        </Button>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-md">
          <Card variant="elevated" padding="lg" className="border-slate-800 shadow-2xl shadow-violet-950/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-violet-950/60 border border-violet-500/30 text-violet-400 mb-3 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white font-display tracking-tight">
                Welcome back to LunaLink
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Your private space is waiting.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-200"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                id="login-email"
                label="Email"
                type="email"
                placeholder="name@example.com"
                value={email}
                error={fieldErrors.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                }}
                leftIcon={<Mail className="w-4 h-4" />}
                autoComplete="email"
                required
              />

              <Input
                id="login-password"
                label="Password"
                isPassword
                placeholder="Enter your password"
                value={password}
                error={fieldErrors.password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                }}
                leftIcon={<Lock className="w-4 h-4" />}
                autoComplete="current-password"
                required
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0A0E1A] border-slate-700 text-violet-600 focus:ring-violet-500/50 focus:ring-offset-0 focus:outline-none"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => navigateTo('forgot-password')}
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors focus:outline-none focus-visible:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Login
              </Button>
            </form>

            {/* Secondary Action: Don't have an account? Create one */}
            <div className="mt-6 text-center text-xs text-slate-400 pt-5 border-t border-slate-800">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => navigateTo('signup')}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors focus:outline-none focus-visible:underline ml-1"
              >
                Create one
              </button>
            </div>

            {/* Quick Demo Autofill Helper for presentation/hackathon judges */}
            <div className="mt-5 p-3 rounded-xl bg-[#0A0E1A] border border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="flex items-center gap-1 text-slate-300">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  Presentation Demo Account
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Ready</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('alex.rivera@example.com');
                  setPassword('password123');
                  login('alex.rivera@example.com');
                }}
                className="w-full py-2 px-3 rounded-lg bg-[#11182C] hover:bg-[#162038] border border-violet-500/30 text-slate-200 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
              >
                <span>Instant Login as Alex Rivera</span>
                <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
              </button>
            </div>
          </Card>
        </div>
      </main>

      {/* Security Footer */}
      <footer className="max-w-md mx-auto text-center text-xs text-slate-400 flex items-center justify-center gap-2 py-4">
        <ShieldCheck className="w-4 h-4 text-violet-400" />
        <span>Granular encryption • Strictly two people • Zero trackers</span>
      </footer>
    </div>
  );
};
