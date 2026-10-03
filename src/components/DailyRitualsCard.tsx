import React, { useState, useEffect } from 'react';
import { Sun, Moon, Check, Sparkles, Plus, Trash2 } from 'lucide-react';
import { RitualItem } from '../types/extraFeatures';
import { playTaskCompleteSound } from '../utils/soundEffects';

const DEFAULT_MORNING_RITUALS: RitualItem[] = [
  { id: 'm1', title: '১ গ্লাস পানি পান ও ফ্রেশ হওয়া', icon: '💧', completed: false },
  { id: 'm2', title: '৫-১০ মিনিট হালকা স্ট্রেচিং বা হাঁটা', icon: '🧘', completed: false },
  { id: 'm3', title: 'আজকের প্রধান ৩টি জরুরি কাজ চিহ্নিত করা', icon: '🎯', completed: false },
  { id: 'm4', title: 'সকালের প্রথম ৩০ মিনিট নো সোশ্যাল মিডিয়া', icon: '📵', completed: false },
];

const DEFAULT_EVENING_RITUALS: RitualItem[] = [
  { id: 'e1', title: 'আজকের কাজগুলোর রিভিউ ও কৃতজ্ঞতা', icon: '🤲', completed: false },
  { id: 'e2', title: 'আগামীকালের ৩টি মূল কাজের পরিকল্পনা', icon: '📝', completed: false },
  { id: 'e3', title: 'ঘুমের ৩০ মিনিট আগে ফোন দূরে রাখা', icon: '🌙', completed: false },
  { id: 'e4', title: 'বই পড়া বা আরামদায়ক রিলাক্সেশন', icon: '📖', completed: false },
];

export const DailyRitualsCard: React.FC = () => {
  const todayKey = new Date().toISOString().split('T')[0];

  const [morning, setMorning] = useState<RitualItem[]>(() => {
    try {
      const saved = localStorage.getItem(`rituals_m_${todayKey}`);
      return saved ? JSON.parse(saved) : DEFAULT_MORNING_RITUALS;
    } catch {
      return DEFAULT_MORNING_RITUALS;
    }
  });

  const [evening, setEvening] = useState<RitualItem[]>(() => {
    try {
      const saved = localStorage.getItem(`rituals_e_${todayKey}`);
      return saved ? JSON.parse(saved) : DEFAULT_EVENING_RITUALS;
    } catch {
      return DEFAULT_EVENING_RITUALS;
    }
  });

  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');

  useEffect(() => {
    try {
      localStorage.setItem(`rituals_m_${todayKey}`, JSON.stringify(morning));
    } catch {
      // ignore
    }
  }, [morning, todayKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`rituals_e_${todayKey}`, JSON.stringify(evening));
    } catch {
      // ignore
    }
  }, [evening, todayKey]);

  const toggleRitual = (type: 'morning' | 'evening', id: string) => {
    if (type === 'morning') {
      setMorning((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const next = !item.completed;
            if (next) playTaskCompleteSound();
            return { ...item, completed: next };
          }
          return item;
        })
      );
    } else {
      setEvening((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const next = !item.completed;
            if (next) playTaskCompleteSound();
            return { ...item, completed: next };
          }
          return item;
        })
      );
    }
  };

  const currentList = activeTab === 'morning' ? morning : evening;
  const completedCount = currentList.filter((r) => r.completed).length;
  const progressPercent = Math.round((completedCount / (currentList.length || 1)) * 100);

  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 text-white rounded-xl shadow-xs">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              ডেইলি রিচুয়াল (সকাল ও রাতের রুটিন)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              সুশৃঙ্খল জীবনযাপনের দৈনন্দিন সুস্থ অভ্যাস
            </p>
          </div>
        </div>

        {/* Progress badge */}
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {completedCount}/{currentList.length} সম্পন্ন ({progressPercent}%)
        </span>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-3 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('morning')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
            activeTab === 'morning'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>সকালের রুটিন (Morning)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('evening')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
            activeTab === 'evening'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
          <span>রাতের রুটিন (Evening)</span>
        </button>
      </div>

      {/* Rituals list */}
      <div className="space-y-1.5">
        {currentList.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleRitual(activeTab, item.id)}
            className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
              item.completed
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 opacity-80'
                : 'bg-white dark:bg-slate-850 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <button
                type="button"
                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                  item.completed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
              </button>

              <span className="text-sm shrink-0">{item.icon}</span>

              <span
                className={`text-xs font-semibold select-none ${
                  item.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
