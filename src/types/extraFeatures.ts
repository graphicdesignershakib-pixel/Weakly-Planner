export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'food' | 'transport' | 'bills' | 'shopping' | 'education' | 'other';
  date: string; // YYYY-MM-DD
  time: string;
}

export interface RitualItem {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
}

export interface DayRituals {
  morning: RitualItem[];
  evening: RitualItem[];
}

export interface TaskTimeLog {
  taskId: string;
  secondsSpent: number;
  isRunning?: boolean;
}
