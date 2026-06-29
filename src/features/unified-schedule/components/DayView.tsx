import React from 'react';
import { isSameDay, format } from 'date-fns';
import { AlertCircle, Clock } from 'lucide-react';
import type { ScheduleEvent, ScheduleEventOccurrence } from '../types';
import { cn } from '@/shared/utils/cn';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { id } from 'date-fns/locale';

interface DayViewProps {
  currentDate: Date;
  occurrences: ScheduleEventOccurrence[];
  conflicts: Record<string, boolean>;
  onEventClick: (event: ScheduleEvent) => void;
  activeContexts: string[];
}

const contextStyles = {
  college: {
    badge: 'bg-teal-100 text-teal-800 border-teal-200',
    accent: 'border-l-4 border-l-teal-500',
  },
  work: {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    accent: 'border-l-4 border-l-blue-500',
  },
  business: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    accent: 'border-l-4 border-l-amber-500',
  },
  personal: {
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    accent: 'border-l-4 border-l-purple-500',
  },
};

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  occurrences,
  conflicts,
  onEventClick,
  activeContexts,
}) => {
  const { t, lang } = useLanguage();

  const dayOccurrences = occurrences.filter((occ) => {
    const occDate = new Date(occ.actualStartDate);
    return isSameDay(occDate, currentDate) && activeContexts.includes(occ.context);
  });

  return (
    <div className="bg-white border border-neutral-300 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-100 mb-6 gap-2">
        <h3 className="text-sm font-bold">
          {lang === 'id'
            ? format(currentDate, 'EEEE, d MMMM yyyy', { locale: id })
            : format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        <span className="text-xs font-semibold text-slate-500">
          {t.schedule.dayView.eventsCountLabel.replace('{count}', String(dayOccurrences.length))}
        </span>
      </div>

      {dayOccurrences.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <Clock className="h-10 w-10 text-[#26A69A] mb-3" />
          <p className="text-sm font-medium text-slate-500">{t.schedule.dayView.noEvents}</p>
          <p className="text-xs text-slate-400 mt-1">{t.schedule.dayView.emptyStateActionDesc}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dayOccurrences.map((occ) => {
            const hasConflict = conflicts[occ.occurrenceId];
            const style = contextStyles[occ.context];
            const startTime = format(new Date(occ.actualStartDate), 'HH:mm');
            const endTime = format(new Date(occ.actualEndDate), 'HH:mm');

            return (
              <button
                key={occ.occurrenceId}
                type="button"
                onClick={() => onEventClick(occ)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border border-neutral-200 flex flex-col gap-3 transition-colors cursor-pointer select-none',
                  style.accent
                )}
              >
                {/* Event header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 w-full">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{occ.title}</h4>
                    <div className="flex flex-wrap gap-2 items-center text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {startTime} - {endTime}
                      </span>
                      {occ.isRecurring && (
                        <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-sm text-[10px]">
                          {t.schedule.dayView.recurring}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={cn(
                    'text-[10px] font-bold px-3 py-0.5 rounded-full border uppercase shrink-0',
                    style.badge
                  )}>
                    {t.todo.aside.contexts[occ.context as keyof typeof t.todo.aside.contexts] || occ.context}
                  </span>
                </div>

                {/* Description */}
                {occ.description && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-neutral-50 rounded-sm p-2 border border-neutral-200 w-full text-left">
                    <span>{occ.description}</span>
                  </p>
                )}

                {/* Conflict badge */}
                {hasConflict && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-100/60 border border-red-200 text-red-800 rounded-md text-[10px] font-semibold animate-pulse w-full text-left">
                    <AlertCircle className="h-3 w-3 text-red-600 shrink-0" />
                    <span>{t.schedule.dayView.conflictMessage}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default DayView;
