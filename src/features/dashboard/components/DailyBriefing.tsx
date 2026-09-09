import React from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { formatCurrency } from '@/shared/utils/currency';
import type { DailyBriefingData } from '../types';
import { Card } from '@/shared/components/ui/Card';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Calendar,
  Wallet,
  Activity,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface DailyBriefingProps {
  briefing: DailyBriefingData;
}

export const DailyBriefing: React.FC<DailyBriefingProps> = ({ briefing }) => {
  const { t } = useLanguage();

  const urgentCount = briefing.urgentTasks.total;
  const eventsCount = briefing.todayEvents.total;
  const netBalance = briefing.monthlyBalance.netBalance;
  const uncompletedHabitsCount = briefing.uncompletedHabits.total;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-tight text-slate-800">
          {t.dashboard.briefingTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Urgent Tasks Card */}
        <Link to="/to-do" className="group">
          <Card className="p-4 h-full flex flex-col justify-between hover:border-[#26A69A]/60 hover:shadow-xs transition-all duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 border border-red-100">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">
                    {t.dashboard.urgentTasks}
                  </span>
                  <div className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
                    {urgentCount}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#26A69A] group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-400 mt-3 truncate">
              {urgentCount > 0
                ? briefing.urgentTasks.items[0]?.title
                : t.dashboard.noUrgentTasks}
            </p>
          </Card>
        </Link>

        {/* Today's Events Card */}
        <Link to="/schedule" className="group">
          <Card className="p-4 h-full flex flex-col justify-between hover:border-[#29B6F6]/60 hover:shadow-xs transition-all duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#29B6F6] border border-sky-100">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">
                    {t.dashboard.todayEvents}
                  </span>
                  <div className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
                    {eventsCount}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#29B6F6] group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-400 mt-3 truncate">
              {eventsCount > 0
                ? briefing.todayEvents.items[0]?.title
                : t.dashboard.noTodayEvents}
            </p>
          </Card>
        </Link>

        {/* Monthly Net Balance Card */}
        <Link to="/finance" className="group">
          <Card className="p-4 h-full flex flex-col justify-between hover:border-[#FFB300]/60 hover:shadow-xs transition-all duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-[#FFB300] border border-amber-100">
                  <Wallet className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">
                    {t.dashboard.monthlyBalance}
                  </span>
                  <div
                    className={cn(
                      'text-lg font-bold tracking-tight mt-0.5 truncate max-w-35',
                      netBalance >= 0 ? 'text-slate-900' : 'text-red-500'
                    )}
                  >
                    {formatCurrency(netBalance)}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#FFB300] group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3">
              <span>{t.dashboard.incomeLabel}: {formatCurrency(briefing.monthlyBalance.totalIncome)}</span>
            </div>
          </Card>
        </Link>

        {/* Pending Habits Card */}
        <Link to="/habits" className="group">
          <Card className="p-4 h-full flex flex-col justify-between hover:border-[#26A69A]/60 hover:shadow-xs transition-all duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#26A69A] border border-teal-100">
                  {uncompletedHabitsCount === 0 ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Activity className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">
                    {t.dashboard.uncompletedHabits}
                  </span>
                  <div className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
                    {uncompletedHabitsCount}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#26A69A] group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-400 mt-3 truncate">
              {uncompletedHabitsCount > 0
                ? briefing.uncompletedHabits.items.map((h) => h.name).join(', ')
                : t.dashboard.allHabitsCompleted}
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
};
