import { axiosClient } from '@/services/axiosClient';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/shared/types/api';
import type { AuthResponse, LoginPayload } from '../types';
import { removeSecureItem } from '@/shared/utils/storage';

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await axiosClient.post<ApiResponse<AuthResponse>>(
    ENDPOINTS.AUTH.LOGIN,
    payload
  );
  return response.data.data;
}

export async function registerUser(payload: LoginPayload): Promise<string> {
  const response = await axiosClient.post<ApiResponse<null>>(
    ENDPOINTS.AUTH.REGISTER,
    payload
  );
  return response.data.message;
}

export async function logout() {
  try {
    const response = await axiosClient.post<ApiResponse<null>>(
      ENDPOINTS.AUTH.LOGOUT
    );
    return response.data.message;
  } finally {
    removeSecureItem('access_token');
    removeSecureItem('refresh_token');
  }
}