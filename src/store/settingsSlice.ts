import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Language = 'id' | 'en';

interface SettingsState {
  language: Language;
}

const getInitialLanguage = (): Language => {
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
      const saved = window.localStorage.getItem('pcc_lang');
      if (saved === 'en' || saved === 'id') {
        return saved;
      }
    }
  } catch {
    // safe fallback
  }

  return 'id';
};

const initialState: SettingsState = {
  language: getInitialLanguage(),
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      try {
        if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
          window.localStorage.setItem('pcc_lang', action.payload);
        }
      } catch {
        // safe fallback
      }
    },
  },
});

export const { setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
