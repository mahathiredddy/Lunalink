import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'subtle' | 'glow';
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  padding = 'md',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantStyles = {
    default:
      'bg-[#0C1222] border border-slate-800/90 shadow-sm shadow-black/30',
    elevated:
      'bg-[#11182C] border border-slate-700/70 shadow-lg shadow-black/40',
    subtle:
      'bg-[#090E1A] border border-slate-800/70',
    glow:
      'bg-[#0E1528] border border-violet-500/30 shadow-[0_0_24px_rgba(124,58,237,0.08)]',
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
