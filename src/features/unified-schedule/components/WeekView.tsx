import React from 'react';
import { id } from 'date-fns/locale';
import { startOfWeek, addDays, isSameDay, format } from 'date-fns';
import { AlertCircle, CalendarRange } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { Event } from '../types';
import { isEventOnDate, isOverlappingTimeOnly } from '../utils/date';
import { CONTEXT_STYLES } from '../constants/styles';

interface WeekViewProps {
  events?: Event[];
  currentDate: Date;
  onEventClick?: (id: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  events = [],
  currentDate,
  onEventClick,
}) => {
  const { t, lang } = useLanguage();

  const start = startOfWeek(currentDate);
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }

  return (
    <div className="space-y-4">
      {days.map((date) => {
        const isToday = isSameDay(date, new Date());

        const dayOccurrences = events.filter((occ) => isEventOnDate(occ, date));

        return (
          <div
            key={date.toISOString()}
            className={cn(
              'p-4 rounded-xl border bg-white transition-all duration-200',
              isToday ? 'border-[#26A69A]' : 'border-neutral-300'
            )}
          >
            {/* Day Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-300 mb-3">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-sm font-bold',
                  isToday ? 'text-[#26A69A]' : ''
                )}>
                  {lang === 'id'
                    ? format(date, 'EEEE', { locale: id })
                    : format(date, 'EEEE')}
                </span>
                <span className="text-xs text-slate-500">
                  {lang === 'id'
                    ? format(date, 'd MMM yyyy', { locale: id })
                    : format(date, 'd MMM yyyy')}
                </span>
              </div>
            </div>

            {/* Day Events */}
            {dayOccurrences.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-500 bg-[#26A69A]/10">
                {t.schedule.weekView.noEvents}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dayOccurrences.map((occ) => {
                  const startTime = format(new Date(occ.startTime), 'HH:mm');
                  const endTime = format(new Date(occ.endTime), 'HH:mm');

                  const hasConflict = dayOccurrences.some((otherOcc) =>
                    otherOcc.id !== occ.id && isOverlappingTimeOnly(occ, otherOcc)
                  );

                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => onEventClick?.(occ.id)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg border border-neutral-200 bg-slate-50/50 hover:bg-slate-100/50',
                        'transition-colors cursor-pointer select-none flex flex-col justify-between gap-2',
                        CONTEXT_STYLES[occ.context.toLowerCase()].accent
                      )}
                    >
                      <div className="space-y-1 w-full">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold line-clamp-2">
                            {occ.title}
                          </h4>
                          <span className={cn(
                            'text-[6px] font-semibold px-1.5 rounded-full border shrink-0',
                            CONTEXT_STYLES[occ.context.toLowerCase()].badge
                          )}>
                            {occ.context}
                          </span>
                        </div>
                        {occ.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {occ.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between w-full pt-2 border-t border-neutral-200">
                        <span className="text-[10px] font-bold flex items-center gap-1">
                          <CalendarRange className="h-3 w-3 shrink-0" />
                          {startTime} - {endTime}
                        </span>

                        {hasConflict && (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-red-700 animate-pulse">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>{t.schedule.weekView.conflictBadge}</span>
                          </div>
                        )}
                      </div>
                    </button>
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
