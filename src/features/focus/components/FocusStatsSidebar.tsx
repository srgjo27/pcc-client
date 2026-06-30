import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Loading } from '@/shared/components/ui/Loading';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { formatTimeShort } from '@/shared/utils/date';
import type { FocusSession, DailyFocusStats } from '../types';

interface FocusStatsSidebarProps {
  stats?: DailyFocusStats;
  isStatsLoading: boolean;
  sessions?: FocusSession[];
  isSessionsLoading: boolean;
}

export const FocusStatsSidebar: React.FC<FocusStatsSidebarProps> = ({
  stats,
  isStatsLoading,
  sessions,
  isSessionsLoading,
}) => {
  const { t } = useLanguage();

  return (
    <aside className="lg:col-span-4 space-y-6" aria-label="Analisis dan Riwayat Fokus">
      {/* Daily Stats Card */}
      <Card className="overflow-hidden relative">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t.focus.dailyStatsTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {isStatsLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-50/50 border border-teal-100/50 p-3 rounded-lg flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-teal-100 text-[#26A69A]">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">{t.focus.sessionsCompleted}</p>
                  <p className="text-sm font-semibold">{stats?.sessionsCompletedToday}</p>
                </div>
              </div>
              <div className="bg-sky-50/50 border border-sky-100/50 p-3 rounded-lg flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-sky-100 text-sky-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">{t.focus.totalFocusTime}</p>
                  <p className="text-sm font-semibold">
                    {t.focus.minutesVal.replace('{minutes}', String(stats?.totalFocusMinutesToday))}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session History Card */}
      <Card className="max-h-95 flex flex-col">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t.focus.sessionHistoryTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {isSessionsLoading ? (
            <Loading />
          ) : !sessions || sessions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <p>{t.focus.noHistory}</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="flex items-start justify-between gap-3 text-xs border-b border-neutral-100 pb-3"
                >
                  <div className="space-y-1">
                    <p>{sess.taskTitle}</p>
                    <p className="text-[10px] text-slate-400">
                      {t.focus.completedAt}: {formatTimeShort(sess.completedAt)}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-50 border border-teal-100 text-[#26A69A]">
                    +{sess.duration} min
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
};
