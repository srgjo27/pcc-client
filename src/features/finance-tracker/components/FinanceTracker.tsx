import React, { useState, useMemo } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Button } from '@/shared/components/ui/Button';
import {
  useGetTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useUpdateBudget,
  useGetDashboard,
  useGetBudgets,
} from '../hooks';
import { TransactionForm } from './TransactionForm';
import { BudgetForm } from './BudgetForm';
import { SummaryCards } from './SummaryCards';
import { BudgetAlerts } from './BudgetAlerts';
import { AnalyticsVisualizations } from './AnalyticsVisualizations';
import { TransactionHistory } from './TransactionHistory';
import { BudgetStatus } from './BudgetStatus';
import type { Transaction } from '../types';

export const FinanceTracker: React.FC = () => {
  const { t } = useLanguage();
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [selectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear] = useState(new Date().getFullYear());

  const { data: transactions = [], isLoading: isTxLoading } = useGetTransactions();
  const { data: dashboardData } = useGetDashboard({ month: selectedMonth, year: selectedYear });
  const { data: budgets = [], isLoading: isBudgetsLoading } = useGetBudgets({ month: selectedMonth, year: selectedYear });
  const createTxMutation = useCreateTransaction();
  const updateTxMutation = useUpdateTransaction();
  const deleteTxMutation = useDeleteTransaction();
  const updateBudgetMutation = useUpdateBudget();

  const budgetsWithSpent = useMemo(() => {
    return budgets.map((b) => {
      const alertItem = (dashboardData?.budgetAlerts || []).find((a) => a.category === b.category);
      const spent = alertItem ? alertItem.spent : 0;
      const percentageSpent = alertItem ? alertItem.percentageSpent : (b.amount > 0 ? (spent / b.amount) * 100 : 0);
      const remaining = alertItem ? alertItem.remaining : b.amount - spent;
      const isExceeded = alertItem ? alertItem.isExceeded : spent > b.amount;
      return {
        ...b,
        spent,
        percentageSpent,
        remaining,
        isExceeded,
      };
    });
  }, [budgets, dashboardData]);

  const summary = useMemo(() => {
    if (dashboardData?.summary) {
      return {
        totalIncome: dashboardData.summary.totalIncome,
        totalExpense: dashboardData.summary.totalExpense,
        netBalance: dashboardData.summary.netBalance,
      };
    }
    return {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
    };
  }, [dashboardData]);

  const budgetAlerts = useMemo(() => {
    return (dashboardData?.budgetAlerts || [])
      .filter((b) => b.isExceeded)
      .map((b) => ({
        category: b.category,
        label: (t.finance.categories as Record<string, string>)[b.category] || b.category,
        spent: b.spent,
        limit: b.budgetLimit,
        exceededBy: b.spent - b.budgetLimit,
      }));
  }, [dashboardData, t]);

  const pieChartData = useMemo(() => {
    return (dashboardData?.expenseBreakdown || []).map((item) => ({
      name: (t.finance.categories as Record<string, string>)[item.category] || item.category,
      value: item.amount,
      category: item.category,
    }));
  }, [dashboardData, t]);

  const trendChartData = useMemo(() => {
    return (dashboardData?.trend || []).map((tItem) => ({
      name: tItem.label,
      [t.finance.totalIncome]: tItem.income,
      [t.finance.totalExpense]: tItem.expense,
    }));
  }, [dashboardData, t]);

  const handleDelete = (id: string) => {
    if (confirm(t.finance.deleteConfirm)) {
      deleteTxMutation.mutate(id);
    }
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
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
            onClick={() => {
              setEditingTransaction(null);
              setIsTxModalOpen(true);
            }}
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
      <AnalyticsVisualizations trendChartData={trendChartData} pieChartData={pieChartData} month={selectedMonth} year={selectedYear} />

      {/* Budget Status Section */}
      <BudgetStatus budgets={budgetsWithSpent} isLoading={isBudgetsLoading} />

      {/* Transaction History list */}
      <TransactionHistory
        transactions={transactions}
        isTxLoading={isTxLoading}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Modals */}
      <TransactionForm
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={(payload) => {
          if (editingTransaction) {
            updateTxMutation.mutate(
              { id: editingTransaction.id, payload },
              {
                onSuccess: () => {
                  setIsTxModalOpen(false);
                  setEditingTransaction(null);
                },
              }
            );
          } else {
            createTxMutation.mutate(payload, {
              onSuccess: () => {
                setIsTxModalOpen(false);
              },
            });
          }
        }}
        isLoading={editingTransaction ? updateTxMutation.isPending : createTxMutation.isPending}
        defaultValues={
          editingTransaction
            ? {
                title: editingTransaction.title,
                type: editingTransaction.type,
                context: editingTransaction.context,
                amount: editingTransaction.amount,
                category: editingTransaction.category,
                date: editingTransaction.date,
                description: editingTransaction.description || undefined,
              }
            : undefined
        }
      />

      <BudgetForm
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSubmit={(payload) => {
          updateBudgetMutation.mutate(payload);
          setIsBudgetModalOpen(false);
        }}
        isLoading={updateBudgetMutation.isPending}
        defaultValues={{ month: selectedMonth, year: selectedYear }}
      />
    </div>
  );
};
