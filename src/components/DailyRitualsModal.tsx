import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  X,
  Heart,
  Target,
  Smile,
  Flame,
} from 'lucide-react';
import { DailyRitual } from '../types/planner';
import { fireConfetti } from '../utils/confetti';
import { playTaskCompleteSound } from '../utils/soundEffects';

interface DailyRitualsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  onAddTodayTask?: (taskTitle: string) => void;
}

export const DailyRitualsModal: React.FC<DailyRitualsModalProps> = ({
  isOpen,
  onClose,
  userName = 'Shakib',
  onAddTodayTask,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const storageKey = `daily_ritual_${todayStr}`;

  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  const [morningWins, setMorningWins] = useState<string[]>(['', '', '']);
  const [affirmation, setAffirmation] = useState<string>('I operate with clarity, focus, and relentless momentum.');
  const [eveningGratitude, setEveningGratitude] = useState<string[]>(['', '', '']);
  const [eveningHighlight, setEveningHighlight] = useState<string>('');
  const [morningDone, setMorningDone] = useState<boolean>(false);
  const [eveningDone, setEveningDone] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Load from local storage
  useEffect(() => {
    if (!isOpen) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data: DailyRitual = JSON.parse(saved);
        setMorningWins(data.morningWins.length === 3 ? data.morningWins : ['', '', '']);
        if (data.morningAffirmation) setAffirmation(data.morningAffirmation);
        setEveningGratitude(data.eveningGratitude.length === 3 ? data.eveningGratitude : ['', '', '']);
        if (data.eveningHighlight) setEveningHighlight(data.eveningHighlight);
        setMorningDone(data.completedMorning);
        setEveningDone(data.completedEvening);
      }
    } catch {
      // ignore
    }

    // Auto set tab based on time of day (morning before 4 PM, evening afterwards)
    const hour = new Date().getHours();
    setActiveTab(hour < 16 ? 'morning' : 'evening');
  }, [isOpen, storageKey]);

  if (!isOpen) return null;

  const handleSaveRitual = (completedWhich: 'morning' | 'evening') => {
    const isMorn = completedWhich === 'morning';
    const isEve = completedWhich === 'evening';

    const newMornDone = isMorn ? true : morningDone;
    const newEveDone = isEve ? true : eveningDone;

    const ritualData: DailyRitual = {
      dateStr: todayStr,
      morningWins: morningWins.map((w) => w.trim()),
      morningAffirmation: affirmation.trim(),
      eveningGratitude: eveningGratitude.map((g) => g.trim()),
      eveningHighlight: eveningHighlight.trim(),
      completedMorning: newMornDone,
      completedEvening: newEveDone,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(ritualData));
    } catch {
      // ignore
    }

    if (isMorn) {
      setMorningDone(true);
      // Optionally auto-add non-negotiable wins to Today's planner tasks!
      if (onAddTodayTask) {
        morningWins.forEach((win) => {
          if (win.trim()) onAddTodayTask(`🔥 ${win.trim()}`);
        });
      }
    } else {
      setEveningDone(true);
    }

    playTaskCompleteSound();
    fireConfetti();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-transparent to-indigo-500/10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#111111] dark:text-white flex items-center gap-2">
                Daily Ritual & Mindset Center
              </h2>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                Intention in the morning · Gratitude in the evening
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#E5E7EB] dark:border-[#27272A] px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('morning')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'morning'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-[#71717A] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Morning Clarity</span>
            {morningDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('evening')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'evening'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-[#71717A] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Evening Reflection</span>
            {eveningDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {activeTab === 'morning' ? (
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 rounded-xl p-3.5">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block mb-1">
                  ☀️ Morning Intention for {userName}
                </span>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                  "Win the morning, win the day." Define your 3 absolute top victories before the world distracts you.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111111] dark:text-white flex items-center gap-1.5 mb-2">
                  <Target className="w-4 h-4 text-amber-500" />
                  Top 3 Non-Negotiable Wins for Today:
                </label>
                <div className="space-y-2">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        0{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={morningWins[idx] || ''}
                        onChange={(e) => {
                          const updated = [...morningWins];
                          updated[idx] = e.target.value;
                          setMorningWins(updated);
                        }}
                        placeholder={`Non-negotiable victory #${idx + 1}...`}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] text-[#111111] dark:text-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[#A1A1AA] dark:text-[#71717A] mt-1.5 italic">
                  Tip: Saving will automatically add these high-priority wins into Today’s planner list!
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111111] dark:text-white flex items-center gap-1.5 mb-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Morning Affirmation / Core Focus:
                </label>
                <input
                  type="text"
                  value={affirmation}
                  onChange={(e) => setAffirmation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] text-[#111111] dark:text-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/40 rounded-xl p-3.5">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block mb-1">
                  🌙 Evening Decompression & Gratitude
                </span>
                <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
                  Clear your mind before sleep. Gratitude rewires the brain for fulfillment and lowers evening anxiety.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111111] dark:text-white flex items-center gap-1.5 mb-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  3 Things I Am Genuinely Grateful For Today:
                </label>
                <div className="space-y-2">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={eveningGratitude[idx] || ''}
                        onChange={(e) => {
                          const updated = [...eveningGratitude];
                          updated[idx] = e.target.value;
                          setEveningGratitude(updated);
                        }}
                        placeholder={`Grateful for...`}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] text-[#111111] dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111111] dark:text-white flex items-center gap-1.5 mb-1.5">
                  <Smile className="w-4 h-4 text-indigo-400" />
                  Highlight of Today (Best Moment):
                </label>
                <textarea
                  rows={2}
                  value={eveningHighlight}
                  onChange={(e) => setEveningHighlight(e.target.value)}
                  placeholder="What made you smile or feel proud today?"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] text-[#111111] dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#141416] flex items-center justify-between">
          <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
            {savedSuccess ? '✨ Ritual sealed & celebration unlocked!' : 'Takes less than 60 seconds'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#71717A] hover:text-[#111111] dark:hover:text-white font-medium cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => handleSaveRitual(activeTab)}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#111111] dark:bg-white dark:text-[#111111] rounded-xl hover:opacity-90 shadow-sm cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete {activeTab === 'morning' ? 'Morning Clarity' : 'Evening Review'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
