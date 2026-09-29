import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Flame,
  Check,
  Plus,
  Trash2,
  Edit3,
  FileSpreadsheet,
  Languages,
  Trophy,
  Calendar,
  TrendingUp,
  CheckCheck,
  Target,
  Filter,
  Printer,
  Palette,
  Share2,
  Download,
  Upload,
  Bell,
  MessageSquare,
  X,
  Copy,
  Sparkles,
  Award,
} from 'lucide-react';
import { playTaskCompleteSound } from '../utils/soundEffects';
import { fireConfetti } from '../utils/confetti';

export interface MonthlyHabitItem {
  id: string;
  nameEn: string;
  nameBn: string;
  category: 'study' | 'health' | 'pray' | 'work' | 'personal';
  targetDays?: number; // Custom target goal (e.g. 25 days/month)
  completed: boolean[]; // Array of boolean for 31 days (index 0 to 30)
}

export type AestheticPaletteId = 'pastel' | 'sage' | 'latte' | 'midnight' | 'ocean';

interface PaletteConfig {
  id: AestheticPaletteId;
  nameBn: string;
  nameEn: string;
  weeks: {
    weekNum: number;
    label: string;
    startDay: number;
    endDay: number;
    headerBg: string;
    headerText: string;
    barColor: string;
    ringColor: string;
    checkboxChecked: string;
    checkboxUnchecked: string;
  }[];
}

const PALETTES: Record<AestheticPaletteId, PaletteConfig> = {
  pastel: {
    id: 'pastel',
    nameBn: '🌸 প্যাস্টেল ব্লুম (Pastel Bloom)',
    nameEn: '🌸 Pastel Bloom',
    weeks: [
      { weekNum: 1, label: 'week 1', startDay: 1, endDay: 7, headerBg: 'bg-[#93C5FD]', headerText: 'text-[#1E3A8A]', barColor: '#93C5FD', ringColor: '#60A5FA', checkboxChecked: 'bg-[#3B82F6] border-[#3B82F6] text-white', checkboxUnchecked: 'border-[#93C5FD]/90 hover:border-[#3B82F6] bg-white dark:bg-slate-900' },
      { weekNum: 2, label: 'week 2', startDay: 8, endDay: 14, headerBg: 'bg-[#F472B6]', headerText: 'text-[#831843]', barColor: '#F472B6', ringColor: '#EC4899', checkboxChecked: 'bg-[#EC4899] border-[#EC4899] text-white', checkboxUnchecked: 'border-[#F472B6]/90 hover:border-[#EC4899] bg-white dark:bg-slate-900' },
      { weekNum: 3, label: 'week 3', startDay: 15, endDay: 21, headerBg: 'bg-[#5EEAD4]', headerText: 'text-[#134E4A]', barColor: '#5EEAD4', ringColor: '#14B8A6', checkboxChecked: 'bg-[#14B8A6] border-[#14B8A6] text-white', checkboxUnchecked: 'border-[#5EEAD4]/90 hover:border-[#14B8A6] bg-white dark:bg-slate-900' },
      { weekNum: 4, label: 'week 4', startDay: 22, endDay: 28, headerBg: 'bg-[#FCD34D]', headerText: 'text-[#78350F]', barColor: '#FCD34D', ringColor: '#F59E0B', checkboxChecked: 'bg-[#F59E0B] border-[#F59E0B] text-white', checkboxUnchecked: 'border-[#FCD34D]/90 hover:border-[#F59E0B] bg-white dark:bg-slate-900' },
      { weekNum: 5, label: 'week 5', startDay: 29, endDay: 31, headerBg: 'bg-[#C4B5FD]', headerText: 'text-[#4C1D95]', barColor: '#C4B5FD', ringColor: '#8B5CF6', checkboxChecked: 'bg-[#8B5CF6] border-[#8B5CF6] text-white', checkboxUnchecked: 'border-[#C4B5FD]/90 hover:border-[#8B5CF6] bg-white dark:bg-slate-900' },
    ],
  },
  sage: {
    id: 'sage',
    nameBn: '🌿 মাচ্চা ও সেজ (Matcha & Sage)',
    nameEn: '🌿 Matcha & Sage',
    weeks: [
      { weekNum: 1, label: 'week 1', startDay: 1, endDay: 7, headerBg: 'bg-[#A7F3D0]', headerText: 'text-[#064E3B]', barColor: '#A7F3D0', ringColor: '#10B981', checkboxChecked: 'bg-[#059669] border-[#059669] text-white', checkboxUnchecked: 'border-[#A7F3D0] hover:border-[#059669] bg-white dark:bg-slate-900' },
      { weekNum: 2, label: 'week 2', startDay: 8, endDay: 14, headerBg: 'bg-[#BBF7D0]', headerText: 'text-[#14532D]', barColor: '#BBF7D0', ringColor: '#22C55E', checkboxChecked: 'bg-[#16A34A] border-[#16A34A] text-white', checkboxUnchecked: 'border-[#BBF7D0] hover:border-[#16A34A] bg-white dark:bg-slate-900' },
      { weekNum: 3, label: 'week 3', startDay: 15, endDay: 21, headerBg: 'bg-[#86EFAC]', headerText: 'text-[#166534]', barColor: '#86EFAC', ringColor: '#4ADE80', checkboxChecked: 'bg-[#22C55E] border-[#22C55E] text-white', checkboxUnchecked: 'border-[#86EFAC] hover:border-[#22C55E] bg-white dark:bg-slate-900' },
      { weekNum: 4, label: 'week 4', startDay: 22, endDay: 28, headerBg: 'bg-[#6EE7B7]', headerText: 'text-[#065F46]', barColor: '#6EE7B7', ringColor: '#34D399', checkboxChecked: 'bg-[#10B981] border-[#10B981] text-white', checkboxUnchecked: 'border-[#6EE7B7] hover:border-[#10B981] bg-white dark:bg-slate-900' },
      { weekNum: 5, label: 'week 5', startDay: 29, endDay: 31, headerBg: 'bg-[#99F6E4]', headerText: 'text-[#115E59]', barColor: '#99F6E4', ringColor: '#2DD4BF', checkboxChecked: 'bg-[#14B8A6] border-[#14B8A6] text-white', checkboxUnchecked: 'border-[#99F6E4] hover:border-[#14B8A6] bg-white dark:bg-slate-900' },
    ],
  },
  latte: {
    id: 'latte',
    nameBn: '☕ ওয়ার্ম লাতে (Warm Latte)',
    nameEn: '☕ Warm Latte',
    weeks: [
      { weekNum: 1, label: 'week 1', startDay: 1, endDay: 7, headerBg: 'bg-[#FED7AA]', headerText: 'text-[#7C2D12]', barColor: '#FED7AA', ringColor: '#F97316', checkboxChecked: 'bg-[#EA580C] border-[#EA580C] text-white', checkboxUnchecked: 'border-[#FED7AA] hover:border-[#EA580C] bg-white dark:bg-slate-900' },
      { weekNum: 2, label: 'week 2', startDay: 8, endDay: 14, headerBg: 'bg-[#FDE68A]', headerText: 'text-[#713F12]', barColor: '#FDE68A', ringColor: '#EAB308', checkboxChecked: 'bg-[#CA8A04] border-[#CA8A04] text-white', checkboxUnchecked: 'border-[#FDE68A] hover:border-[#CA8A04] bg-white dark:bg-slate-900' },
      { weekNum: 3, label: 'week 3', startDay: 15, endDay: 21, headerBg: 'bg-[#E2E8F0]', headerText: 'text-[#334155]', barColor: '#E2E8F0', ringColor: '#94A3B8', checkboxChecked: 'bg-[#475569] border-[#475569] text-white', checkboxUnchecked: 'border-[#E2E8F0] hover:border-[#475569] bg-white dark:bg-slate-900' },
      { weekNum: 4, label: 'week 4', startDay: 22, endDay: 28, headerBg: 'bg-[#FECDD3]', headerText: 'text-[#881337]', barColor: '#FECDD3', ringColor: '#FB7185', checkboxChecked: 'bg-[#E11D48] border-[#E11D48] text-white', checkboxUnchecked: 'border-[#FECDD3] hover:border-[#E11D48] bg-white dark:bg-slate-900' },
      { weekNum: 5, label: 'week 5', startDay: 29, endDay: 31, headerBg: 'bg-[#DDD6FE]', headerText: 'text-[#4C1D95]', barColor: '#DDD6FE', ringColor: '#A78BFA', checkboxChecked: 'bg-[#7C3AED] border-[#7C3AED] text-white', checkboxUnchecked: 'border-[#DDD6FE] hover:border-[#7C3AED] bg-white dark:bg-slate-900' },
    ],
  },
  midnight: {
    id: 'midnight',
    nameBn: '🌌 মিডনাইট নিয়ন (Midnight Neon)',
    nameEn: '🌌 Midnight Neon',
    weeks: [
      { weekNum: 1, label: 'week 1', startDay: 1, endDay: 7, headerBg: 'bg-[#38BDF8]', headerText: 'text-[#0C4A6E]', barColor: '#38BDF8', ringColor: '#0284C7', checkboxChecked: 'bg-[#0284C7] border-[#0284C7] text-white', checkboxUnchecked: 'border-[#38BDF8] hover:border-[#0284C7] bg-white dark:bg-slate-900' },
      { weekNum: 2, label: 'week 2', startDay: 8, endDay: 14, headerBg: 'bg-[#F43F5E]', headerText: 'text-white', barColor: '#F43F5E', ringColor: '#E11D48', checkboxChecked: 'bg-[#BE123C] border-[#BE123C] text-white', checkboxUnchecked: 'border-[#F43F5E] hover:border-[#BE123C] bg-white dark:bg-slate-900' },
      { weekNum: 3, label: 'week 3', startDay: 15, endDay: 21, headerBg: 'bg-[#A855F7]', headerText: 'text-white', barColor: '#A855F7', ringColor: '#9333EA', checkboxChecked: 'bg-[#7E22CE] border-[#7E22CE] text-white', checkboxUnchecked: 'border-[#A855F7] hover:border-[#7E22CE] bg-white dark:bg-slate-900' },
      { weekNum: 4, label: 'week 4', startDay: 22, endDay: 28, headerBg: 'bg-[#10B981]', headerText: 'text-[#064E3B]', barColor: '#10B981', ringColor: '#059669', checkboxChecked: 'bg-[#047857] border-[#047857] text-white', checkboxUnchecked: 'border-[#10B981] hover:border-[#047857] bg-white dark:bg-slate-900' },
      { weekNum: 5, label: 'week 5', startDay: 29, endDay: 31, headerBg: 'bg-[#F59E0B]', headerText: 'text-[#78350F]', barColor: '#F59E0B', ringColor: '#D97706', checkboxChecked: 'bg-[#B45309] border-[#B45309] text-white', checkboxUnchecked: 'border-[#F59E0B] hover:border-[#B45309] bg-white dark:bg-slate-900' },
    ],
  },
  ocean: {
    id: 'ocean',
    nameBn: '🌊 ওশান ব্রিজ (Ocean Breeze)',
    nameEn: '🌊 Ocean Breeze',
    weeks: [
      { weekNum: 1, label: 'week 1', startDay: 1, endDay: 7, headerBg: 'bg-[#7DD3FC]', headerText: 'text-[#0369A1]', barColor: '#7DD3FC', ringColor: '#0EA5E9', checkboxChecked: 'bg-[#0284C7] border-[#0284C7] text-white', checkboxUnchecked: 'border-[#7DD3FC] hover:border-[#0284C7] bg-white dark:bg-slate-900' },
      { weekNum: 2, label: 'week 2', startDay: 8, endDay: 14, headerBg: 'bg-[#A5F3FC]', headerText: 'text-[#155E75]', barColor: '#A5F3FC', ringColor: '#06B6D4', checkboxChecked: 'bg-[#0891B2] border-[#0891B2] text-white', checkboxUnchecked: 'border-[#A5F3FC] hover:border-[#0891B2] bg-white dark:bg-slate-900' },
      { weekNum: 3, label: 'week 3', startDay: 15, endDay: 21, headerBg: 'bg-[#67E8F9]', headerText: 'text-[#164E63]', barColor: '#67E8F9', ringColor: '#0891B2', checkboxChecked: 'bg-[#0E7490] border-[#0E7490] text-white', checkboxUnchecked: 'border-[#67E8F9] hover:border-[#0E7490] bg-white dark:bg-slate-900' },
      { weekNum: 4, label: 'week 4', startDay: 22, endDay: 28, headerBg: 'bg-[#99F6E4]', headerText: 'text-[#115E59]', barColor: '#99F6E4', ringColor: '#14B8A6', checkboxChecked: 'bg-[#0D9488] border-[#0D9488] text-white', checkboxUnchecked: 'border-[#99F6E4] hover:border-[#0D9488] bg-white dark:bg-slate-900' },
      { weekNum: 5, label: 'week 5', startDay: 29, endDay: 31, headerBg: 'bg-[#BAE6FD]', headerText: 'text-[#075985]', barColor: '#BAE6FD', ringColor: '#38BDF8', checkboxChecked: 'bg-[#0369A1] border-[#0369A1] text-white', checkboxUnchecked: 'border-[#BAE6FD] hover:border-[#0369A1] bg-white dark:bg-slate-900' },
    ],
  },
};

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const INITIAL_HABITS: MonthlyHabitItem[] = [];

export const MonthlyAestheticHabitTracker: React.FC = () => {
  const currentDate = useMemo(() => new Date(), []);
  const [selectedMonth, setSelectedMonth] = useState<number>(() => currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(() => currentDate.getFullYear());
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [selectedCategory, setSelectedCategory] = useState<'all' | MonthlyHabitItem['category']>('all');
  const [selectedPaletteId, setSelectedPaletteId] = useState<AestheticPaletteId>(() => {
    try {
      const saved = localStorage.getItem('monthly_aesthetic_palette_id') as AestheticPaletteId;
      if (saved && PALETTES[saved]) return saved;
    } catch {
      // ignore
    }
    return 'pastel';
  });

  const [habits, setHabits] = useState<MonthlyHabitItem[]>(() => {
    try {
      const hasCleaned = localStorage.getItem('monthly_habits_user_clean_slate_v3');
      if (!hasCleaned) {
        localStorage.setItem('monthly_habits_user_clean_slate_v3', 'true');
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('monthly_aesthetic_habits_') || k.startsWith('monthly_day_notes_'))) {
            localStorage.removeItem(k);
          }
        }
        return [];
      }
      const saved = localStorage.getItem(`monthly_aesthetic_habits_v2_${selectedYear}_${selectedMonth}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Daily Micro-Notes state (e.g. { 14: "Finished Chapter 4" })
  const [dayNotes, setDayNotes] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(`monthly_day_notes_${selectedYear}_${selectedMonth}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const [activeNoteDay, setActiveNoteDay] = useState<number | null>(null);
  const [noteInputText, setNoteInputText] = useState('');
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [reportCopied, setReportCopied] = useState(false);
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newHabitName, setNewHabitName] = useState('');
  const [newCategory, setNewCategory] = useState<MonthlyHabitItem['category']>('study');
  const [newTargetDays, setNewTargetDays] = useState<number>(30);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [affirmation, setAffirmation] = useState(
    'I am... focused, intentional, and ready for the month ahead.'
  );
  const [isEditingAffirmation, setIsEditingAffirmation] = useState(false);

  // Active palette configuration
  const activePalette = useMemo(() => PALETTES[selectedPaletteId] || PALETTES.pastel, [selectedPaletteId]);

  // Real-time Today Detection
  const isCurrentMonthAndYear =
    currentDate.getMonth() === selectedMonth && currentDate.getFullYear() === selectedYear;
  const todayDayNum = isCurrentMonthAndYear ? currentDate.getDate() : -1;

  // Days in selected month
  const totalDaysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  // Load from storage whenever month/year changes
  useEffect(() => {
    const key = `monthly_aesthetic_habits_v2_${selectedYear}_${selectedMonth}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setHabits(JSON.parse(saved));
      } else {
        setHabits([]);
      }
    } catch {
      setHabits([]);
    }

    const notesKey = `monthly_day_notes_${selectedYear}_${selectedMonth}`;
    try {
      const savedNotes = localStorage.getItem(notesKey);
      if (savedNotes) {
        setDayNotes(JSON.parse(savedNotes));
      } else {
        setDayNotes({});
      }
    } catch {
      setDayNotes({});
    }
  }, [selectedMonth, selectedYear]);

  // Save to storage
  useEffect(() => {
    const key = `monthly_aesthetic_habits_v2_${selectedYear}_${selectedMonth}`;
    try {
      localStorage.setItem(key, JSON.stringify(habits));
    } catch {
      // ignore
    }
  }, [habits, selectedMonth, selectedYear]);

  useEffect(() => {
    const notesKey = `monthly_day_notes_${selectedYear}_${selectedMonth}`;
    try {
      localStorage.setItem(notesKey, JSON.stringify(dayNotes));
    } catch {
      // ignore
    }
  }, [dayNotes, selectedMonth, selectedYear]);

  useEffect(() => {
    try {
      localStorage.setItem('monthly_aesthetic_palette_id', selectedPaletteId);
    } catch {
      // ignore
    }
  }, [selectedPaletteId]);

  // Jump to Current Real-World Month
  const handleJumpToCurrentMonth = () => {
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
  };

  // Day letter mapping (M, T, W, T, F, S, S)
  const getDayLetter = (dayNum: number) => {
    const d = new Date(selectedYear, selectedMonth, dayNum);
    const day = d.getDay(); // 0=Sun, 1=Mon...
    const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return letters[day];
  };

  // Toggle single habit checkbox
  const handleToggleDay = (habitId: string, dayIdx: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const newCompleted = [...h.completed];
        const willBeChecked = !newCompleted[dayIdx];
        newCompleted[dayIdx] = willBeChecked;
        if (willBeChecked) {
          playTaskCompleteSound();
        }
        return { ...h, completed: newCompleted };
      })
    );
  };

  // Mark all habits for TODAY with one click
  const handleToggleAllToday = () => {
    if (todayDayNum === -1) return;
    const dayIdx = todayDayNum - 1;
    const allCheckedToday = habits.every((h) => h.completed[dayIdx]);
    const targetState = !allCheckedToday;

    setHabits((prev) =>
      prev.map((h) => {
        const copy = [...h.completed];
        copy[dayIdx] = targetState;
        return { ...h, completed: copy };
      })
    );

    if (targetState) {
      playTaskCompleteSound();
      fireConfetti();
    }
  };

  // Filtered habits by selected category
  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'all') return habits;
    return habits.filter((h) => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  // Calculate day completion count & percentage across all habits
  const dayStats = useMemo(() => {
    const stats: { count: number; pct: number }[] = [];
    const totalHabits = habits.length;

    for (let d = 0; d < totalDaysInMonth; d++) {
      if (totalHabits === 0) {
        stats.push({ count: 0, pct: 0 });
        continue;
      }
      const completedCount = habits.filter((h) => h.completed[d]).length;
      const pct = Math.round((completedCount / totalHabits) * 100);
      stats.push({ count: completedCount, pct });
    }
    return stats;
  }, [habits, totalDaysInMonth]);

  // Overall Month Progress
  const overallProgress = useMemo(() => {
    if (habits.length === 0 || totalDaysInMonth === 0) return { pct: 0, completed: 0, total: 0 };
    let completed = 0;
    const total = habits.length * totalDaysInMonth;

    habits.forEach((h) => {
      for (let d = 0; d < totalDaysInMonth; d++) {
        if (h.completed[d]) completed++;
      }
    });

    const pct = ((completed / total) * 100).toFixed(2);
    return { pct: Number(pct), completed, total };
  }, [habits, totalDaysInMonth]);

  // Weekly Stats calculation for 5 weeks
  const weeklyStats = useMemo(() => {
    return activePalette.weeks.map((cfg) => {
      const endDay = Math.min(cfg.endDay, totalDaysInMonth);
      const daysCount = Math.max(0, endDay - cfg.startDay + 1);
      if (daysCount === 0 || habits.length === 0) {
        return { ...cfg, pct: 0, completed: 0, total: 0, daysCount };
      }

      let completed = 0;
      const total = habits.length * daysCount;

      habits.forEach((h) => {
        for (let d = cfg.startDay - 1; d < endDay; d++) {
          if (h.completed[d]) completed++;
        }
      });

      const pct = Math.round((completed / total) * 100);
      return { ...cfg, pct, completed, total, daysCount };
    });
  }, [activePalette, habits, totalDaysInMonth]);

  // Calculate stats for each habit: goal, count, pct, streak
  const habitStats = useMemo(() => {
    return habits.map((h) => {
      let count = 0;
      let currentStreak = 0;
      let longestStreak = 0;

      for (let d = 0; d < totalDaysInMonth; d++) {
        if (h.completed[d]) {
          count++;
          currentStreak++;
          if (currentStreak > longestStreak) longestStreak = currentStreak;
        } else {
          currentStreak = 0;
        }
      }

      const goal = h.targetDays || totalDaysInMonth;
      const pct = Math.min(100, Math.round((count / goal) * 100));

      return {
        habit: h,
        goal,
        count,
        pct,
        longestStreak,
      };
    });
  }, [habits, totalDaysInMonth]);

  // Top 10 Habits sorted by progress percentage
  const top10Habits = useMemo(() => {
    return [...habitStats]
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 10);
  }, [habitStats]);

  // Add new habit
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newHabitName.trim();
    if (!trimmed) return;
    const newHabit: MonthlyHabitItem = {
      id: `h_${Date.now()}`,
      nameEn: trimmed,
      nameBn: trimmed,
      category: newCategory,
      targetDays: Math.min(totalDaysInMonth, Math.max(1, newTargetDays || totalDaysInMonth)),
      completed: Array(31).fill(false),
    };
    setHabits((prev) => [...prev, newHabit]);
    setNewHabitName('');
  };

  // Delete habit
  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Save rename
  const handleSaveRename = (id: string) => {
    if (!editingName.trim()) return;
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              nameEn: editingName.trim(),
              nameBn: editingName.trim(),
            }
          : h
      )
    );
    setEditingHabitId(null);
  };

  // Day Micro-Note handlers
  const handleOpenDayNote = (dayNum: number) => {
    setActiveNoteDay(dayNum);
    setNoteInputText(dayNotes[dayNum] || '');
  };

  const handleSaveDayNote = () => {
    if (activeNoteDay === null) return;
    const trimmed = noteInputText.trim();
    setDayNotes((prev) => {
      const next = { ...prev };
      if (trimmed) {
        next[activeNoteDay] = trimmed;
      } else {
        delete next[activeNoteDay];
      }
      return next;
    });
    setActiveNoteDay(null);
  };

  // Full Data Backup (JSON Export)
  const handleBackupJSON = () => {
    const backupData = {
      app: 'Weekly Life Planner - Monthly Habits',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      month: selectedMonth,
      year: selectedYear,
      habits,
      dayNotes,
      affirmation,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Habit_Tracker_Backup_${MONTH_NAMES_EN[selectedMonth]}_${selectedYear}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Full Data Restore (JSON Import)
  const handleRestoreJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.habits && Array.isArray(parsed.habits)) {
          setHabits(parsed.habits);
          if (parsed.dayNotes) setDayNotes(parsed.dayNotes);
          if (parsed.affirmation) setAffirmation(parsed.affirmation);
          fireConfetti();
          alert('✓ ডেটা সফলভাবে রিস্টোর করা হয়েছে!');
        } else {
          alert('ভুল ফাইল ফরম্যাট!');
        }
      } catch {
        alert('ফাইলটি পড়া যায়নি। সঠিক JSON ফাইল দিন।');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Daily Reminder Notification setup
  const handleTriggerDailyReminder = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🌸 অভ্যাস চেক করেছেন তো?', {
          body: `আজকের (${todayDayNum !== -1 ? todayDayNum : 'আজকের'} তারিখ) অভ্যাসগুলো সম্পন্ন করে স্ট্রিক অব্যাহত রাখুন!`,
          icon: '/favicon.ico',
        });
        setReminderToast('🔔 নোটিফিকেশন অ্যালার্ট পাঠানো হয়েছে!');
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('🌸 নোটিফিকেশন সক্রিয় হয়েছে!', {
              body: 'প্রতিদিন সন্ধ্যায় আপনার অভ্যাস পূরণ করার রিমাইন্ডার পাবেন।',
            });
            setReminderToast('🔔 নোটিফিকেশন রিমাইন্ডার সক্রিয় করা হয়েছে!');
          }
        });
      } else {
        setReminderToast('🔔 ব্রাউজার সেটিংসে নোটিফিকেশন ব্লক করা আছে।');
      }
    } else {
      setReminderToast('🔔 আপনার ব্রাউজারে নোটিফিকেশন সাপোর্ট নেই।');
    }
    setTimeout(() => setReminderToast(null), 3500);
  };

  // Presets loader
  const loadPreset = (presetType: 'student' | 'pro' | 'spiritual' | 'fitness') => {
    let presetList: MonthlyHabitItem[] = [];
    if (presetType === 'student') {
      presetList = [
        { id: 's1', nameEn: 'Class Lecture Revision (1h)', nameBn: 'ক্লাস লেকচার রিভিশন (১ ঘণ্টা)', category: 'study', targetDays: 26, completed: Array(31).fill(false).map((_, i) => i < 24) },
        { id: 's2', nameEn: 'Solve 3 Assignment Questions', nameBn: '৩টি অ্যাসাইনমেন্ট সমাধান', category: 'study', targetDays: 22, completed: Array(31).fill(false).map((_, i) => i < 20) },
        { id: 's3', nameEn: 'Read Textbook (15 pages)', nameBn: 'পাঠ্যবই পড়া (১৫ পৃষ্ঠা)', category: 'study', targetDays: 25, completed: Array(31).fill(false).map((_, i) => i < 22) },
        { id: 's4', nameEn: 'Clean & Organize Study Desk', nameBn: 'পড়ার টেবিল গোছানো', category: 'personal', targetDays: 28, completed: Array(31).fill(false).map((_, i) => i < 27) },
        { id: 's5', nameEn: 'No Phone During Study Time', nameBn: 'পড়ার সময় ফেসবুক/রিলস বন্ধ', category: 'personal', targetDays: 26, completed: Array(31).fill(false).map((_, i) => i < 19) },
        { id: 's6', nameEn: '5 Daily Prayers (Salah on time)', nameBn: '৫ ওয়াক্ত নামাজ সময়মতো আদায়', category: 'pray', targetDays: 30, completed: Array(31).fill(false).map((_, i) => i < 28) },
        { id: 's7', nameEn: 'Sleep by 11:30 PM', nameBn: 'রাত ১১:৩০ এর মধ্যে ঘুম', category: 'health', targetDays: 28, completed: Array(31).fill(false).map((_, i) => i < 25) },
      ];
    } else if (presetType === 'pro') {
      presetList = [
        { id: 'p1', nameEn: 'Deep Work Session (2 Hours)', nameBn: 'ডিপ ওয়ার্ক সেশন (২ ঘণ্টা)', category: 'work', targetDays: 26, completed: Array(31).fill(false).map((_, i) => i < 26) },
        { id: 'p2', nameEn: 'Clear Inboxes & Client Messages', nameBn: 'ক্লায়েন্ট মেসেজ ও ইনবক্স জিরো', category: 'work', targetDays: 25, completed: Array(31).fill(false).map((_, i) => i < 24) },
        { id: 'p3', nameEn: 'Learn New Skill or Tool (30m)', nameBn: 'নতুন স্কিল বা টুল শেখা (৩০ মি.)', category: 'study', targetDays: 22, completed: Array(31).fill(false).map((_, i) => i < 21) },
        { id: 'p4', nameEn: 'Daily Physical Exercise', nameBn: 'প্রতিদিন ৩০ মিনিট ব্যায়াম/ওয়াক', category: 'health', targetDays: 25, completed: Array(31).fill(false).map((_, i) => i < 23) },
        { id: 'p5', nameEn: 'Drink 8 Glasses of Water', nameBn: '৮ গ্লাস বিশুদ্ধ পানি পান', category: 'health', targetDays: 30, completed: Array(31).fill(false).map((_, i) => i < 28) },
        { id: 'p6', nameEn: '5 Times Salah & Daily Dua', nameBn: '৫ ওয়াক্ত সালাত ও দোয়া', category: 'pray', targetDays: 30, completed: Array(31).fill(false).map((_, i) => i < 27) },
      ];
    } else if (presetType === 'spiritual') {
      presetList = [
        { id: 'sp1', nameEn: 'Fajr Prayer on Time', nameBn: 'ফজর নামাজ ওয়াক্তমতো আদায়', category: 'pray', targetDays: 30, completed: Array(31).fill(false).map((_, i) => i < 28) },
        { id: 'sp2', nameEn: 'Dhuhr Prayer on Time', nameBn: 'যোহর নামাজ ওয়াক্তমতো আদায়', category: 'pray', targetDays: 30, completed: Array(31).fill(false).map((_, i) => i < 27) },
        { id: 'sp3', nameEn: 'Asr Prayer on Time', nameBn: 'আসর নামাজ ওয়াক্তমতো আদায়', category: 'pray', targetDays: 30, completed: Array(31).fill(false).map((_, i) => i < 26) },
        { id: 'sp4', nameEn: 'Maghrib Prayer on Time', nameBn: 'মাগরিব নামাজ ওয়াক্তমতো আদায়', category: 'pray', targetDays: 30, completed: Array(31).fill(false).map((_, i) => i < 29) },
        { id: 'sp5', nameEn: 'Isha Prayer on Time', nameBn: 'ইশা নামাজ ওয়াক্তমতো আদায়', category: 'pray', targetDays: 30, completed: Array(31).fill(false).map((_, i) => i < 28) },
        { id: 'sp6', nameEn: 'Quran Tilawat & Meaning (1 Ruku)', nameBn: 'কুরআন তিলাওয়াত ও অর্থ অনুধাবন', category: 'pray', targetDays: 26, completed: Array(31).fill(false).map((_, i) => i < 25) },
        { id: 'sp7', nameEn: 'Morning & Evening Masnoon Azkar', nameBn: 'সকাল ও সন্ধ্যার মাসনুন জিকির', category: 'pray', targetDays: 28, completed: Array(31).fill(false).map((_, i) => i < 22) },
      ];
    } else {
      presetList = [
        { id: 'f1', nameEn: '10,000 Daily Steps', nameBn: '১০,০০০ কদম হাঁটা', category: 'health', targetDays: 28, completed: Array(31).fill(false).map((_, i) => i < 25) },
        { id: 'f2', nameEn: 'Drink 2.5 Liters Water', nameBn: '২.৫ লিটার পানি পান', category: 'health', targetDays: 30, completed: Array(31).fill(false).map((_, i) => i < 29) },
        { id: 'f3', nameEn: '30 Minutes HIIT or Gym Workout', nameBn: '৩০ মিনিট জিম বা হোম ওয়ার্কআউট', category: 'health', targetDays: 24, completed: Array(31).fill(false).map((_, i) => i < 22) },
        { id: 'f4', nameEn: 'No Sugar & No Fast Food', nameBn: 'চিনি ও ফাস্টফুড মুক্ত স্বাস্থ্যকর খাবার', category: 'health', targetDays: 26, completed: Array(31).fill(false).map((_, i) => i < 24) },
        { id: 'f5', nameEn: '7-8 Hours Sound Sleep', nameBn: '৭-৮ ঘণ্টা গভীর ঘুম', category: 'health', targetDays: 28, completed: Array(31).fill(false).map((_, i) => i < 26) },
      ];
    }
    setHabits(presetList);
    fireConfetti();
  };

  // Export to CSV for Google Sheets & Excel
  const handleExportCSV = () => {
    let csv = `Month,${MONTH_NAMES_EN[selectedMonth]},Year,${selectedYear}\n\n`;
    csv += 'Habit Name,Category,Goal,' + Array.from({ length: totalDaysInMonth }, (_, i) => `Day ${i + 1}`).join(',') + ',Total Completed,Percentage,Longest Streak\n';

    habitStats.forEach(({ habit, goal, count, pct, longestStreak }) => {
      const daysMarks = Array.from({ length: totalDaysInMonth }, (_, i) => (habit.completed[i] ? 'TRUE' : 'FALSE')).join(',');
      const name = `"${habit.nameEn.replace(/"/g, '""')}"`;
      csv += `${name},${habit.category},${goal},${daysMarks},${count},${pct}%,${longestStreak}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Habit_Tracker_${MONTH_NAMES_EN[selectedMonth]}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mathematical Area Wave Path Generator (100% Original Vector Math)
  const waveSvgPath = useMemo(() => {
    if (dayStats.length === 0) return { lineD: '', areaD: '' };
    const width = 800;
    const height = 90;
    const paddingX = 10;
    const stepX = (width - paddingX * 2) / (dayStats.length - 1 || 1);

    const points = dayStats.map((stat, i) => {
      const x = paddingX + i * stepX;
      const y = 78 - (stat.pct / 100) * 62;
      return { x, y };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const lastX = points[points.length - 1].x;
    const areaD = `${d} L ${lastX} ${height} L ${points[0].x} ${height} Z`;

    return { lineD: d, areaD };
  }, [dayStats]);

  // Copy monthly report card text
  const handleCopyReportText = () => {
    const reportText = `🏆 Monthly Habit Report (${MONTH_NAMES_EN[selectedMonth]} ${selectedYear})\n` +
      `• Overall Score: ${overallProgress.pct}%\n` +
      `• Completed Actions: ${overallProgress.completed} / ${overallProgress.total}\n` +
      `• Top Champion Habit: ${top10Habits[0]?.habit.nameEn || 'N/A'} (${top10Habits[0]?.pct}%)\n` +
      `• Longest Streak: ${Math.max(...habitStats.map((h) => h.longestStreak), 0)} days 🔥\n` +
      `Motto: "${affirmation}"\n` +
      `Created with Weekly Life Planner ✨`;

    navigator.clipboard.writeText(reportText);
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2500);
  };

  return (
    <div className="w-full bg-[#FAF9F6] dark:bg-[#090E17] text-slate-800 dark:text-slate-100 rounded-3xl p-4 sm:p-6 lg:p-7 shadow-xl border border-slate-200/90 dark:border-slate-800 font-sans transition-all print:p-0 print:border-none print:shadow-none print:bg-white">
      {/* Hidden file input for restore */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleRestoreJSON}
        className="hidden"
      />

      {/* Toast Notification */}
      {reminderToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 animate-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold">{reminderToast}</span>
        </div>
      )}

      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200/80 dark:border-slate-800 print:hidden">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white rounded-2xl shadow-md shadow-pink-500/20">
            <Flame className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                {lang === 'bn' ? 'সৌন্দর্যময় মাসিক হ্যাবিট ড্যাশবোর্ড' : 'Aesthetic Monthly Habit Dashboard'}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                100% Original
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'bn'
                ? 'দৈনিক অভ্যাস, পূর্ণাঙ্গ অ্যানালিটিক্স ও গুগল শিটস কমপ্যাটিবল এক্সপোর্ট'
                : 'Daily tracking, wave analytics curve & Google Sheets exportable matrix'}
            </p>
          </div>
        </div>

        {/* Action Controls: Presets, Theme, A4 Print, Report, Backup, CSV */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Presets */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold px-1.5 uppercase font-mono">
              {lang === 'bn' ? 'প্রিসেট:' : 'Presets:'}
            </span>
            <button
              onClick={() => loadPreset('student')}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer"
              title="শিক্ষার্থী প্রিসেট"
            >
              🎓 {lang === 'bn' ? 'ছাত্র' : 'Student'}
            </button>
            <button
              onClick={() => loadPreset('pro')}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer"
              title="ফ্রিল্যান্সার ও চাকরিজীবী"
            >
              💼 {lang === 'bn' ? 'প্রো' : 'Pro'}
            </button>
            <button
              onClick={() => loadPreset('spiritual')}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer"
              title="দ্বীন ও সালাত"
            >
              🤲 {lang === 'bn' ? 'সালাত' : 'Pray'}
            </button>
            <button
              onClick={() => loadPreset('fitness')}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer"
              title="স্বাস্থ্য ও ডায়েট"
            >
              🏃 {lang === 'bn' ? 'স্বাস্থ্য' : 'Fitness'}
            </button>
          </div>

          {/* Aesthetic Color Palettes Selector */}
          <div className="relative">
            <select
              value={selectedPaletteId}
              onChange={(e) => setSelectedPaletteId(e.target.value as AestheticPaletteId)}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs focus:outline-none"
              title="Select Aesthetic Palette for 5 Weeks"
            >
              {Object.values(PALETTES).map((p) => (
                <option key={p.id} value={p.id}>
                  {lang === 'bn' ? p.nameBn : p.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Clear All Habits Button */}
          {habits.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(lang === 'bn' ? 'আপনি কি এই মাসের সব অভ্যাস মুছে নতুন করে শুরু করতে চান?' : 'Clear all habits for this month?')) {
                  setHabits([]);
                  setReminderToast(lang === 'bn' ? 'সব অভ্যাস মুছে ফেলা হয়েছে' : 'All habits cleared');
                  setTimeout(() => setReminderToast(null), 2500);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="সব অভ্যাস মুছে ফেলুন"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সব মুছুন' : 'Clear All'}</span>
            </button>
          )}

          {/* Today One-Click Action */}
          {todayDayNum !== -1 && (
            <button
              onClick={handleToggleAllToday}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-xs cursor-pointer transition-all active:scale-95"
              title={`আজকের (${todayDayNum} তারিখ) সমস্ত অভ্যাস এক ক্লিকে সম্পন্ন করুন`}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'আজকের সব মার্ক' : 'Mark Today'}</span>
            </button>
          )}

          {/* Monthly Report Card Modal trigger */}
          <button
            onClick={() => setIsReportCardOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold shadow-2xs cursor-pointer hover:bg-indigo-100 transition-all"
            title="View Shareable Monthly Report Card"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'bn' ? 'রিপোর্ট কার্ড' : 'Report'}</span>
          </button>

          {/* Print A4 / Save as PDF */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold shadow-2xs cursor-pointer hover:border-slate-400 transition-all"
            title="A4 Print / Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-sky-500" />
            <span>{lang === 'bn' ? 'A4 প্রিন্ট / PDF' : 'Print A4'}</span>
          </button>

          {/* Daily Reminder Notification */}
          <button
            onClick={handleTriggerDailyReminder}
            className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer hover:border-amber-400 shadow-2xs"
            title="Daily Reminder Alert"
          >
            <Bell className="w-4 h-4 text-amber-500" />
          </button>

          {/* Backup & Restore JSON */}
          <button
            onClick={handleBackupJSON}
            className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 shadow-2xs"
            title="Download Full JSON Backup"
          >
            <Download className="w-4 h-4 text-emerald-500" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 shadow-2xs"
            title="Restore from JSON Backup"
          >
            <Upload className="w-4 h-4 text-indigo-500" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-slate-400 shadow-2xs cursor-pointer transition-all"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-500" />
            <span>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Export to Google Sheets */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
            title="Download CSV for Google Sheets or Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'গুগল শিটস (CSV)' : 'CSV'}</span>
          </button>
        </div>
      </div>

      {/* TOP SECTION: Month Selector, Wave Curve & Circular Daily Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch mb-5">
        {/* Top-Left: Month Title & Selectors */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
                {lang === 'bn' ? 'মাসিক ট্র্যাকার' : 'HABIT TRACKER'}
              </span>
              <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold rounded-full font-mono">
                {selectedYear}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-slate-900 dark:text-white capitalize">
              {lang === 'bn' ? MONTH_NAMES_BN[selectedMonth] : MONTH_NAMES_EN[selectedMonth]}
            </h2>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {totalDaysInMonth} {lang === 'bn' ? 'দিনের পূর্ণাঙ্গ হিসেব' : 'Days complete cycle'}
              </p>
              {!isCurrentMonthAndYear && (
                <button
                  onClick={handleJumpToCurrentMonth}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {lang === 'bn' ? 'চলতি মাস ↗' : 'This Month ↗'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {lang === 'bn' ? 'মাস' : 'Month'}
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="w-full text-xs font-bold bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {MONTH_NAMES_EN.map((m, idx) => (
                  <option key={m} value={idx}>
                    {lang === 'bn' ? MONTH_NAMES_BN[idx] : m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {lang === 'bn' ? 'বছর' : 'Year'}
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="w-full text-xs font-bold bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-mono"
              >
                {[2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Top-Center: Area Wave Progress Chart */}
        <div className="lg:col-span-6 bg-[#EEF2FF] dark:bg-[#1E1B4B]/30 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/40 shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div className="flex items-center justify-between mb-1 z-10">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lang === 'bn' ? 'প্রতিদিনের পূর্ণতা সূচক কার্ভ' : 'MONTHLY COMPLETION WAVE'}</span>
            </span>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 font-mono">
              Day 1 – Day {totalDaysInMonth}
            </span>
          </div>

          {/* SVG Wave */}
          <div className="w-full h-24 my-auto relative">
            <svg
              viewBox="0 0 800 90"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#EEF2FF" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Area */}
              {waveSvgPath.areaD && (
                <path d={waveSvgPath.areaD} fill="url(#waveGradient)" />
              )}

              {/* Curve Line */}
              {waveSvgPath.lineD && (
                <path
                  d={waveSvgPath.lineD}
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
            <span>D1</span>
            <span>D7 (W1)</span>
            <span>D14 (W2)</span>
            <span>D21 (W3)</span>
            <span>D28 (W4)</span>
            <span>D{totalDaysInMonth} (W5)</span>
          </div>
        </div>

        {/* Top-Right: DAILY PROGRESS Ring Card */}
        <div className="lg:col-span-3 bg-[#FDF2F8] dark:bg-[#831843]/20 rounded-2xl p-5 border border-pink-200 dark:border-pink-900/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-700 dark:text-pink-300 font-mono">
              {lang === 'bn' ? 'সামগ্রিক প্রগ্রেস' : 'DAILY PROGRESS'}
            </span>
            <div className="text-3xl font-serif font-black text-slate-900 dark:text-white mt-1 tabular-nums font-mono">
              {overallProgress.pct}%
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-mono">
              {overallProgress.completed} / {overallProgress.total} {lang === 'bn' ? 'সম্পূর্ণ' : 'checked'}
            </p>
          </div>

          {/* Circular SVG Ring */}
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-pink-200 dark:text-pink-950/60"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-pink-500 transition-all duration-700 ease-out"
                strokeDasharray={`${overallProgress.pct}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-pink-700 dark:text-pink-300 font-mono">
              {Math.round(overallProgress.pct)}%
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Original Botanical Affirmation Card + 5 Weekly Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5 items-stretch">
        {/* Left Side: Original Vector Art Affirmation Card */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="relative rounded-xl overflow-hidden mb-3 aspect-[4/3] bg-gradient-to-tr from-amber-50 via-rose-50 to-indigo-50 dark:from-slate-850 dark:to-indigo-950 flex flex-col items-center justify-center p-3 text-center border border-slate-100 dark:border-slate-800">
            <svg
              className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-1 opacity-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.387.836-4.58 2.235-6.31" />
              <path d="M12 6v6l4 2" />
              <path d="M7 16c2.5-3 5.5-5 9-6" />
            </svg>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {lang === 'bn' ? 'শৃঙ্খলা ও ধারাবাহিকতা' : 'Discipline & Momentum'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              {MONTH_NAMES_EN[selectedMonth]} · {selectedYear}
            </span>
          </div>

          <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/20 rounded-xl border border-amber-200/70 dark:border-amber-900/40">
            {isEditingAffirmation ? (
              <div className="space-y-1.5">
                <textarea
                  value={affirmation}
                  onChange={(e) => setAffirmation(e.target.value)}
                  className="w-full text-xs p-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none"
                  rows={2}
                />
                <button
                  onClick={() => setIsEditingAffirmation(false)}
                  className="px-2 py-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded text-xs font-bold cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingAffirmation(true)}
                className="cursor-pointer group"
                title="Click to customize affirmation motto"
              >
                <p className="text-[11px] font-serif italic text-slate-700 dark:text-slate-300 leading-snug">
                  "{affirmation}"
                </p>
                <span className="text-[9px] text-amber-700 dark:text-amber-400 font-bold block text-right mt-1 opacity-60 group-hover:opacity-100">
                  {lang === 'bn' ? 'সংকল্প এডিট করুন ✎' : 'Edit Motto ✎'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 5-Week Bar Charts and Circular Progress Indicators */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-4">
            {weeklyStats.map((week) => {
              const daysInThisWeek = Math.max(0, Math.min(week.endDay, totalDaysInMonth) - week.startDay + 1);

              return (
                <div
                  key={week.weekNum}
                  className="flex flex-col items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-[11px] font-serif font-black capitalize tracking-wider mb-2 text-slate-700 dark:text-slate-300">
                    {week.label}
                  </span>

                  {/* Day mini columns inside this week */}
                  <div className="flex items-end justify-center gap-1 h-24 w-full px-1">
                    {Array.from({ length: daysInThisWeek }, (_, i) => {
                      const dayIdx = week.startDay - 1 + i;
                      const dayNum = dayIdx + 1;
                      const isTodayCol = dayNum === todayDayNum;
                      const stat = dayStats[dayIdx] || { count: 0, pct: 0 };
                      const barH = Math.max(8, (stat.pct / 100) * 80);

                      return (
                        <div
                          key={dayIdx}
                          className="flex-1 flex flex-col items-center group relative cursor-pointer"
                          title={`Day ${dayNum}: ${stat.pct}% completed (${stat.count}/${habits.length})`}
                        >
                          <div
                            style={{ height: `${barH}px`, backgroundColor: week.barColor }}
                            className={`w-full rounded-t-sm transition-all duration-300 group-hover:brightness-90 ${
                              isTodayCol ? 'ring-2 ring-amber-400' : ''
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Percentage & Count below week columns */}
                  <div className="w-full text-center pt-2 border-t border-slate-200/60 dark:border-slate-800 mt-1">
                    <span className="text-[11px] font-black font-mono text-slate-800 dark:text-slate-200 block">
                      {week.pct}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {week.completed}/{week.total}
                    </span>
                  </div>

                  {/* Circular Ring for this week */}
                  <div className="relative w-12 h-12 mt-2">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200 dark:text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        style={{ color: week.ringColor }}
                        strokeDasharray={`${week.pct}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono">
                      {week.pct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 font-mono">
            {lang === 'bn'
              ? '✦ ৫ সপ্তাহের পরিষ্কার রঙিন চার্ট — প্রতিটি দিন ট্র্যাক করার সাথে সাথে চার্টটি নিজে আপডেট হবে'
              : '✦ Color-coded weekly breakdown provides instant visual feedback across all 5 weeks'}
          </p>
        </div>
      </div>

      {/* CATEGORY FILTER BAR */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 print:hidden">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" />
          <span>{lang === 'bn' ? 'ফিল্টার:' : 'Filter:'}</span>
        </span>
        {[
          { id: 'all', labelBn: `সকল অভ্যাস (${habits.length})`, labelEn: `All (${habits.length})` },
          { id: 'study', labelBn: `📖 পড়ালেখা (${habits.filter((h) => h.category === 'study').length})`, labelEn: '📖 Study' },
          { id: 'health', labelBn: `🏃 স্বাস্থ্য (${habits.filter((h) => h.category === 'health').length})`, labelEn: '🏃 Health' },
          { id: 'pray', labelBn: `🤲 সালাত (${habits.filter((h) => h.category === 'pray').length})`, labelEn: '🤲 Prayers' },
          { id: 'work', labelBn: `💼 ক্যারিয়ার (${habits.filter((h) => h.category === 'work').length})`, labelEn: '💼 Work' },
          { id: 'personal', labelBn: `🌿 ব্যক্তিগত (${habits.filter((h) => h.category === 'personal').length})`, labelEn: '🌿 Personal' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as MonthlyHabitItem['category'] | 'all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            {lang === 'bn' ? tab.labelBn : tab.labelEn}
          </button>
        ))}
      </div>

      {/* BOTTOM SECTION: SPREADSHEET MATRIX (Left 8 cols) & STATS TABLES (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* MAIN SPREADSHEET GRID */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto custom-scrollbar">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md">
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </span>
              <span>{lang === 'bn' ? 'প্রতিদিনের অভ্যাস ম্যাট্রিক্স (১ - ৩১ তারিখ)' : 'DAILY HABITS SPREADSHEET MATRIX'}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {filteredHabits.length} {lang === 'bn' ? 'অভ্যাস দৃশ্যমান' : 'habits shown'}
            </span>
          </div>

          {/* Table Container */}
          <table className="w-full border-collapse text-left min-w-[720px]">
            {/* Week Headers Row */}
            <thead>
              <tr>
                <th className="py-1 px-3 w-48 text-xs font-serif font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  DAILY HABITS
                </th>
                {activePalette.weeks.map((week) => {
                  const endDay = Math.min(week.endDay, totalDaysInMonth);
                  const span = Math.max(0, endDay - week.startDay + 1);
                  if (span === 0) return null;

                  return (
                    <th
                      key={week.weekNum}
                      colSpan={span}
                      className={`text-center py-1 text-[11px] font-serif font-black tracking-wider ${week.headerBg} ${week.headerText} rounded-t-lg border-x border-white/40 dark:border-slate-800`}
                    >
                      {week.label}
                    </th>
                  );
                })}
              </tr>

              {/* Day Letter & Number Row (With Highlighted TODAY Column + Micro-Note Trigger) */}
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 px-3 text-[10px] font-bold text-slate-400 uppercase">
                  {lang === 'bn' ? 'অভ্যাসের নাম' : 'Habit Title'}
                </th>
                {Array.from({ length: totalDaysInMonth }, (_, i) => {
                  const dayNum = i + 1;
                  const letter = getDayLetter(dayNum);
                  const isTodayCol = dayNum === todayDayNum;
                  const hasNote = Boolean(dayNotes[dayNum]);
                  const week = activePalette.weeks.find((w) => dayNum >= w.startDay && dayNum <= w.endDay) || activePalette.weeks[0];

                  return (
                    <th
                      key={dayNum}
                      onClick={() => handleOpenDayNote(dayNum)}
                      className={`text-center p-1 w-6 border-r border-slate-100 dark:border-slate-800/60 ${week.headerText} ${
                        isTodayCol ? 'bg-amber-100 dark:bg-amber-950/80 font-black' : 'opacity-90'
                      } cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group relative`}
                      title={hasNote ? `Day ${dayNum} Note: "${dayNotes[dayNum]}" (Click to edit)` : `Day ${dayNum} (Click to add micro-note)`}
                    >
                      <div className="text-[10px] font-black">{letter}</div>
                      <div className={`text-[9px] font-mono ${isTodayCol ? 'text-amber-900 dark:text-amber-300 font-black' : 'opacity-80'}`}>
                        {dayNum}
                      </div>
                      {/* Note indicator dot */}
                      {hasNote ? (
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mx-auto mt-0.5" />
                      ) : isTodayCol ? (
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mx-auto mt-0.5 animate-pulse" />
                      ) : null}
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Habit Rows */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredHabits.length === 0 ? (
                <tr>
                  <td colSpan={totalDaysInMonth + 1} className="py-12 text-center">
                    <div className="max-w-md mx-auto space-y-2 p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-850/40 border border-dashed border-slate-200 dark:border-slate-800">
                      <span className="text-3xl block">🌱</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {lang === 'bn' ? 'কোনো অভ্যাস যোগ করা হয়নি' : 'No habits yet'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {lang === 'bn'
                          ? 'নিচের ফর্ম থেকে আপনার নিজস্ব অভ্যাসের নাম লিখে "+ হ্যাবিট যোগ করুন" বাটনে চাপুন।'
                          : 'Type a habit name in the form below and click "+ Add Habit" to start.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHabits.map((habit) => {
                const isEditing = editingHabitId === habit.id;

                return (
                  <tr
                    key={habit.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Habit Title Column */}
                    <td className="py-2.5 px-3 max-w-[200px]">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="text-xs bg-white dark:bg-slate-800 border border-slate-900 dark:border-white rounded px-1.5 py-0.5 w-full"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(habit.id);
                              if (e.key === 'Escape') setEditingHabitId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveRename(habit.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-1.5">
                          <span
                            onDoubleClick={() => {
                              setEditingHabitId(habit.id);
                              setEditingName(lang === 'bn' ? habit.nameBn : habit.nameEn);
                            }}
                            className="font-medium text-slate-800 dark:text-slate-200 truncate cursor-pointer hover:underline"
                            title="Double click to edit habit name"
                          >
                            {lang === 'bn' ? habit.nameBn : habit.nameEn}
                          </span>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingHabitId(habit.id);
                                setEditingName(lang === 'bn' ? habit.nameBn : habit.nameEn);
                              }}
                              className="p-0.5 text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                              title="Edit habit"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteHabit(habit.id)}
                              className="p-0.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Delete habit"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Day Checkboxes */}
                    {Array.from({ length: totalDaysInMonth }, (_, dayIdx) => {
                      const dayNum = dayIdx + 1;
                      const isChecked = habit.completed[dayIdx];
                      const isTodayCol = dayNum === todayDayNum;
                      const week = activePalette.weeks.find((w) => dayNum >= w.startDay && dayNum <= w.endDay) || activePalette.weeks[0];

                      return (
                        <td
                          key={dayNum}
                          className={`text-center p-1 border-r border-slate-100 dark:border-slate-800/40 ${
                            isTodayCol ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''
                          }`}
                        >
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={isChecked}
                            onClick={() => handleToggleDay(habit.id, dayIdx)}
                            className={`w-4 h-4 mx-auto rounded-[4px] border flex items-center justify-center transition-all cursor-pointer ${
                              isChecked
                                ? week.checkboxChecked
                                : `${week.checkboxUnchecked} ${isTodayCol ? 'ring-1 ring-amber-400' : ''}`
                            }`}
                            title={`${lang === 'bn' ? habit.nameBn : habit.nameEn} - Day ${dayNum}`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              }))}
            </tbody>
          </table>

          {/* Quick Add Habit Row */}
          <form onSubmit={handleAddHabit} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 print:hidden">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder={lang === 'bn' ? 'নতুন অভ্যাস যোগ করুন (যেমন: ৩০ মিনিট কুরআন তিলাওয়াত, ওয়াক ইত্যাদি)...' : 'Add custom habit (e.g. Read 20 pages, Gym workout)...'}
              className="flex-1 min-w-[200px] text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as MonthlyHabitItem['category'])}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="study">📖 Study</option>
              <option value="health">🏃 Health</option>
              <option value="pray">🤲 Pray</option>
              <option value="work">💼 Work</option>
              <option value="personal">🌿 Life</option>
            </select>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Target className="w-3.5 h-3.5" />
              <input
                type="number"
                min="1"
                max={totalDaysInMonth}
                value={newTargetDays}
                onChange={(e) => setNewTargetDays(parseInt(e.target.value, 10) || totalDaysInMonth)}
                className="w-12 text-xs text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2"
                title="Target days per month"
              />
              <span className="text-[10px]">days</span>
            </div>
            <button
              type="submit"
              disabled={!newHabitName.trim()}
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-40 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'যোগ করুন' : 'Add Habit'}</span>
            </button>
          </form>
        </div>

        {/* RIGHT ANALYTICS TABLES: TOP 10 HABITS & PROGRESS STATS */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. TOP 10 HABITS TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-100 dark:border-indigo-900/50">
              <span className="text-xs font-serif font-black tracking-wider text-indigo-900 dark:text-indigo-300 uppercase flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>TOP 10 HABITS</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {lang === 'bn' ? 'র‍্যাংক ও প্রগ্রেস' : 'Rank & Progress'}
              </span>
            </div>

            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] uppercase font-serif italic text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                  <th className="text-left py-1 w-6">#</th>
                  <th className="text-left py-1">daily habit</th>
                  <th className="text-right py-1">progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {top10Habits.map((item, idx) => (
                  <tr key={item.habit.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-1.5 text-[11px] font-bold text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-1.5 pr-2 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                      {lang === 'bn' ? item.habit.nameBn : item.habit.nameEn}
                    </td>
                    <td className="py-1.5 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {item.pct}.0%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[11px] text-pink-600 dark:text-pink-400 font-serif italic">
                Over 80% on {top10Habits.filter((h) => h.pct >= 80).length} habits — keep going! 🚀
              </span>
            </div>
          </div>

          {/* 2. DAILY PROGRESS DETAILED STATS */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-serif font-black tracking-wider text-slate-900 dark:text-white uppercase">
                DAILY PROGRESS
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {overallProgress.completed} / {overallProgress.total} completed
              </span>
            </div>

            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] uppercase font-serif italic text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                  <th className="text-left py-1 w-8">goal</th>
                  <th className="text-left py-1 w-20">percentage</th>
                  <th className="text-right py-1">count</th>
                  <th className="text-right py-1">longest streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {habitStats.slice(0, 10).map(({ habit, goal, count, pct, longestStreak }) => (
                  <tr key={habit.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-1.5 text-slate-400 font-mono text-[11px]">
                      {goal}
                    </td>
                    <td className="py-1.5 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold w-7">{pct}%</span>
                        <div className="w-10 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="bg-indigo-500 h-full rounded-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-1.5 text-right font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {count} / {goal}
                    </td>
                    <td className="py-1.5 text-right font-mono font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                      {longestStreak > 0 ? `${longestStreak} 🔥` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL 1: Day Micro-Note Popover */}
      {activeNoteDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                <span>Day {activeNoteDay} Reflection Note</span>
              </span>
              <button
                onClick={() => setActiveNoteDay(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={noteInputText}
              onChange={(e) => setNoteInputText(e.target.value)}
              placeholder="e.g. Read 20 pages instead of 10! Felt energetic after morning run..."
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveNoteDay(null)}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDayNote}
                className="px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Social Shareable Monthly Report Card */}
      {isReportCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-[#FFFDF7] to-white dark:from-[#0B101B] dark:to-[#0B0F17] rounded-3xl p-6 sm:p-7 max-w-md w-full border border-amber-200/80 dark:border-amber-900/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-500 text-white rounded-xl">
                  <Award className="w-4 h-4" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                  Monthly Performance Certificate
                </span>
              </div>
              <button
                onClick={() => setIsReportCardOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Aesthetic Certificate Content */}
            <div className="text-center py-4 px-3 bg-gradient-to-tr from-amber-50/50 via-rose-50/30 to-indigo-50/40 dark:from-slate-850 dark:to-slate-900 rounded-2xl border border-amber-100 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold block mb-1">
                {MONTH_NAMES_EN[selectedMonth]} {selectedYear}
              </span>
              <div className="text-5xl font-serif font-black text-slate-900 dark:text-white my-1 tabular-nums font-mono">
                {overallProgress.pct}%
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                {overallProgress.pct >= 80 ? '🌟 Outstanding Discipline & Momentum' : '🌱 Solid Growth & Progress'}
              </span>

              {/* Badges grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 text-left">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-mono block">TOP HABIT</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                    {top10Habits[0]?.habit.nameEn || 'All habits'}
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                    {top10Habits[0]?.pct || 0}% Completion
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-mono block">LONGEST STREAK</span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 block font-mono">
                    {Math.max(...habitStats.map((h) => h.longestStreak), 0)} Days in a row 🔥
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {overallProgress.completed} total marks
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-serif italic text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                "{affirmation}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleCopyReportText}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold cursor-pointer hover:opacity-95 transition-all shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{reportCopied ? 'কপি হয়েছে! ✓' : 'Copy Summary'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                title="Print this card"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
