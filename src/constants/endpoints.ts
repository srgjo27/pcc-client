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
  }
} as const;
