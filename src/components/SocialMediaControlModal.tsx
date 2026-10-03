import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
  Bell,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { playReminderChime } from '../utils/soundEffects';

interface SocialMediaControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayIndex: number;
  initialMinutes: number;
  onSaveMinutes: (dayIndex: number, minutes: number) => void;
}

export const SocialMediaControlModal: React.FC<SocialMediaControlModalProps> = ({
  isOpen,
  onClose,
  dayIndex,
  initialMinutes,
  onSaveMinutes,
}) => {
  const { isBn } = useLanguage();

  // Screen time input
  const [loggedMinutes, setLoggedMinutes] = useState<number>(initialMinutes || 0);

  // 15-Minute Shorts/Reels Countdown Timer
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15 mins in sec
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    setLoggedMinutes(initialMinutes || 0);
  }, [initialMinutes, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            playReminderChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  if (!isOpen) return null;

  const minutesDisplay = Math.floor(timeLeft / 60);
  const secondsDisplay = timeLeft % 60;
  const timeFormatted = `${String(minutesDisplay).padStart(2, '0')}:${String(secondsDisplay).padStart(2, '0')}`;

  // Current Phase Budget (Phase 1 = 150 mins / 2.5 hrs)
  const phaseBudgetMinutes = 150;
  const isOverBudget = loggedMinutes > phaseBudgetMinutes;
  const percentUsed = Math.min(100, Math.round((loggedMinutes / phaseBudgetMinutes) * 100));

  const handleSave = () => {
    onSaveMinutes(dayIndex, loggedMinutes);
    onClose();
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(15 * 60);
    setIsFinished(false);
  };

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
            <span className="p-2 bg-gradient-to-tr from-pink-500 to-rose-500 text-white rounded-xl shadow-xs">
              <Smartphone className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-black">
                {isBn ? 'Social Media Control System (Section ৭)' : 'Social Media Control System'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'Facebook + YouTube ধাপে ধাপে কমানো, পুরোপুরি বন্ধ নয়' : 'Gradual reduction, not cold turkey'}
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

        <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-4">
          {/* Daily Budget Status Bar */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isBn ? 'আজকের ব্যবহার (Screen Time):' : "Today's Screen Time:"}
              </span>
              <span className={`text-xs font-mono font-black ${isOverBudget ? 'text-rose-600' : 'text-indigo-600 dark:text-indigo-400'}`}>
                {Math.floor(loggedMinutes / 60)}h {loggedMinutes % 60}m / {Math.floor(phaseBudgetMinutes / 60)}h {phaseBudgetMinutes % 60}m
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverBudget
                    ? 'bg-rose-500'
                    : percentUsed > 80
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="720"
                value={loggedMinutes || ''}
                onChange={(e) => setLoggedMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 px-3 py-1.5 text-xs font-mono font-bold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none"
                placeholder="মিনিট"
              />
              <span className="text-xs text-slate-500">মিনিট (Digital Wellbeing দেখে লিখুন)</span>
              <button
                type="button"
                onClick={handleSave}
                className="ml-auto px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                সংরক্ষণ
              </button>
            </div>
          </div>

          {/* 15-Minute Shorts / Reels Dedicated Countdown Timer */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-indigo-500/10 border border-pink-200 dark:border-pink-900/40 text-center">
            <span className="text-[10px] font-black tracking-wider uppercase text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5 mb-1">
              <Bell className="w-3.5 h-3.5" />
              <span>১৫ মিনিট Shorts / Reels টাইমার (Section ৭.২)</span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              শর্টস বা রিলস দেখার আগে টাইমার অন করুন — সময় শেষ হলে থেমে যান!
            </p>

            <div className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white my-2">
              {timeFormatted}
            </div>

            {isFinished && (
              <div className="p-2 mb-2 bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-xl animate-bounce">
                🛑 ১৫ মিনিট শেষ! ফোন বিছানা বা টেবিল থেকে দূরে রেখে অজু করুন।
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mt-2">
              {!isRunning ? (
                <button
                  type="button"
                  onClick={() => setIsRunning(true)}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>শুরু করুন</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRunning(false)}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>থামুন</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetTimer}
                className="p-1.5 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs cursor-pointer transition-all"
                title="রিসেট"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Rules reminder */}
          <div className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">সোনালী নিয়ম:</span>
            <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
              <li>ঘুমে ওঠার পর প্রথম ঘণ্টায় কোনো সোশ্যাল মিডিয়া নয় (৯:৩০ AM-এর আগে নয়)।</li>
              <li>Deep Work শেষ না হওয়া পর্যন্ত ফেসবুক ও ইউটিউব পুরোপুরি বন্ধ।</li>
              <li>ঘুমানোর ৩০ মিনিট আগে ফোন বিছানা থেকে দূরে চার্জে রাখুন।</li>
              <li>লিমিট ভাঙলে অপরাধবোধ নয় — বাকি সময় ফোন বন্ধ রেখে কাল স্বাভাবিক দিন শুরু।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
