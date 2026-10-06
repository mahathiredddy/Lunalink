import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div
      id="lunalink-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Visual Logo Mark: Intersecting Lunar Crescent & Secure Link Ring */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(167,139,250,0.35)]"
        >
          {/* Subtle glow aura */}
          <circle cx="18" cy="18" r="15" className="fill-indigo-950/40" />

          {/* Crescent Moon Path */}
          <path
            d="M21 7C14.3726 7 9 12.3726 9 19C9 25.6274 14.3726 31 21 31C24.0886 31 26.9048 29.8327 29.043 27.9142C24.0152 27.5683 20 23.3644 20 18.25C20 13.5658 23.3533 9.66442 27.7844 8.82585C25.7538 7.68264 23.4478 7 21 7Z"
            className="fill-indigo-400"
          />

          {/* Secure Link Ring intersecting the crescent */}
          <ellipse
            cx="21.5"
            cy="18.5"
            rx="8.5"
            ry="5.5"
            transform="rotate(-28 21.5 18.5)"
            stroke="#A78BFA"
            strokeWidth="2.2"
            strokeDasharray="28 10"
            className="stroke-violet-300"
          />

          {/* Twin connection nodes */}
          <circle cx="15" cy="18" r="2" fill="#E0E7FF" className="animate-pulse" />
          <circle cx="25" cy="15" r="1.8" fill="#DDD6FE" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-semibold tracking-tight text-white font-display ${textSizes[size]}`}>
            Luna<span className="text-violet-400 font-medium">Link</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
            Private Connection
          </span>
        )}
      </div>
    </div>
  );
};
