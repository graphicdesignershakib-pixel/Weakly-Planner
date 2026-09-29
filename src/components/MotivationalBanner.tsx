import React, { useState } from 'react';
import { Sparkles, Flame, Trophy, Volume2, VolumeX, RefreshCw, PartyPopper } from 'lucide-react';
import { fireConfetti } from '../utils/confetti';
import { playLevelUpSound, isSoundEnabled, setSoundEnabled } from '../utils/soundEffects';

const MOTIVATIONAL_QUOTES = [
  { text: 'Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.', author: 'John C. Maxwell' },
  { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear (Atomic Habits)' },
  { text: 'Deep work is the ability to focus without distraction on a cognitively demanding task.', author: 'Cal Newport' },
  { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Do not count the days, make the days count.', author: 'Muhammad Ali' },
  { text: 'Discipline equals freedom.', author: 'Jocko Willink' },
  { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
];

interface MotivationalBannerProps {
  completedTasksCount: number;
  totalTasksCount: number;
  habitStreakCount: number;
}

export const MotivationalBanner: React.FC<MotivationalBannerProps> = ({
  completedTasksCount,
  totalTasksCount,
  habitStreakCount,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleCelebrate = () => {
    fireConfetti();
    playLevelUpSound();
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  // Calculate Level & XP
  const xp = completedTasksCount * 15 + habitStreakCount * 25;
  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-indigo-500/20 relative overflow-hidden luxury-card">
      {/* Background subtle decorative flare */}
      <div className="absolute right-0 top-0 w-96 h-full bg-radial from-indigo-500/15 via-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        {/* Left: Inspiring Daily Quote */}
        <div className="flex-1 min-w-0 pr-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-amber-400/20 text-amber-300 rounded-lg shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </span>
            <span className="text-[11px] uppercase font-bold tracking-widest text-amber-300/90 font-mono">
              Daily Anchor · Mindset Mastery
            </span>
            <button
              type="button"
              onClick={handleNextQuote}
              className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto lg:ml-2 cursor-pointer"
              title="Next Quote"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-sm sm:text-base font-medium italic text-slate-100 leading-relaxed tracking-wide">
            "{currentQuote.text}"
          </p>
          <span className="text-xs text-indigo-200/80 font-semibold block mt-1.5 font-sans">
            — {currentQuote.author}
          </span>
        </div>

        {/* Right: Gamification Badges & Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Level & XP Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3.5 py-2.5 flex items-center gap-3 shadow-inner">
            <div className="p-2 bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 rounded-lg font-black text-xs shadow-md">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide text-white">Level {level}</span>
                <span className="text-[10px] text-amber-300 font-mono font-bold">({xp} XP)</span>
              </div>
              <div className="w-24 bg-white/20 h-2 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpInCurrentLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Tasks Completed */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-inner">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-300 uppercase font-bold block font-mono">
                Tasks Completed
              </span>
              <span className="text-sm font-black font-mono text-white tracking-tight">
                {completedTasksCount} / {totalTasksCount}
              </span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
              soundOn
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                : 'bg-rose-500/20 border-rose-500/30 text-rose-300 hover:bg-rose-500/30'
            }`}
            title={soundOn ? 'Mute sound effects' : 'Unmute sound effects'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Celebration Button */}
          <button
            type="button"
            onClick={handleCelebrate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg hover:shadow-amber-500/25 active:scale-95 cursor-pointer hover:brightness-105"
            title="Celebrate your progress!"
          >
            <PartyPopper className="w-4 h-4" />
            <span>Cheer 🎉</span>
          </button>
        </div>
      </div>
    </div>
  );
};
