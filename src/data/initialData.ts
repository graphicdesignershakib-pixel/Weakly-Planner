import { PlannerState } from '../types/planner';
import { getWeekDaysInfo } from '../utils/dateUtils';

/**
 * Generate standard sample planner state for a given weekStart.
 */
export function generateSampleData(weekStart: string): PlannerState {
  const daysInfo = getWeekDaysInfo(weekStart);

  const sampleTasksByDayIndex: { [key: number]: { title: string; completed: boolean }[] } = {
    0: [
      { title: 'Plan the week', completed: true },
      { title: 'Deep work session', completed: true },
      { title: 'Exercise', completed: true },
      { title: 'Read 10 pages', completed: true },
      { title: 'Review goals', completed: true },
    ],
    1: [
      { title: 'Study / learning', completed: true },
      { title: 'Project work', completed: true },
      { title: 'Workout', completed: true },
      { title: 'Read 10 pages', completed: false },
    ],
    2: [
      { title: 'Design practice', completed: true },
      { title: 'Deep work session', completed: true },
      { title: 'Exercise', completed: false },
      { title: 'Research', completed: true },
    ],
    3: [
      { title: 'Study / learning', completed: true },
      { title: 'Internship work', completed: true },
      { title: 'Workout', completed: true },
      { title: 'Read 10 pages', completed: true },
    ],
    4: [
      { title: 'Weekly review', completed: true },
      { title: 'Content creation', completed: false },
      { title: 'Exercise', completed: true },
      { title: 'Plan next week', completed: false },
    ],
    5: [
      { title: 'Personal project', completed: true },
      { title: 'Outdoor activity', completed: true },
      { title: 'Reading', completed: false },
    ],
    6: [
      { title: 'Reflection', completed: false },
      { title: 'Family time', completed: true },
      { title: 'Plan Monday', completed: false },
    ],
  };

  const dayNotes: { [key: number]: string } = {
    0: 'Focus: Clean execution on priorities',
    1: 'Prioritize architecture review',
    2: 'Mid-week checkpoint & design sprint',
    3: 'Deep sprint before review day',
    4: 'Wrap up deliverables & reflect',
    5: 'Rest & creative rejuvenation',
    6: 'Prepare mind and workspace for next week',
  };

  const days = daysInfo.map((info, idx) => ({
    date: info.dateStr,
    note: dayNotes[idx] || '',
    tasks: (sampleTasksByDayIndex[idx] || []).map((t, taskIdx) => ({
      id: `task-${info.dateStr}-${taskIdx}-${Date.now().toString(36)}`,
      title: t.title,
      completed: t.completed,
    })),
  }));

  const habits = [
    {
      id: 'h-1',
      name: 'Wake up early',
      completed: [true, true, true, true, true, false, false],
    },
    {
      id: 'h-2',
      name: 'Drink 2L water',
      completed: [true, true, true, true, true, true, false],
    },
    {
      id: 'h-3',
      name: 'Exercise',
      completed: [true, true, false, true, true, true, false],
    },
    {
      id: 'h-4',
      name: 'Read 10 pages',
      completed: [true, false, true, true, false, true, true],
    },
    {
      id: 'h-5',
      name: 'Study',
      completed: [true, true, true, true, false, false, false],
    },
    {
      id: 'h-6',
      name: 'Meditation',
      completed: [true, true, true, false, true, true, false],
    },
    {
      id: 'h-7',
      name: 'Budget tracking',
      completed: [true, false, false, true, false, false, true],
    },
  ];

  return {
    weekStart,
    focus: 'Consistency & Growth',
    objective: 'Complete core priorities every morning and maintain strong habit momentum.',
    reward: 'New Hoodie',
    days,
    habits,
    review: {
      wentWell: 'Maintained morning deep work sessions and completed all daily reading targets.',
      challenges: 'Managing context switching between internship tasks and personal projects.',
      achievement: 'Shipped core design system draft and exercised 5 out of 7 days.',
      lesson: 'Planning the next day the night before significantly cuts morning procrastination.',
      nextWeekPriority: 'Finish user testing protocol and maintain consistent 6:30 AM wakeups.',
    },
  };
}

/**
 * Generate a blank planner state for a given weekStart.
 */
export function generateBlankWeek(weekStart: string): PlannerState {
  const daysInfo = getWeekDaysInfo(weekStart);

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
    habits: [
      { id: 'h-1', name: 'Wake up early', completed: [false, false, false, false, false, false, false] },
      { id: 'h-2', name: 'Drink 2L water', completed: [false, false, false, false, false, false, false] },
      { id: 'h-3', name: 'Exercise', completed: [false, false, false, false, false, false, false] },
    ],
    review: {
      wentWell: '',
      challenges: '',
      achievement: '',
      lesson: '',
      nextWeekPriority: '',
    },
  };
}
