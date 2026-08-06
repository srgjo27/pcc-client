import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  fetchBudgets,
  updateBudget,
  fetchDashboard,
} from '../services';
import type { TransactionFormPayload, BudgetFormPayload } from '../types';

export const FINANCE_KEYS = {
  all: ['finance'] as const,
  transactions: (params?: any) => ['finance', 'transactions', params] as const,
  budgets: (params?: any) => ['finance', 'budgets', params] as const,
  dashboard: (params?: any) => ['finance', 'dashboard', params] as const,
};

export const useGetTransactions = (params?: { type?: 'INCOME' | 'EXPENSE'; category?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: FINANCE_KEYS.transactions(params),
    queryFn: () => fetchTransactions(params),
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransactionFormPayload) => createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TransactionFormPayload> }) =>
      updateTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
};

export const useGetBudgets = (params?: { month?: number; year?: number }) => {
  return useQuery({
    queryKey: FINANCE_KEYS.budgets(params),
    queryFn: () => fetchBudgets(params),
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BudgetFormPayload) => updateBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
};

export const useGetDashboard = (params?: { month: number; year: number }) => {
  return useQuery({
    queryKey: FINANCE_KEYS.dashboard(params),
    queryFn: () => fetchDashboard(params),
  });
};
