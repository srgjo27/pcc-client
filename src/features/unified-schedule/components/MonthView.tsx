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
import { CONTEXT_ICON, CONTEXT_STYLES } from '../constants/styles';
import { isEventOnDate } from '../utils/date';

interface MonthViewProps {
  lang: string;
  events?: Event[];
  currentDate: Date;
  onEventClick?: (id: string) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  lang,
  events = [],
  currentDate,
  onEventClick,
}) => {
  const weekDays = lang === 'id' ? WEEKDAYS_SHORT_ID : WEEKDAYS_SHORT;
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

          const dayOccurrences = events.filter((occ) => isEventOnDate(occ, date));

          return (
            <div
              key={date.toISOString()}
              className={cn(
                'min-h-27.5 p-2 bg-white flex flex-col justify-between transition-colors hover:bg-slate-50/30 cursor-pointer select-none'
              )}
            >
              {/* Date Header */}
              <div className="flex justify-between items-center">
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
              <div className="grid grid-cols-2 overflow-y-auto max-h-20">
                {dayOccurrences.map((occ) => {
                  const IconComponent = CONTEXT_ICON[occ.context.toLowerCase()];
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      title={occ.title}
                      onClick={() => onEventClick?.(occ.id)}
                      className={cn('flex justify-center items-center rounded-full w-8 h-8',
                        CONTEXT_STYLES[occ.context.toLowerCase()].badge)}
                    >
                      <IconComponent className='h-4 w-4' />
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
