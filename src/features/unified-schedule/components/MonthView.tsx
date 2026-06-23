import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  format,
} from 'date-fns';
import { AlertCircle } from 'lucide-react';
import type { ScheduleEvent, ScheduleEventOccurrence } from '../types';
import { cn } from '@/shared/utils/cn';
import { useLanguage } from '@/shared/hooks/useLanguage';

interface MonthViewProps {
  currentDate: Date;
  occurrences: ScheduleEventOccurrence[];
  conflicts: Record<string, boolean>;
  onEventClick: (event: ScheduleEvent) => void;
  onDateClick: (date: Date) => void;
  activeContexts: string[];
}

const contextStyles = {
  college: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
  work: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
  business: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
  personal: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
};

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  occurrences,
  conflicts,
  onEventClick,
  onDateClick,
  activeContexts,
}) => {
  const { t } = useLanguage();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = t.schedule.monthView.weekDays;

  return (
    <div className="flex flex-col border border-neutral-300 rounded-xl overflow-hidden bg-white">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-neutral-300 bg-slate-50/50 text-center py-2.5">
        {weekDays.map((wd) => (
          <span key={wd} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {wd}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-neutral-200 bg-neutral-200">
        {days.map((date) => {
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isToday = isSameDay(date, new Date());

          // Filter occurrences for this day
          const dayOccurrences = occurrences.filter((occ) => {
            const occDate = new Date(occ.actualStartDate);
            return isSameDay(occDate, date) && activeContexts.includes(occ.context);
          });

          return (
            <div
              key={date.toISOString()}
              onClick={() => onDateClick(date)}
              className={cn(
                'min-h-27.5 p-2 bg-white flex flex-col justify-between transition-colors hover:bg-slate-50/30 cursor-pointer select-none',
                !isCurrentMonth && 'text-slate-300'
              )}
            >
              {/* Date Header */}
              <div className="flex justify-between items-center mb-1">
                <span
                  className={cn(
                    'text-xs font-bold flex items-center justify-center h-6 w-6 rounded-full',
                    isToday
                      ? 'bg-[#26A69A] text-white'
                      : !isCurrentMonth && 'text-slate-400'
                  )}
                >
                  {format(date, 'd')}
                </span>
              </div>

              {/* Event occurrences list */}
              <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-20">
                {dayOccurrences.map((occ) => {
                  const hasConflict = conflicts[occ.occurrenceId];
                  return (
                    <button
                      key={occ.occurrenceId}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(occ);
                      }}
                      className={cn(
                        'w-full text-left text-[10px] font-semibold px-2 py-1 rounded-md border flex items-center justify-between transition-all duration-150',
                        contextStyles[occ.context]
                      )}
                    >
                      <span className="truncate mr-1">{occ.title}</span>
                      {hasConflict && (
                        <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MonthView;
