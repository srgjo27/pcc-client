import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AlertCircle, CalendarRange, Clock, TrendingUp, ListChecks } from 'lucide-react';
import { Card, CardContent } from '../../../shared/components/ui/Card';
import type { WeeklyReview } from '../types';

interface WeeklyReviewCardProps {
  data: WeeklyReview;
}

export const WeeklyReviewCard: React.FC<WeeklyReviewCardProps> = ({ data }) => {
  return (
    <Card className="overflow-hidden space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#FFB300]/10 to-[#29B6F6]/10 px-6 py-5 border-b border-neutral-300 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-[#FFB300]" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Weekly Review</span>
          </div>
          <h3 className="text-xl font-extrabold mt-1">Review Produktivitas Mingguan</h3>
        </div>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-1 text-center">
          <span className="block text-[10px] font-bold uppercase text-amber-600">Productivity Score</span>
          <span className="text-lg font-black">{data.productivityScore}%</span>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-neutral-200 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400">Total Jam Fokus</span>
              <span className="text-lg font-bold">{data.focusHours} Jam</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-neutral-200 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400">Tugas Selesai</span>
              <span className="text-lg font-bold">{data.tasksCompleted} Tugas</span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold">Distribusi Fokus & Tugas Harian</h4>
          <div className="h-55 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                <Bar name="Jam Fokus" dataKey="focusHours" fill="#29B6F6" radius={[4, 4, 0, 0]} />
                <Bar name="Tugas Selesai" dataKey="tasksCompleted" fill="#26A69A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Narrative Summary */}
        <p className="text-sm text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-lg border border-neutral-200">
          {data.reviewSummary}
        </p>

        {/* Strengths & Improvements Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Positives */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Poin Positif & Pencapaian
            </h5>
            <ul className="space-y-2">
              {data.positives.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Area Perbaikan / Hambatan
            </h5>
            <ul className="space-y-2">
              {data.improvements.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default WeeklyReviewCard;
