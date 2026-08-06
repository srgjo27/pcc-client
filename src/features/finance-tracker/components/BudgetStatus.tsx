import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { formatCurrency } from '@/shared/utils/currency';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { Budget } from '../types';
import { CATEGORY_COLORS } from '../constants/style';

interface BudgetWithSpent extends Budget {
  spent: number;
  percentageSpent: number;
  remaining: number;
  isExceeded: boolean;
}

interface BudgetStatusProps {
  budgets: BudgetWithSpent[];
  isLoading: boolean;
}

export const BudgetStatus: React.FC<BudgetStatusProps> = ({ budgets, isLoading }) => {
  const { t, lang } = useLanguage();

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4">
        <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 rounded animate-pulse" />
          <div className="h-10 bg-slate-100 rounded animate-pulse" />
        </div>
      </Card>
    );
  }

  if (budgets.length === 0) {
    return (
      <Card className="p-6 text-center text-slate-500 text-xs py-8">
        <span>{lang === 'id' ? 'Belum ada anggaran yang diatur' : 'No budgets set yet'}</span>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="font-bold text-sm tracking-tight">{t.finance.budgetStatus}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget) => {
          const colors = CATEGORY_COLORS[budget.category] || CATEGORY_COLORS.others;
          const displayLabel = (t.finance.categories as Record<string, string>)[budget.category] || budget.category;
          const percentage = Math.min(budget.percentageSpent, 100);

          return (
            <div key={budget.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className={`font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                  {displayLabel}
                </span>
                <span className="text-slate-500 font-medium">
                  {formatCurrency(budget.spent)} / <span className="font-semibold text-slate-700">{formatCurrency(budget.amount)}</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budget.isExceeded ? 'bg-rose-600' : colors.progress
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-medium">
                <span className={budget.isExceeded ? 'text-rose-600' : 'text-slate-400'}>
                  {budget.isExceeded
                    ? `${lang === 'id' ? 'Melebihi batas' : 'Over limit'}`
                    : `${budget.percentageSpent.toFixed(0)}% ${lang === 'id' ? 'terpakai' : 'used'}`}
                </span>
                <span className="text-slate-500">
                  {budget.isExceeded
                    ? `${lang === 'id' ? 'Lebih' : 'Exceeded by'} ${formatCurrency(Math.abs(budget.remaining))}`
                    : `${lang === 'id' ? 'Sisa' : 'Remaining'} ${formatCurrency(budget.remaining)}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
