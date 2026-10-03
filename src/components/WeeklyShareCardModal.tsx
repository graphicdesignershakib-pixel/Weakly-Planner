import React, { useState, useRef } from 'react';
import { X, Sparkles, Share2, Download, Copy, Check, Award, Trophy, Star } from 'lucide-react';
import { PlannerState } from '../types/planner';

interface WeeklyShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PlannerState;
}

export const WeeklyShareCardModal: React.FC<WeeklyShareCardModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Calculate statistics
  let totalTasks = 0;
  let completedTasks = 0;
  let totalPrayersDone = 0;

  state.days.forEach((day) => {
    totalTasks += day.tasks.length;
    completedTasks += day.tasks.filter((t) => t.completed).length;
    if (day.prayers) {
      Object.values(day.prayers).forEach((done) => {
        if (done) totalPrayersDone++;
      });
    }
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const completedHabitsCount = (state.habits || []).length;
  const completedGoalsCount = (state.shortTermGoals || []).filter((g) => g.status === 'completed').length;

  const copyShareText = () => {
    const text = `🎯 আমার সাপ্তাহিক অর্জন রিপোর্ট (${state.weekStart}):\n` +
      `✅ সম্পন্ন টাস্ক: ${completedTasks}/${totalTasks} (${completionRate}%)\n` +
      `🔥 ট্র্যাক করা অভ্যাস: ${completedHabitsCount}টি\n` +
      `🏆 অর্জিত লক্ষ্য: ${completedGoalsCount}টি\n` +
      `✨ Weekly Life Planner অ্যাপ দিয়ে তৈরি!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-zinc-800 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <span className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 text-white rounded-xl shadow-xs">
            <Trophy className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-black">সাপ্তাহিক অর্জন কার্ড (Weekly Summary)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              আপনার সপ্তাহের অগ্রগতি ও সফলতার স্টোরি কার্ড
            </p>
          </div>
        </div>

        {/* The Visual Card Container */}
        <div
          ref={cardRef}
          className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white border border-indigo-700/50 shadow-xl relative overflow-hidden"
        >
          {/* Background Decorative Rings */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-300 block">
                WEEKLY ACHIEVEMENT
              </span>
              <h4 className="text-base font-black text-white">
                উইকলি লাইফ প্ল্যানার
              </h4>
            </div>
            <span className="text-xs font-mono font-bold bg-white/10 border border-white/20 px-2.5 py-1 rounded-full text-indigo-200">
              {state.weekStart}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-[11px] text-indigo-200 block">টাস্ক কমপ্লিশন</span>
              <span className="text-2xl font-mono font-black text-white">
                {completionRate}%
              </span>
              <span className="text-[10px] text-white/60 block mt-0.5">
                {completedTasks}/{totalTasks} কাজ সম্পন্ন
              </span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-[11px] text-indigo-200 block">ট্র্যাক করা অভ্যাস</span>
              <span className="text-2xl font-mono font-black text-white">
                {completedHabitsCount} টি
              </span>
              <span className="text-[10px] text-white/60 block mt-0.5">
                মাসিক হ্যাবিট ম্যাট্রিক্সে
              </span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-[11px] text-indigo-200 block">অর্জিত গোল</span>
              <span className="text-2xl font-mono font-black text-white">
                {completedGoalsCount} টি
              </span>
              <span className="text-[10px] text-white/60 block mt-0.5">
                সফল মাইলস্টোন
              </span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-[11px] text-indigo-200 block">নামাজ/রিচুয়াল</span>
              <span className="text-2xl font-mono font-black text-white">
                {totalPrayersDone} ওয়াক্ত
              </span>
              <span className="text-[10px] text-white/60 block mt-0.5">
                সারাসপ্তাহে রক্ষিত
              </span>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-white/10">
            <p className="text-[11px] text-indigo-200 italic">
              "ধাপে ধাপে ধারাবাহিক উন্নতিই আনে অবিস্মরণীয় সাফল্য।"
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-5">
          <button
            type="button"
            onClick={copyShareText}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'কপি হয়েছে!' : 'টেক্সট কপি করুন'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.print();
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>প্রিন্ট / PDF সেভ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
