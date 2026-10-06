import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-violet-400 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30',
    info: 'border-violet-500/30',
    warning: 'border-amber-500/30',
    error: 'border-rose-500/30',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-[#0F162A]/95 backdrop-blur-md border ${borders[toast.type]} shadow-xl shadow-black/60 text-slate-200 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-2 duration-200`}
        >
          {icons[toast.type]}
          <div className="flex-1 leading-snug">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded focus:outline-none"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
