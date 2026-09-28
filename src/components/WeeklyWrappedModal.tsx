import React, { useState, useEffect } from 'react';
import {
  Trophy,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle,
  Award,
  Share2,
  Droplet,
  Crown,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { PlannerState, DayInfo } from '../types/planner';
import { fireConfetti } from '../utils/confetti';
import { playLevelUpSound } from '../utils/soundEffects';

interface WeeklyWrappedModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PlannerState;
  daysInfo: DayInfo[];
  userName?: string;
}

export const WeeklyWrappedModal: React.FC<WeeklyWrappedModalProps> = ({
  isOpen,
  onClose,
  state,
  daysInfo,
  userName = 'Shakib',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Calculate metrics
  const totalTasks = state.days.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = state.days.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.completed).length,
    0
  );
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalHabitsChecks = state.habits.reduce(
    (acc, h) => acc + h.completed.filter(Boolean).length,
    0
  );
  const maxPossibleHabits = state.habits.length * 7;
  const habitRate = maxPossibleHabits > 0 ? Math.round((totalHabitsChecks / maxPossibleHabits) * 100) : 0;

  const totalWaterGlasses = state.days.reduce((acc, d) => acc + (d.waterGlasses || 0), 0);
  const prayerCount = state.days.reduce(
    (acc, d) =>
      acc + (d.prayers ? Object.values(d.prayers).filter(Boolean).length : 0),
    0
  );

  // Best day determination
  let bestDayName = 'Friday';
  let maxDayDone = -1;
  state.days.forEach((d, idx) => {
    const done = d.tasks.filter((t) => t.completed).length;
    if (done > maxDayDone) {
      maxDayDone = done;
      bestDayName = daysInfo[idx]?.dayName || 'Friday';
    }
  });

  // Archetype title
  const getProductivityArchetype = () => {
    if (taskRate >= 80) return { title: 'The Master Strategist 👑', desc: 'Flawless execution and unstoppable drive.' };
    if (taskRate >= 60) return { title: 'The High Momentum Builder ⚡', desc: 'Consistently moving the needle forward.' };
    if (totalHabitsChecks >= 15) return { title: 'The Habit Alchemist 🧘', desc: 'Building systems that withstand any chaos.' };
    return { title: 'The Resilient Pioneer 🌟', desc: 'Every day is a fresh opportunity to excel.' };
  };

  const archetype = getProductivityArchetype();

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
      playLevelUpSound();
      fireConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSlides = 5;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      fireConfetti();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md h-[540px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 select-none bg-radial from-[#1E1B4B] via-[#0F0E26] to-[#050510] text-white border border-white/20">
        {/* Story Progress Indicators at top */}
        <div className="flex items-center gap-1.5 w-full z-10">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  idx < currentSlide
                    ? 'w-full'
                    : idx === currentSlide
                    ? 'w-full animate-pulse'
                    : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-white/60 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Story Slides Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4 py-8">
          {currentSlide === 0 && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase text-amber-300">
                <Sparkles className="w-3.5 h-3.5" /> Weekly Wrapped 2026
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                Ready for your recap, {userName}?
              </h2>
              <p className="text-sm text-zinc-300 font-light leading-relaxed">
                Another seven days of discipline, intentionality, and wins. Let’s look at your incredible progress.
              </p>
              <div className="pt-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5 shadow-xl animate-bounce">
                  <div className="w-full h-full bg-[#0F0E26] rounded-2xl flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentSlide === 1 && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-300">Total Victories Conquered</h3>
              <div className="text-6xl font-black text-white tabular-nums tracking-tighter">
                {completedTasks}
                <span className="text-2xl text-indigo-300 font-medium">/{totalTasks}</span>
              </div>
              <p className="text-xs text-indigo-200 font-medium">
                {taskRate}% of planned tasks executed with precision
              </p>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
                Your highest peak day was <strong className="text-amber-400">{bestDayName}</strong> with {maxDayDone > 0 ? maxDayDone : 'consistent'} completed actions!
              </div>
            </div>
          )}

          {currentSlide === 2 && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <Flame className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-300">Habit Streaks & Discipline</h3>
              <div className="text-6xl font-black text-emerald-400 tabular-nums tracking-tighter">
                {totalHabitsChecks}
              </div>
              <p className="text-xs text-emerald-200 font-medium">
                Total positive habit rituals marked this week
              </p>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
                Consistency beats intensity. You kept your promises even when inspiration faded.
              </div>
            </div>
          )}

          {currentSlide === 3 && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-2">
                <Droplet className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-300">Holistic Wellness & Soul</h3>
              <div className="grid grid-cols-2 gap-3 text-left w-full max-w-xs mx-auto">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-[11px] text-sky-300 block mb-0.5">Hydration Fuel</span>
                  <span className="text-2xl font-bold text-white">{totalWaterGlasses * 250} ml</span>
                  <span className="text-[10px] text-zinc-400 block mt-1">({totalWaterGlasses} glasses)</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-[11px] text-amber-300 block mb-0.5">Prayers Offered</span>
                  <span className="text-2xl font-bold text-white">{prayerCount}</span>
                  <span className="text-[10px] text-zinc-400 block mt-1">Salah moments</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 italic">
                A strong mind requires a hydrated body and grounded spirit.
              </p>
            </div>
          )}

          {currentSlide === 4 && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                Your Weekly Identity
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {archetype.title}
              </h2>
              <p className="text-sm text-zinc-300 max-w-xs mx-auto leading-relaxed">
                "{archetype.desc}"
              </p>
              <div className="py-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-amber-300">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Next week will be even greater!</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono text-white/50">
            {currentSlide + 1} of {totalSlides}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-full bg-white text-[#0F0E26] font-bold text-xs hover:bg-white/90 transition-transform active:scale-95 flex items-center gap-1 shadow-lg"
          >
            <span>{currentSlide === totalSlides - 1 ? 'Celebrate & Finish' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
