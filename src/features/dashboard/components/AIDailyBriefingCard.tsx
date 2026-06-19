import React from 'react';
import { Sparkles, Quote, Lightbulb, TrendingUp, CalendarArrowUp } from 'lucide-react';
import { Card, CardContent } from '../../../shared/components/ui/Card';
import type { AIDailyBriefing } from '../types';

interface AIDailyBriefingCardProps {
  data: AIDailyBriefing;
}

export const AIDailyBriefingCard: React.FC<AIDailyBriefingCardProps> = ({ data }) => {
  return (
    <Card className="overflow-hidden space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#26A69A]/15 to-[#29B6F6]/15 px-6 py-5 border-b border-neutral-300">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#26A69A]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#26A69A]">AI Daily Briefing</span>
        </div>
        <h3 className="text-xl font-extrabold mt-1">{data.greeting}</h3>
        <p className="text-xs font-semibold text-slate-500">{data.date}</p>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Quote Section */}
        <div className="relative p-4 bg-slate-50 rounded-xl border border-neutral-200 italic text-slate-600 text-sm">
          <Quote className="absolute top-2 left-2 h-6 w-6 text-slate-200 z-0 opacity-40" />
          <p className="relative z-10 pl-6 leading-relaxed">
            "{data.quote.text}"
          </p>
          <p className="text-right text-xs font-semibold text-slate-400 mt-2 not-italic">
            — {data.quote.author}
          </p>
        </div>

        {/* Focus Score Gauge */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 bg-[#F0F9FF]/30">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Skor Fokus Hari Ini</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black">{data.focusScore}</span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#26A69A] bg-[#E0F2F1] px-2.5 py-1 rounded-full">
            <TrendingUp className="h-3.5 w-3.5" />
            Sangat Baik
          </div>
        </div>

        {/* Daily Tasks Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-1.5">
            <CalendarArrowUp className="h-4.5 w-4.5 text-blue-500" />
            Agenda & Prioritas Hari Ini
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/20 p-3 rounded-lg border border-blue-50/50">
            {data.focusScore > 80 && (
              <span className="text-xs font-bold text-blue-600 block mb-1">REKOMENDASI AI:</span>
            )}
            {data.tasksSummary}
          </p>
        </div>

        {/* AI Insights & Recommendations */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold flex items-center gap-1.5">
            <Lightbulb className="h-4.5 w-4.5 text-amber-500" />
            AI Insights
          </h4>
          <ul className="space-y-2.5">
            {data.insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-100">
                  {idx + 1}
                </span>
                <span className="leading-normal">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
export default AIDailyBriefingCard;
