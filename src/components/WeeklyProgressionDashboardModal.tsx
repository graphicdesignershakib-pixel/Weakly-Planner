import React, { useMemo } from 'react';
import {
  X,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { PlannerState } from '../types/planner';
import { useLanguage } from '../context/LanguageContext';

interface WeeklyProgressionDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PlannerState;
}

export const WeeklyProgressionDashboardModal: React.FC<WeeklyProgressionDashboardModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  const { isBn } = useLanguage();

  const metrics = useMemo(() => {
    const habits = state.habits || [];
    const days = state.days || [];

    const getHabitCompletedDays = (idSub: string) => {
      const h = habits.find((item) => item.id.includes(idSub) || item.name.toLowerCase().includes(idSub.toLowerCase()));
      if (!h) return 0;
      return h.completed.filter(Boolean).length;
    };

    const fajrDays = getHabitCompletedDays('fajr');
    const prayerDays = getHabitCompletedDays('prayer') || getHabitCompletedDays('৫ ওয়াক্ত');
    const chineseDays = getHabitCompletedDays('chinese');
    const englishDays = getHabitCompletedDays('english');
    const deepWorkDays = getHabitCompletedDays('deep');
    const readingDays = getHabitCompletedDays('reading') || getHabitCompletedDays('বই');
    const exerciseDays = getHabitCompletedDays('walk') || getHabitCompletedDays('হাঁটা');
    const sleepDays = getHabitCompletedDays('sleep') || getHabitCompletedDays('ঘুম');

    // Count Minimum Days
    const minDaysCount = days.filter((d) => d.isMinimumDay).length;

    // Progression Gate Calculation (5 core habits: Prayers, Chinese, English, Sleep, Deep Work)
    const coreHabitScores = [prayerDays, chineseDays, englishDays, sleepDays, deepWorkDays];
    const avgCoreDays = coreHabitScores.reduce((a, b) => a + b, 0) / coreHabitScores.length;
    const isGatePassed = avgCoreDays >= 5; // 5/7 days ≈ 70%

    return {
      fajrDays,
      prayerDays,
      chineseDays,
      englishDays,
      deepWorkDays,
      readingDays,
      exerciseDays,
      sleepDays,
      minDaysCount,
      avgCoreDays: Math.round(avgCoreDays * 10) / 10,
      isGatePassed,
    };
  }, [state]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-600 text-white rounded-xl shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-black">
                {isBn ? 'Weekly Dashboard & Progression Gate (Section ১২)' : 'Weekly Dashboard & Progression Gate'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'লক্ষ্য বনাম আসল — সংখ্যা ও তথ্যের নিরপেক্ষ নিরীক্ষা' : 'Target vs Actual Weekly Audit'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-4 text-xs">
          {/* Progression Gate Status Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            metrics.isGatePassed
              ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-800'
              : 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-black text-xs flex items-center gap-1.5">
                <Trophy className={`w-4 h-4 ${metrics.isGatePassed ? 'text-emerald-600' : 'text-indigo-600'}`} />
                <span>Progression Gate (Section ১০.৪)</span>
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 border">
                গড় স্কোর: {metrics.avgCoreDays}/৭ দিন
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {metrics.isGatePassed
                ? '🎉 অভিনন্দন! আপনার মূল অভ্যাসগুলো ৭০% বা ৫/৭ দিনের বেশি সম্পন্ন হয়েছে। আপনি আত্মবিশ্বাসের সাথে Phase ২ (কাঠামো)-তে যাওয়ার জন্য প্রস্তুত!'
                : 'মূল ৫টি অভ্যাস (নামাজ, Chinese, English, ঘুম, Deep Work) গড়ে ৫/৭ দিন অর্জিত হলে Phase ২ আনলক হবে। ধীরে ধীরে ধাপে ধাপে এগিয়ে চলুন!'}
            </p>
          </div>

          {/* Table: Target vs Actual (W1 Phase 1) */}
          <div className="border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-zinc-800/80 px-3 py-2 font-black text-[11px] flex justify-between">
              <span>মেট্রিক (Section ১২)</span>
              <span className="font-mono">W১ লক্ষ্য ➔ আসল</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-semibold text-[11px]">
              {[
                { label: 'Chinese practice দিন', target: '৭ দিন', actual: `${metrics.chineseDays} দিন` },
                { label: 'English practice দিন', target: '৭ দিন', actual: `${metrics.englishDays} দিন` },
                { label: '৫ ওয়াক্ত পূর্ণ দিন', target: '৭ দিন', actual: `${metrics.prayerDays} দিন` },
                { label: 'Fajr-এ ওঠা দিন', target: '৫ দিন', actual: `${metrics.fajrDays} দিন` },
                { label: 'Deep Work দিন', target: '৪ দিন', actual: `${metrics.deepWorkDays} দিন` },
                { label: 'বই পড়া / Reading দিন', target: '৫ দিন', actual: `${metrics.readingDays} দিন` },
                { label: 'হাঁটা / Exercise দিন', target: '৪ দিন', actual: `${metrics.exerciseDays} দিন` },
                { label: 'সময়মতো ঘুম (১১:০০ PM)', target: '৫ দিন', actual: `${metrics.sleepDays} দিন` },
                { label: 'Minimum Day ব্যবহার', target: '—', actual: `${metrics.minDaysCount} বার` },
              ].map((row, idx) => (
                <div key={idx} className="px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <span className="text-slate-700 dark:text-slate-300">{row.label}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400 text-[10px]">{row.target}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{row.actual}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
