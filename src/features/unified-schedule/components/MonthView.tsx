import React from 'react';
import {
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { cn } from '@/shared/utils/cn';
import { WEEKDAYS_SHORT, WEEKDAYS_SHORT_ID } from '@/shared/utils/date';
import type { Event } from '../types';

interface MonthViewProps {
  lang: string;
  events?: Event[];
  currentDate: Date;
}

const contextStyles: Record<string, string> = {
  lecture: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
  work: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
  business: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
  personal: 'bg-gold-50 text-gold-800 border-gold-200 hover:bg-gold-100',
  gym: 'bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100',
};

export const MonthView: React.FC<MonthViewProps> = ({
  lang,
  events = [],
  currentDate,
}) => {
  const weekDays = lang === 'id' ? WEEKDAYS_SHORT_ID : WEEKDAYS_SHORT
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days: Date[] = [];

  while (startDate <= endDate) {
    days.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }

  return (
    <div className="flex flex-col border border-neutral-300 rounded-xl overflow-hidden bg-white">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-neutral-300 bg-slate-50/50 text-center py-2">
        {weekDays.map((wd) => (
          <span key={wd} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {wd}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-neutral-200 bg-slate-200">
        {days.map((date) => {
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isToday = isSameDay(date, new Date());

          const dayOccurrences = events.filter((occ) => {
            const occDate = new Date(occ.startTime);
            return isSameDay(occDate, date);
          });

          return (
            <div
              key={date.toISOString()}
              className={cn(
                'min-h-27.5 p-2 bg-white flex flex-col justify-between transition-colors hover:bg-slate-50/30 cursor-pointer select-none',
              )}
            >
              {/* Date Header */}
              <div className="flex justify-between items-center mb-1">
                <span
                  className={cn(
                    'text-xs font-bold flex items-center justify-center h-6 w-6 rounded-full',
                    isToday
                      ? 'bg-[#26A69A] text-white'
                      : !isCurrentMonth && 'text-slate-300'
                  )}
                >
                  {format(date, 'd')}
                </span>
              </div>

              {/* Event Occurrences List */}
              <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-20">
                {dayOccurrences.map((occ) => {
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      className={cn(
                        'w-full text-left text-[10px] font-semibold px-2 py-1 rounded-md border flex items-center justify-between transition-all duration-150',
                        contextStyles[occ.context.toLowerCase()]
                      )}
                    >
                      <span className="truncate mr-1">{occ.title}</span>
                      {/* {hasConflict && (
                        <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 animate-pulse" />
                      )} */}
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
