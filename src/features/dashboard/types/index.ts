import type { Task } from '@/features/to-do/types';
import type { Event } from '@/features/unified-schedule/types';

export interface TodayInfo {
  date: string;
  timezone: string;
  dayOfWeek: number;
}

export interface MonthlyBalance {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface HabitSnapshotItem {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  frequency: 'DAILY' | 'WEEKLY';
  targetDays: number[];
  isScheduledToday: boolean;
  isCompletedToday: boolean;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
}

export interface StreakSummary {
  totalActiveHabits: number;
  scheduledTodayCount: number;
  completedTodayCount: number;
  uncompletedTodayCount: number;
  bestCurrentStreak: number;
}

export interface StreakSnapshotData {
  habits: HabitSnapshotItem[];
  summary: StreakSummary;
}

export interface DailyBriefingData {
  urgentTasks: {
    total: number;
    items: Task[];
  };
  todayEvents: {
    total: number;
    items: Event[];
  };
  monthlyBalance: MonthlyBalance;
  uncompletedHabits: {
    total: number;
    items: HabitSnapshotItem[];
  };
}

export interface DailyOverviewResponse {
  today: TodayInfo;
  dailyBriefing: DailyBriefingData;
  streakSnapshot: StreakSnapshotData;
}

export interface QuickAddNotePayload {
  title: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
  taskIds?: string[];
}
