import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'shared' | 'private' | 'info' | 'success' | 'warning' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const variantStyles = {
    shared:
      'bg-violet-500/15 text-violet-300 border border-violet-500/30',
    private:
      'bg-slate-800 text-slate-300 border border-slate-700/80',
    info:
      'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    success:
      'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    warning:
      'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    neutral:
      'bg-slate-800/80 text-slate-300 border border-slate-700/60',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full select-none whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
