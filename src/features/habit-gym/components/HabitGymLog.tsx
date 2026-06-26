import React, { useState } from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { useGetHabits, useCreateHabit, useCheckInHabit, useDeleteHabit } from '../hooks';
import type { HabitInput } from '../types';
import { HabitListItem } from './HabitListItem';
import { HabitHeatmap } from './HabitHeatmap';
import { HabitForm } from './HabitForm';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { getLocalDateString } from '../services';
import { Activity, CheckCircle2, PieChart, Plus, SportShoe, Zap } from 'lucide-react';
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

  // Compute Overall Stats
  const activeHabitsCount = habits.length;
  const bestStreak = habits.reduce((max, h) => (h.streak > max ? h.streak : max), 0);

  // Total check-ins ever
  const totalCheckIns = habits.reduce(
    (total, h) => total + Object.values(h.checkInHistory).filter(Boolean).length,
    0
  );

  // Calculate completion percentage for today
  const todayStr = getLocalDateString();
  const completedTodayCount = habits.filter((h) => !!h.checkInHistory[todayStr]).length;
  const completionRateToday = activeHabitsCount > 0
    ? Math.round((completedTodayCount / activeHabitsCount) * 100)
    : 0;

  // Flatten check-in history to build a unified heatmap
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F9FF] text-[#26A69A]">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500">{t.habits.activeHabits}</span>
            <h3 className="text-lg font-bold mt-0.5">{activeHabitsCount}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF9C4] text-[#FFB300]">
            <Zap className="h-6 w-6 fill-[#FFB300]" />
          </div>
          <div>
            <span className="text-xs text-slate-500">{t.habits.bestStreak}</span>
            <h3 className="text-lg font-bold mt-0.5">{bestStreak} {t.days}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
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

      {/* Heatmap Section */}
      <HabitHeatmap checkInHistory={unifiedHistory} />

      {/* Main Habits List */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
          {t.habits.myHabbits}
        </h2>

        {habits.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center !border-dashed border border-neutral-300">
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

      {/* Form Dialog Modal */}
      <HabitForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateHabit}
        isLoading={createHabitMutation.isPending}
      />
    </div>
  );
};
