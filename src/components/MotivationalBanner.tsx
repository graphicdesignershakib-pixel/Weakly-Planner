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
    <div className="bg-gradient-to-r from-[#111111] to-[#27272A] text-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#27272A] relative overflow-hidden">
      {/* Background subtle decorative flare */}
      <div className="absolute right-0 top-0 w-96 h-full bg-radial from-white/5 to-transparent pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        {/* Left: Inspiring Daily Quote */}
        <div className="flex-1 min-w-0 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-white/10 pb-3 lg:pb-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 bg-amber-400/20 text-amber-300 rounded">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
              Daily Inspiration & Mindset
            </span>
            <button
              type="button"
              onClick={handleNextQuote}
              className="text-white/60 hover:text-white p-1 rounded hover:bg-white/10 transition-colors ml-auto lg:ml-2 cursor-pointer"
              title="Next Quote"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs sm:text-sm font-medium italic text-zinc-100 leading-relaxed">
            "{currentQuote.text}"
          </p>
          <span className="text-[10px] text-zinc-400 font-semibold block mt-1">
            — {currentQuote.author}
          </span>
        </div>

        {/* Right: Gamification Badges & Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Level & XP Badge */}
          <div className="bg-white/10 border border-white/15 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-400 text-[#111111] rounded-md font-extrabold text-xs">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Level {level}</span>
                <span className="text-[10px] text-amber-300 font-mono">({xp} XP)</span>
              </div>
              <div className="w-20 bg-white/20 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpInCurrentLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Tasks Completed */}
          <div className="bg-white/10 border border-white/15 rounded-lg px-3 py-2 flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-md">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                Done Tasks
              </span>
              <span className="text-xs font-bold font-mono text-white">
                {completedTasksCount} / {totalTasksCount}
              </span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              soundOn
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                : 'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30'
            }`}
            title={soundOn ? 'Mute sound effects' : 'Unmute sound effects'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Celebration Button */}
          <button
            type="button"
            onClick={handleCelebrate}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-[#111111] hover:from-amber-300 hover:to-amber-400 font-bold rounded-lg text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            title="Celebrate your progress!"
          >
            <PartyPopper className="w-3.5 h-3.5" />
            <span>Cheer 🎉</span>
          </button>
        </div>
      </div>
    </div>
  );
};
