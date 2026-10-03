export interface MealItem {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  title: string;
  time?: string;
  notes?: string;
}

export interface DaySleep {
  bedTime: string; // e.g., "23:30"
  wakeTime: string; // e.g., "07:00"
  totalHours: number; // e.g., 7.5
  quality: 'deep' | 'good' | 'average' | 'poor';
  notes?: string;
}

export interface RoutineTemplate {
  id: string;
  title: string;
  titleEn: string;
  icon: string;
  badge: string;
  description: string;
  descriptionEn: string;
  tasks: Array<{
    title: string;
    titleEn: string;
    time?: string;
    priority?: 'high' | 'normal';
  }>;
}
