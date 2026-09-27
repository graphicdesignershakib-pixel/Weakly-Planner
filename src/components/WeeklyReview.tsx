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
      className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-5 sm:p-6 shadow-xs transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F4F4F5] dark:border-[#27272A] mb-5">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-[#F4F4F5] dark:bg-[#27272A] rounded text-[#111111] dark:text-white">
            <BookOpen className="w-4 h-4" />
          </span>
          <div>
            <h2 id="weekly-review-heading" className="text-sm font-bold text-[#111111] dark:text-white uppercase tracking-wider">
              Weekly Review & Reflection
            </h2>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              End-of-week reflection to sharpen focus and compound lessons
            </p>
          </div>
        </div>
        <span className="text-[11px] text-[#A1A1AA] dark:text-[#71717A] hidden sm:inline">
          Reflections persist automatically
        </span>
      </div>

      {/* 5 Reflection Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Field 1: What went well? */}
        <div className="space-y-1.5">
          <label
            htmlFor="review-went-well"
            className="block text-xs font-bold text-[#111111] dark:text-white"
          >
            What went well?
          </label>
          <textarea
            id="review-went-well"
            rows={3}
            value={review.wentWell}
            onChange={(e) => onChangeReviewField('wentWell', e.target.value)}
            placeholder="Key wins, maintained habits, moments of flow..."
            className="w-full text-xs text-[#111111] dark:text-white bg-[#FAFAFA] dark:bg-[#121214] focus:bg-white dark:focus:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] focus:border-[#111111] dark:focus:border-white rounded-lg p-2.5 transition-colors focus:outline-none placeholder:text-[#A1A1AA] dark:placeholder:text-[#71717A] resize-none leading-relaxed"
          />
        </div>

        {/* Field 2: What was difficult? */}
        <div className="space-y-1.5">
          <label
            htmlFor="review-challenges"
            className="block text-xs font-bold text-[#111111] dark:text-white"
          >
            What was difficult or distracting?
          </label>
          <textarea
            id="review-challenges"
            rows={3}
            value={review.challenges}
            onChange={(e) => onChangeReviewField('challenges', e.target.value)}
            placeholder="Friction points, unexpected fires, fatigue..."
            className="w-full text-xs text-[#111111] dark:text-white bg-[#FAFAFA] dark:bg-[#121214] focus:bg-white dark:focus:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] focus:border-[#111111] dark:focus:border-white rounded-lg p-2.5 transition-colors focus:outline-none placeholder:text-[#A1A1AA] dark:placeholder:text-[#71717A] resize-none leading-relaxed"
          />
        </div>

        {/* Field 3: Biggest achievement */}
        <div className="space-y-1.5">
          <label
            htmlFor="review-achievement"
            className="block text-xs font-bold text-[#111111] dark:text-white"
          >
            Biggest achievement this week
          </label>
          <textarea
            id="review-achievement"
            rows={3}
            value={review.achievement}
            onChange={(e) => onChangeReviewField('achievement', e.target.value)}
            placeholder="The single milestone you are proud of..."
            className="w-full text-xs text-[#111111] dark:text-white bg-[#FAFAFA] dark:bg-[#121214] focus:bg-white dark:focus:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] focus:border-[#111111] dark:focus:border-white rounded-lg p-2.5 transition-colors focus:outline-none placeholder:text-[#A1A1AA] dark:placeholder:text-[#71717A] resize-none leading-relaxed"
          />
        </div>

        {/* Field 4: Key lesson */}
        <div className="space-y-1.5">
          <label
            htmlFor="review-lesson"
            className="block text-xs font-bold text-[#111111] dark:text-white"
          >
            One lesson learned or rule to remember
          </label>
          <textarea
            id="review-lesson"
            rows={3}
            value={review.lesson}
            onChange={(e) => onChangeReviewField('lesson', e.target.value)}
            placeholder="Insight on energy, sleep, planning, or mindset..."
            className="w-full text-xs text-[#111111] dark:text-white bg-[#FAFAFA] dark:bg-[#121214] focus:bg-white dark:focus:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] focus:border-[#111111] dark:focus:border-white rounded-lg p-2.5 transition-colors focus:outline-none placeholder:text-[#A1A1AA] dark:placeholder:text-[#71717A] resize-none leading-relaxed"
          />
        </div>

        {/* Field 5: Priority for next week (spans full width) */}
        <div className="space-y-1.5 md:col-span-2">
          <label
            htmlFor="review-next-week"
            className="block text-xs font-bold text-[#111111] dark:text-white"
          >
            Top Priority for Next Week
          </label>
          <textarea
            id="review-next-week"
            rows={2}
            value={review.nextWeekPriority}
            onChange={(e) => onChangeReviewField('nextWeekPriority', e.target.value)}
            placeholder="The #1 non-negotiable target to execute when Monday begins..."
            className="w-full text-xs text-[#111111] dark:text-white bg-[#FAFAFA] dark:bg-[#121214] focus:bg-white dark:focus:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] focus:border-[#111111] dark:focus:border-white rounded-lg p-2.5 transition-colors focus:outline-none placeholder:text-[#A1A1AA] dark:placeholder:text-[#71717A] resize-none leading-relaxed"
          />
        </div>
      </div>
    </section>
  );
};
