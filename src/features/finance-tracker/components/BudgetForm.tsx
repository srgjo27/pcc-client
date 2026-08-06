import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { budgetSchema } from '../schemas';
import type { BudgetFormPayload } from '../types';

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormPayload) => void;
  isLoading?: boolean;
  defaultValues?: Partial<BudgetFormPayload>;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
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
    formState: { errors },
  } = useForm<BudgetFormPayload>({
    resolver: zodResolver(budgetSchema),
    values: {
      category: defaultValues?.category || 'consumption',
      amount: defaultValues?.amount || 0,
      month: defaultValues?.month || new Date().getMonth() + 1,
      year: defaultValues?.year || new Date().getFullYear(),
    },
  });

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.finance.setBudget}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('month', { valueAsNumber: true })} />
        <input type="hidden" {...register('year', { valueAsNumber: true })} />

        <Select
          label={t.finance.form.categoryLabel}
          error={errors.category?.message}
          options={expenseCategories}
          {...register('category')}
        />

        <Input
          label={t.finance.budgetLimit}
          type="number"
          placeholder="e.g. 1000000"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
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
