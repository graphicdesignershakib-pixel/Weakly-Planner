import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, Plus, Trash2, Tag, TrendingDown, ArrowDownRight, Wallet } from 'lucide-react';
import { ExpenseItem } from '../types/extraFeatures';

const CATEGORY_MAP = {
  food: { label: 'খাবার', icon: '🍔', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
  transport: { label: 'যাতায়াত', icon: '🚗', color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200' },
  bills: { label: 'বিল/ইউটিলিটি', icon: '⚡', color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-200' },
  shopping: { label: 'শপিং', icon: '🛍️', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200' },
  education: { label: 'শিক্ষা/বই', icon: '📚', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200' },
  other: { label: 'অন্যান্য', icon: '💡', color: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200' },
};

export const DailyExpenseTracker: React.FC = () => {
  const todayKey = new Date().toISOString().split('T')[0];

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem('life_planner_expenses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('food');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('life_planner_expenses', JSON.stringify(expenses));
    } catch {
      // ignore
    }
  }, [expenses]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) return;

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      amount: numAmount,
      category,
      date: todayKey,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setTitle('');
    setAmount('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Today's expenses
  const todayExpenses = useMemo(() => {
    return expenses.filter((e) => e.date === todayKey);
  }, [expenses, todayKey]);

  const todayTotal = useMemo(() => {
    return todayExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [todayExpenses]);

  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-xl shadow-xs">
            <Wallet className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              দৈনিক পকেট খরচ ট্র্যাকার
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              দৈনন্দিন খরচের হিসাব রাখুন সহজে
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Today's Total Badge */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-medium block">আজকের মোট</span>
            <span className="text-xs sm:text-sm font-mono font-black text-rose-600 dark:text-rose-400">
              ৳ {todayTotal.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer transition-colors shadow-xs"
            title="খরচ যোগ করুন"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <form onSubmit={handleAddExpense} className="mb-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in duration-150 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="কী বাবদ খরচ? (যেমন: লাঞ্চ, রিকশা ভাড়া)"
              className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none"
            />
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 w-24">
              <span className="text-xs text-slate-400 mr-1">৳</span>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="পরিমাণ"
                className="w-full text-xs font-mono font-bold bg-transparent text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseItem['category'])}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {Object.entries(CATEGORY_MAP).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.icon} {info.label}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                যোগ করুন
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Expense items list for today */}
      {todayExpenses.length === 0 ? (
        <div className="text-center py-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 font-medium">
            আজকে এখনও কোনো খরচ যুক্ত করা হয়নি 🌿
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {todayExpenses.map((item) => {
            const catInfo = CATEGORY_MAP[item.category] || CATEGORY_MAP.other;
            return (
              <div
                key={item.id}
                className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between gap-2 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs p-1 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                    {catInfo.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.time} • {catInfo.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                    -৳{item.amount.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer transition-colors"
                    title="মুছুন"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
