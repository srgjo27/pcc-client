import React from 'react';
import { useGetDailyOverview } from '../hooks';
import { DashboardGreeting } from './DashboardGreeting';
import { DailyBriefing } from './DailyBriefing';
import { QuickAddBar } from './QuickAddBar';
import { MiniWeeklyCalendar } from './MiniWeeklyCalendar';
import { StreakSnapshot } from './StreakSnapshot';
import { Loading } from '@/shared/components/ui/Loading';

export const Dashboard: React.FC = () => {
  const { data: overview, isLoading, isError } = useGetDailyOverview();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError || !overview) {
    return (
      <div className="space-y-6">
        <DashboardGreeting />
        <QuickAddBar />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-6">
      <DashboardGreeting />
      <QuickAddBar />
      <DailyBriefing briefing={overview.dailyBriefing} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 h-full">
          <MiniWeeklyCalendar events={overview.dailyBriefing.todayEvents.items} />
        </div>
        <div className="lg:col-span-7 h-full">
          <StreakSnapshot data={overview.streakSnapshot} />
        </div>
      </div>
    </div>
  );
};
