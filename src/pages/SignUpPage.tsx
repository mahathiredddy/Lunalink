import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/ui/Logo';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { signUp, navigateTo } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  // Password strength calculation
  const passwordCriteria = useMemo(() => {
    return {
      hasMinLength: password.length >= 8,
      hasNumberOrSymbol: /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      hasMixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    };
  }, [password]);

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'None', color: 'bg-slate-700', text: 'text-slate-500' };

    let passed = 0;
    if (passwordCriteria.hasMinLength) passed++;
    if (passwordCriteria.hasNumberOrSymbol) passed++;
    if (passwordCriteria.hasMixedCase) passed++;
    if (password.length >= 12) passed++;

    if (passed <= 1) {
      return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    }
    if (passed === 2) {
      return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
    }
    if (passed === 3) {
      return { score: 3, label: 'Good', color: 'bg-indigo-400', text: 'text-indigo-400' };
    }
    return { score: 4, label: 'Strong', color: 'bg-emerald-400', text: 'text-emerald-400' };
  }, [password, passwordCriteria]);

  const validate = () => {
    const errors: typeof fieldErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errors.terms = 'You must agree to the Terms and Privacy Policy';
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
      await new Promise((resolve) => setTimeout(resolve, 600));
      await signUp(fullName.trim(), email.trim());
    } catch {
      setError('An error occurred during account creation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C15] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar */}
      <header className="flex items-center justify-between max-w-7xl mx-auto w-full py-4">
        <Logo size="md" onClick={() => navigateTo('landing')} className="cursor-pointer" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateTo('login')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </header>

      {/* Main Registration Form */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-md">
          <Card variant="elevated" padding="lg" className="border-slate-800 shadow-2xl shadow-indigo-950/20">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 mb-3 shadow-inner">
                <UserPlus className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white font-display tracking-tight">
                Create your LunaLink
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Start building your private shared space.
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

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full name */}
              <Input
                id="signup-fullname"
                label="Full name"
                type="text"
                placeholder="e.g. Alex Rivera"
                value={fullName}
                error={fieldErrors.fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: undefined });
                }}
                leftIcon={<User className="w-4 h-4" />}
                autoComplete="name"
                required
              />

              {/* Email */}
              <Input
                id="signup-email"
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

              {/* Password */}
              <div>
                <Input
                  id="signup-password"
                  label="Password"
                  isPassword
                  placeholder="Minimum 8 characters"
                  value={password}
                  error={fieldErrors.password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  }}
                  leftIcon={<Lock className="w-4 h-4" />}
                  autoComplete="new-password"
                  required
                />

                {/* Password Strength Feedback */}
                {password.length > 0 && (
                  <div className="mt-2.5 p-3 rounded-xl bg-[#0A0E1A] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Password strength:</span>
                      <span className={`font-semibold ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                            passwordStrength.score >= step
                              ? passwordStrength.color
                              : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Criteria checklist */}
                    <div className="grid grid-cols-1 gap-1 pt-1 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        {passwordCriteria.hasMinLength ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <X className="w-3 h-3 text-slate-500" />
                        )}
                        <span className={passwordCriteria.hasMinLength ? 'text-slate-300' : 'text-slate-500'}>
                          At least 8 characters
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {passwordCriteria.hasNumberOrSymbol ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <X className="w-3 h-3 text-slate-500" />
                        )}
                        <span className={passwordCriteria.hasNumberOrSymbol ? 'text-slate-300' : 'text-slate-500'}>
                          At least one number or symbol
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {passwordCriteria.hasMixedCase ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <X className="w-3 h-3 text-slate-500" />
                        )}
                        <span className={passwordCriteria.hasMixedCase ? 'text-slate-300' : 'text-slate-500'}>
                          Uppercase and lowercase letters
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <Input
                id="signup-confirm-password"
                label="Confirm password"
                isPassword
                placeholder="Re-type your password"
                value={confirmPassword}
                error={fieldErrors.confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
                  }
                }}
                leftIcon={<Lock className="w-4 h-4" />}
                autoComplete="new-password"
                required
              />

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="terms-agree"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (fieldErrors.terms) setFieldErrors({ ...fieldErrors, terms: undefined });
                    }}
                    className="mt-0.5 w-4 h-4 rounded bg-[#0A0E1A] border-slate-700 text-violet-600 focus:ring-violet-500/50 focus:ring-offset-0 focus:outline-none"
                  />
                  <span className="leading-relaxed text-slate-300">
                    I agree to the <span className="text-violet-400 hover:underline">Terms</span> and{' '}
                    <span className="text-violet-400 hover:underline">Privacy Policy</span>.
                  </span>
                </label>
                {fieldErrors.terms && (
                  <p role="alert" className="text-xs text-rose-400 mt-1 pl-6">
                    {fieldErrors.terms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>

            {/* Secondary: Already have an account? Sign in */}
            <div className="mt-6 text-center text-xs text-slate-400 pt-5 border-t border-slate-800">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigateTo('login')}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors focus:outline-none focus-visible:underline ml-1"
              >
                Sign in
              </button>
            </div>
          </Card>
        </div>
      </main>

      {/* Trust Reassurance Footer */}
      <footer className="max-w-md mx-auto text-center text-xs text-slate-400 flex items-center justify-center gap-2 py-4">
        <ShieldCheck className="w-4 h-4 text-indigo-400" />
        <span>Strictly two people • You control every permission</span>
      </footer>
    </div>
  );
};
