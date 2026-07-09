import React from 'react';
import { isSameDay, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { Event } from '../types';
import { CONTEXT_STYLES } from '../constants/styles';
import { isEventOnDate } from '../utils/date';

interface DayViewProps {
  events?: Event[];
  currentDate: Date;
  onEventClick?: (id: string) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  events = [],
  currentDate,
  onEventClick,
}) => {
  const { t, lang } = useLanguage();

  const dayOccurrences = events.filter((occ) => isEventOnDate(occ, currentDate));

  return (
    <div className="bg-white border border-neutral-300 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-neutral-200 mb-6 gap-2">
        <h3 className="text-sm font-semibold">
          {lang === 'id'
            ? format(currentDate, 'EEEE, d MMMM yyyy', { locale: id })
            : format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        <span className="text-xs font-semibold text-slate-500">
          {t.schedule.dayView.eventsCountLabel.replace('{count}', String(dayOccurrences.length))}
        </span>
      </div>

      {dayOccurrences.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center bg-[#26A69A]/10">
          <Clock className="h-10 w-10 text-slate-400 mb-3" />
          <p className="text-sm font-medium">{t.schedule.dayView.noEvents}</p>
          <p className="text-xs text-slate-500 mt-1">{t.schedule.dayView.emptyStateActionDesc}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dayOccurrences.map((occ) => {
            const style = CONTEXT_STYLES[occ.context.toLowerCase()];
            const startTime = format(new Date(occ.startTime), 'HH:mm');
            const endTime = format(new Date(occ.endTime), 'HH:mm');

            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => onEventClick?.(occ.id)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border border-neutral-200 flex flex-col gap-3 transition-colors cursor-pointer select-none',
                  style.accent
                )}
              >
                {/* Event Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start w-full">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{occ.title}</h4>
                    <div className="flex flex-wrap gap-2 items-center text-xs text-slate-500">
                      <span className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {startTime} - {endTime}
                      </span>
                      {occ.isRecurring && (
                        <span className="bg-slate-100 border border-neutral-200 px-2 py-0.5 rounded-sm text-[10px]">
                          {t.schedule.dayView.recurring}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={cn(
                    'text-[10px] font-semibold px-3 rounded-full border uppercase shrink-0',
                    style.badge
                  )}>
                    {occ.context}
                  </span>
                </div>

                {/* Description */}
                {occ.description && (
                  <p className="text-xs text-slate-500 leading-relaxed w-full text-left">
                    <span>{occ.description}</span>
                  </p>
                )}

                {/* Conflict badge */}
                {/* {hasConflict && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-100/60 border border-red-200 text-red-800 rounded-md text-[10px] font-semibold animate-pulse w-full text-left">
                    <AlertCircle className="h-3 w-3 text-red-600 shrink-0" />
                    <span>{t.schedule.dayView.conflictMessage}</span>
                  </div>
                )} */}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DayView;