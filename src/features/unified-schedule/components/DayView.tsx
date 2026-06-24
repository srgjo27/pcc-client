import React from 'react';
import { isSameDay, format } from 'date-fns';
import { AlertCircle, Clock, FileText } from 'lucide-react';
import type { ScheduleEvent, ScheduleEventOccurrence } from '../types';
import { cn } from '@/shared/utils/cn';
import { useLanguage } from '@/shared/hooks/useLanguage';

interface DayViewProps {
  currentDate: Date;
  occurrences: ScheduleEventOccurrence[];
  conflicts: Record<string, boolean>;
  onEventClick: (event: ScheduleEvent) => void;
  activeContexts: string[];
}

const contextStyles = {
  college: {
    bg: 'bg-teal-50 hover:bg-teal-50/80 border-teal-200',
    badge: 'bg-teal-100 text-teal-800 border-teal-200',
    accent: 'border-l-4 border-l-teal-500',
  },
  work: {
    bg: 'bg-blue-50 hover:bg-blue-50/80 border-blue-200',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    accent: 'border-l-4 border-l-blue-500',
  },
  business: {
    bg: 'bg-amber-50 hover:bg-amber-50/80 border-amber-200',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    accent: 'border-l-4 border-l-amber-500',
  },
  personal: {
    bg: 'bg-purple-50 hover:bg-purple-50/80 border-purple-200',
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
  const { t } = useLanguage();

  const dayOccurrences = occurrences.filter((occ) => {
    const occDate = new Date(occ.actualStartDate);
    return isSameDay(occDate, currentDate) && activeContexts.includes(occ.context);
  });

  return (
    <div className="bg-white border border-neutral-300 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-100 mb-6 gap-2">
        <h3 className="text-sm font-bold text-slate-800">
          {format(currentDate, 'EEEE, d MMMM yyyy')}
        </h3>
        <span className="text-xs font-semibold text-slate-500">
          {t.schedule.dayView.eventsCountLabel.replace('{count}', String(dayOccurrences.length))}
        </span>
      </div>

      {dayOccurrences.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <Clock className="h-10 w-10 text-slate-300 mb-3 animate-pulse" />
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
              <div
                key={occ.occurrenceId}
                onClick={() => onEventClick(occ)}
                className={cn(
                  'p-4 rounded-xl border flex flex-col gap-3 transition-colors cursor-pointer select-none',
                  style.bg,
                  style.accent
                )}
              >
                {/* Event header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">{occ.title}</h4>
                    <div className="flex flex-wrap gap-2 items-center text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {startTime} - {endTime}
                      </span>
                      {occ.isRecurring && (
                        <span className="bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded-sm text-[10px]">
                          {t.schedule.dayView.recurring}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={cn(
                    'text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase shrink-0',
                    style.badge
                  )}>
                    {t.todo.aside.contexts[occ.context as keyof typeof t.todo.aside.contexts] || occ.context}
                  </span>
                </div>

                {/* Description */}
                {occ.description && (
                  <p className="text-xs text-slate-600 font-medium flex items-start gap-2 leading-relaxed bg-white/50 p-2.5 rounded-lg border border-neutral-100">
                    <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{occ.description}</span>
                  </p>
                )}

                {/* Conflict badge */}
                {hasConflict && (
                  <div className="flex items-center gap-2 p-2 bg-red-100/60 border border-red-200 text-red-800 rounded-lg text-xs font-bold animate-pulse">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>{t.schedule.dayView.conflictMessage}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default DayView;
