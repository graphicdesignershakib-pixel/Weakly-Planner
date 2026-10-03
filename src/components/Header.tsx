import React, { useState, useEffect } from 'react';
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
  CalendarDays,
  Palette,
  Clock,
  Mail,
  Flame,
  BookOpen,
  MoreVertical,
  Headphones,
  Languages,
  Award,
  Compass,
} from 'lucide-react';
import { formatWeekRangeLabel, getMondayOfWeek } from '../utils/dateUtils';
import { ThemeType } from '../types/planner';
import { PWAInstallButton } from './PWAInstallButton';
import { useLanguage } from '../context/LanguageContext';

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
  onExportCalendar?: () => void;
  onOpenShortcuts: () => void;
  onOpenAchievementCard?: () => void;
  onOpenBreathing?: () => void;
  onOpenRituals?: () => void;
  onOpenLetters?: () => void;
  onOpenWrapped?: () => void;
  onOpenManual?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenProfile?: () => void;
  onOpenAmbientTimer?: () => void;
  onOpenWeeklyShare?: () => void;
  onOpenRoutines?: () => void;
  onOpenSearch?: () => void;
  onOpenBadges?: () => void;
  onOpenShakibGuide?: () => void;
  userName?: string;
  userTagline?: string;
  lastSavedText: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  currentTheme?: ThemeType;
  onChangeTheme?: (theme: ThemeType) => void;
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
  onExportCalendar,
  onOpenShortcuts,
  onOpenAchievementCard,
  onOpenBreathing,
  onOpenRituals,
  onOpenLetters,
  onOpenWrapped,
  onOpenManual,
  onOpenCommandPalette,
  onOpenProfile,
  onOpenAmbientTimer,
  onOpenWeeklyShare,
  onOpenRoutines,
  onOpenSearch,
  onOpenBadges,
  onOpenShakibGuide,
  userName = 'Shakib',
  userTagline,
  lastSavedText,
  isDarkMode,
  onToggleDarkMode,
  currentTheme = 'minimal',
  onChangeTheme,
}) => {
  const { isBn, toggleLang } = useLanguage();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Live real-time clock ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentWeekMonday = getMondayOfWeek(currentTime);
  const isCurrentWeek = weekStart === currentWeekMonday;

  const handleManualSave = () => {
    onSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Live formatted time strings
  const formattedLiveDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedLiveClock = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Get dynamic greeting with user name
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return `Good morning, ${userName}! Make today remarkable ✨`;
    if (hour >= 12 && hour < 17) return `Good afternoon, ${userName}! Momentum is building 🔥`;
    if (hour >= 17 && hour < 22) return `Good evening, ${userName}! Celebrate today's wins 🌙`;
    return `Peaceful night, ${userName}! Rest well and recharge 🌟`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B0F17]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Dynamic Greeting */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white text-base font-black shadow-md ring-2 ring-white/20 shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Click to edit your profile"
          >
            {userName.slice(0, 1).toUpperCase()}
          </button>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Weekly Life Planner
              </span>
              <button
                type="button"
                onClick={onOpenProfile}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors shadow-2xs"
                title="Edit profile"
              >
                <span>{userName}</span>
                {userTagline && <span className="opacity-60">· {userTagline}</span>}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-pulse" />
                {getGreeting()}
              </span>
              {/* Real-time Live Clock & Date Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[10px] font-mono text-slate-600 dark:text-slate-300 tabular-nums shadow-2xs">
                <Clock className="w-3 h-3 text-sky-500 animate-pulse" />
                <span className="font-bold text-slate-900 dark:text-zinc-100">{formattedLiveClock}</span>
                <span className="opacity-30">|</span>
                <span>{formattedLiveDate}</span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums hidden lg:inline">
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
        <div className="flex items-center gap-1.5 self-end md:self-auto">
          {/* Spotlight Search (Ctrl+K) */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202024] transition-colors cursor-pointer"
              title="Spotlight Search & Quick Add (Ctrl+K / ⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline text-[9px] font-mono bg-[#FAFAFA] dark:bg-[#18181B] px-1 py-0.2 rounded border border-[#E5E7EB] dark:border-[#3F3F46]">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Daily Rituals (Morning Clarity & Evening Reflection) */}
          {onOpenRituals && (
            <button
              type="button"
              onClick={onOpenRituals}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100/80 transition-colors cursor-pointer text-xs font-bold shadow-2xs"
              title="Daily Rituals: Morning Intentions & Evening Gratitude"
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Rituals</span>
            </button>
          )}

          {/* Ambient Focus Audio Timer */}
          {onOpenAmbientTimer && (
            <button
              type="button"
              onClick={onOpenAmbientTimer}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors cursor-pointer text-xs font-bold shadow-2xs"
              title="অ্যাম্বিয়েন্ট সাউন্ড ও ফোকাস টাইমার"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">ফোকাস অডিও</span>
            </button>
          )}

          {/* Global Search Button */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-xs font-bold shadow-2xs"
              title={isBn ? 'সবকিছু সার্চ করুন (Search)' : 'Search everything'}
            >
              <Search className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden md:inline">{isBn ? 'সার্চ' : 'Search'}</span>
            </button>
          )}

          {/* 1-Click Routine Presets */}
          {onOpenRoutines && (
            <button
              type="button"
              onClick={onOpenRoutines}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/80 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors cursor-pointer text-xs font-bold shadow-2xs"
              title={isBn ? '১-ক্লিকে রেডিমেড রুটিন লোড করুন' : '1-Click Routine Presets'}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden xl:inline">{isBn ? 'রুটিন টেমপ্লেট' : 'Routines'}</span>
            </button>
          )}

          {/* Shakib 30-Day Discipline Reset Guide */}
          {onOpenShakibGuide && (
            <button
              type="button"
              onClick={onOpenShakibGuide}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-950/50 dark:to-sky-950/50 text-indigo-700 dark:text-indigo-300 hover:opacity-95 transition-all cursor-pointer text-xs font-black shadow-2xs"
              title={isBn ? 'শাকিবের ৩০ দিনের Discipline Reset গাইড ও সিস্টেম' : "Shakib's 30-Day Discipline Reset Guide"}
            >
              <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
              <span className="hidden md:inline">{isBn ? '৩০ দিনের গাইড' : '30-Day Guide'}</span>
            </button>
          )}

          {/* Language Switcher Button (BN / EN) */}
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold transition-colors cursor-pointer shadow-2xs"
            title={isBn ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
          >
            <Languages className="w-3.5 h-3.5 text-sky-500" />
            <span>{isBn ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Weekly Share Summary Card */}
          {onOpenWeeklyShare && (
            <button
              type="button"
              onClick={onOpenWeeklyShare}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors cursor-pointer text-xs font-bold shadow-2xs"
              title="সাপ্তাহিক অর্জন কার্ড ও স্টোরি রিপোর্ট"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">অর্জন কার্ড</span>
            </button>
          )}

          {/* Gamification Badges & Level */}
          {onOpenBadges && (
            <button
              type="button"
              onClick={onOpenBadges}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-yellow-300 dark:border-yellow-700/60 bg-yellow-50/80 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 transition-colors cursor-pointer text-xs font-bold shadow-2xs"
              title={isBn ? 'আপনার প্রোডাক্টিভিটি ব্যাজ ও লেভেল দেখুন' : 'View your badges & level'}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xl:inline">{isBn ? 'ব্যাজ' : 'Badges'}</span>
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* User Manual Guide */}
          {onOpenManual && (
            <button
              type="button"
              onClick={onOpenManual}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sky-300 dark:border-sky-800/60 bg-sky-50/60 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 hover:bg-sky-100/80 transition-colors cursor-pointer text-xs font-bold shadow-2xs"
              title="ব্যবহার নির্দেশিকা / App User Manual"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Guide</span>
            </button>
          )}

          {/* Aesthetic Color Theme Cycler */}
          {onChangeTheme && (
            <button
              type="button"
              onClick={() => {
                const themes: ThemeType[] = ['minimal', 'sage', 'latte', 'obsidian'];
                const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
                onChangeTheme(themes[nextIdx]);
              }}
              className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202024] transition-colors cursor-pointer flex items-center gap-1"
              title={`Switch Aesthetic Theme (Current: ${currentTheme.toUpperCase()})`}
            >
              <Palette className="w-4 h-4" />
              <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider">
                {currentTheme}
              </span>
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

          {/* More Actions Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isMoreMenuOpen
                  ? 'border-[#111111] dark:border-white bg-[#F4F4F5] dark:bg-[#202024] text-[#111111] dark:text-white'
                  : 'border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202024]'
              }`}
              title="More Options (Print, Export, Future Letters, Wrapped)"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-0.5">
                  {onOpenWrapped && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        onOpenWrapped();
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-[#111111] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                      <span>Weekly Wrapped Story</span>
                    </button>
                  )}

                  {onOpenLetters && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        onOpenLetters();
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-[#111111] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] flex items-center gap-2 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-purple-500" />
                      <span>Letters to Future Self</span>
                    </button>
                  )}

                  {onOpenBreathing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        onOpenBreathing();
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-[#111111] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] flex items-center gap-2 cursor-pointer"
                    >
                      <Wind className="w-3.5 h-3.5 text-sky-500" />
                      <span>1-Min Breathing Exercise</span>
                    </button>
                  )}

                  {onOpenAchievementCard && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        onOpenAchievementCard();
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-[#111111] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] flex items-center gap-2 cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Achievement Card (Share)</span>
                    </button>
                  )}

                  <div className="h-px bg-[#E5E7EB] dark:bg-[#27272A] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onPrint();
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-[#111111] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#71717A]" />
                    <span>Print or PDF (Ctrl+P)</span>
                  </button>

                  {onExportCalendar && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        onExportCalendar();
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-[#111111] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] flex items-center gap-2 cursor-pointer"
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-[#71717A]" />
                      <span>Sync Calendar (.ics)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenShortcuts();
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-[#111111] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] flex items-center gap-2 cursor-pointer"
                  >
                    <Keyboard className="w-3.5 h-3.5 text-[#71717A]" />
                    <span>Keyboard Shortcuts (?)</span>
                  </button>

                  <div className="h-px bg-[#E5E7EB] dark:bg-[#27272A] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onExport();
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-[#111111] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#71717A]" />
                    <span>Backup Data (JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onImport();
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-[#111111] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#71717A]" />
                    <span>Restore Data (JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenResetModal();
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset This Week</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Manual Save Button */}
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
