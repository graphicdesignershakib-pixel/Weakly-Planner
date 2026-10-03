import React, { useMemo } from 'react';
import {
  X,
  Trophy,
  Award,
  Sparkles,
  Lock,
  CheckCircle,
  Flame,
  Star,
  Target,
  Zap,
} from 'lucide-react';
import { PlannerState } from '../types/planner';
import { useLanguage } from '../context/LanguageContext';

interface GamificationBadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PlannerState;
}

interface Badge {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  descBn: string;
  descEn: string;
  unlocked: boolean;
  progress: string;
}

export const GamificationBadgesModal: React.FC<GamificationBadgesModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  const { isBn } = useLanguage();

  const totalTasksCompleted = useMemo(() => {
    return (state.days || []).reduce(
      (acc, d) => acc + d.tasks.filter((t) => t.completed).length,
      0
    );
  }, [state]);

  const totalHabitsCompleted = useMemo(() => {
    return (state.habits || []).reduce(
      (acc, h) => acc + (h.completed || []).filter(Boolean).length,
      0
    );
  }, [state]);

  // Calculate XP
  const xp = totalTasksCompleted * 20 + totalHabitsCompleted * 15;
  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  const badges: Badge[] = useMemo(() => {
    return [
      {
        id: 'starter',
        nameBn: 'প্রথম পদক্ষেপ',
        nameEn: 'First Steps',
        icon: '🌱',
        descBn: 'যেকোনো ১টি কাজ সম্পন্ন করা',
        descEn: 'Complete your first task',
        unlocked: totalTasksCompleted >= 1,
        progress: `${Math.min(1, totalTasksCompleted)}/1`,
      },
      {
        id: 'focus_master',
        nameBn: 'ফোকাস মাস্টার',
        nameEn: 'Focus Master',
        icon: '🎯',
        descBn: 'কমপক্ষে ১০টি কাজ সম্পন্ন করা',
        descEn: 'Complete at least 10 tasks',
        unlocked: totalTasksCompleted >= 10,
        progress: `${Math.min(10, totalTasksCompleted)}/10`,
      },
      {
        id: 'unstoppable',
        nameBn: 'আনস্টপেবল স্ট্রিক',
        nameEn: 'Unstoppable Streak',
        icon: '🔥',
        descBn: 'কমপক্ষে ৭টি অভ্যাস সম্পন্ন করা',
        descEn: 'Complete at least 7 habit checks',
        unlocked: totalHabitsCompleted >= 7,
        progress: `${Math.min(7, totalHabitsCompleted)}/7`,
      },
      {
        id: 'grandmaster',
        nameBn: 'প্রোডাক্টিভিটি লিজেন্ড',
        nameEn: 'Productivity Legend',
        icon: '👑',
        descBn: 'কমপক্ষে ২৫টি কাজ সম্পন্ন করা',
        descEn: 'Complete 25 total tasks',
        unlocked: totalTasksCompleted >= 25,
        progress: `${Math.min(25, totalTasksCompleted)}/25`,
      },
      {
        id: 'planner_architect',
        nameBn: 'স্ট্র্যাটেজিক প্ল্যানার',
        nameEn: 'Master Architect',
        icon: '📐',
        descBn: 'সাপ্তাহিক প্রায়োরিটি ও লক্ষ্য নির্ধারণ করা',
        descEn: 'Set up weekly focus and goals',
        unlocked: Boolean(state.focus?.trim() || state.objective?.trim()),
        progress: Boolean(state.focus?.trim() || state.objective?.trim()) ? '1/1' : '0/1',
      },
      {
        id: 'zen_warrior',
        nameBn: 'জেন মাইন্ডসেট',
        nameEn: 'Zen Mindset',
        icon: '🧘',
        descBn: 'মানসিক প্রশান্তি ও ফোকাস ধরে রাখা',
        descEn: 'Focus on calm and consistent work',
        unlocked: totalTasksCompleted >= 5,
        progress: `${Math.min(5, totalTasksCompleted)}/5`,
      },
    ];
  }, [totalTasksCompleted, totalHabitsCompleted, state]);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-zinc-800 relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-gradient-to-tr from-amber-500 to-yellow-500 text-white rounded-2xl shadow-xs">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black">
                {isBn ? 'অ্যাচিভমেন্ট ও প্রোডাক্টিভিটি ব্যাজ' : 'Productivity Badges & Level'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'আপনার ধারাবাহিকতার প্রতিটি অর্জন উদযাপন করুন' : 'Unlock badges as you complete tasks and habits'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Level Card */}
        <div className="p-4 my-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-200/50 dark:border-amber-900/30 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black uppercase tracking-wider">
                Level {level}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {isBn ? 'প্রোডাক্টিভ ওয়ারিয়র' : 'Productive Warrior'}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              {xp} XP
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${xpInCurrentLevel}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{isBn ? 'পরবর্তী লেভেল:' : 'Next Level:'} {level + 1}</span>
            <span>{xpInCurrentLevel}/100 XP</span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>{isBn ? 'আপনার অর্জিত ব্যাজসমূহ' : 'Your Badges'}</span>
            <span>{unlockedCount} / {badges.length} {isBn ? 'আনলকড' : 'unlocked'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                  b.unlocked
                    ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20'
                    : 'border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40 opacity-70'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
                    b.unlocked
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                      : 'bg-slate-200 dark:bg-zinc-800 text-slate-400'
                  }`}
                >
                  {b.unlocked ? b.icon : <Lock className="w-4 h-4 text-slate-400" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-black truncate text-slate-900 dark:text-white">
                      {isBn ? b.nameBn : b.nameEn}
                    </h4>
                    {b.unlocked && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {isBn ? b.descBn : b.descEn}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {b.progress}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
