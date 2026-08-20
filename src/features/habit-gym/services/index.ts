import { ENDPOINTS } from '@/constants/endpoints';
import { axiosClient } from '@/services/axiosClient';
import type { ApiResponse } from '@/shared/types/api';
import type { Habit, HabitInput, BackendStreak, BackendHabitLog } from '../types';

export const habitGymService = {
  getHabits: async (): Promise<Habit[]> => {
    const habitsRes = await axiosClient.get<ApiResponse<Habit[]>>(ENDPOINTS.HABIT.HABITS);
    const apiHabits = habitsRes.data.data || [];

    if (apiHabits.length === 0) {
      return [];
    }

    const mappedHabits = apiHabits.map((habit) => {
      return {
        id: habit.id,
        name: habit.name,
        createdAt: new Date(habit.createdAt),
        updatedAt: new Date(habit.updatedAt),
        userId: habit.userId,
        icon: habit.icon,
        frequency: habit.frequency,
        targetDays: habit.targetDays || [],
        color: habit.color,
        isActive: habit.isActive,
      };
    });

    return mappedHabits;
  },

  createHabit: async (input: HabitInput): Promise<Habit> => {
    const backendFrequency = input.frequency === 'daily' ? 'DAILY' : 'WEEKLY';
    const backendTargetDays = input.frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : input.frequencyDays;

    const payload = {
      name: input.name,
      icon: input.icon,
      frequency: backendFrequency,
      targetDays: backendTargetDays,
      color: '#26A69A',
    };

    const response = await axiosClient.post<ApiResponse<Habit>>(ENDPOINTS.HABIT.CREATE, payload);
    const habit = response.data.data;

    return {
      id: habit.id,
      name: habit.name,
      createdAt: new Date(habit.createdAt),
      updatedAt: new Date(habit.updatedAt),
      userId: habit.userId,
      icon: habit.icon,
      frequency: habit.frequency,
      targetDays: habit.targetDays || [],
      color: habit.color,
      isActive: habit.isActive,
    };
  },

  toggleCheckIn: async (id: string, dateStr: string, isChecked: boolean): Promise<unknown> => {
    if (isChecked) {
      const url = ENDPOINTS.HABIT.CANCEL_CHECK_IN.replace('{id}', id).replace('{date}', dateStr);
      const response = await axiosClient.delete<ApiResponse<unknown>>(url);
      return response.data;
    } else {
      const url = ENDPOINTS.HABIT.CHECK_IN.replace('{id}', id);
      const response = await axiosClient.post<ApiResponse<unknown>>(url, { date: dateStr });
      return response.data;
    }
  },

  deleteHabit: async (id: string): Promise<string> => {
    const url = ENDPOINTS.HABIT.REMOVE.replace('{id}', id);
    await axiosClient.delete<ApiResponse<unknown>>(url);
    return id;
  },

  getStreaks: async (): Promise<BackendStreak[]> => {
    const response = await axiosClient.get<ApiResponse<BackendStreak[]>>(ENDPOINTS.HABIT.STREAKS);
    return response.data.data || [];
  },

  getHabitLogs: async (id: string): Promise<BackendHabitLog[]> => {
    const url = ENDPOINTS.HABIT.LOGS.replace('{id}', id);
    const response = await axiosClient.get<ApiResponse<BackendHabitLog[]>>(url);
    return response.data.data || [];
  },
};
