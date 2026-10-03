import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  Sparkles,
  Droplets,
  Heart,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fireConfetti } from '../utils/confetti';

interface RestartProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMinimumDay: () => void;
}

export const RestartProtocolModal: React.FC<RestartProtocolModalProps> = ({
  isOpen,
  onClose,
  onApplyMinimumDay,
}) => {
  const { isBn } = useLanguage();
  const [breathingSec, setBreathingSec] = useState<number>(30);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (isBreathingActive && breathingSec > 0) {
      t = setInterval(() => setBreathingSec((p) => p - 1), 1000);
    } else if (breathingSec === 0) {
      setIsBreathingActive(false);
    }
    return () => clearInterval(t);
  }, [isBreathingActive, breathingSec]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-xl shadow-xs">
              <RotateCcw className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isBn ? '৩ ধাপের Restart Protocol (Section ১৪)' : '3-Step Restart Protocol'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'রুটিন ভেঙে গেলে দ্রুত ফিরে আসার বৈজ্ঞানিক সিস্টেম' : 'Bounce back immediately without guilt'}
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
        <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-3.5 text-xs">
          {/* Core Philosophy Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 text-xs">
            <p className="font-semibold leading-relaxed">
              💡 <span className="font-bold">“Discipline মানে কখনো না ভাঙা নয়।”</span> Discipline মানে ভাঙার পর কত দ্রুত ফিরে আসেন। ব্যর্থতা অপরাধ নয়, এটা শুধু একটা ডেটা বা তথ্য।
            </p>
          </div>

          {/* Step 1: Calm down (30s) */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                <span>ধাপ ১: থামুন, নিজেকে দোষ নয় (৩০ সেকেন্ড)</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">{breathingSec}s</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2">
              মনে মনে বলুন: <em>“ঠিক আছে, ভেঙে গেছে। এটা তথ্য, কোনো ব্যর্থতা নয়।”</em> গভীর শ্বাস নিন।
            </p>
            {!isBreathingActive ? (
              <button
                type="button"
                onClick={() => {
                  setBreathingSec(30);
                  setIsBreathingActive(true);
                }}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] cursor-pointer"
              >
                ৩০ সেকেন্ড শান্ত হোন
              </button>
            ) : (
              <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
                ধীরে ধীরে শ্বাস নিন ও ছাড়ুন...
              </div>
            )}
          </div>

          {/* Step 2: Next small action */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
            <span className="font-black text-sky-600 dark:text-sky-400 flex items-center gap-1.5 mb-1.5">
              <Droplets className="w-4 h-4" />
              <span>ধাপ ২: পরের ছোট কাজ (১০-১৫ মিনিট)</span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex-wrap">
              <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700">১ গ্লাস পানি পান</span>
              <span>➔</span>
              <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700">অজু করা</span>
              <span>➔</span>
              <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700">পরের সালাত</span>
              <span>➔</span>
              <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700">১০ মি. চাইনিজ/ইংলিশ</span>
            </div>
          </div>

          {/* Step 3: Minimum Day trigger */}
          <div className="p-3.5 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
            <span className="font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>ধাপ ৩: আজকের দিনটিকে Minimum Day ঘোষণা করুন</span>
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2.5">
              আজ আর কোনো অতিরিক্ত কাজের বোঝা চাপাবেন না। সব কাজ সরিয়ে কেবল ১টি MUST কাজ ও মৌলিক অভ্যাস রেখে দিন সুরক্ষিত রাখুন।
            </p>

            <button
              type="button"
              onClick={() => {
                onApplyMinimumDay();
                fireConfetti();
                onClose();
              }}
              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>🌿 আজকের দিনটিকে Minimum Day-তে রূপান্তর করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
