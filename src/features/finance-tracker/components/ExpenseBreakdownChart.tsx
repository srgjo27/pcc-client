import React from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/shared/components/ui/Card';
import { formatCurrency } from '@/shared/utils/currency';
import { useLanguage } from '@/shared/hooks/useLanguage';

export interface PieChartItem {
  name: string;
  value: number;
  category: string;
}

interface ExpenseBreakdownChartProps {
  pieChartData: PieChartItem[];
  monthLabel: string;
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

export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({
  pieChartData,
  monthLabel,
}) => {
  const { t, lang } = useLanguage();

  const coloredPieData = React.useMemo(() => {
    return pieChartData.map((entry) => ({
      ...entry,
      fill: COLORS[entry.category],
    }));
  }, [pieChartData]);

  return (
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
                <Tooltip formatter={(value: unknown) => formatCurrency(Number(value as string | number ?? 0))} />
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
  );
};
