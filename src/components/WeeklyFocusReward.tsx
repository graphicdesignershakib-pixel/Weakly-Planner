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
      <div className="md:col-span-8 bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5 flex flex-col justify-between transition-colors">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#F4F4F5] rounded text-[#111111]">
              <Target className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                Weekly Focus
              </span>
              <p className="text-xs text-[#A1A1AA] tabular-nums">
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
              className="inline-flex items-center gap-1 text-xs text-[#71717A] hover:text-[#111111] px-2 py-1 hover:bg-[#F4F4F5] rounded transition-colors"
              aria-label="Edit weekly focus"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSaveFocus}
                className="inline-flex items-center gap-1 text-xs font-medium bg-[#111111] text-white px-2.5 py-1 rounded hover:bg-[#27272A] transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
              <button
                onClick={handleCancelFocus}
                className="text-xs text-[#71717A] hover:text-[#111111] px-2 py-1 rounded hover:bg-[#F4F4F5] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditingFocus ? (
          <div className="space-y-2 mt-1">
            <div>
              <label htmlFor="focus-input" className="block text-[11px] font-semibold text-[#52525B] mb-1">
                Main Focus
              </label>
              <input
                id="focus-input"
                type="text"
                value={tempFocus}
                onChange={(e) => setTempFocus(e.target.value)}
                placeholder="e.g. Consistency & Growth"
                className="w-full text-base font-semibold text-[#111111] bg-[#F8F9FA] border border-[#D4D4D8] rounded px-3 py-1.5 focus:outline-none focus:border-[#111111] transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveFocus();
                  if (e.key === 'Escape') handleCancelFocus();
                }}
              />
            </div>
            <div>
              <label htmlFor="objective-input" className="block text-[11px] font-semibold text-[#52525B] mb-1">
                Supporting Objective (Optional)
              </label>
              <input
                id="objective-input"
                type="text"
                value={tempObjective}
                onChange={(e) => setTempObjective(e.target.value)}
                placeholder="e.g. Ship the architecture draft and keep morning routine intact"
                className="w-full text-xs text-[#52525B] bg-[#F8F9FA] border border-[#E4E4E7] rounded px-3 py-1.5 focus:outline-none focus:border-[#111111] transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveFocus();
                  if (e.key === 'Escape') handleCancelFocus();
                }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-1">
            {focus ? (
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#111111]">
                {focus}
              </h2>
            ) : (
              <p className="text-sm italic text-[#A1A1AA]">
                Set a focus for this week.
              </p>
            )}

            {objective ? (
              <p className="text-xs sm:text-sm text-[#52525B] mt-1 line-clamp-2">
                {objective}
              </p>
            ) : null}
          </div>
        )}
      </div>

      {/* Weekly Reward (4 cols on desktop) */}
      <div className="md:col-span-4 bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5 flex flex-col justify-between transition-colors">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#F4F4F5] rounded text-[#111111]">
              <Gift className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                Weekly Reward
              </span>
              <p className="text-xs text-[#A1A1AA]">Earned upon completion</p>
            </div>
          </div>

          {!isEditingReward ? (
            <button
              onClick={() => {
                setTempReward(reward);
                setIsEditingReward(true);
              }}
              className="inline-flex items-center gap-1 text-xs text-[#71717A] hover:text-[#111111] px-2 py-1 hover:bg-[#F4F4F5] rounded transition-colors"
              aria-label="Edit weekly reward"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleSaveReward}
                className="inline-flex items-center gap-1 text-xs font-medium bg-[#111111] text-white px-2 py-1 rounded hover:bg-[#27272A] transition-colors"
              >
                <Check className="w-3 h-3" />
                <span>Done</span>
              </button>
              <button
                onClick={handleCancelReward}
                className="text-xs text-[#71717A] hover:text-[#111111] px-1.5 py-1 rounded hover:bg-[#F4F4F5] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditingReward ? (
          <div className="mt-1">
            <label htmlFor="reward-input" className="block text-[11px] font-semibold text-[#52525B] mb-1">
              Reward Target
            </label>
            <input
              id="reward-input"
              type="text"
              value={tempReward}
              onChange={(e) => setTempReward(e.target.value)}
              placeholder="e.g. New Hoodie or Movie Night"
              className="w-full text-sm font-semibold text-[#111111] bg-[#F8F9FA] border border-[#D4D4D8] rounded px-3 py-1.5 focus:outline-none focus:border-[#111111] transition-colors"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveReward();
                if (e.key === 'Escape') handleCancelReward();
              }}
            />
          </div>
        ) : (
          <div className="mt-1">
            {reward ? (
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-bold text-[#111111]">
                  {reward}
                </span>
              </div>
            ) : (
              <p className="text-sm italic text-[#A1A1AA]">
                Add a reward for completing the week.
              </p>
            )}
            <p className="text-[11px] text-[#71717A] mt-1">
              Celebrate discipline and weekly follow-through.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
