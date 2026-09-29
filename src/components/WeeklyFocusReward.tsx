import React, { useState } from 'react';
import { Target, Gift, Edit2, Check } from 'lucide-react';
import { getWeekDaysInfo } from '../utils/dateUtils';

interface WeeklyFocusRewardProps {
  weekStart: string;
  focus: string;
  objective?: string;
  reward: string;
  onUpdateFocus: (focus: string, objective?: string) => void;
  onUpdateReward: (reward: string) => void;
}

export const WeeklyFocusReward: React.FC<WeeklyFocusRewardProps> = ({
  weekStart,
  focus,
  objective,
  reward,
  onUpdateFocus,
  onUpdateReward,
}) => {
  const [isEditingFocus, setIsEditingFocus] = useState(false);
  const [tempFocus, setTempFocus] = useState(focus);
  const [tempObjective, setTempObjective] = useState(objective || '');

  const [isEditingReward, setIsEditingReward] = useState(false);
  const [tempReward, setTempReward] = useState(reward);

  const daysInfo = getWeekDaysInfo(weekStart);
  const formattedWeekStart = daysInfo[0]?.fullFormatted || weekStart;

  const handleSaveFocus = () => {
    onUpdateFocus(tempFocus.trim(), tempObjective.trim());
    setIsEditingFocus(false);
  };

  const handleCancelFocus = () => {
    setTempFocus(focus);
    setTempObjective(objective || '');
    setIsEditingFocus(false);
  };

  const handleSaveReward = () => {
    onUpdateReward(tempReward.trim());
    setIsEditingReward(false);
  };

  const handleCancelReward = () => {
    setTempReward(reward);
    setIsEditingReward(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Weekly Focus & Objective (8 cols on desktop) */}
      <div className="md:col-span-8 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all shadow-sm hover:shadow-md luxury-card">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-gradient-to-tr from-indigo-500 to-violet-500 text-white rounded-xl shadow-md shadow-indigo-500/20">
              <Target className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Weekly Anchor Focus
              </span>
              <p className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                Week Starting: {formattedWeekStart}
              </p>
            </div>
          </div>

          {!isEditingFocus ? (
            <button
              onClick={() => {
                setTempFocus(focus);
                setTempObjective(objective || '');
                setIsEditingFocus(true);
              }}
              className="inline-flex items-center gap-1 text-xs text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white px-2 py-1 hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded transition-colors cursor-pointer"
              aria-label="Edit weekly focus"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleSaveFocus}
                className="inline-flex items-center gap-1 text-xs bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-2 py-1 rounded transition-colors cursor-pointer"
                title="Save changes"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancelFocus}
                className="text-xs text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white px-2 py-1 hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="mt-2">
          {isEditingFocus ? (
            <div className="space-y-2">
              <input
                type="text"
                value={tempFocus}
                onChange={(e) => setTempFocus(e.target.value)}
                placeholder="e.g. Consistency, Shipping V1, Deep Execution..."
                className="w-full text-sm font-bold text-[#111111] dark:text-white bg-[#F8F9FA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#111111] dark:focus:border-white"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveFocus();
                  if (e.key === 'Escape') handleCancelFocus();
                }}
              />
              <textarea
                value={tempObjective}
                onChange={(e) => setTempObjective(e.target.value)}
                placeholder="Core outcome to achieve by Sunday..."
                rows={2}
                className="w-full text-xs text-[#111111] dark:text-white bg-[#F8F9FA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#111111] dark:focus:border-white resize-none"
              />
            </div>
          ) : (
            <div
              onClick={() => {
                setTempFocus(focus);
                setTempObjective(objective || '');
                setIsEditingFocus(true);
              }}
              className="cursor-pointer group"
            >
              <h2 className="text-base sm:text-lg font-bold text-[#111111] dark:text-white tracking-tight group-hover:underline underline-offset-4">
                {focus || (
                  <span className="text-[#A1A1AA] dark:text-[#71717A] font-normal italic">
                    Click to define this week's primary theme & focus...
                  </span>
                )}
              </h2>
              {objective ? (
                <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] mt-1 leading-relaxed">
                  {objective}
                </p>
              ) : (
                <p className="text-xs text-[#A1A1AA] dark:text-[#71717A] mt-1 italic">
                  Optional: add specific weekly milestones or objective.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Reward (4 cols on desktop) */}
      <div className="md:col-span-4 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all shadow-sm hover:shadow-md luxury-card">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-gradient-to-tr from-amber-500 to-rose-500 text-white rounded-xl shadow-md shadow-amber-500/20">
              <Gift className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Completion Reward
              </span>
              <p className="text-xs text-slate-400 dark:text-slate-500">Celebrate your victory</p>
            </div>
          </div>

          {!isEditingReward ? (
            <button
              onClick={() => {
                setTempReward(reward);
                setIsEditingReward(true);
              }}
              className="inline-flex items-center gap-1 text-xs text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white px-2 py-1 hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded transition-colors cursor-pointer"
              aria-label="Edit reward"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleSaveReward}
                className="inline-flex items-center gap-1 text-xs bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-2 py-1 rounded transition-colors cursor-pointer"
                title="Save reward"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancelReward}
                className="text-xs text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white px-2 py-1 hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="mt-2">
          {isEditingReward ? (
            <input
              type="text"
              value={tempReward}
              onChange={(e) => setTempReward(e.target.value)}
              placeholder="e.g. Favorite Dinner, New Book, Relaxing Outing..."
              className="w-full text-sm font-semibold text-[#111111] dark:text-white bg-[#F8F9FA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#111111] dark:focus:border-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveReward();
                if (e.key === 'Escape') handleCancelReward();
              }}
            />
          ) : (
            <div
              onClick={() => {
                setTempReward(reward);
                setIsEditingReward(true);
              }}
              className="cursor-pointer group"
            >
              <h3 className="text-sm sm:text-base font-bold text-[#111111] dark:text-white group-hover:underline underline-offset-4">
                {reward || (
                  <span className="text-[#A1A1AA] dark:text-[#71717A] font-normal italic">
                    Set a reward for executing this week...
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">
                Earned when hitting &ge; 80% weekly completion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
