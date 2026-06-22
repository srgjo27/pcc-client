import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';

/**
 * Global Redux Store.
 * 
 * NOTE: This store is strictly focused on Client State management (e.g., local preferences,
 * sidebar states, active filters, UI states). All server-side data fetching and caching
 * should be managed by TanStack Query.
 */
export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
