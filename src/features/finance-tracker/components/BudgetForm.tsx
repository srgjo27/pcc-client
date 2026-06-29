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
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormPayload>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: defaultValues?.category || 'food',
      amount: defaultValues?.amount || 0,
    },
  });

  const expenseCategories = [
    { value: 'food', label: t.finance.categories.food },
    { value: 'transportation', label: t.finance.categories.transportation },
    { value: 'subscription', label: t.finance.categories.subscription },
    { value: 'education', label: t.finance.categories.education },
    { value: 'entertainment', label: t.finance.categories.entertainment },
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
            {t.todo.cancelButton}
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {t.todo.saveButton}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
