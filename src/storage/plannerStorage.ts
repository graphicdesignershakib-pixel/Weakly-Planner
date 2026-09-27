import { PlannerState, Habit, MasterTodo, LongTermGoal, ShortTermGoal } from '../types/planner';
import { generateBlankWeek, generateSampleData, DEFAULT_HABITS, DEFAULT_LONG_TERM_GOALS, DEFAULT_SHORT_TERM_GOALS, DEFAULT_MASTER_TODOS } from '../data/initialData';
import { getWeekDaysInfo } from '../utils/dateUtils';

const STORAGE_PREFIX = 'weekly_life_planner_v1_';
const LAST_WEEK_KEY = 'weekly_life_planner_last_week';
const MASTER_HABITS_KEY = 'weekly_life_planner_master_habits';
const MASTER_TODOS_KEY = 'weekly_life_planner_master_todos';
const MASTER_LONG_GOALS_KEY = 'weekly_life_planner_master_long_goals';
const MASTER_SHORT_GOALS_KEY = 'weekly_life_planner_master_short_goals';
const HAS_INITIALIZED_KEY = 'weekly_life_planner_has_initialized_v2';

export interface StorageRepository {
  load(weekStart: string): PlannerState;
  save(state: PlannerState): void;
  reset(weekStart: string, useSample?: boolean): PlannerState;
  clear(weekStart: string): PlannerState;
  getLastActiveWeek(): string | null;
  setLastActiveWeek(weekStart: string): void;
  exportJSON(): string;
  importJSON(jsonString: string): boolean;
}

class LocalStorageRepository implements StorageRepository {
  private getKey(weekStart: string): string {
    return `${STORAGE_PREFIX}${weekStart}`;
  }

  private getMasterHabits(): Habit[] {
    try {
      const data = localStorage.getItem(MASTER_HABITS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return DEFAULT_HABITS;
  }

  private setMasterHabits(habits: Habit[]): void {
    try {
      localStorage.setItem(MASTER_HABITS_KEY, JSON.stringify(habits));
    } catch {
      // ignore
    }
  }

  private getMasterTodos(): MasterTodo[] {
    try {
      const data = localStorage.getItem(MASTER_TODOS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return DEFAULT_MASTER_TODOS;
  }

  private setMasterTodos(todos: MasterTodo[]): void {
    try {
      localStorage.setItem(MASTER_TODOS_KEY, JSON.stringify(todos));
    } catch {
      // ignore
    }
  }

  private getMasterLongGoals(): LongTermGoal[] {
    try {
      const data = localStorage.getItem(MASTER_LONG_GOALS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return DEFAULT_LONG_TERM_GOALS;
  }

  private setMasterLongGoals(goals: LongTermGoal[]): void {
    try {
      localStorage.setItem(MASTER_LONG_GOALS_KEY, JSON.stringify(goals));
    } catch {
      // ignore
    }
  }

  private getMasterShortGoals(): ShortTermGoal[] {
    try {
      const data = localStorage.getItem(MASTER_SHORT_GOALS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return DEFAULT_SHORT_TERM_GOALS;
  }

  private setMasterShortGoals(goals: ShortTermGoal[]): void {
    try {
      localStorage.setItem(MASTER_SHORT_GOALS_KEY, JSON.stringify(goals));
    } catch {
      // ignore
    }
  }

  load(weekStart: string): PlannerState {
    const key = this.getKey(weekStart);
    try {
      const serialized = localStorage.getItem(key);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        return this.sanitizeState(parsed, weekStart);
      }
    } catch (e) {
      console.error('Failed to load planner state from localStorage:', e);
    }

    // Check if this is the first time the app is EVER run
    const hasInitialized = localStorage.getItem(HAS_INITIALIZED_KEY);
    if (!hasInitialized) {
      localStorage.setItem(HAS_INITIALIZED_KEY, 'true');
      const sampleState = generateSampleData(weekStart);
      this.save(sampleState);
      return sampleState;
    }

    // For any NEW or unvisited week, start completely blank and fresh!
    // But preserve master habit templates and long/short term goals
    const blankState = generateBlankWeek(
      weekStart,
      this.getMasterHabits(),
      this.getMasterTodos(),
      this.getMasterLongGoals(),
      this.getMasterShortGoals()
    );
    this.save(blankState);
    return blankState;
  }

  save(state: PlannerState): void {
    try {
      const key = this.getKey(state.weekStart);
      localStorage.setItem(key, JSON.stringify(state));
      this.setLastActiveWeek(state.weekStart);

      // Persist global items
      if (state.habits && state.habits.length > 0) {
        this.setMasterHabits(state.habits);
      }
      if (state.masterTodos) {
        this.setMasterTodos(state.masterTodos);
      }
      if (state.longTermGoals) {
        this.setMasterLongGoals(state.longTermGoals);
      }
      if (state.shortTermGoals) {
        this.setMasterShortGoals(state.shortTermGoals);
      }
    } catch (e) {
      console.error('Failed to save planner state to localStorage:', e);
    }
  }

  reset(weekStart: string, useSample: boolean = true): PlannerState {
    const freshState = useSample
      ? generateSampleData(weekStart)
      : generateBlankWeek(
          weekStart,
          this.getMasterHabits(),
          this.getMasterTodos(),
          this.getMasterLongGoals(),
          this.getMasterShortGoals()
        );
    this.save(freshState);
    return freshState;
  }

  clear(weekStart: string): PlannerState {
    return this.reset(weekStart, false);
  }

  getLastActiveWeek(): string | null {
    try {
      return localStorage.getItem(LAST_WEEK_KEY);
    } catch {
      return null;
    }
  }

  setLastActiveWeek(weekStart: string): void {
    try {
      localStorage.setItem(LAST_WEEK_KEY, weekStart);
    } catch {
      // ignore
    }
  }

  exportJSON(): string {
    try {
      const allData: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          allData[key] = JSON.parse(localStorage.getItem(key) || '{}');
        }
      }
      allData['masterHabits'] = this.getMasterHabits();
      allData['masterTodos'] = this.getMasterTodos();
      allData['masterLongGoals'] = this.getMasterLongGoals();
      allData['masterShortGoals'] = this.getMasterShortGoals();
      return JSON.stringify(allData, null, 2);
    } catch (e) {
      console.error('Failed to export JSON', e);
      return '{}';
    }
  }

  importJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== 'object' || parsed === null) return false;
      for (const [key, value] of Object.entries(parsed)) {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      }
      if (parsed['masterHabits']) this.setMasterHabits(parsed['masterHabits']);
      if (parsed['masterTodos']) this.setMasterTodos(parsed['masterTodos']);
      if (parsed['masterLongGoals']) this.setMasterLongGoals(parsed['masterLongGoals']);
      if (parsed['masterShortGoals']) this.setMasterShortGoals(parsed['masterShortGoals']);
      return true;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  }

  private sanitizeState(data: Partial<PlannerState>, weekStart: string): PlannerState {
    const daysInfo = getWeekDaysInfo(weekStart);
    const existingDays = Array.isArray(data.days) ? data.days : [];

    // Ensure all 7 days exist with valid structure
    const days = daysInfo.map((info) => {
      const found = existingDays.find((d) => d.date === info.dateStr) || existingDays[info.dayIndex];
      if (found) {
        return {
          date: info.dateStr,
          note: found.note || '',
          tasks: (found.tasks || []).map((t) => ({
            id: t.id || `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
            title: t.title || '',
            completed: Boolean(t.completed),
            priority: t.priority === 'high' ? ('high' as const) : ('normal' as const),
          })),
        };
      }
      return {
        date: info.dateStr,
        note: '',
        tasks: [],
      };
    });

    const habits = Array.isArray(data.habits) && data.habits.length > 0
      ? data.habits.map((h, i) => ({
          id: h.id || `h-${i}`,
          name: h.name || `Habit ${i + 1}`,
          category: h.category || 'health',
          completed: Array.isArray(h.completed) && h.completed.length === 7
            ? h.completed.map(Boolean)
            : [false, false, false, false, false, false, false],
        }))
      : this.getMasterHabits();

    return {
      weekStart: data.weekStart || weekStart,
      focus: data.focus || '',
      objective: data.objective || '',
      reward: data.reward || '',
      days,
      habits,
      review: {
        wentWell: data.review?.wentWell || '',
        challenges: data.review?.challenges || '',
        achievement: data.review?.achievement || '',
        lesson: data.review?.lesson || '',
        nextWeekPriority: data.review?.nextWeekPriority || '',
      },
      masterTodos: Array.isArray(data.masterTodos) ? data.masterTodos : this.getMasterTodos(),
      longTermGoals: Array.isArray(data.longTermGoals) ? data.longTermGoals : this.getMasterLongGoals(),
      shortTermGoals: Array.isArray(data.shortTermGoals) ? data.shortTermGoals : this.getMasterShortGoals(),
    };
  }
}

export const plannerStorage = new LocalStorageRepository();
