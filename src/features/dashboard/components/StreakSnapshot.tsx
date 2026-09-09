import React from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { useCheckInHabit } from '@/features/habit-gym/hooks';
import type { StreakSnapshotData } from '../types';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Link } from 'react-router-dom';
import { Zap, Check, Flame, ChevronRight, Trophy, Dumbbell, Braces, Bed, GlassWater, Book } from 'lucide-react';
import { formatToDateLocal } from '@/shared/utils/date';
import { cn } from '@/shared/utils/cn';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Dumbbell,
  Braces,
  Bed,
  GlassWater,
  Book,
};

interface StreakSnapshotProps {
  data: StreakSnapshotData;
}

export const StreakSnapshot: React.FC<StreakSnapshotProps> = ({ data }) => {
  const { t, lang } = useLanguage();
  const todayStr = formatToDateLocal(new Date());
  const { mutateAsync: checkInHabit, isPending } = useCheckInHabit();

  const handleToggle = async (habitId: string, isCompleted: boolean) => {
    await checkInHabit({
      id: habitId,
      dateStr: todayStr,
      isChecked: isCompleted,
    });
  };

  const { summary, habits } = data;

  return (
    <Card className="p-4 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFB300]/15 text-[#FFB300]">
              <Flame className="h-4 w-4 fill-[#FFB300]" />
            </div>
            <h3 className="text-xs font-bold tracking-tight text-slate-800">
              {t.dashboard.streakSnapshotTitle}
            </h3>
          </div>
          <Link
            to="/habits"
            className="text-[11px] font-semibold text-[#26A69A] hover:underline flex items-center gap-0.5"
          >
            {t.dashboard.viewAll}
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-2 rounded-xl bg-slate-50 border border-neutral-200 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              {t.dashboard.bestStreakLabel}
            </span>
            <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
              <Zap className="h-3.5 w-3.5 fill-[#FFB300] text-[#FFB300]" />
              {summary.bestCurrentStreak} {t.days}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-neutral-200 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              {t.dashboard.activeHabitsLabel}
            </span>
            <span className="text-sm font-bold text-slate-800 block mt-0.5">
              {summary.totalActiveHabits}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-neutral-200 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              {t.dashboard.todayCompletedLabel}
            </span>
            <span className="text-sm font-bold text-[#26A69A] block mt-0.5">
              {summary.completedTodayCount}/{summary.scheduledTodayCount}
            </span>
          </div>
        </div>

        {/* Habit List Snapshot */}
        <div className="space-y-2">
          {habits.slice(0, 4).map((habit) => {
            const IconComponent = (habit.icon ? iconMap[habit.icon] : null) || Trophy;

            return (
              <div
                key={habit.id}
                className={cn(
                  'flex items-center justify-between p-2.5 rounded-xl border transition-all',
                  habit.isCompletedToday
                    ? 'bg-teal-50/40 border-teal-200'
                    : 'bg-white border-neutral-200 hover:bg-slate-50'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs',
                      habit.isCompletedToday
                        ? 'bg-[#26A69A] text-white border-[#26A69A]'
                        : 'bg-slate-50 text-slate-500 border-neutral-200'
                    )}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 truncate">
                      {habit.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <Zap className="h-2.5 w-2.5 fill-[#FFB300] text-[#FFB300]" />
                      {habit.currentStreak} {t.days}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={habit.isCompletedToday ? 'primary' : 'outline'}
                  disabled={isPending}
                  onClick={() => handleToggle(habit.id, habit.isCompletedToday)}
                  className="h-7 text-xs px-2.5 gap-1 shrink-0"
                >
                  {habit.isCompletedToday ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>{t.dashboard.completedAction}</span>
                    </>
                  ) : (
                    <span>{t.dashboard.checkInAction}</span>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {habits.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-4">
          {lang === 'id' ? 'Belum ada rutinitas yang dibuat' : 'No habits created yet'}
        </p>
      )}
    </Card>
  );
};
