import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  id?: string;
  ariaLabel?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  id,
  ariaLabel,
}) => {
  const isSm = size === 'sm';

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080C14] ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${
        checked
          ? 'bg-violet-600'
          : 'bg-slate-700/90 hover:bg-slate-600'
      } ${isSm ? 'h-5 w-9' : 'h-6 w-11'}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block rounded-full bg-white shadow-md transform ring-0 transition duration-200 ease-in-out ${
          isSm
            ? `${checked ? 'translate-x-4' : 'translate-x-0.5'} h-4 w-4 mt-0.5`
            : `${checked ? 'translate-x-5' : 'translate-x-0.5'} h-5 w-5 mt-0.5`
        }`}
      />
    </button>
  );
};
