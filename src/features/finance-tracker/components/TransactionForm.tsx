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
  defaultValues?: TransactionFormPayload;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  defaultValues,
}) => {
  const { t, lang } = useLanguage();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<TransactionFormPayload>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      type: 'EXPENSE',
      context: 'PERSONAL',
      amount: 0,
      category: 'consumption',
      date: new Date().toISOString().split('T')[0],
      description: '',
    },
  });

  const transactionType = useWatch({
    control,
    name: 'type',
  });

  const category = useWatch({
    control,
    name: 'category',
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        reset({
          title: defaultValues.title,
          type: defaultValues.type,
          context: defaultValues.context,
          amount: defaultValues.amount,
          category: defaultValues.category,
          date: defaultValues.date,
          description: defaultValues.description || '',
        });
      } else {
        reset({
          title: '',
          type: 'EXPENSE',
          context: 'PERSONAL',
          amount: 0,
          category: 'consumption',
          date: new Date().toISOString().split('T')[0],
          description: '',
        });
      }
    }
  }, [isOpen, defaultValues, reset]);

  useEffect(() => {
    // Only apply category adjustment if we aren't loading initial defaultValues (to prevent resetting category on load)
    if (defaultValues && isOpen) {
      // Skip automatic override if values match defaultValues
      if (transactionType === defaultValues.type && category === defaultValues.category) {
        return;
      }
    }

    if (transactionType === 'INCOME') {
      const isIncomeCategory = ['salary', 'freelance', 'business'].includes(category);
      if (!isIncomeCategory) {
        setValue('category', 'salary');
      }
    } else {
      const isExpenseCategory = [
        'housing',
        'consumption',
        'health',
        'personal',
        'communication',
        'transportation',
        'laundry',
        'investment',
        'familySupport',
        'emergencyFund',
        'others'
      ].includes(category);
      if (!isExpenseCategory) {
        setValue('category', 'consumption');
      }
    }
  }, [transactionType, setValue, category, defaultValues, isOpen]);

  useEffect(() => {
    if (defaultValues && isOpen) {
      if (transactionType === defaultValues.type && category === defaultValues.category && getValues('context') === defaultValues.context) {
        return;
      }
    }

    if (transactionType === 'INCOME') {
      if (category === 'salary') setValue('context', 'GAJI');
      else if (category === 'business') setValue('context', 'USAHA');
      else if (category === 'freelance') setValue('context', 'FREELANCE');
      else setValue('context', 'PERSONAL');
    } else {
      setValue('context', 'PERSONAL');
    }
  }, [transactionType, category, setValue, defaultValues, isOpen, control]);

  const incomeCategories = [
    { value: 'salary', label: t.finance.categories.salary },
    { value: 'freelance', label: t.finance.categories.freelance },
    { value: 'business', label: t.finance.categories.business },
  ];

  const expenseCategories = [
    { value: 'housing', label: t.finance.categories.housing },
    { value: 'consumption', label: t.finance.categories.consumption },
    { value: 'health', label: t.finance.categories.health },
    { value: 'personal', label: t.finance.categories.personal },
    { value: 'communication', label: t.finance.categories.communication },
    { value: 'transportation', label: t.finance.categories.transportation },
    { value: 'laundry', label: t.finance.categories.laundry },
    { value: 'investment', label: t.finance.categories.investment },
    { value: 'familySupport', label: t.finance.categories.familySupport },
    { value: 'emergencyFund', label: t.finance.categories.emergencyFund },
    { value: 'others', label: t.finance.categories.others },
  ];

  const categoryOptions = transactionType === 'INCOME' ? incomeCategories : expenseCategories;

  const handleFormSubmit = (data: TransactionFormPayload) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultValues ? (lang === 'id' ? 'Edit Transaksi' : 'Edit Transaction') : t.finance.addTransaction}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <input type="hidden" {...register('context')} />

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
            <option value="EXPENSE">{t.finance.form.typeLabel === 'Transaction Type' ? 'Expense' : 'Pengeluaran'}</option>
            <option value="INCOME">{t.finance.form.typeLabel === 'Transaction Type' ? 'Income' : 'Pemasukan'}</option>
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
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {lang === 'id' ? 'Batal' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {lang === 'id' ? 'Simpan' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
