/**
 * Types for the Weekly Life Planner
 */

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority?: 'high' | 'normal';
  time?: string; // e.g. "09:30 AM" or "14:00"
};

export type DayMood = 'fire' | 'focus' | 'calm' | 'tired' | 'rest';

export type DayPrayers = {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
};

export type DayPlan = {
  date: string; // YYYY-MM-DD format
  tasks: Task[];
  note: string;
  mood?: DayMood;
  prayers?: DayPrayers;
  waterGlasses?: number; // 0 to 8 glasses
  winOfTheDay?: string; // Daily highlight or achievement
  gratitude?: string; // What I am grateful for today
};

export type ThemeType = 'minimal' | 'sage' | 'latte' | 'obsidian';

export type UserProfile = {
  name: string;
  tagline: string;
  avatarSeed?: string;
};

export type ScratchNote = {
  id: string;
  content: string;
  createdAt: string;
};

export type HabitCategory = 'health' | 'study' | 'pray' | 'work' | 'personal';

export type Habit = {
  id: string;
  name: string;
  category?: HabitCategory;
  completed: boolean[]; // 7 elements, index 0=Mon, ..., 6=Sun
};

export type WeeklyReview = {
  wentWell: string;
  challenges: string;
  achievement: string;
  lesson: string;
  nextWeekPriority: string;
};

export type MasterTodo = {
  id: string;
  title: string;
  completed: boolean;
  priority: 'urgent' | 'high' | 'normal';
  category: 'work' | 'personal' | 'study' | 'urgent';
  assignedDayIndex?: number | null; // 0=Mon..6=Sun if assigned
  createdAt: string;
};

export type GoalMilestone = {
  id: string;
  title: string;
  completed: boolean;
};

export type LongTermGoal = {
  id: string;
  title: string;
  timeframe: string; // e.g. "2026 Q4", "1 Year Vision"
  category: 'career' | 'health' | 'finance' | 'spiritual' | 'personal';
  progress: number; // 0 to 100
  milestones: GoalMilestone[];
};

export type ShortTermGoal = {
  id: string;
  title: string;
  deadline: string; // e.g. "This Month", "Next 2 Weeks"
  category: 'career' | 'health' | 'study' | 'personal';
  status: 'not_started' | 'in_progress' | 'completed';
};

export type PlannerState = {
  weekStart: string; // YYYY-MM-DD of Monday
  focus: string;
  reward: string;
  objective?: string;
  days: DayPlan[];
  habits: Habit[];
  review: WeeklyReview;
  masterTodos?: MasterTodo[];
  longTermGoals?: LongTermGoal[];
  shortTermGoals?: ShortTermGoal[];
};

export type DayInfo = {
  dateStr: string;
  dayIndex: number; // 0=Mon..6=Sun
  dayName: string; // "Monday"
  dayAbbr: string; // "Mon"
  singleLetter: string; // "M"
  formattedDate: string; // "28 Sep"
  fullFormatted: string; // "28 September 2026"
  isToday: boolean;
};
