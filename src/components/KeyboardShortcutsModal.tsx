import React, { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
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

  const shortcuts = [
    { key: '[  or  ]', desc: 'Navigate to Previous / Next week' },
    { key: 'T', desc: 'Jump to current week (Today)' },
    { key: '1 – 7', desc: 'Quick jump to day (Mon to Sun)' },
    { key: 'N', desc: 'Focus task input for current or active day' },
    { key: '⌘ / Ctrl + P', desc: 'Print or export as PDF' },
    { key: '⌘ / Ctrl + S', desc: 'Instant save planner state' },
    { key: 'Enter', desc: 'Submit new task or save inline edit' },
    { key: 'Esc', desc: 'Cancel editing or close open modal' },
    { key: '?', desc: 'Toggle keyboard shortcuts menu' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <span className="p-2 bg-[#F4F4F5] dark:bg-[#27272A] text-[#111111] dark:text-white rounded-lg">
            <Keyboard className="w-4 h-4" />
          </span>
          <div>
            <h3 id="shortcuts-title" className="text-base font-bold text-[#111111] dark:text-white">
              Keyboard Shortcuts
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Speed up your daily planning and navigation
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-[#F4F4F5] dark:divide-[#27272A] text-xs">
          {shortcuts.map((item) => (
            <div key={item.key} className="py-2 flex items-center justify-between gap-3">
              <span className="text-[#52525B] dark:text-zinc-200">{item.desc}</span>
              <kbd className="font-mono text-[11px] bg-[#F4F4F5] dark:bg-[#27272A] border border-[#E5E7EB] dark:border-[#3F3F46] text-[#111111] dark:text-white px-2 py-0.5 rounded shadow-2xs font-semibold shrink-0">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[#F4F4F5] dark:border-[#27272A] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-lg cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
