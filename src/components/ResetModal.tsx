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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div
        className="bg-white border border-[#E5E7EB] rounded-lg max-w-md w-full p-5 sm:p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#71717A] hover:text-[#111111] hover:bg-[#F4F4F5] rounded"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <span className="p-2 bg-[#FEE2E2] text-[#DC2626] rounded-full">
            <AlertTriangle className="w-5 h-5" />
          </span>
          <div>
            <h3 id="reset-modal-title" className="text-base font-bold text-[#111111]">
              Reset Current Week
            </h3>
            <p className="text-xs text-[#71717A]">
              Choose how you want to reset this week's planner data.
            </p>
          </div>
        </div>

        <p className="text-xs text-[#52525B] leading-relaxed my-4 bg-[#F8F9FA] p-3 rounded border border-[#E5E7EB]">
          This action will overwrite your current daily tasks, habit checkmarks, and weekly review for this week.
        </p>

        <div className="space-y-2.5">
          <button
            onClick={() => {
              onResetToSample();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 border border-[#E5E7EB] hover:border-[#111111] rounded-md transition-colors text-left group"
          >
            <div>
              <div className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#52525B] group-hover:text-[#111111]" />
                Reset to Sample Planner Data
              </div>
              <p className="text-[11px] text-[#71717A] mt-0.5">
                Restores standard sample schedule, daily habits, and review.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#111111] opacity-0 group-hover:opacity-100 transition-opacity">
              Apply →
            </span>
          </button>

          <button
            onClick={() => {
              onClearToBlank();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 border border-[#FEE2E2] hover:bg-[#FEF2F2] rounded-md transition-colors text-left group"
          >
            <div>
              <div className="text-xs font-bold text-[#DC2626] flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                Clear to Blank Slate
              </div>
              <p className="text-[11px] text-[#71717A] mt-0.5">
                Erases all tasks and starts with an empty week schedule.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity">
              Clear →
            </span>
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-[#F4F4F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#52525B] hover:text-[#111111] hover:bg-[#F4F4F5] rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
