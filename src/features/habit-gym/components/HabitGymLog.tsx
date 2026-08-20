import React, { useState } from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { useGetHabits, useCreateHabit, useCheckInHabit, useDeleteHabit, useGetStreaks, useGetHabitsLogs } from '../hooks';
import type { HabitInput } from '../types';
import { HabitListItem } from './HabitListItem';
import { HabitHeatmap } from './HabitHeatmap';
import { HabitForm } from './HabitForm';
import { HabitStatsCards } from './HabitStatsCards';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { formatToDateLocal } from '@/shared/utils/date';
import { Plus, SportShoe } from 'lucide-react';
import { Loading } from '@/shared/components/ui/Loading';

export const HabitGymLog: React.FC = () => {
  const { t } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: habits = [], isLoading: habitsLoading } = useGetHabits();
  const { data: streaks = [], isLoading: streaksLoading } = useGetStreaks();
  
  const habitIds = habits.map((h) => h.id);
  const logsQueries = useGetHabitsLogs(habitIds);
  const logsLoading = logsQueries.some((q) => q.isLoading);

  const isLoading = habitsLoading || streaksLoading || logsLoading;

  const createHabitMutation = useCreateHabit();
  const checkInMutation = useCheckInHabit();
  const deleteMutation = useDeleteHabit();

  const handleCreateHabit = (data: HabitInput) => {
    createHabitMutation.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  const habitsWithDetails = habits.map((habit, index) => {
    const streakInfo = streaks.find((s) => s.habitId === habit.id);
    const streak = streakInfo ? streakInfo.currentStreak : 0;

    const habitLogs = logsQueries[index]?.data || [];
    const checkInHistory: Record<string, boolean> = {};
    habitLogs.forEach((log) => {
      if (log.completed) {
        const dateStr = log.date.split('T')[0];
        checkInHistory[dateStr] = true;
      }
    });

    return {
      ...habit,
      streak,
      checkInHistory,
    };
  });

  const handleToggleCheckIn = (id: string, dateStr: string) => {
    const habit = habitsWithDetails.find((h) => h.id === id);
    const isChecked = habit ? !!habit.checkInHistory[dateStr] : false;
    checkInMutation.mutate({ id, dateStr, isChecked });
  };

  const handleDeleteHabit = (id: string) => {
    deleteMutation.mutate(id);
  };

  const activeHabitsCount = habitsWithDetails.length;
  const bestStreak = streaks.reduce((max, s) => (s.currentStreak > max ? s.currentStreak : max), 0);
  const totalCheckIns = streaks.reduce((total, s) => total + s.totalCompletions, 0);

  const todayStr = formatToDateLocal(new Date());
  const completedTodayCount = habitsWithDetails.filter((h) => !!h.checkInHistory[todayStr]).length;
  const completionRateToday = activeHabitsCount > 0
    ? Math.round((completedTodayCount / activeHabitsCount) * 100)
    : 0;

  const unifiedHistory: Record<string, boolean> = {};
  habitsWithDetails.forEach((h) => {
    Object.keys(h.checkInHistory).forEach((dateStr) => {
      if (h.checkInHistory[dateStr]) {
        unifiedHistory[dateStr] = true;
      }
    });
  });

  if (isLoading) return <Loading />

  return (
    <div className="flex flex-col gap-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            {t.habits.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t.habits.subtitle}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsFormOpen(true)}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          {t.habits.addHabit}
        </Button>
      </div>

      {/* Statistics Cards */}
      <HabitStatsCards
        activeHabitsCount={activeHabitsCount}
        bestStreak={bestStreak}
        totalCheckIns={totalCheckIns}
        completionRateToday={completionRateToday}
      />

      {/* Heatmap Section */}
      <HabitHeatmap checkInHistory={unifiedHistory} />

      {/* Main Habits List */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
          {t.habits.myHabbits}
        </h2>

        {habits.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center !border-dashed">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-[#26A69A] mb-3">
              <SportShoe className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">{t.habits.emptyHabits}</h3>
            <p className="text-sm text-slate-400 max-w-sm mt-1">{t.habits.emptyHabitsDesc}</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {habitsWithDetails.map((habit) => (
              <HabitListItem
                key={habit.id}
                habit={habit}
                onToggleCheckIn={handleToggleCheckIn}
                onDelete={handleDeleteHabit}
                isCheckingIn={checkInMutation.isPending && checkInMutation.variables?.id === habit.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <HabitForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateHabit}
        isLoading={createHabitMutation.isPending}
      />
    </div>
  );
};
