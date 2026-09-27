import React from 'react';
import {
  Trophy,
  Flame,
  Droplets,
  Sunrise,
  CheckCircle2,
  Lock,
  Sparkles,
  HeartHandshake,
  Star,
} from 'lucide-react';
import { PlannerState } from '../types/planner';

interface BadgesShowcaseProps {
  plannerState: PlannerState;
}

export const BadgesShowcase: React.FC<BadgesShowcaseProps> = ({ plannerState }) => {
  const totalTasks = plannerState.days.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = plannerState.days.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.completed).length,
    0
  );
  const streakCount = plannerState.habits.reduce(
    (acc, h) => acc + h.completed.filter(Boolean).length,
    0
  );
  const totalWater = plannerState.days.reduce(
    (acc, d) => acc + (d.waterGlasses || 0),
    0
  );
  const totalPrayers = plannerState.days.reduce((acc, d) => {
    if (!d.prayers) return acc;
    return acc + Object.values(d.prayers).filter(Boolean).length;
  }, 0);

  const badges = [
    {
      id: 'first-step',
      name: 'Momentum Builder',
      desc: 'Completed at least 5 tasks this week',
      icon: CheckCircle2,
      isUnlocked: completedTasks >= 5,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
    },
    {
      id: 'hydration-hero',
      name: 'Hydration Hero',
      desc: 'Drank 8+ glasses of water',
      icon: Droplets,
      isUnlocked: totalWater >= 8,
      color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/40',
    },
    {
      id: 'habit-streak',
      name: 'Discipline Master',
      desc: 'Maintained 10+ habit check-ins',
      icon: Flame,
      isUnlocked: streakCount >= 10,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
    },
    {
      id: 'spiritual-anchor',
      name: 'Consistent Soul',
      desc: 'Completed 15+ prayer check-ins',
      icon: Sunrise,
      isUnlocked: totalPrayers >= 15,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40',
    },
    {
      id: 'centurion',
      name: 'Peak Performer',
      desc: 'Completed 20+ tasks in a week',
      icon: Trophy,
      isUnlocked: completedTasks >= 20,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40',
    },
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F5] dark:border-[#27272A] mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 rounded-lg">
            <Trophy className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
              Trophy Room · Achievement Badges
            </h3>
            <span className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] font-mono">
              Earn honor badges as you stay disciplined each day
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FAFAFA] dark:bg-[#202024] px-2.5 py-1 rounded-lg border border-[#E5E7EB] dark:border-[#27272A]">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
          <span className="text-xs font-bold text-[#111111] dark:text-white font-mono">
            {unlockedCount} / {badges.length} Unlocked
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                b.isUnlocked
                  ? `${b.color} ring-1 ring-current/20 shadow-2xs`
                  : 'bg-[#FAFAFA]/60 dark:bg-[#121214]/60 border-[#E5E7EB] dark:border-[#27272A] opacity-50 grayscale'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <span className="p-2 rounded-lg bg-white/80 dark:bg-black/40 shadow-2xs">
                  <Icon className="w-4 h-4" />
                </span>
                {b.isUnlocked ? (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-white/90 dark:bg-black/60 px-1.5 py-0.5 rounded">
                    Unlocked ✨
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-[#A1A1AA] flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> Locked
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#111111] dark:text-white leading-tight">
                  {b.name}
                </h4>
                <p className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-snug">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
