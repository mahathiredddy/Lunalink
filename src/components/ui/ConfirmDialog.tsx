import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  requireConfirmationWord?: string; // e.g. "DELETE"
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  requireConfirmationWord,
  isLoading = false,
  icon,
}) => {
  const [typedWord, setTypedWord] = useState('');

  // Reset typed word whenever dialog opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setTypedWord('');
    }
  }, [isOpen]);

  const isConfirmDisabled = Boolean(
    requireConfirmationWord && typedWord.trim() !== requireConfirmationWord
  );

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          confirmBtnVariant: 'danger' as const,
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          confirmBtnVariant: 'primary' as const,
        };
      case 'info':
      default:
        return {
          iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
          confirmBtnVariant: 'primary' as const,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-2xl border flex-shrink-0 ${styles.iconBg}`}
          >
            {icon ||
              (variant === 'danger' ? (
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              ) : variant === 'warning' ? (
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-violet-400" />
              ))}
          </div>
          <div className="space-y-1.5 flex-1">
            <p className="text-sm text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {requireConfirmationWord && (
          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <label className="block text-xs font-semibold text-rose-300">
              Type <span className="font-mono underline font-bold">{requireConfirmationWord}</span> to confirm this irreversible action:
            </label>
            <input
              type="text"
              value={typedWord}
              onChange={(e) => setTypedWord(e.target.value)}
              placeholder={`Type ${requireConfirmationWord}`}
              className="w-full px-3 py-2 bg-[#090D16] border border-rose-500/40 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              autoFocus
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={styles.confirmBtnVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isConfirmDisabled}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
