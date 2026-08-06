import React from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Card } from '@/shared/components/ui/Card';
import { formatCurrency } from '@/shared/utils/currency';
import { useLanguage } from '@/shared/hooks/useLanguage';

interface TrendChartItem {
  name: string;
  [key: string]: string | number;
}

interface PieChartItem {
  name: string;
  value: number;
  category: string;
}

interface AnalyticsVisualizationsProps {
  trendChartData: TrendChartItem[];
  pieChartData: PieChartItem[];
  month: number;
  year: number;
}

const RADIAN = Math.PI / 180;

interface CustomizedLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

const renderCustomizedLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (!percent || percent < 0.01) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px] font-bold fill-white animate-fade-in"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const COLORS: Record<string, string> = {
  housing: '#F59E0B',
  consumption: '#EF4444',
  health: '#10B981',
  personal: '#8B5CF6',
  communication: '#06B6D4',
  transportation: '#3B82F6',
  laundry: '#0EA5E9',
  investment: '#14B8A6',
  familySupport: '#D946EF',
  emergencyFund: '#6366F1',
  others: '#64748B',
};

export const AnalyticsVisualizations: React.FC<AnalyticsVisualizationsProps> = ({
  trendChartData,
  pieChartData,
  month,
  year,
}) => {
  const { t, lang } = useLanguage();

  const monthLabel = React.useMemo(() => {
    const d = new Date(year, month - 1, 1);
    const monthName = d.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'long' });
    return lang === 'id' ? `Bulan ${monthName} ${year}` : `Month of ${monthName} ${year}`;
  }, [month, year, lang]);

  const coloredPieData = React.useMemo(() => {
    return pieChartData.map((entry) => ({
      ...entry,
      fill: COLORS[entry.category],
    }));
  }, [pieChartData]);

  return (
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
              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
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
          <p className="text-xs text-slate-400 mt-0.5">{monthLabel}</p>
        </div>
        {pieChartData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
            <span>{lang === 'id' ? 'Belum ada pengeluaran bulan ini' : 'No expenses recorded this month'}</span>
          </div>
        ) : (
          <div className="h-72 w-full flex flex-col justify-center">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={coloredPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  />
                  <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 max-h-24 overflow-y-auto pr-1">
              {pieChartData.map((entry) => (
                <div key={entry.category} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[entry.category] }} />
                  <span className="truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
