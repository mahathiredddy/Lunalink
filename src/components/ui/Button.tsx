import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080C14] disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap active:scale-[0.99]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 min-h-[36px] text-xs gap-1.5',
    md: 'px-4 py-2 min-h-[42px] sm:min-h-[40px] text-sm gap-2',
    lg: 'px-5 py-2.5 min-h-[46px] text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white shadow-sm shadow-violet-950/40 hover:shadow-violet-600/20 border border-violet-400/25',
    secondary:
      'bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700/70 hover:border-slate-600 shadow-sm shadow-black/20',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 hover:border-slate-500',
    ghost:
      'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white',
    danger:
      'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/50',
  };

  return (
    <button
      type={type}
      aria-busy={isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
      ) : (
        leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>
      )}
    </button>
  );
};
