import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/ui/Logo';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, KeyRound, ArrowLeft, CheckCircle2, AlertCircle, RotateCw } from 'lucide-react';
import { authService } from '../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setFieldError('Email address is required');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setFieldError('Please enter a valid email address');
      return false;
    }
    setFieldError(undefined);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await authService.requestPasswordReset(email.trim());
      setSubmittedEmail(email.trim());
      setIsSuccess(true);
    } catch {
      setError('Could not process password reset request. Please verify your email and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await authService.requestPasswordReset(submittedEmail);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C15] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar */}
      <header className="flex items-center justify-between max-w-7xl mx-auto w-full py-4">
        <Logo size="md" onClick={() => navigateTo('landing')} className="cursor-pointer" />
        <button
          type="button"
          onClick={() => navigateTo('login')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 rounded px-2 py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </button>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-md">
          <Card variant="elevated" padding="lg" className="border-slate-800 shadow-2xl shadow-sky-950/20">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-sky-950/60 border border-sky-500/30 text-sky-400 mb-3 shadow-inner">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white font-display tracking-tight">
                Reset your password
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Enter your email and we&apos;ll help you get back into LunaLink.
              </p>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-left space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Check your email for the password reset link.</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We sent recovery instructions to{' '}
                    <span className="font-semibold text-white font-mono">{submittedEmail}</span>.
                    Please check your inbox and spam folder.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={() => navigateTo('login')}
                    className="w-full"
                  >
                    Return to Login
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResend}
                    isLoading={isResending}
                    className="w-full text-slate-400 hover:text-white"
                    leftIcon={<RotateCw className="w-3.5 h-3.5" />}
                  >
                    Didn&apos;t receive it? Resend link
                  </Button>
                </div>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Form Error Banner */}
                {error && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <Input
                  id="forgot-email"
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  error={fieldError}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldError) setFieldError(undefined);
                  }}
                  leftIcon={<Mail className="w-4 h-4" />}
                  autoComplete="email"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={isLoading}
                >
                  Send Reset Link
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => navigateTo('login')}
                    className="text-xs text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:underline"
                  >
                    Cancel and return to login
                  </button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </main>

      {/* Footer support */}
      <footer className="max-w-md mx-auto text-center text-xs text-slate-400 py-4">
        Need assistance? Contact support@lunalink.io
      </footer>
    </div>
  );
};
