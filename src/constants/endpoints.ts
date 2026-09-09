export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  TASK: {
    TASKS: '/tasks',
    CREATE: '/tasks',
    VIEW: '/tasks/{id}',
    REMOVE: '/tasks/{id}',
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
    NOTES: '/notes',
    CREATE: '/notes',
    VIEW: '/notes/{id}',
    UPDATE: '/notes/{id}',
    REMOVE: '/notes/{id}',
  },
  HABIT: {
    HABITS: '/habits',
    CREATE: '/habits',
    UPDATE: '/habits/{id}',
    REMOVE: '/habits/{id}',
    LOGS: '/habits/{id}/logs',
    CHECK_IN: '/habits/{id}/logs',
    CANCEL_CHECK_IN: '/habits/{id}/logs/{date}',
    STREAKS: '/habits/streaks',
  },
  FOCUS: {
    SESSIONS: '/focus/sessions',
    STATS: '/focus/stats',
  },
  DASHBOARD: {
    DAILY_OVERVIEW: '/dashboard',
    QUICK_ADD_TASK: '/dashboard/quick-add/task',
    QUICK_ADD_NOTE: '/dashboard/quick-add/note',
  },
} as const;
