import { z } from 'zod';

export const transactionSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  type: z.enum(['income', 'expense'] as const, {
    message: 'Type must be income or expense',
  }),
  amount: z.number().gt(0, { message: 'Amount must be greater than 0' }),
  category: z.string().min(1, { message: 'Category is required' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' }),
  description: z.string().optional(),
});

export const budgetSchema = z.object({
  category: z.string().min(1, { message: 'Category is required' }),
  amount: z.number().min(0, { message: 'Amount must be a positive number' }),
});
