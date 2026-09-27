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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="bg-white border border-[#E5E7EB] rounded-lg max-w-md w-full p-5 sm:p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#71717A] hover:text-[#111111] hover:bg-[#F4F4F5] rounded"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <span className="p-2 bg-[#F4F4F5] text-[#111111] rounded-md">
            <Keyboard className="w-4 h-4" />
          </span>
          <div>
            <h3 id="shortcuts-title" className="text-base font-bold text-[#111111]">
              Keyboard Shortcuts
            </h3>
            <p className="text-xs text-[#71717A]">
              Power-user navigation for instant workflow
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-[#F4F4F5]">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="py-2.5 flex items-center justify-between gap-4 text-xs"
            >
              <span className="text-[#52525B]">{s.desc}</span>
              <kbd className="px-2 py-1 font-mono text-[11px] font-semibold text-[#111111] bg-[#F4F4F5] border border-[#E5E7EB] rounded shadow-2xs whitespace-nowrap">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[#F4F4F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-[#111111] text-white hover:bg-[#27272A] rounded transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
