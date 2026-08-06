import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { formatCurrency } from '@/shared/utils/currency';
import { useLanguage } from '@/shared/hooks/useLanguage';

interface SummaryCardsProps {
  summary: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
  };
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 flex items-center gap-4 bg-linear-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
        <div className="p-3 bg-emerald-500 rounded-xl text-white shrink-0">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider truncate">{t.finance.totalIncome}</p>
          <h3 className="text-lg sm:text-xl font-bold mt-1 break-all sm:wrap-break-word">{formatCurrency(summary.totalIncome)}</h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center gap-4 bg-linear-to-br from-rose-50 to-rose-100/50 border-rose-200">
        <div className="p-3 bg-rose-500 rounded-xl text-white shrink-0">
          <TrendingDown className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider truncate">{t.finance.totalExpense}</p>
          <h3 className="text-lg sm:text-xl font-bold mt-1 break-all sm:wrap-break-word">{formatCurrency(summary.totalExpense)}</h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center gap-4 bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-200">
        <div className="p-3 bg-blue-500 rounded-xl text-white shrink-0">
          <Wallet className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider truncate">{t.finance.netBalance}</p>
          <h3 className={`text-lg sm:text-xl font-bold mt-1 break-all sm:wrap-break-word ${summary.netBalance <= 0 ? 'text-rose-600' : ''}`}>
            {formatCurrency(summary.netBalance)}
          </h3>
        </div>
      </Card>
    </div>
  );
};
