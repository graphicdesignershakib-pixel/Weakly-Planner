import React from 'react';
import { WeeklyReview as WeeklyReviewType } from '../types/planner';
import { BookOpen } from 'lucide-react';

interface WeeklyReviewProps {
  review: WeeklyReviewType;
  onChangeReviewField: (field: keyof WeeklyReviewType, value: string) => void;
}

export const WeeklyReview: React.FC<WeeklyReviewProps> = ({
  review,
  onChangeReviewField,
}) => {
  return (
    <section
      aria-labelledby="weekly-review-heading"
      className="bg-white border border-[#E5E7EB] rounded-lg p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F4F4F5] mb-5">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-[#F4F4F5] rounded text-[#111111]">
            <BookOpen className="w-4 h-4" />
          </span>
          <div>
            <h2 id="weekly-review-heading" className="text-sm font-bold text-[#111111] uppercase tracking-wider">
              Weekly Review & Reflection
            </h2>
            <p className="text-xs text-[#71717A]">
              End-of-week reflection to sharpen focus and compound lessons
            </p>
          </div>
        </div>
        <span className="text-[11px] text-[#A1A1AA] hidden sm:inline">
          Reflections persist automatically
        </span>
      </div>

      {/* 5 Reflection Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Field 1: What went well? */}
        <div className="space-y-1.5">
          <label
            htmlFor="review-went-well"
            className="block text-xs font-bold text-[#111111]"
          >
            What went well?
          </label>
          <textarea
            id="review-went-well"
            rows={3}
            value={review.wentWell}
            onChange={(e) => onChangeReviewField('wentWell', e.target.value)}
            placeholder="Key wins, maintained habits, moments of flow..."
            className="w-full text-xs text-[#111111] bg-[#FAFAFA] focus:bg-white border border-[#E5E7EB] focus:border-[#111111] rounded-md p-2.5 transition-colors focus:outline-none placeholder:text-[#A1A1AA] resize-none leading-relaxed"
          />
        </div>

        {/* Field 2: What was difficult? */}
        <div className="space-y-1.5">
          <label
            htmlFor="review-challenges"
            className="block text-xs font-bold text-[#111111]"
          >
            What was difficult or caused friction?
          </label>
          <textarea
            id="review-challenges"
            rows={3}
            value={review.challenges}
            onChange={(e) => onChangeReviewField('challenges', e.target.value)}
            placeholder="Obstacles, distractions, energy dips, dropped commitments..."
            className="w-full text-xs text-[#111111] bg-[#FAFAFA] focus:bg-white border border-[#E5E7EB] focus:border-[#111111] rounded-md p-2.5 transition-colors focus:outline-none placeholder:text-[#A1A1AA] resize-none leading-relaxed"
          />
        </div>

        {/* Field 3: Biggest achievement */}
        <div className="space-y-1.5">
          <label
            htmlFor="review-achievement"
            className="block text-xs font-bold text-[#111111]"
          >
            Biggest achievement this week
          </label>
          <input
            id="review-achievement"
            type="text"
            value={review.achievement}
            onChange={(e) => onChangeReviewField('achievement', e.target.value)}
            placeholder="The single outcome you take greatest pride in..."
            className="w-full text-xs text-[#111111] bg-[#FAFAFA] focus:bg-white border border-[#E5E7EB] focus:border-[#111111] rounded-md px-3 py-2 transition-colors focus:outline-none placeholder:text-[#A1A1AA]"
          />
        </div>

        {/* Field 4: What did I learn? */}
        <div className="space-y-1.5">
          <label
            htmlFor="review-lesson"
            className="block text-xs font-bold text-[#111111]"
          >
            What did I learn about myself or my systems?
          </label>
          <input
            id="review-lesson"
            type="text"
            value={review.lesson}
            onChange={(e) => onChangeReviewField('lesson', e.target.value)}
            placeholder="Insights on scheduling, rest, focus, or pacing..."
            className="w-full text-xs text-[#111111] bg-[#FAFAFA] focus:bg-white border border-[#E5E7EB] focus:border-[#111111] rounded-md px-3 py-2 transition-colors focus:outline-none placeholder:text-[#A1A1AA]"
          />
        </div>

        {/* Field 5: Priority for next week (Full width span) */}
        <div className="md:col-span-2 space-y-1.5 pt-2 border-t border-[#F4F4F5]">
          <label
            htmlFor="review-next-priority"
            className="block text-xs font-bold text-[#111111]"
          >
            Priority focus for next week
          </label>
          <input
            id="review-next-priority"
            type="text"
            value={review.nextWeekPriority}
            onChange={(e) => onChangeReviewField('nextWeekPriority', e.target.value)}
            placeholder="The #1 non-negotiable target to unlock next week's success..."
            className="w-full text-xs font-medium text-[#111111] bg-[#FAFAFA] focus:bg-white border border-[#E5E7EB] focus:border-[#111111] rounded-md px-3 py-2.5 transition-colors focus:outline-none placeholder:text-[#A1A1AA]"
          />
        </div>
      </div>
    </section>
  );
};
