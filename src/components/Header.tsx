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
  Moon,
  Sun,
  Sparkles,
  Trophy,
  Wind,
  Search,
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
  onOpenAchievementCard?: () => void;
  onOpenBreathing?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenProfile?: () => void;
  userName?: string;
  userTagline?: string;
  lastSavedText: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
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
  onOpenAchievementCard,
  onOpenBreathing,
  onOpenCommandPalette,
  onOpenProfile,
  userName = 'Shakib',
  userTagline,
  lastSavedText,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const currentWeekMonday = getMondayOfWeek(new Date());
  const isCurrentWeek = weekStart === currentWeekMonday;

  const handleManualSave = () => {
    onSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Get dynamic greeting with user name
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return `Good morning, ${userName}! Make today remarkable ✨`;
    if (hour >= 12 && hour < 17) return `Good afternoon, ${userName}! Momentum is building 🔥`;
    if (hour >= 17 && hour < 22) return `Good evening, ${userName}! Celebrate today's wins 🌙`;
    return `Peaceful night, ${userName}! Rest well and recharge 🌟`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-[#18181B] border-b border-[#E5E7EB] dark:border-[#27272A] px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Dynamic Greeting */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white text-base font-black shadow-xs shrink-0 hover:scale-105 transition-transform cursor-pointer"
            title="Click to edit your profile"
          >
            {userName.slice(0, 1).toUpperCase()}
          </button>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#111111] dark:text-white">
                Weekly Life Planner
              </span>
              <button
                type="button"
                onClick={onOpenProfile}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#52525B] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white bg-[#F4F4F5] dark:bg-[#27272A] px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                title="Edit profile"
              >
                <span>{userName}</span>
                {userTagline && <span className="opacity-60">· {userTagline}</span>}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {getGreeting()}
              </span>
              <span className="text-[11px] text-[#A1A1AA] dark:text-[#71717A] tabular-nums hidden sm:inline">
                · {lastSavedText ? `Saved ${lastSavedText}` : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Week Navigation Pills */}
        <div className="flex items-center justify-between sm:justify-center gap-1.5 bg-[#FAFAFA] dark:bg-[#121214] p-1 rounded-lg border border-[#E5E7EB] dark:border-[#27272A]">
          <button
            type="button"
            onClick={onPrevWeek}
            className="p-1 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded transition-colors cursor-pointer"
            title="Previous Week (Press [)"
            aria-label="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-[#111111] dark:text-white px-2 tracking-tight">
            {formatWeekRangeLabel(weekStart)}
          </span>

          <button
            type="button"
            onClick={onNextWeek}
            className="p-1 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded transition-colors cursor-pointer"
            title="Next Week (Press ])"
            aria-label="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isCurrentWeek && (
            <button
              type="button"
              onClick={onCurrentWeek}
              className="text-[11px] font-semibold bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-2 py-0.5 rounded cursor-pointer transition-colors ml-1 shadow-2xs"
              title="Jump to Current Week (Press T)"
            >
              Today
            </button>
          )}
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-1.5 self-end md:self-auto flex-wrap">
          {/* Spotlight Search (Ctrl+K) */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202024] transition-colors cursor-pointer"
              title="Spotlight Search & Quick Add (Ctrl+K / ⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden lg:inline text-[9px] font-mono bg-[#FAFAFA] dark:bg-[#18181B] px-1 py-0.2 rounded border border-[#E5E7EB] dark:border-[#3F3F46]">
                ⌘K
              </kbd>
            </button>
          )}

          {/* 1-Min Mindfulness Breathing */}
          {onOpenBreathing && (
            <button
              type="button"
              onClick={onOpenBreathing}
              className="p-1.5 rounded-lg border border-sky-200 dark:border-sky-800/40 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer"
              title="1-Minute Box Breathing (De-Stress & Center)"
            >
              <Wind className="w-4 h-4" />
            </button>
          )}

          {/* Dark Mode Switcher */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202024] transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Weekly Achievement Card */}
          {onOpenAchievementCard && (
            <button
              type="button"
              onClick={onOpenAchievementCard}
              className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
              title="Weekly Achievement Social Card (Shareable Image)"
            >
              <Trophy className="w-4 h-4" />
            </button>
          )}

          {/* Print View */}
          <button
            type="button"
            onClick={onPrint}
            className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202024] transition-colors cursor-pointer"
            title="Print or Export PDF (Ctrl+P)"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Shortcuts */}
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202024] transition-colors cursor-pointer"
            title="Keyboard Shortcuts (Press ?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Export JSON */}
          <button
            type="button"
            onClick={onExport}
            className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202024] transition-colors cursor-pointer"
            title="Backup Data (JSON Export)"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Import JSON */}
          <button
            type="button"
            onClick={onImport}
            className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202024] transition-colors cursor-pointer"
            title="Restore Data (JSON Import)"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Reset Week */}
          <button
            type="button"
            onClick={onOpenResetModal}
            className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#DC2626] hover:bg-[#FEE2E2] dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            title="Reset this week"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Manual Save */}
          <button
            type="button"
            onClick={handleManualSave}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#27272A] dark:hover:bg-zinc-200'
            }`}
            title="Save changes (Ctrl+S)"
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
        </div>
      </div>
    </header>
  );
};
