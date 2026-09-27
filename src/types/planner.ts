/**
 * Types for the Weekly Life Planner
 */

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority?: 'high' | 'normal';
};

export type DayPlan = {
  date: string; // YYYY-MM-DD format
  tasks: Task[];
  note: string;
};

export type Habit = {
  id: string;
  name: string;
  completed: boolean[]; // 7 elements, index 0=Mon, ..., 6=Sun
};

export type WeeklyReview = {
  wentWell: string;
  challenges: string;
  achievement: string;
  lesson: string;
  nextWeekPriority: string;
};

export type PlannerState = {
  weekStart: string; // YYYY-MM-DD of Monday
  focus: string;
  reward: string;
  objective?: string;
  days: DayPlan[];
  habits: Habit[];
  review: WeeklyReview;
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
