import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { formatCurrency } from '@/shared/utils/currency';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { ExpenseCategory } from '../types';

interface BudgetAlertItem {
  category: ExpenseCategory;
  label: string;
  spent: number;
  limit: number;
  exceededBy: number;
}

interface BudgetAlertsProps {
  alerts: BudgetAlertItem[];
}

export const BudgetAlerts: React.FC<BudgetAlertsProps> = ({ alerts }) => {
  const { t } = useLanguage();

  if (alerts.length === 0) return null;

  return (
    <Card className="p-5 border-amber-200 bg-amber-50/50 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
        <span>{t.finance.budgetAlert}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {alerts.map((alert) => (
          <div key={alert.category} className="bg-white p-3 rounded-lg border border-amber-200 text-xs flex justify-between items-center">
            <div>
              <span className="font-semibold">{alert.label}</span>
              <div className="text-slate-500 mt-1">
                {t.finance.budgetLimit}: <span className="font-medium text-slate-700">{formatCurrency(alert.limit)}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-rose-600 mr-1">{formatCurrency(alert.spent)}</span>
              <div className="text-[10px] text-amber-700 font-medium bg-amber-100 px-1.5 py-0.5 rounded-full inline-block">
                +{formatCurrency(alert.exceededBy)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
