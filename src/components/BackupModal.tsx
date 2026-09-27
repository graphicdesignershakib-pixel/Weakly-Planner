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
      setErrorMessage('Could not parse JSON. Please check text and try again.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="bg-white border border-[#E5E7EB] rounded-lg max-w-lg w-full p-5 sm:p-6 shadow-xl relative animate-in fade-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#71717A] hover:text-[#111111] hover:bg-[#F4F4F5] rounded"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          {mode === 'export' ? (
            <Download className="w-5 h-5 text-[#111111]" />
          ) : (
            <Upload className="w-5 h-5 text-[#111111]" />
          )}
          <h3 className="text-base font-bold text-[#111111]">
            {mode === 'export' ? 'Export Planner Backup' : 'Import Planner Backup'}
          </h3>
        </div>

        <p className="text-xs text-[#71717A] mb-4">
          {mode === 'export'
            ? 'Download or copy your full weekly planner data snapshot.'
            : 'Paste your previously exported JSON backup to restore all weeks.'}
        </p>

        {errorMessage && (
          <div className="p-2.5 mb-3 bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs rounded">
            {errorMessage}
          </div>
        )}

        <textarea
          rows={8}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={mode === 'import' ? 'Paste backup JSON here...' : ''}
          className="w-full text-[11px] font-mono p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-md focus:outline-none focus:border-[#111111] text-[#111111]"
          readOnly={mode === 'export'}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F4F4F5]">
          {mode === 'export' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#E5E7EB] hover:bg-[#F4F4F5] rounded transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
              <button
                onClick={handleDownloadFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#111111] text-white hover:bg-[#27272A] rounded transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleApplyImport}
              disabled={!jsonText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-[#111111] text-white hover:bg-[#27272A] disabled:bg-[#E5E7EB] disabled:text-[#A1A1AA] rounded transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Apply Backup</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-[#71717A] hover:text-[#111111] hover:bg-[#F4F4F5] rounded transition-colors ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
