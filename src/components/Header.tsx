import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  Download,
  Upload,
  Calendar,
  Save,
  Printer,
  Keyboard,
} from 'lucide-react';
import { formatWeekRangeLabel, getMondayOfWeek } from '../utils/dateUtils';

interface HeaderProps {
  weekStart: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  onSave: () => void;
  onOpenResetModal: () => void;
  onExport: () => void;
  onImport: () => void;
  onPrint: () => void;
  onOpenShortcuts: () => void;
  lastSavedText: string;
}

export const Header: React.FC<HeaderProps> = ({
  weekStart,
  onPrevWeek,
  onNextWeek,
  onCurrentWeek,
  onSave,
  onOpenResetModal,
  onExport,
  onImport,
  onPrint,
  onOpenShortcuts,
  lastSavedText,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const currentWeekMonday = getMondayOfWeek(new Date());
  const isCurrentWeek = weekStart === currentWeekMonday;

  const handleManualSave = () => {
    onSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Editorial Kicker */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#111111]">
                Weekly Life Planner
              </span>
              <span className="hidden sm:inline text-xs font-medium text-[#71717A] tracking-wider uppercase">
                Plan · Track · Reflect
              </span>
            </div>
            <span className="text-[11px] text-[#A1A1AA] tabular-nums">
              {lastSavedText ? `Auto-saved ${lastSavedText}` : 'Ready to plan'}
            </span>
          </div>

          {/* Mobile Current Week jump */}
          {!isCurrentWeek && (
            <button
              onClick={onCurrentWeek}
              className="md:hidden text-xs font-semibold px-2.5 py-1 bg-[#F4F4F5] text-[#111111] hover:bg-[#E4E4E7] rounded-md transition-colors whitespace-nowrap"
            >
              Today
            </button>
          )}
        </div>

        {/* Center: Week Selector Controls */}
        <div className="flex items-center justify-between md:justify-center gap-1.5 sm:gap-2 bg-[#F8F9FA] border border-[#E5E7EB] p-1 rounded-lg">
          <button
            onClick={onPrevWeek}
            aria-label="Previous week ( [ )"
            title="Previous week [ ]"
            className="p-1.5 text-[#52525B] hover:text-[#111111] hover:bg-white rounded-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-2 text-xs sm:text-sm font-semibold text-[#111111] tabular-nums whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-[#71717A] hidden xs:inline" />
            <span>{formatWeekRangeLabel(weekStart)}</span>
          </div>

          <button
            onClick={onNextWeek}
            aria-label="Next week ( ] )"
            title="Next week ]"
            className="p-1.5 text-[#52525B] hover:text-[#111111] hover:bg-white rounded-md transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isCurrentWeek && (
            <button
              onClick={onCurrentWeek}
              className="hidden md:inline-flex text-xs font-medium px-2 py-1 bg-white hover:bg-[#F4F4F5] text-[#27272A] border border-[#E5E7EB] rounded-md transition-colors ml-1 whitespace-nowrap"
            >
              Current Week
            </button>
          )}
        </div>

        {/* Right Actions: Print, Shortcuts, Save, Reset, Export */}
        <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto flex-wrap">
          {/* Print button */}
          <button
            onClick={onPrint}
            title="Print or Save PDF (⌘P)"
            aria-label="Print or Save as PDF"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#52525B] hover:text-[#111111] bg-white hover:bg-[#F4F4F5] border border-[#E5E7EB] rounded-md transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5 text-[#71717A]" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          {/* Keyboard Shortcuts button */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard shortcuts (?)"
            aria-label="Keyboard shortcuts"
            className="p-1.5 text-[#71717A] hover:text-[#111111] hover:bg-[#F4F4F5] border border-[#E5E7EB] rounded-md transition-colors"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>

          {/* Save Button */}
          <button
            onClick={handleManualSave}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              saveSuccess
                ? 'bg-[#1F7A4D] text-white shadow-xs'
                : 'bg-[#111111] text-white hover:bg-[#27272A] active:scale-[0.98]'
            } whitespace-nowrap`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={onOpenResetModal}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#52525B] hover:text-[#111111] bg-white hover:bg-[#F4F4F5] border border-[#E5E7EB] rounded-md transition-colors whitespace-nowrap"
            title="Reset or clear week"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#71717A]" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Export / Import */}
          <div className="flex items-center border-l border-[#E5E7EB] pl-1.5 gap-1">
            <button
              onClick={onExport}
              title="Export planner backup"
              aria-label="Export backup"
              className="p-1.5 text-[#71717A] hover:text-[#111111] hover:bg-[#F4F4F5] rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onImport}
              title="Import backup"
              aria-label="Import backup"
              className="p-1.5 text-[#71717A] hover:text-[#111111] hover:bg-[#F4F4F5] rounded-md transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
