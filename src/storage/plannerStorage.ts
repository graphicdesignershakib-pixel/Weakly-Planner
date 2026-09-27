import { PlannerState } from '../types/planner';
import { generateBlankWeek, generateSampleData } from '../data/initialData';
import { getWeekDaysInfo } from '../utils/dateUtils';

const STORAGE_PREFIX = 'weekly_life_planner_v1_';
const LAST_WEEK_KEY = 'weekly_life_planner_last_week';

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

  load(weekStart: string): PlannerState {
    try {
      const key = this.getKey(weekStart);
      const serialized = localStorage.getItem(key);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        // Ensure day alignment in case week days changed or partial state saved
        return this.sanitizeState(parsed, weekStart);
      }
    } catch (e) {
      console.error('Failed to load planner state from localStorage:', e);
    }
    // Return sample data for current week on initial start
    return generateSampleData(weekStart);
  }

  save(state: PlannerState): void {
    try {
      const key = this.getKey(state.weekStart);
      localStorage.setItem(key, JSON.stringify(state));
      this.setLastActiveWeek(state.weekStart);
    } catch (e) {
      console.error('Failed to save planner state to localStorage:', e);
    }
  }

  reset(weekStart: string, useSample: boolean = true): PlannerState {
    const freshState = useSample
      ? generateSampleData(weekStart)
      : generateBlankWeek(weekStart);
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
      return true;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  }

  private sanitizeState(saved: Partial<PlannerState>, weekStart: string): PlannerState {
    const daysInfo = getWeekDaysInfo(weekStart);
    const existingDays = saved.days || [];

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

    const habits = (saved.habits || []).map((h, i) => ({
      id: h.id || `h-${i}`,
      name: h.name || 'Habit',
      completed: Array.isArray(h.completed)
        ? Array.from({ length: 7 }, (_, d) => Boolean(h.completed[d]))
        : [false, false, false, false, false, false, false],
    }));

    return {
      weekStart,
      focus: saved.focus || '',
      objective: saved.objective || '',
      reward: saved.reward || '',
      days,
      habits: habits.length > 0 ? habits : generateBlankWeek(weekStart).habits,
      review: {
        wentWell: saved.review?.wentWell || '',
        challenges: saved.review?.challenges || '',
        achievement: saved.review?.achievement || '',
        lesson: saved.review?.lesson || '',
        nextWeekPriority: saved.review?.nextWeekPriority || '',
      },
    };
  }
}

export const plannerStorage: StorageRepository = new LocalStorageRepository();
