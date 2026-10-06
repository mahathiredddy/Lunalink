import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightElement,
      isPassword = false,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = errorId || helperId;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-slate-300 flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center" aria-hidden="true">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={actualType}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full bg-[#0A0E1A] text-slate-100 text-sm rounded-xl px-3.5 py-2.5 transition-all duration-200 border ${
              error
                ? 'border-rose-500/70 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'border-slate-700/80 hover:border-slate-600 focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50'
            } placeholder:text-slate-500 focus:outline-none ${
              leftIcon ? 'pl-9' : ''
            } ${isPassword || rightElement ? 'pr-10' : ''} ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
            </button>
          )}

          {!isPassword && rightElement && (
            <div className="absolute right-3 flex items-center">{rightElement}</div>
          )}
        </div>

        {error ? (
          <p id={errorId} role="alert" className="text-xs text-rose-400 mt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-slate-400 mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
