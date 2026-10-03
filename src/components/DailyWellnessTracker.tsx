import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Moon,
  Sun,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Coffee,
  Apple,
  Salad,
  Bed,
} from 'lucide-react';
import { MealItem, DaySleep } from '../types/wellness';
import { useLanguage } from '../context/LanguageContext';

interface DailyWellnessTrackerProps {
  dateStr?: string;
}

const DEFAULT_SLEEP: DaySleep = {
  bedTime: '23:30',
  wakeTime: '07:00',
  totalHours: 7.5,
  quality: 'good',
  notes: '',
};

export const DailyWellnessTracker: React.FC<DailyWellnessTrackerProps> = ({
  dateStr = new Date().toISOString().split('T')[0],
}) => {
  const { isBn } = useLanguage();
  const storageKeyMeals = `meals_${dateStr}`;
  const storageKeySleep = `sleep_${dateStr}`;

  const [meals, setMeals] = useState<MealItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKeyMeals);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [sleep, setSleep] = useState<DaySleep>(() => {
    try {
      const saved = localStorage.getItem(storageKeySleep);
      return saved ? JSON.parse(saved) : DEFAULT_SLEEP;
    } catch {
      return DEFAULT_SLEEP;
    }
  });

  // Calculate hours slept whenever bedtime or waketime changes
  const calculateSleepDuration = (bed: string, wake: string): number => {
    const [bH, bM] = bed.split(':').map(Number);
    const [wH, wM] = wake.split(':').map(Number);
    if (isNaN(bH) || isNaN(wH)) return 7.5;

    let bMinutes = bH * 60 + (bM || 0);
    let wMinutes = wH * 60 + (wM || 0);

    // If wake time is less than bed time, it means woke up next morning
    if (wMinutes < bMinutes) {
      wMinutes += 24 * 60;
    }

    const diff = (wMinutes - bMinutes) / 60;
    return Math.round(diff * 10) / 10;
  };

  const [activeMealType, setActiveMealType] = useState<MealItem['type']>('breakfast');
  const [newMealTitle, setNewMealTitle] = useState('');
  const [showAddMeal, setShowAddMeal] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKeyMeals, JSON.stringify(meals));
    } catch {
      // ignore
    }
  }, [meals, storageKeyMeals]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKeySleep, JSON.stringify(sleep));
    } catch {
      // ignore
    }
  }, [sleep, storageKeySleep]);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealTitle.trim()) return;
    const item: MealItem = {
      id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: activeMealType,
      title: newMealTitle.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMeals((prev) => [...prev, item]);
    setNewMealTitle('');
    setShowAddMeal(false);
  };

  const handleDeleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSleepChange = (field: keyof DaySleep, val: string | number) => {
    setSleep((prev) => {
      const updated = { ...prev, [field]: val };
      if (field === 'bedTime' || field === 'wakeTime') {
        const bed = field === 'bedTime' ? String(val) : prev.bedTime;
        const wake = field === 'wakeTime' ? String(val) : prev.wakeTime;
        updated.totalHours = calculateSleepDuration(bed, wake);
      }
      return updated;
    });
  };

  const mealTypes = [
    { type: 'breakfast', label: isBn ? 'নাস্তা' : 'Breakfast', icon: '🍳' },
    { type: 'lunch', label: isBn ? 'দুপুরের খাবার' : 'Lunch', icon: '🍛' },
    { type: 'snack', label: isBn ? 'স্ন্যাক্স' : 'Snacks', icon: '🍎' },
    { type: 'dinner', label: isBn ? 'রাতের খাবার' : 'Dinner', icon: '🥗' },
  ] as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Meal & Nutrition Log */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-gradient-to-tr from-amber-500 to-emerald-600 text-white rounded-xl shadow-xs">
              <Utensils className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {isBn ? 'দৈনিক ডায়েট ও খাবার ট্র্যাকার' : 'Daily Meal & Nutrition Log'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'সকালের নাস্তা, লাঞ্চ ও ডিনারের সহজ ডায়রি' : 'Track your daily food & meals'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddMeal(!showAddMeal)}
            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer transition-colors shadow-xs"
            title={isBn ? 'খাবার যোগ করুন' : 'Add Meal'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add Meal Form */}
        {showAddMeal && (
          <form onSubmit={handleAddMeal} className="mb-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in duration-150 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {mealTypes.map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setActiveMealType(m.type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeMealType === m.type
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={newMealTitle}
                onChange={(e) => setNewMealTitle(e.target.value)}
                placeholder={isBn ? 'কী খেলেন? (যেমন: ওটস, ডিম, ফ্রুট সালাদ)...' : 'What did you eat?...'}
                className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                {isBn ? 'যোগ' : 'Add'}
              </button>
            </div>
          </form>
        )}

        {/* Meals list */}
        {meals.length === 0 ? (
          <div className="text-center py-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-medium">
              {isBn ? 'আজকে এখনও কোনো খাবারের তথ্য যুক্ত করা হয়নি 🥗' : 'No meals logged yet today 🥗'}
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {meals.map((m) => {
              const meta = mealTypes.find((t) => t.type === m.type) || mealTypes[0];
              return (
                <div
                  key={m.id}
                  className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{meta.icon}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {m.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {meta.label} • {m.time}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMeal(m.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer transition-colors"
                    title={isBn ? 'মুছুন' : 'Delete'}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Sleep & Rest Tracker */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-xl shadow-xs">
              <Bed className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {isBn ? 'স্লিপ ও ঘুমের ট্র্যাকার' : 'Sleep & Recovery Tracker'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'পর্যাপ্ত ঘুম আপনার এনার্জি ও ফোকাস ধরে রাখে' : 'Monitor sleep duration & recovery'}
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-black px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {sleep.totalHours} {isBn ? 'ঘণ্টা ঘুম' : 'hours'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Moon className="w-3 h-3 text-indigo-500" />
              <span>{isBn ? 'ঘুমের সময় (Bedtime)' : 'Bedtime'}</span>
            </label>
            <input
              type="time"
              value={sleep.bedTime}
              onChange={(e) => handleSleepChange('bedTime', e.target.value)}
              className="w-full text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-white cursor-pointer"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" />
              <span>{isBn ? 'ওঠার সময় (Wakeup)' : 'Wake up'}</span>
            </label>
            <input
              type="time"
              value={sleep.wakeTime}
              onChange={(e) => handleSleepChange('wakeTime', e.target.value)}
              className="w-full text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-white cursor-pointer"
            />
          </div>
        </div>

        {/* Sleep Quality Selector */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            {isBn ? 'ঘুমের অনুভূতি কেমন ছিল? (Sleep Quality)' : 'Sleep Quality'}
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'deep', label: isBn ? 'গভীর 😴' : 'Deep 😴' },
              { id: 'good', label: isBn ? 'ভালো 😊' : 'Good 😊' },
              { id: 'average', label: isBn ? 'মাঝারি 😐' : 'Fair 😐' },
              { id: 'poor', label: isBn ? 'খারাপ 🥱' : 'Poor 🥱' },
            ].map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => handleSleepChange('quality', q.id)}
                className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
                  sleep.quality === q.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
