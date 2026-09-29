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
      className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all luxury-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60 mb-5">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-gradient-to-tr from-teal-500 to-emerald-500 text-white rounded-xl shadow-md shadow-teal-500/20">
            <BookOpen className="w-4 h-4" />
          </span>
          <div>
            <h2 id="weekly-review-heading" className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Weekly Review & Reflection
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              End-of-week reflection to sharpen focus and compound lessons
            </p>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline font-mono">
          Auto-saves locally
        </span>
      </div>

      {/* 5 Reflection Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Field 1: What went well? */}
        <div className="space-y-2">
          <label
            htmlFor="review-went-well"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white"
          >
            <span className="text-emerald-500">✓</span> What went well?
          </label>
          <textarea
            id="review-went-well"
            rows={3}
            value={review.wentWell}
            onChange={(e) => onChangeReviewField('wentWell', e.target.value)}
            placeholder="Key wins, maintained habits, moments of flow..."
            className="w-full text-xs text-slate-900 dark:text-white bg-slate-50/70 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white rounded-xl p-3 transition-all focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none leading-relaxed shadow-2xs focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
          />
        </div>

        {/* Field 2: What was difficult? */}
        <div className="space-y-2">
          <label
            htmlFor="review-challenges"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white"
          >
            <span className="text-amber-500">⚡</span> What was difficult or distracting?
          </label>
          <textarea
            id="review-challenges"
            rows={3}
            value={review.challenges}
            onChange={(e) => onChangeReviewField('challenges', e.target.value)}
            placeholder="Friction points, unexpected fires, fatigue..."
            className="w-full text-xs text-slate-900 dark:text-white bg-slate-50/70 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white rounded-xl p-3 transition-all focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none leading-relaxed shadow-2xs focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
          />
        </div>

        {/* Field 3: Biggest achievement */}
        <div className="space-y-2">
          <label
            htmlFor="review-achievement"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white"
          >
            <span className="text-indigo-500">🎯</span> Biggest achievement this week
          </label>
          <textarea
            id="review-achievement"
            rows={3}
            value={review.achievement}
            onChange={(e) => onChangeReviewField('achievement', e.target.value)}
            placeholder="The single milestone you are proud of..."
            className="w-full text-xs text-slate-900 dark:text-white bg-slate-50/70 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white rounded-xl p-3 transition-all focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none leading-relaxed shadow-2xs focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
          />
        </div>

        {/* Field 4: Key lesson */}
        <div className="space-y-2">
          <label
            htmlFor="review-lesson"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white"
          >
            <span className="text-purple-500">💡</span> One lesson learned or rule to remember
          </label>
          <textarea
            id="review-lesson"
            rows={3}
            value={review.lesson}
            onChange={(e) => onChangeReviewField('lesson', e.target.value)}
            placeholder="Insight on energy, sleep, planning, or mindset..."
            className="w-full text-xs text-slate-900 dark:text-white bg-slate-50/70 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white rounded-xl p-3 transition-all focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none leading-relaxed shadow-2xs focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
          />
        </div>

        {/* Field 5: Priority for next week (spans full width) */}
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="review-next-week"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white"
          >
            <span className="text-rose-500">🔥</span> Top Priority for Next Week
          </label>
          <textarea
            id="review-next-week"
            rows={2}
            value={review.nextWeekPriority}
            onChange={(e) => onChangeReviewField('nextWeekPriority', e.target.value)}
            placeholder="The #1 non-negotiable target to execute when Monday begins..."
            className="w-full text-xs text-slate-900 dark:text-white bg-slate-50/70 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white rounded-xl p-3 transition-all focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none leading-relaxed shadow-2xs focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 font-medium"
          />
        </div>
      </div>
    </section>
  );
};
