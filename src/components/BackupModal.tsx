import React, { useState, useEffect } from 'react';
import { Download, Upload, X, Check, Copy } from 'lucide-react';
import { plannerStorage } from '../storage/plannerStorage';

interface BackupModalProps {
  isOpen: boolean;
  mode: 'export' | 'import';
  onClose: () => void;
  onImportSuccess: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  mode,
  onClose,
  onImportSuccess,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'export') {
        const exported = plannerStorage.exportJSON();
        setJsonText(exported);
      } else {
        setJsonText('');
      }
      setErrorMessage('');
      setCopied(false);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleDownloadFile = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-life-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyImport = () => {
    try {
      const success = plannerStorage.importJSON(jsonText);
      if (success) {
        onImportSuccess();
        onClose();
      } else {
        setErrorMessage('Invalid planner backup format. Please paste valid JSON.');
      }
    } catch {
      setErrorMessage('Failed to parse JSON backup. Please check format.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div
        className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <span className="p-2 bg-[#F4F4F5] dark:bg-[#27272A] rounded-full text-[#111111] dark:text-white">
            {mode === 'export' ? <Download className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
          </span>
          <div>
            <h3 id="backup-modal-title" className="text-base font-bold text-[#111111] dark:text-white">
              {mode === 'export' ? 'Backup / Export All Data' : 'Restore / Import Backup'}
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              {mode === 'export'
                ? 'Save your complete weekly planner history as JSON.'
                : 'Paste exported JSON backup to restore all tasks and weeks.'}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-2.5 mb-3 bg-[#FEE2E2] dark:bg-red-950/40 border border-[#FCA5A5] dark:border-red-800/40 rounded text-xs text-[#DC2626] dark:text-red-300">
            {errorMessage}
          </div>
        )}

        <div className="mt-2">
          <textarea
            rows={8}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            readOnly={mode === 'export'}
            placeholder={mode === 'import' ? 'Paste valid JSON here...' : ''}
            className="w-full text-[11px] font-mono bg-[#FAFAFA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] text-[#111111] dark:text-white rounded-lg p-2.5 focus:outline-none focus:border-[#111111] dark:focus:border-white resize-none"
          />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#F4F4F5] dark:border-[#27272A]">
          {mode === 'export' ? (
            <>
              <button
                type="button"
                onClick={handleCopyClipboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] dark:border-[#27272A] text-[#111111] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded-lg text-xs font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadFile}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#27272A] dark:hover:bg-zinc-200 rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON File</span>
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyImport}
                disabled={!jsonText.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] disabled:bg-[#E5E7EB] dark:disabled:bg-[#27272A] disabled:text-[#A1A1AA] rounded-lg text-xs font-semibold cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Restore Backup</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
