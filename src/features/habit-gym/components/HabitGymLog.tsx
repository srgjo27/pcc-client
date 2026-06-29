import React, { useState } from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { useGetHabits, useCreateHabit, useCheckInHabit, useDeleteHabit } from '../hooks';
import type { HabitInput } from '../types';
import { HabitListItem } from './HabitListItem';
import { HabitHeatmap } from './HabitHeatmap';
import { HabitForm } from './HabitForm';
import { HabitStatsCards } from './HabitStatsCards';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { getLocalDateString } from '../services';
import { Plus, SportShoe } from 'lucide-react';
import { Loading } from '@/shared/components/ui/Loading';

export const HabitGymLog: React.FC = () => {
  const { t } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Queries & Mutations
  const { data: habits = [], isLoading } = useGetHabits();
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

  const handleToggleCheckIn = (id: string, dateStr: string) => {
    checkInMutation.mutate({ id, dateStr });
  };

  const handleDeleteHabit = (id: string) => {
    deleteMutation.mutate(id);
  };

  const activeHabitsCount = habits.length;
  const bestStreak = habits.reduce((max, h) => (h.streak > max ? h.streak : max), 0);

  const totalCheckIns = habits.reduce(
    (total, h) => total + Object.values(h.checkInHistory).filter(Boolean).length,
    0
  );

  const todayStr = getLocalDateString();
  const completedTodayCount = habits.filter((h) => !!h.checkInHistory[todayStr]).length;
  const completionRateToday = activeHabitsCount > 0
    ? Math.round((completedTodayCount / activeHabitsCount) * 100)
    : 0;

  const unifiedHistory: Record<string, boolean> = {};
  habits.forEach((h) => {
    Object.keys(h.checkInHistory).forEach((dateStr) => {
      if (h.checkInHistory[dateStr]) {
        unifiedHistory[dateStr] = true;
      }
    });
  });

  if (isLoading) return <Loading />

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Actions */}
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
            {habits.map((habit) => (
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
