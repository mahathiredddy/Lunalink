import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  statusIndicator?: 'online' | 'offline' | 'sharing' | 'private' | 'none';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  statusIndicator = 'none',
  className = '',
}) => {
  const sizeStyles = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const indicatorSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  };

  const indicatorColors = {
    online: 'bg-emerald-400 ring-2 ring-[#0D1424]',
    offline: 'bg-slate-500 ring-2 ring-[#0D1424]',
    sharing: 'bg-violet-400 ring-2 ring-[#0D1424]',
    private: 'bg-amber-400 ring-2 ring-[#0D1424]',
    none: '',
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase() || 'LL';
  };

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <div
        className={`rounded-full overflow-hidden flex items-center justify-center font-medium bg-gradient-to-tr from-violet-900/60 to-indigo-800/60 text-slate-100 border border-violet-500/30 shadow-inner ${sizeStyles[size]}`}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {statusIndicator !== 'none' && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ${indicatorSizes[size]} ${indicatorColors[statusIndicator]}`}
          title={`Status: ${statusIndicator}`}
        />
      )}
    </div>
  );
};
