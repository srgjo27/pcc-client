export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  TASK: {
    TASKS: '/task/tasks',
    CREATE: '/task/tasks',
    VIEW: '/task/tasks/{id}',
    REMOVE: '/task/tasks/{id}',
  },
  EVENT: {
    EVENTS: '/schedule',
    CREATE: '/schedule',
    VIEW: '/schedule/{id}',
    REMOVE: '/schedule/{id}',
    UPDATE: '/schedule/{id}',
  },
  FINANCE: {
    TRANSACTIONS: '/finance/transactions',
    CREATE_TRX: '/finance/transactions',
    UPDATE_TRX: '/finance/transactions/{id}',
    REMOVE_TRX: '/finance/transactions/{id}',

    BUDGETS: '/finance/budgets',
    UPSERT: '/finance/budgets',

    DASHBOARD: '/finance/dashboard',
  },
  NOTE: {
    NOTES: '/notes/notes',
    CREATE: '/notes/notes',
    VIEW: '/notes/notes/{id}',
    UPDATE: '/notes/notes/{id}',
    REMOVE: '/notes/notes/{id}',
  },
  HABIT: {
    HABITS: '/habits/habits',
    CREATE: '/habits/habits',
    UPDATE: '/habits/habits/{id}',
    REMOVE: '/habits/habits/{id}',
    LOGS: '/habits/habits/{id}/logs',
    CHECK_IN: '/habits/habits/{id}/logs',
    CANCEL_CHECK_IN: '/habits/habits/{id}/logs/{date}',
    STREAKS: '/habits/habits/streaks',
  },
  FOCUS: {
    SESSIONS: '/focus/sessions',
    STATS: '/focus/stats',
  },
} as const;
