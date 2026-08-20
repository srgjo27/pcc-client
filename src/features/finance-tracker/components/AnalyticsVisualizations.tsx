import React from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { TrendChart, type TrendChartItem } from './TrendChart';
import { ExpenseBreakdownChart, type PieChartItem } from './ExpenseBreakdownChart';

interface AnalyticsVisualizationsProps {
  trendChartData: TrendChartItem[];
  pieChartData: PieChartItem[];
  month: number;
  year: number;
}

export const AnalyticsVisualizations: React.FC<AnalyticsVisualizationsProps> = ({
  trendChartData,
  pieChartData,
  month,
  year,
}) => {
  const { lang } = useLanguage();

  const monthLabel = React.useMemo(() => {
    const d = new Date(year, month - 1, 1);
    const monthName = d.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'long' });
    return lang === 'id' ? `Bulan ${monthName} ${year}` : `Month of ${monthName} ${year}`;
  }, [month, year, lang]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 6-Month Trend Chart */}
      <TrendChart trendChartData={trendChartData} />

      {/* Pie Chart Expense Breakdown */}
      <ExpenseBreakdownChart pieChartData={pieChartData} monthLabel={monthLabel} />
    </div>
  );
};
