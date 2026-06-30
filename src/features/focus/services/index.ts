import type { FocusTask, FocusTimerSettings, FocusSession, DailyFocusStats } from '../types';

const SETTINGS_KEY = 'pcc_focus_settings';
const TASKS_KEY = 'pcc_focus_tasks';
const SESSIONS_KEY = 'pcc_focus_sessions';

const DEFAULT_SETTINGS: FocusTimerSettings = {
  focusDuration: 25,
  breakDuration: 5,
};

const DEFAULT_TASKS: FocusTask[] = [
  {
    id: 't1',
    title: 'Mengerjakan Tugas Aljabar',
    completed: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't2',
    title: 'Revisi Kodingan PCC Client',
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't3',
    title: 'Membaca Buku Pemrograman',
    completed: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't4',
    title: 'Desain UI Modul Focus',
    completed: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const DEFAULT_SESSIONS: FocusSession[] = [
  {
    id: 's1',
    taskId: 't3',
    taskTitle: 'Membaca Buku Pemrograman',
    duration: 25,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString(),
    mode: 'focus',
  },
  {
    id: 's2',
    taskId: 't4',
    taskTitle: 'Desain UI Modul Focus',
    duration: 25,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000).toISOString(),
    mode: 'focus',
  },
  {
    id: 's3',
    taskId: 't4',
    taskTitle: 'Desain UI Modul Focus',
    duration: 25,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
    mode: 'focus',
  },
  {
    id: 's4',
    taskId: 't2',
    taskTitle: 'Revisi Kodingan PCC Client',
    duration: 25,
    completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    mode: 'focus',
  },
  {
    id: 's5',
    taskId: 't1',
    taskTitle: 'Mengerjakan Tugas Aljabar',
    duration: 25,
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    mode: 'focus',
  },
];

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

const getStoredTasks = (): FocusTask[] => {
  const data = localStorage.getItem(TASKS_KEY);
  if (!data) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(DEFAULT_TASKS));
    return DEFAULT_TASKS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_TASKS;
  }
};

const getStoredSessions = (): FocusSession[] => {
  const data = localStorage.getItem(SESSIONS_KEY);
  if (!data) {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(DEFAULT_SESSIONS));
    return DEFAULT_SESSIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_SESSIONS;
  }
};

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const focusService = {
  getSettings: async (): Promise<FocusTimerSettings> => {
    await delay();
    return getStoredSettings();
  },

  saveSettings: async (settings: FocusTimerSettings): Promise<FocusTimerSettings> => {
    await delay();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  },

  getTasks: async (): Promise<FocusTask[]> => {
    await delay();
    return getStoredTasks();
  },

  createTask: async (title: string): Promise<FocusTask> => {
    await delay();
    const tasks = getStoredTasks();
    const newTask: FocusTask = {
      id: `t_${Date.now()}`,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return newTask;
  },

  getFocusSessions: async (): Promise<FocusSession[]> => {
    await delay();
    const sessions = getStoredSessions();
    return [...sessions].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  },

  createFocusSession: async (
    sessionInput: Omit<FocusSession, 'id' | 'completedAt'>
  ): Promise<FocusSession> => {
    await delay();
    const sessions = getStoredSessions();
    const newSession: FocusSession = {
      ...sessionInput,
      id: `s_${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    sessions.push(newSession);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

    if (sessionInput.taskId && sessionInput.mode === 'focus') {
      const tasks = getStoredTasks();
      const taskIndex = tasks.findIndex((t) => t.id === sessionInput.taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].completed = true;
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      }
    }

    return newSession;
  },

  getDailyStats: async (): Promise<DailyFocusStats> => {
    await delay();
    const sessions = getStoredSessions();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = sessions.filter((s) => {
      const compDate = new Date(s.completedAt);
      return compDate.getTime() >= today.getTime() && s.mode === 'focus';
    });

    const totalMinutes = todaySessions.reduce((acc, curr) => acc + curr.duration, 0);

    return {
      sessionsCompletedToday: todaySessions.length,
      totalFocusMinutesToday: totalMinutes,
    };
  },
};
