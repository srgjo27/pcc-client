import React from 'react';
import { Zap, CheckCircle2, PieChart, AlarmClock } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { useLanguage } from '@/shared/hooks/useLanguage';

interface HabitStatsCardsProps {
  activeHabitsCount: number;
  bestStreak: number;
  totalCheckIns: number;
  completionRateToday: number;
}

export const HabitStatsCards: React.FC<HabitStatsCardsProps> = ({
  activeHabitsCount,
  bestStreak,
  totalCheckIns,
  completionRateToday,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F9FF] text-[#26A69A]">
          <AlarmClock className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs text-slate-500">{t.habits.activeHabits}</span>
          <h3 className="text-lg font-bold mt-0.5">{activeHabitsCount}</h3>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff9c4] text-[#FBC02D]">
          <Zap className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs text-slate-500">{t.habits.bestStreak}</span>
          <h3 className="text-lg font-bold mt-0.5">{bestStreak} {t.days}</h3>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e0f7fa] text-[#29B6F6]">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs text-slate-500">{t.habits.totalCheckIns}</span>
          <h3 className="text-lg font-bold mt-0.5">{totalCheckIns} {t.times}</h3>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <PieChart className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs text-slate-500">{t.habits.totalCompletion}</span>
          <h3 className="text-lg font-bold mt-0.5">{completionRateToday}%</h3>
        </div>
      </Card>
    </div>
  );
};
