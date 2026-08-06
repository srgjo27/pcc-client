import { z } from 'zod';
import { transactionSchema, budgetSchema } from '../schemas';

export type TransactionType = 'INCOME' | 'EXPENSE';

export type FinanceContext = 'GAJI' | 'USAHA' | 'FREELANCE' | 'INVESTASI' | 'PERSONAL';

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  type: TransactionType;
  context: FinanceContext;
  amount: number;
  category: string;
  date: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface IncomeContextBreakdown {
  context: string;
  amount: number;
  percentage: number;
}

export interface BudgetAlert {
  id: string;
  category: string;
  budgetLimit: number;
  spent: number;
  isExceeded: boolean;
  remaining: number;
  percentageSpent: number;
}

export interface TrendData {
  year: number;
  month: number;
  label: string;
  income: number;
  expense: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  expenseBreakdown: ExpenseBreakdown[];
  incomeContextBreakdown: IncomeContextBreakdown[];
  budgetAlerts: BudgetAlert[];
  trend: TrendData[];
}

export type TransactionFormPayload = z.infer<typeof transactionSchema>;
export type BudgetFormPayload = z.infer<typeof budgetSchema>;
