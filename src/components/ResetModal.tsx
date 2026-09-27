import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Trash2, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetToSample: () => void;
  onClearToBlank: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onResetToSample,
  onClearToBlank,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div
        className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <span className="p-2 bg-[#FEE2E2] dark:bg-red-950/50 text-[#DC2626] dark:text-red-400 rounded-full">
            <AlertTriangle className="w-5 h-5" />
          </span>
          <div>
            <h3 id="reset-modal-title" className="text-base font-bold text-[#111111] dark:text-white">
              Reset Current Week
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Choose how you want to reset this week's planner data.
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <button
            type="button"
            onClick={() => {
              onResetToSample();
              onClose();
            }}
            className="w-full flex items-start gap-3 p-3 text-left border border-[#E5E7EB] dark:border-[#27272A] rounded-lg hover:border-[#111111] dark:hover:border-white hover:bg-[#FAFAFA] dark:hover:bg-[#202024] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#111111] dark:text-white mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-[#111111] dark:text-white block">
                Load Sample Template
              </span>
              <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                Populate this week with standard example tasks, habits, and review reflections.
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onClearToBlank();
              onClose();
            }}
            className="w-full flex items-start gap-3 p-3 text-left border border-[#FEE2E2] dark:border-red-950/40 rounded-lg hover:border-[#DC2626] bg-[#FEF2F2]/40 dark:bg-red-950/20 hover:bg-[#FEE2E2] dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-[#DC2626] dark:text-red-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-[#DC2626] dark:text-red-400 block">
                Clear to Blank Slate
              </span>
              <span className="text-[11px] text-[#991B1B] dark:text-red-300">
                Wipe all daily tasks, focus notes, and review for this week.
              </span>
            </div>
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-[#F4F4F5] dark:border-[#27272A] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
