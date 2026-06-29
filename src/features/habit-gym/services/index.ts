import type { Habit, HabitInput } from '../types';

const LOCAL_STORAGE_KEY = 'pcc_habits_log';

// Helper to format date as YYYY-MM-DD local time
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to subtract days
export const subtractDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

// Calculate current streak
export const calculateStreak = (habit: Habit): number => {
  const history = habit.checkInHistory;
  const todayStr = getLocalDateString();
  // If there are no check-ins at all
  const hasCheckIns = Object.values(history).some(v => v);
  if (!hasCheckIns) return 0;

  let streak = 0;
  let currentDate = new Date();

  // Walk backwards up to 365 days
  for (let i = 0; i < 365; i++) {
    const dateStr = getLocalDateString(currentDate);
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const isTargetDay = habit.frequency === 'daily' || habit.frequencyDays.includes(dayOfWeek);
    const isToday = dateStr === todayStr;

    if (isTargetDay) {
      if (history[dateStr]) {
        streak++;
      } else {
        // If it's today and not checked in yet, the streak is still active from yesterday
        if (isToday) {
          // Just skip today, don't break the streak yet
        } else {
          // A target day was missed
          break;
        }
      }
    }
    
    currentDate = subtractDays(currentDate, 1);
  }

  return streak;
};

// Default initial habits
const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Gym / Olahraga',
    icon: 'Dumbbell',
    frequency: 'custom',
    frequencyDays: [1, 3, 5], // Mon, Wed, Fri
    streak: 3,
    lastCheckIn: getLocalDateString(subtractDays(new Date(), 1)),
    checkInHistory: {
      [getLocalDateString(subtractDays(new Date(), 1))]: true,
      [getLocalDateString(subtractDays(new Date(), 3))]: true,
      [getLocalDateString(subtractDays(new Date(), 5))]: true,
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Baca Buku 30 Menit',
    icon: 'BookOpen',
    frequency: 'daily',
    frequencyDays: [],
    streak: 5,
    lastCheckIn: getLocalDateString(subtractDays(new Date(), 1)),
    checkInHistory: {
      [getLocalDateString(subtractDays(new Date(), 1))]: true,
      [getLocalDateString(subtractDays(new Date(), 2))]: true,
      [getLocalDateString(subtractDays(new Date(), 3))]: true,
      [getLocalDateString(subtractDays(new Date(), 4))]: true,
      [getLocalDateString(subtractDays(new Date(), 5))]: true,
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Tidur Sebelum Jam 12 Malam',
    icon: 'Moon',
    frequency: 'daily',
    frequencyDays: [],
    streak: 0,
    lastCheckIn: null,
    checkInHistory: {},
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'Minum Air 8 Gelas',
    icon: 'Droplet',
    frequency: 'daily',
    frequencyDays: [],
    streak: 1,
    lastCheckIn: getLocalDateString(),
    checkInHistory: {
      [getLocalDateString()]: true,
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const getStoredHabits = (): Habit[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_HABITS));
    return INITIAL_HABITS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_HABITS;
  }
};

const saveStoredHabits = (habits: Habit[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(habits));
};

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const habitGymService = {
  getHabits: async (): Promise<Habit[]> => {
    await delay();
    return getStoredHabits();
  },

  createHabit: async (input: HabitInput): Promise<Habit> => {
    await delay();
    const habits = getStoredHabits();
    const newHabit: Habit = {
      id: String(Date.now()),
      name: input.name,
      icon: input.icon,
      frequency: input.frequency,
      frequencyDays: input.frequencyDays,
      streak: 0,
      lastCheckIn: null,
      checkInHistory: {},
      createdAt: new Date().toISOString(),
    };
    habits.push(newHabit);
    saveStoredHabits(habits);
    return newHabit;
  },

  toggleCheckIn: async (id: string, dateStr: string): Promise<Habit> => {
    await delay();
    const habits = getStoredHabits();
    const habitIndex = habits.findIndex(h => h.id === id);
    if (habitIndex === -1) throw new Error('Habit not found');

    const habit = habits[habitIndex];
    const isChecked = !!habit.checkInHistory[dateStr];
    
    // Toggle the date
    if (isChecked) {
      delete habit.checkInHistory[dateStr];
    } else {
      habit.checkInHistory[dateStr] = true;
    }

    // Update lastCheckIn field
    const checkedDates = Object.keys(habit.checkInHistory).filter(d => habit.checkInHistory[d]);
    if (checkedDates.length > 0) {
      // Sort descending to get the most recent date
      checkedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      habit.lastCheckIn = checkedDates[0];
    } else {
      habit.lastCheckIn = null;
    }

    // Recalculate streak
    habit.streak = calculateStreak(habit);

    habits[habitIndex] = habit;
    saveStoredHabits(habits);
    return habit;
  },

  deleteHabit: async (id: string): Promise<string> => {
    await delay();
    const habits = getStoredHabits();
    const updated = habits.filter(h => h.id !== id);
    saveStoredHabits(updated);
    return id;
  }
};
