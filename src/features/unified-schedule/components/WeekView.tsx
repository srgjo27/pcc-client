import React from 'react';
import { startOfWeek, addDays, isSameDay, format } from 'date-fns';
import { AlertCircle, CalendarRange } from 'lucide-react';
import type { ScheduleEvent, ScheduleEventOccurrence } from '../types';
import { cn } from '@/shared/utils/cn';
import { useLanguage } from '@/shared/hooks/useLanguage';

interface WeekViewProps {
  currentDate: Date;
  occurrences: ScheduleEventOccurrence[];
  conflicts: Record<string, boolean>;
  onEventClick: (event: ScheduleEvent) => void;
  activeContexts: string[];
}

const contextBadgeStyles = {
  college: 'bg-teal-100 text-teal-800 border-teal-200',
  work: 'bg-blue-100 text-blue-800 border-blue-200',
  business: 'bg-amber-100 text-amber-800 border-amber-200',
  personal: 'bg-purple-100 text-purple-800 border-purple-200',
};

const borderStyles = {
  college: 'border-l-4 border-l-teal-500',
  work: 'border-l-4 border-l-blue-500',
  business: 'border-l-4 border-l-amber-500',
  personal: 'border-l-4 border-l-purple-500',
};

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  occurrences,
  conflicts,
  onEventClick,
  activeContexts,
}) => {
  const { t } = useLanguage();

  const weekStart = startOfWeek(currentDate);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(weekStart, i));
  }

  return (
    <div className="space-y-4">
      {days.map((date) => {
        const isToday = isSameDay(date, new Date());
        const dayOccurrences = occurrences.filter((occ) => {
          const occDate = new Date(occ.actualStartDate);
          return isSameDay(occDate, date) && activeContexts.includes(occ.context);
        });

        return (
          <div
            key={date.toISOString()}
            className={cn(
              'p-4 rounded-xl border bg-white transition-all duration-200',
              isToday ? 'border-[#26A69A] ring-1 ring-[#26A69A]/20' : 'border-neutral-300'
            )}
          >
            {/* Day Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-3">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-sm font-bold',
                  isToday && 'text-[#26A69A]'
                )}>
                  {format(date, 'EEEE')}
                </span>
                <span className="text-xs text-slate-500">
                  {format(date, 'dd MMM yyyy')}
                </span>
              </div>
              {isToday && (
                <span className="text-[10px] font-bold bg-[#26A69A]/10 text-[#26A69A] border border-[#26A69A]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {t.schedule.today}
                </span>
              )}
            </div>

            {/* Day Events */}
            {dayOccurrences.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 font-medium">
                {t.schedule.weekView.noEvents}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dayOccurrences.map((occ) => {
                  const hasConflict = conflicts[occ.occurrenceId];
                  const startTime = format(new Date(occ.actualStartDate), 'HH:mm');
                  const endTime = format(new Date(occ.actualEndDate), 'HH:mm');

                  return (
                    <div
                      key={occ.occurrenceId}
                      onClick={() => onEventClick(occ)}
                      className={cn(
                        'p-3 rounded-lg border border-neutral-200 bg-slate-50/50 hover:bg-slate-100/50 transition-colors cursor-pointer select-none flex flex-col justify-between gap-2',
                        borderStyles[occ.context]
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold line-clamp-1">
                            {occ.title}
                          </h4>
                          <span className={cn(
                            'text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase shrink-0',
                            contextBadgeStyles[occ.context]
                          )}>
                            {t.todo.aside.contexts[occ.context as keyof typeof t.todo.aside.contexts] || occ.context}
                          </span>
                        </div>
                        {occ.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {occ.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100/80">
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <CalendarRange className="h-3 w-3 shrink-0" />
                          {startTime} - {endTime}
                        </span>

                        {hasConflict && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 animate-pulse">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>{t.schedule.weekView.conflictBadge}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default WeekView;
