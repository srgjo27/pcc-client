import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/shared/components/ui/Card';
import { formatCurrency } from '@/shared/utils/currency';
import { useLanguage } from '@/shared/hooks/useLanguage';

export interface TrendChartItem {
  name: string;
  [key: string]: string | number;
}

interface TrendChartProps {
  trendChartData: TrendChartItem[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ trendChartData }) => {
  const { t } = useLanguage();

  return (
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
            <Tooltip formatter={(value: unknown) => formatCurrency(Number(value as string | number ?? 0))} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Area
              type="monotone"
              dataKey={t.finance.totalIncome}
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorIncome)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey={t.finance.totalExpense}
              stroke="#EF4444"
              fillOpacity={1}
              fill="url(#colorExpense)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
