import { axiosClient } from '@/services/axiosClient';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/shared/types/api';
import type {
  FocusTask,
  FocusTimerSettings,
  FocusSession,
  Session,
  DailyFocusStats,
  Stats,
} from '../types';
import type { Task } from '@/features/to-do';

const SETTINGS_KEY = 'pcc_focus_settings';

const DEFAULT_SETTINGS: FocusTimerSettings = {
  focusDuration: 25,
  breakDuration: 5,
};

const getStoredSettings = (): FocusTimerSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (!data) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const focusService = {
  getSettings: async (): Promise<FocusTimerSettings> => {
    return getStoredSettings();
  },

  saveSettings: async (settings: FocusTimerSettings): Promise<FocusTimerSettings> => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  },

  getTasks: async (): Promise<FocusTask[]> => {
    const response = await axiosClient.get<ApiResponse<Task[]>>(ENDPOINTS.TASK.TASKS);
    const backendTasks = response.data.data || [];
    return backendTasks.map((t) => ({
      id: t.id,
      title: t.title,
      completed: t.status === 'DONE',
      createdAt: t.createdAt,
    }));
  },

  getFocusSessions: async (): Promise<FocusSession[]> => {
    const sessionsResponse = await axiosClient.get<ApiResponse<Session[]>>(
      ENDPOINTS.FOCUS.SESSIONS
    );
    const backendSessions = sessionsResponse.data.data || [];

    let tasks: Task[] = [];
    try {
      const tasksResponse = await axiosClient.get<ApiResponse<Task[]>>(ENDPOINTS.TASK.TASKS);
      tasks = tasksResponse.data.data || [];
    } catch (e) {
      console.error('Failed to fetch tasks for mapping titles', e);
    }

    const taskMap = new Map(tasks.map((t) => [t.id, t.title]));

    return backendSessions.map((s): FocusSession => ({
      id: s.id,
      taskId: s.taskId,
      taskTitle: s.taskId ? (taskMap.get(s.taskId) || 'Unknown Task') : 'Tanpa Task',
      duration: s.durationMins,
      completedAt: s.completedAt,
      mode: 'focus',
    }));
  },

  createFocusSession: async (
    sessionInput: Omit<FocusSession, 'id' | 'completedAt'>
  ): Promise<FocusSession> => {
    const settings = getStoredSettings();
    const plannedMins = settings.focusDuration;
    const payload = {
      taskId: sessionInput.taskId || null,
      durationMins: sessionInput.duration,
      plannedMins,
      completedAt: new Date().toISOString(),
      note: '',
    };

    const response = await axiosClient.post<ApiResponse<Session>>(
      ENDPOINTS.FOCUS.SESSIONS,
      payload
    );
    const createdSession = response.data.data;

    if (!createdSession) {
      throw new Error('Failed to create focus session: No data returned');
    }

    let taskTitle = sessionInput.taskTitle;
    if (createdSession.taskId && !taskTitle) {
      try {
        const tasksResponse = await axiosClient.get<ApiResponse<Task[]>>(ENDPOINTS.TASK.TASKS);
        const tasks = tasksResponse.data.data || [];
        const task = tasks.find((t) => t.id === createdSession.taskId);
        if (task) {
          taskTitle = task.title;
        }
      } catch (e) {
        console.error('Failed to fetch tasks for mapping title', e);
      }
    }

    return {
      id: createdSession.id,
      taskId: createdSession.taskId,
      taskTitle: taskTitle || 'Tanpa Task',
      duration: createdSession.durationMins,
      completedAt: createdSession.completedAt,
      mode: 'focus',
    };
  },

  getDailyStats: async (): Promise<DailyFocusStats> => {
    const response = await axiosClient.get<ApiResponse<Stats>>(ENDPOINTS.FOCUS.STATS);
    const data = response.data.data;

    const todayStr = new Date().toLocaleDateString('en-CA');
    const todayStat = data?.dailyStats?.find((s) => s.date === todayStr);

    return {
      sessionsCompletedToday: todayStat?.sessionsCount ?? 0,
      totalFocusMinutesToday: todayStat?.totalDurationMins ?? 0,
    };
  },
};
