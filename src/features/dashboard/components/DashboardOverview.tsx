import React from 'react';
import { Frown, RefreshCw } from 'lucide-react';
import { useDashboard } from '../hooks';
import { AIDailyBriefingCard } from './AIDailyBriefingCard';
import { WeeklyReviewCard } from './WeeklyReviewCard';
import { Button } from '../../../shared/components/ui/Button';

export const DashboardOverview: React.FC = () => {
  const { data, isLoading, error, refetch } = useDashboard();

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-pulse">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-md"></div>
            <div className="h-4 w-72 bg-slate-200 rounded-md"></div>
          </div>
        </div>

        {/* Dashboard Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Daily Briefing Skeleton */}
          <div className="h-120 bg-slate-100 rounded-xl border border-neutral-300 animate-pulse p-6 space-y-6">
            <div className="h-6 w-36 bg-slate-200 rounded"></div>
            <div className="h-12 w-full bg-slate-200 rounded-lg"></div>
            <div className="h-16 w-full bg-slate-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="h-20 w-full bg-slate-200 rounded-lg"></div>
            </div>
          </div>

          {/* Weekly Review Skeleton */}
          <div className="h-120 bg-slate-100 rounded-xl border border-neutral-300 animate-pulse p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-6 w-36 bg-slate-200 rounded"></div>
              <div className="h-8 w-16 bg-slate-200 rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-slate-200 rounded-lg"></div>
              <div className="h-16 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="h-48 w-full bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 p-6 text-center rounded-xl border border-neutral-300">
        <div className="p-3 bg-red-50 text-red-600 rounded-full mb-4">
          <Frown className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold">Gagal Memuat Data Dashboard</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-2 mb-6">
          {error?.message || 'Terjadi kesalahan saat memproses data dashboard Anda.'}
        </p>
        <Button
          onClick={handleRefresh}
          className="!bg-[#26A69A] hover:!bg-[#26A69A]/90 !text-white gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl gap-2">
            Dashboard PCC
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau ringkasan produktivitas harian Anda dan analisis perkembangan aktivitas mingguan.
          </p>
        </div>
      </div>

      {/* Main Grid: AI Daily Briefing and Weekly Review */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AIDailyBriefingCard data={data.dailyBriefing} />
        <WeeklyReviewCard data={data.weeklyReview} />
      </div>
    </div>
  );
};
