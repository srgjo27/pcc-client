import React, { useState, useMemo } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Button } from '@/shared/components/ui/Button';
import {
  useGetTransactions,
  useCreateTransaction,
  useDeleteTransaction,
  useGetBudgets,
  useUpdateBudget,
} from '../hooks';
import { TransactionForm } from './TransactionForm';
import { BudgetForm } from './BudgetForm';
import { SummaryCards } from './SummaryCards';
import { BudgetAlerts } from './BudgetAlerts';
import { AnalyticsVisualizations } from './AnalyticsVisualizations';
import { TransactionHistory } from './TransactionHistory';
import type { ExpenseCategory } from '../types';

export const FinanceTracker: React.FC = () => {
  const { t, lang } = useLanguage();
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Queries & Mutations
  const { data: transactions = [], isLoading: isTxLoading } = useGetTransactions();
  const { data: budgets = [] } = useGetBudgets();
  const createTxMutation = useCreateTransaction();
  const deleteTxMutation = useDeleteTransaction();
  const updateBudgetMutation = useUpdateBudget();

  // Determine current month (June 2026 as per seed data)
  const currentMonthStr = '2026-06';

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    });
    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    };
  }, [transactions]);

  const currentMonthExpensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((tx) => tx.type === 'expense' && tx.date.startsWith(currentMonthStr))
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      });
    return map;
  }, [transactions]);

  const budgetAlerts = useMemo(() => {
    const alerts: Array<{
      category: ExpenseCategory;
      label: string;
      spent: number;
      limit: number;
      exceededBy: number;
    }> = [];

    budgets.forEach((b) => {
      const spent = currentMonthExpensesByCategory[b.category] || 0;
      if (spent > b.amount) {
        alerts.push({
          category: b.category,
          label: t.finance.categories[b.category] || b.category,
          spent,
          limit: b.amount,
          exceededBy: spent - b.amount,
        });
      }
    });

    return alerts;
  }, [budgets, currentMonthExpensesByCategory, t]);

  const pieChartData = useMemo(() => {
    const categoriesList: ExpenseCategory[] = [
      'food',
      'transportation',
      'subscription',
      'education',
      'entertainment',
      'others',
    ];
    return categoriesList
      .map((cat) => ({
        name: t.finance.categories[cat] || cat,
        value: currentMonthExpensesByCategory[cat] || 0,
        category: cat,
      }))
      .filter((item) => item.value > 0);
  }, [currentMonthExpensesByCategory, t]);

  const trendChartData = useMemo(() => {
    const months = [
      { key: '2026-01', label: lang === 'id' ? 'Jan' : 'Jan' },
      { key: '2026-02', label: lang === 'id' ? 'Feb' : 'Feb' },
      { key: '2026-03', label: lang === 'id' ? 'Mar' : 'Mar' },
      { key: '2026-04', label: lang === 'id' ? 'Apr' : 'Apr' },
      { key: '2026-05', label: lang === 'id' ? 'Mei' : 'May' },
      { key: '2026-06', label: lang === 'id' ? 'Jun' : 'Jun' },
    ];

    return months.map((m) => {
      let income = 0;
      let expense = 0;
      transactions
        .filter((tx) => tx.date.startsWith(m.key))
        .forEach((tx) => {
          if (tx.type === 'income') {
            income += tx.amount;
          } else {
            expense += tx.amount;
          }
        });
      return {
        name: m.label,
        [t.finance.totalIncome]: income,
        [t.finance.totalExpense]: expense,
      };
    });
  }, [transactions, lang, t]);



  const handleDelete = (id: string) => {
    if (confirm(t.finance.deleteConfirm)) {
      deleteTxMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">{t.finance.title}</h1>
          <p className="text-slate-500 text-sm">{t.finance.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsBudgetModalOpen(true)}
            size="sm"
            className="gap-2">
            <Calendar className="h-4 w-4 text-[#26A69A]" />
            <span>{t.finance.setBudget}</span>
          </Button>
          <Button
            onClick={() => setIsTxModalOpen(true)}
            size="sm"
            className="gap-2">
            <Plus className="h-4 w-4" />
            <span>{t.finance.addTransaction}</span>
          </Button>
        </div>
      </div>

      {/* Main summary cards */}
      <SummaryCards summary={summary} />

      {/* Budget Alerts section */}
      <BudgetAlerts alerts={budgetAlerts} />

      {/* Analytics Visualization Section */}
      <AnalyticsVisualizations trendChartData={trendChartData} pieChartData={pieChartData} />

      {/* Transaction History list */}
      <TransactionHistory
        transactions={transactions}
        isTxLoading={isTxLoading}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <TransactionForm
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSubmit={(payload) => {
          createTxMutation.mutate(payload);
          setIsTxModalOpen(false);
        }}
        isLoading={createTxMutation.isPending}
      />

      <BudgetForm
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSubmit={(payload) => {
          updateBudgetMutation.mutate(payload);
          setIsBudgetModalOpen(false);
        }}
        isLoading={updateBudgetMutation.isPending}
      />
    </div>
  );
};
