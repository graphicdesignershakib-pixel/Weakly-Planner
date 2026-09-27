import { PlannerState, Habit, MasterTodo, LongTermGoal, ShortTermGoal } from '../types/planner';
import { getWeekDaysInfo } from '../utils/dateUtils';

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'h-health-1',
    name: 'Morning Workout & Stretch',
    category: 'health',
    completed: [false, false, false, false, false, false, false],
  },
  {
    id: 'h-health-2',
    name: 'Drink 2.5L Water',
    category: 'health',
    completed: [false, false, false, false, false, false, false],
  },
  {
    id: 'h-pray-1',
    name: '5 Daily Prayers (Salah)',
    category: 'pray',
    completed: [false, false, false, false, false, false, false],
  },
  {
    id: 'h-pray-2',
    name: 'Morning Dhikr / Mindfulness',
    category: 'pray',
    completed: [false, false, false, false, false, false, false],
  },
  {
    id: 'h-study-1',
    name: 'Read 20 Pages (Books/Docs)',
    category: 'study',
    completed: [false, false, false, false, false, false, false],
  },
  {
    id: 'h-study-2',
    name: 'Coding / Skill Practice (45m)',
    category: 'study',
    completed: [false, false, false, false, false, false, false],
  },
  {
    id: 'h-work-1',
    name: 'Deep Work (No Phone 90m)',
    category: 'work',
    completed: [false, false, false, false, false, false, false],
  },
  {
    id: 'h-personal-1',
    name: 'Sleep by 11:30 PM',
    category: 'personal',
    completed: [false, false, false, false, false, false, false],
  },
];

export const DEFAULT_LONG_TERM_GOALS: LongTermGoal[] = [
  {
    id: 'ltg-1',
    title: 'Master Full-Stack TypeScript & AI Architecture',
    timeframe: '2026 Q4',
    category: 'career',
    progress: 70,
    milestones: [
      { id: 'm1', title: 'Complete Advanced TypeScript system design', completed: true },
      { id: 'm2', title: 'Build 3 production AI apps with Gemini API', completed: true },
      { id: 'm3', title: 'Deploy portfolio & publish technical case studies', completed: false },
    ],
  },
  {
    id: 'ltg-2',
    title: 'Achieve Optimal Fitness & 75kg Target Weight',
    timeframe: '6 Months',
    category: 'health',
    progress: 55,
    milestones: [
      { id: 'm4', title: 'Consistent 4x weekly strength routine', completed: true },
      { id: 'm5', title: 'Run continuous 5km in under 26 mins', completed: false },
    ],
  },
  {
    id: 'ltg-3',
    title: 'Spiritual Discipline & Quran Memorization (Juz Amma)',
    timeframe: '1 Year',
    category: 'spiritual',
    progress: 40,
    milestones: [
      { id: 'm6', title: 'Never miss Fajr in congregation / on time', completed: true },
      { id: 'm7', title: 'Complete first 15 Surahs with Tajweed', completed: false },
    ],
  },
];

export const DEFAULT_SHORT_TERM_GOALS: ShortTermGoal[] = [
  {
    id: 'stg-1',
    title: 'Ship Weekly Life Planner v2 with Vercel Deploy',
    deadline: 'This Week',
    category: 'career',
    status: 'in_progress',
  },
  {
    id: 'stg-2',
    title: 'Read 1 Product Psychology Book (Atomic Habits / Deep Work)',
    deadline: 'This Month',
    category: 'study',
    status: 'in_progress',
  },
  {
    id: 'stg-3',
    title: 'Consistent 5 Prayers Daily on time for 14 Days',
    deadline: 'Next 2 Weeks',
    category: 'personal',
    status: 'in_progress',
  },
];

export const DEFAULT_MASTER_TODOS: MasterTodo[] = [
  {
    id: 'todo-1',
    title: 'Review quarterly savings & investment portfolio',
    completed: false,
    priority: 'high',
    category: 'personal',
    assignedDayIndex: null,
    createdAt: '2026-09-27',
  },
  {
    id: 'todo-2',
    title: 'Research Figma auto-layout & design tokens best practices',
    completed: false,
    priority: 'normal',
    category: 'study',
    assignedDayIndex: null,
    createdAt: '2026-09-27',
  },
  {
    id: 'todo-3',
    title: 'Backup computer drive & clean downloads directory',
    completed: true,
    priority: 'normal',
    category: 'work',
    assignedDayIndex: null,
    createdAt: '2026-09-26',
  },
];

/**
 * Generate standard sample planner state for a given weekStart.
 */
export function generateSampleData(weekStart: string): PlannerState {
  const daysInfo = getWeekDaysInfo(weekStart);

  const sampleTasksByDayIndex: { [key: number]: { title: string; completed: boolean; priority?: 'high' | 'normal' }[] } = {
    0: [
      { title: 'Plan weekly objectives & master priorities', completed: true, priority: 'high' },
      { title: 'Deep work sprint (Frontend UI layout)', completed: true, priority: 'high' },
      { title: 'Morning workout & 10 min cardio', completed: true },
      { title: 'Read 20 pages of Deep Work', completed: true },
      { title: 'Daily Salah & evening reflection', completed: true },
    ],
    1: [
      { title: 'Study TypeScript advanced generics', completed: true, priority: 'high' },
      { title: 'Project architecture review', completed: true },
      { title: 'Gym workout (Chest & Triceps)', completed: true },
      { title: 'Review pull requests and comments', completed: false },
    ],
    2: [
      { title: 'Design system practice in Figma', completed: true, priority: 'high' },
      { title: 'Deep coding session', completed: true },
      { title: '30 mins outdoor brisk walk', completed: false },
      { title: 'Review short-term sprint goals', completed: true },
    ],
    3: [
      { title: 'AI integration & prompt engineering test', completed: true, priority: 'high' },
      { title: 'Internship deliverable submission', completed: true },
      { title: 'Full body workout', completed: true },
      { title: 'Read 20 pages', completed: true },
    ],
    4: [
      { title: 'Weekly task review & retrospective', completed: true, priority: 'high' },
      { title: 'Write tech blog summary', completed: false },
      { title: 'Jummah prayer & gratitude journal', completed: true },
      { title: 'Plan next week priorities', completed: false },
    ],
    5: [
      { title: 'Personal creative build / Side project', completed: true },
      { title: 'Family dinner & outdoor relaxation', completed: true },
      { title: 'Skill practice session', completed: false },
    ],
    6: [
      { title: 'Weekly reflection & room cleanup', completed: false },
      { title: 'Rest & physical recovery', completed: true },
      { title: 'Prepare Monday outfit and agenda', completed: false },
    ],
  };

  const dayNotes: { [key: number]: string } = {
    0: 'Focus: Start with extreme momentum & deep work',
    1: 'Prioritize architecture & zero distractions',
    2: 'Mid-week checkpoint & design sprint',
    3: 'Deep sprint before review day',
    4: 'Wrap up weekly deliverables & Jummah prayers',
    5: 'Rest, recharge & creative exploration',
    6: 'Prepare mind, spirit and workspace for next week',
  };

  const days = daysInfo.map((info, idx) => ({
    date: info.dateStr,
    note: dayNotes[idx] || '',
    tasks: (sampleTasksByDayIndex[idx] || []).map((t, taskIdx) => ({
      id: `task-${info.dateStr}-${taskIdx}-${Date.now().toString(36)}`,
      title: t.title,
      completed: t.completed,
      priority: t.priority || 'normal',
    })),
  }));

  const habits: Habit[] = [
    {
      id: 'h-health-1',
      name: 'Morning Workout & Stretch',
      category: 'health',
      completed: [true, true, false, true, true, true, false],
    },
    {
      id: 'h-health-2',
      name: 'Drink 2.5L Water',
      category: 'health',
      completed: [true, true, true, true, true, true, false],
    },
    {
      id: 'h-pray-1',
      name: '5 Daily Prayers (Salah)',
      category: 'pray',
      completed: [true, true, true, true, true, true, true],
    },
    {
      id: 'h-pray-2',
      name: 'Morning Dhikr & Quran',
      category: 'pray',
      completed: [true, true, true, false, true, true, false],
    },
    {
      id: 'h-study-1',
      name: 'Read 20 Pages',
      category: 'study',
      completed: [true, false, true, true, false, true, true],
    },
    {
      id: 'h-study-2',
      name: 'Coding / Skill Practice',
      category: 'study',
      completed: [true, true, true, true, false, false, false],
    },
    {
      id: 'h-work-1',
      name: 'Deep Work (90m Sprint)',
      category: 'work',
      completed: [true, true, true, true, true, false, false],
    },
  ];

  return {
    weekStart,
    focus: 'Consistency & High-Leverage Growth',
    objective: 'Complete core priorities early each morning and maintain unbreakable habit streaks.',
    reward: 'Weekend Outing & Favorite Meal',
    days,
    habits,
    review: {
      wentWell: 'Maintained early morning deep work sessions and completed all daily reading targets.',
      challenges: 'Managing context switching between internship tasks and side projects.',
      achievement: 'Shipped weekly milestones and prayed all 5 daily prayers on time.',
      lesson: 'Planning the next day the night before significantly cuts morning friction.',
      nextWeekPriority: 'Finish user testing and maintain consistent 6:30 AM wakeups.',
    },
    masterTodos: DEFAULT_MASTER_TODOS,
    longTermGoals: DEFAULT_LONG_TERM_GOALS,
    shortTermGoals: DEFAULT_SHORT_TERM_GOALS,
  };
}

/**
 * Generate a 100% clean, blank planner state for a given weekStart.
 * Master habits carry over with FALSE checkboxes so users don't re-type habits!
 */
export function generateBlankWeek(
  weekStart: string,
  existingHabitNames?: Habit[],
  existingTodos?: MasterTodo[],
  existingLongGoals?: LongTermGoal[],
  existingShortGoals?: ShortTermGoal[]
): PlannerState {
  const daysInfo = getWeekDaysInfo(weekStart);

  const cleanHabits: Habit[] = existingHabitNames && existingHabitNames.length > 0
    ? existingHabitNames.map((h) => ({
        id: h.id,
        name: h.name,
        category: h.category,
        completed: [false, false, false, false, false, false, false],
      }))
    : DEFAULT_HABITS.map((h) => ({
        ...h,
        completed: [false, false, false, false, false, false, false],
      }));

  return {
    weekStart,
    focus: '',
    objective: '',
    reward: '',
    days: daysInfo.map((info) => ({
      date: info.dateStr,
      note: '',
      tasks: [],
    })),
    habits: cleanHabits,
    review: {
      wentWell: '',
      challenges: '',
      achievement: '',
      lesson: '',
      nextWeekPriority: '',
    },
    masterTodos: existingTodos || [],
    longTermGoals: existingLongGoals || DEFAULT_LONG_TERM_GOALS,
    shortTermGoals: existingShortGoals || DEFAULT_SHORT_TERM_GOALS,
  };
}
