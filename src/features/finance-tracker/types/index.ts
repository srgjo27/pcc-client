import { z } from 'zod';
import { transactionSchema, budgetSchema } from '../schemas';

export type TransactionType = 'income' | 'expense';

export type IncomeCategory = 'salary' | 'business' | 'freelance';

export type ExpenseCategory = 'food' | 'transportation' | 'subscription' | 'education' | 'entertainment' | 'others';

export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  title: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date: string; // YYYY-MM-DD
  description?: string;
}

export interface Budget {
  category: ExpenseCategory;
  amount: number;
}

export type TransactionFormPayload = z.infer<typeof transactionSchema>;
export type BudgetFormPayload = z.infer<typeof budgetSchema>;
