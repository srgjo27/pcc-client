import { z } from 'zod';

export const transactionSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  type: z.enum(['INCOME', 'EXPENSE'] as const, {
    message: 'Type must be INCOME or EXPENSE',
  }),
  context: z.enum(['GAJI', 'USAHA', 'FREELANCE', 'INVESTASI', 'PERSONAL'] as const, {
    message: 'Invalid context',
  }),
  amount: z.number().gt(0, { message: 'Amount must be greater than 0' }),
  category: z.string().min(1, { message: 'Category is required' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' }),
  description: z.string().optional(),
});

export const budgetSchema = z.object({
  category: z.string().min(1, { message: 'Category is required' }),
  amount: z.number().min(0, { message: 'Amount must be a positive number' }),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
});
