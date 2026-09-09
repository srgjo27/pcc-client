import { axiosClient } from '@/services/axiosClient';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/shared/types/api';
import type {
  DailyOverviewResponse,
  QuickAddNotePayload,
} from '../types';
import type { TaskPayload } from '@/features/to-do';

export const dashboardService = {
  getDailyOverview: async (): Promise<DailyOverviewResponse> => {
    const response = await axiosClient.get<ApiResponse<DailyOverviewResponse>>(
      ENDPOINTS.DASHBOARD.DAILY_OVERVIEW
    );
    return response.data.data;
  },

  quickAddTask: async (payload: TaskPayload): Promise<string> => {
    const response = await axiosClient.post<ApiResponse<string>>(
      ENDPOINTS.DASHBOARD.QUICK_ADD_TASK,
      payload
    );
    return response.data.message;
  },

  quickAddNote: async (payload: QuickAddNotePayload): Promise<unknown> => {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      ENDPOINTS.DASHBOARD.QUICK_ADD_NOTE,
      payload
    );
    return response.data.data;
  },
};
