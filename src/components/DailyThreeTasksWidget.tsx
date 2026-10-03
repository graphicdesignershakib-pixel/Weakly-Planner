import React from 'react';
import { Target, CheckCircle2, Circle, Sparkles, HelpCircle } from 'lucide-react';
import { DayPlan } from '../types/planner';
import { useLanguage } from '../context/LanguageContext';
import { fireConfetti } from '../utils/confetti';
import { playCelebrationSound } from '../utils/soundEffects';

interface DailyThreeTasksWidgetProps {
  dayPlan: DayPlan;
  dayIndex: number;
  dayName: string;
  onUpdateThreeTasks: (
    dayIndex: number,
    threeTasks: {
      must: string;
      mustDone: boolean;
      should: string;
      shouldDone: boolean;
      could: string;
      couldDone: boolean;
    }
  ) => void;
}

export const DailyThreeTasksWidget: React.FC<DailyThreeTasksWidgetProps> = ({
  dayPlan,
  dayIndex,
  dayName,
  onUpdateThreeTasks,
}) => {
  const { isBn } = useLanguage();

  const current = dayPlan.threeTasks || {
    must: '',
    mustDone: false,
    should: '',
    shouldDone: false,
    could: '',
    couldDone: false,
  };

  const handleToggle = (key: 'mustDone' | 'shouldDone' | 'couldDone') => {
    const nextVal = !current[key];
    const updated = { ...current, [key]: nextVal };
    onUpdateThreeTasks(dayIndex, updated);

    if (nextVal) {
      playCelebrationSound();
      if (key === 'mustDone') {
        fireConfetti();
      }
    }
  };

  const handleChangeText = (key: 'must' | 'should' | 'could', text: string) => {
    onUpdateThreeTasks(dayIndex, { ...current, [key]: text });
  };

  const completedCount = [current.mustDone, current.shouldDone, current.couldDone].filter(Boolean).length;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-zinc-900/90 dark:to-indigo-950/20 rounded-2xl border border-indigo-200/70 dark:border-indigo-900/50 p-3 sm:p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-600 text-white rounded-xl shadow-xs">
            <Target className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{isBn ? `দৈনিক ৩-টাস্ক সিস্টেম (${dayName})` : `Daily 3-Task System (${dayName})`}</span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono px-1.5 py-0.2 rounded-full font-bold">
                {completedCount}/3
              </span>
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {isBn ? 'MUST · SHOULD · COULD — এর বাইরে আর কোনো কাজ নয়' : 'MUST · SHOULD · COULD only'}
            </p>
          </div>
        </div>

        {current.mustDone && (
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in zoom-in-95">
            <Sparkles className="w-3 h-3" />
            <span>{isBn ? 'MUST সফল!' : 'MUST Done!'}</span>
          </span>
        )}
      </div>

      <div className="space-y-2">
        {/* 1. MUST DO */}
        <div className={`p-2.5 rounded-xl border transition-all ${
          current.mustDone
            ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-800'
            : 'bg-white dark:bg-zinc-800/80 border-rose-200 dark:border-rose-900/50'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black tracking-wider uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-pulse"></span>
              <span>MUST DO (আজ শুধুই এটি করলে দিন সফল)</span>
            </span>
            <span className="text-[9px] text-slate-400 font-mono">৪৫–৯০ মি.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggle('mustDone')}
              className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
            >
              {current.mustDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>
            <input
              type="text"
              value={current.must}
              onChange={(e) => handleChangeText('must', e.target.value)}
              placeholder={isBn ? 'উদা: Adobe Stock ২টি আইকন সেট তৈরি / Portfolio কেস স্টাডি' : 'e.g. Adobe Stock 2 asset sets / Portfolio case study'}
              className={`flex-1 bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-600 ${
                current.mustDone ? 'line-through text-slate-400 dark:text-zinc-500' : ''
              }`}
            />
          </div>
        </div>

        {/* 2. SHOULD DO */}
        <div className={`p-2.5 rounded-xl border transition-all ${
          current.shouldDone
            ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-800'
            : 'bg-white dark:bg-zinc-800/80 border-amber-200 dark:border-amber-900/50'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black tracking-wider uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
              <span>SHOULD DO (MUST শেষ হলে — সহায়ক কাজ)</span>
            </span>
            <span className="text-[9px] text-slate-400 font-mono">৩০ মি.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggle('shouldDone')}
              className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
            >
              {current.shouldDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>
            <input
              type="text"
              value={current.should}
              onChange={(e) => handleChangeText('should', e.target.value)}
              placeholder={isBn ? 'উদা: Title-keyword লেখা বা Portfolio description তৈরি' : 'e.g. Title-keyword tagging / Portfolio description'}
              className={`flex-1 bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-600 ${
                current.shouldDone ? 'line-through text-slate-400 dark:text-zinc-500' : ''
              }`}
            />
          </div>
        </div>

        {/* 3. COULD DO */}
        <div className={`p-2.5 rounded-xl border transition-all ${
          current.couldDone
            ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-800'
            : 'bg-white dark:bg-zinc-800/80 border-sky-200 dark:border-sky-900/50'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black tracking-wider uppercase text-sky-600 dark:text-sky-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block"></span>
              <span>COULD DO (বোনাস — শক্তি থাকলে করবেন)</span>
            </span>
            <span className="text-[9px] text-slate-400 font-mono">১০–২০ মি.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggle('couldDone')}
              className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
            >
              {current.couldDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>
            <input
              type="text"
              value={current.could}
              onChange={(e) => handleChangeText('could', e.target.value)}
              placeholder={isBn ? 'উদা: পরবর্তী অ্যাসেটের আইডিয়া নোট বা ডেস্ক গোছানো' : 'e.g. Next asset idea list / Desk reset'}
              className={`flex-1 bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-600 ${
                current.couldDone ? 'line-through text-slate-400 dark:text-zinc-500' : ''
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
