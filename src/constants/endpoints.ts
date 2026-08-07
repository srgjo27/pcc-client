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
} as const;
