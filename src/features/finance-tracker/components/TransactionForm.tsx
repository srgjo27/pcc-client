import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { Textarea } from '@/shared/components/ui/Textarea';
import { transactionSchema } from '../schemas';
import type { TransactionFormPayload } from '../types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormPayload) => void;
  isLoading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<TransactionFormPayload>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      type: 'expense',
      amount: 0,
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      description: '',
    },
  });

  const transactionType = useWatch({
    control,
    name: 'type',
  });

  // Set default category when transaction type changes
  useEffect(() => {
    if (transactionType === 'income') {
      setValue('category', 'salary');
    } else {
      setValue('category', 'food');
    }
  }, [transactionType, setValue]);

  const incomeCategories = [
    { value: 'salary', label: t.finance.categories.salary },
    { value: 'business', label: t.finance.categories.business },
    { value: 'freelance', label: t.finance.categories.freelance },
  ];

  const expenseCategories = [
    { value: 'food', label: t.finance.categories.food },
    { value: 'transportation', label: t.finance.categories.transportation },
    { value: 'subscription', label: t.finance.categories.subscription },
    { value: 'education', label: t.finance.categories.education },
    { value: 'entertainment', label: t.finance.categories.entertainment },
    { value: 'others', label: t.finance.categories.others },
  ];

  const categoryOptions = transactionType === 'income' ? incomeCategories : expenseCategories;

  const handleFormSubmit = (data: TransactionFormPayload) => {
    onSubmit(data);
    reset({
      title: '',
      type: 'expense',
      amount: 0,
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.finance.addTransaction}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label={t.finance.form.titleLabel}
          placeholder={t.finance.form.titlePlaceholder}
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label={t.finance.form.typeLabel}
            error={errors.type?.message}
            {...register('type')}
          >
            <option value="expense">{t.finance.form.typeLabel === 'Transaction Type' ? 'Expense' : 'Pengeluaran'}</option>
            <option value="income">{t.finance.form.typeLabel === 'Transaction Type' ? 'Income' : 'Pemasukan'}</option>
          </Select>

          <Select
            label={t.finance.form.categoryLabel}
            error={errors.category?.message}
            options={categoryOptions}
            {...register('category')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t.finance.form.amountLabel}
            type="number"
            placeholder={t.finance.form.amountPlaceholder}
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />

          <Input
            label={t.finance.form.dateLabel}
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
        </div>

        <Textarea
          label={t.finance.form.descriptionLabel}
          placeholder={t.finance.form.descriptionPlaceholder}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t.todo.cancelButton || 'Batal'}
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {t.todo.saveButton || 'Simpan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
