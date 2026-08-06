import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction,
  fetchBudgets,
  updateBudget,
} from '../services';
import type { TransactionFormPayload, BudgetFormPayload } from '../types';

export const FINANCE_KEYS = {
  transactions: ['finance', 'transactions'] as const,
  budgets: ['finance', 'budgets'] as const,
};

export const useGetTransactions = () => {
  return useQuery({
    queryKey: FINANCE_KEYS.transactions,
    queryFn: fetchTransactions,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransactionFormPayload) => createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.transactions });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.transactions });
    },
  });
};

export const useGetBudgets = () => {
  return useQuery({
    queryKey: FINANCE_KEYS.budgets,
    queryFn: fetchBudgets,
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BudgetFormPayload) => updateBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.budgets });
    },
  });
};
