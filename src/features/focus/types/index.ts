export interface FocusTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface FocusTimerSettings {
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
}

export interface FocusSession {
  id: string;
  taskId: string | null;
  taskTitle: string | null;
  duration: number; // in minutes
  completedAt: string; // ISO String
  mode: 'focus' | 'break';
}

export interface DailyFocusStats {
  sessionsCompletedToday: number;
  totalFocusMinutesToday: number;
}
