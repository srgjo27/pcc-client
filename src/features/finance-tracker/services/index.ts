import { ENDPOINTS } from '@/constants/endpoints';
import { axiosClient } from '@/services/axiosClient';
import type { ApiResponse } from '@/shared/types/api';
import type {
  Transaction,
  Budget,
  TransactionFormPayload,
  BudgetFormPayload,
  DashboardData,
} from '../types';

export async function fetchTransactions(params?: { type?: 'INCOME' | 'EXPENSE'; category?: string; page?: number; limit?: number }) {
  const response = await axiosClient.get<ApiResponse<Transaction[]>>(
    ENDPOINTS.FINANCE.TRANSACTIONS,
    { params }
  );
  return response.data.data;
}

export async function createTransaction(payload: TransactionFormPayload) {
  const response = await axiosClient.post<ApiResponse<Transaction>>(
    ENDPOINTS.FINANCE.CREATE_TRX,
    payload
  );
  return response.data.data;
}

export async function updateTransaction(id: string, payload: Partial<TransactionFormPayload>) {
  const response = await axiosClient.patch<ApiResponse<Transaction>>(
    ENDPOINTS.FINANCE.UPDATE_TRX.replace('{id}', id),
    payload
  );
  return response.data.data;
}

export async function deleteTransaction(id: string) {
  const response = await axiosClient.delete<ApiResponse<null>>(
    ENDPOINTS.FINANCE.REMOVE_TRX.replace('{id}', id)
  );
  return response.data.message;
}

export async function fetchBudgets(params?: { month?: number; year?: number }) {
  const response = await axiosClient.get<ApiResponse<Budget[]>>(
    ENDPOINTS.FINANCE.BUDGETS,
    { params }
  );
  return response.data.data;
}

export async function updateBudget(payload: BudgetFormPayload) {
  const response = await axiosClient.post<ApiResponse<Budget>>(
    ENDPOINTS.FINANCE.UPSERT,
    payload
  );
  return response.data.data;
}

export async function fetchDashboard(params?: { month: number; year: number }) {
  const response = await axiosClient.get<ApiResponse<DashboardData>>(
    ENDPOINTS.FINANCE.DASHBOARD,
    { params }
  );
  return response.data.data;
}
