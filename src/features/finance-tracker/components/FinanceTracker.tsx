import React, { useState, useMemo } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown, AlertTriangle, Calendar, Search } from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { formatCurrency } from '@/shared/utils/currency';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  useGetTransactions,
  useCreateTransaction,
  useDeleteTransaction,
  useGetBudgets,
  useUpdateBudget,
} from '../hooks';
import { TransactionForm } from './TransactionForm';
import { BudgetForm } from './BudgetForm';
import { TransactionHistoryList } from './TransactionHistoryList';
import type { ExpenseCategory } from '../types';

export const FinanceTracker: React.FC = () => {
  const { t, lang } = useLanguage();
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Queries & Mutations
  const { data: transactions = [], isLoading: isTxLoading } = useGetTransactions();
  const { data: budgets = [] } = useGetBudgets();
  const createTxMutation = useCreateTransaction();
  const deleteTxMutation = useDeleteTransaction();
  const updateBudgetMutation = useUpdateBudget();

  // Determine current month (June 2026 as per seed data)
  const currentMonthStr = '2026-06';

  // Dashboard summary calculation (Overall & Current Month)
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

  // Current Month's expenses grouped by category
  const currentMonthExpensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((tx) => tx.type === 'expense' && tx.date.startsWith(currentMonthStr))
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      });
    return map;
  }, [transactions]);

  // Budget Alerts: Compare current month expenses to active budgets
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

  // Pie Chart Data (Current month expenses)
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

  // Colors for expense categories
  const COLORS: Record<string, string> = {
    food: '#FF6B6B',
    transportation: '#4DABF7',
    subscription: '#BE4BDB',
    education: '#20C997',
    entertainment: '#FAB005',
    others: '#A0AEC0',
  };

  // 6-Month Trend Data (January to June 2026)
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

  // Sort transactions by date descending
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions]);

  // Filter transactions by search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return sortedTransactions;
    const query = searchQuery.toLowerCase().trim();
    return sortedTransactions.filter((tx) => {
      const titleMatch = tx.title.toLowerCase().includes(query);
      const descMatch = tx.description ? tx.description.toLowerCase().includes(query) : false;
      const categoryLabel = t.finance.categories[tx.category] || tx.category;
      const categoryMatch = categoryLabel.toLowerCase().includes(query);
      return titleMatch || descMatch || categoryMatch;
    });
  }, [sortedTransactions, searchQuery, t.finance.categories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const paginatedTransactions = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, activePage]);

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
        <div className="flex gap-3">
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
            variant="custom"
            size="sm"
            className="gap-2 bg-[#26A69A] hover:bg-[#208b81] text-white">
            <Plus className="h-4 w-4" />
            <span>{t.finance.addTransaction}</span>
          </Button>
        </div>
      </div>

      {/* Main summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 bg-linear-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="p-3 bg-emerald-500 rounded-xl text-white">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">{t.finance.totalIncome}</p>
            <h3 className="text-xl font-bold mt-1">{formatCurrency(summary.totalIncome)}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 bg-linear-to-br from-rose-50 to-rose-100/50 border-rose-200">
          <div className="p-3 bg-rose-500 rounded-xl text-white">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">{t.finance.totalExpense}</p>
            <h3 className="text-xl font-bold mt-1">{formatCurrency(summary.totalExpense)}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="p-3 bg-blue-500 rounded-xl text-white">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.finance.netBalance}</p>
            <h3 className={`text-xl font-bold mt-1 ${summary.netBalance <= 0 && 'text-rose-600'}`}>
              {formatCurrency(summary.netBalance)}
            </h3>
          </div>
        </Card>
      </div>

      {/* Budget Alerts section */}
      {budgetAlerts.length > 0 && (
        <Card className="p-5 border-amber-200 bg-amber-50/50 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <span>{t.finance.budgetAlert}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {budgetAlerts.map((alert) => (
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
      )}

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 6-Month Trend Chart */}
        <Card className="p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-sm tracking-tight">{t.finance.incomeTrend}</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tickLine={false} style={{ fontSize: '11px', fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#64748B' }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey={t.finance.totalIncome} stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey={t.finance.totalExpense} stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart Expense Breakdown */}
        <Card className="p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-sm tracking-tight">{t.finance.expenseBreakdown}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{lang === 'id' ? 'Bulan Juni 2026' : 'Month of June 2026'}</p>
          </div>
          {pieChartData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs">
              <span>{lang === 'id' ? 'Belum ada pengeluaran bulan ini' : 'No expenses recorded this month'}</span>
            </div>
          ) : (
            <div className="h-72 w-full flex flex-col justify-center">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((entry) => (
                        <Cell key={`cell-${entry.category}`} fill={COLORS[entry.category] || '#A0AEC0'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 max-h-24 overflow-y-auto pr-1">
                {pieChartData.map((entry) => (
                  <div key={entry.category} className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[entry.category] || '#A0AEC0' }} />
                    <span className="truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Transaction History list */}
      <Card className="p-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm tracking-tight">
            {lang === 'id' ? 'Riwayat Transaksi' : 'Transaction History'}
          </h3>
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder={lang === 'id' ? 'Cari transaksi...' : 'Search transactions...'}
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label={lang === 'id' ? 'Cari transaksi' : 'Search transactions'}
              className="!h-9 !text-xs"
              leftElement={<Search className="h-3 w-3 text-slate-400" />}
            />
          </div>
        </div>
        <TransactionHistoryList
          isTxLoading={isTxLoading}
          transactionsCount={transactions.length}
          filteredTransactions={filteredTransactions}
          paginatedTransactions={paginatedTransactions}
          currentPage={activePage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onDelete={handleDelete}
          lang={lang}
          t={t}
        />
      </Card>

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
