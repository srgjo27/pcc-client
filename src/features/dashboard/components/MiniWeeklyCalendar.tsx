import React from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { startOfWeek, endOfWeek, addDays, isSameDay, format } from 'date-fns';
import { WEEKDAYS_SHORT, WEEKDAYS_SHORT_ID } from '@/shared/utils/date';
import { Card } from '@/shared/components/ui/Card';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import type { Event } from '@/features/unified-schedule/types';
import { isEventOnDate } from '@/features/unified-schedule/utils/date';

interface MiniWeeklyCalendarProps {
  events: Event[];
}

export const MiniWeeklyCalendar: React.FC<MiniWeeklyCalendarProps> = ({ events }) => {
  const { t, lang } = useLanguage();
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Start Monday
  const end = endOfWeek(today, { weekStartsOn: 1 });

  const weekDaysShort = lang === 'id' ? WEEKDAYS_SHORT_ID : WEEKDAYS_SHORT;
  const days: Date[] = [];
  let current = start;

  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return (
    <Card className="p-4 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#29B6F6]/10 text-[#29B6F6]">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold tracking-tight text-slate-800">
              {t.dashboard.weeklyCalendarTitle}
            </h3>
          </div>
          <Link
            to="/schedule"
            className="text-[11px] font-semibold text-[#26A69A] hover:underline flex items-center gap-0.5"
          >
            {t.dashboard.viewAll}
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {days.map((date) => {
            const dayOfWeekIdx = date.getDay();
            const dayLabel = weekDaysShort[dayOfWeekIdx];
            const isToday = isSameDay(date, today);
            const dayEvents = events.filter((e) => isEventOnDate(e, date));

            return (
              <div
                key={date.toISOString()}
                className={cn(
                  'flex flex-col items-center py-2 px-1 rounded-xl border transition-all select-none',
                  isToday
                    ? 'bg-[#26A69A]/10 border-[#26A69A] text-[#26A69A] font-bold shadow-2xs'
                    : 'border-neutral-200 bg-white hover:bg-slate-50 text-slate-600'
                )}
              >
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  {dayLabel}
                </span>
                <span className={cn('text-sm font-bold mt-0.5', isToday && 'text-[#26A69A]')}>
                  {format(date, 'd')}
                </span>

                {/* Event Dots */}
                <div className="flex items-center justify-center gap-0.5 mt-1.5 h-2">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        isToday ? 'bg-[#26A69A]' : 'bg-[#29B6F6]'
                      )}
                      title={e.title}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events summary below calendar */}
      <div className="mt-4 pt-3 border-t border-neutral-100">
        <span className="text-[11px] text-slate-500 font-medium">
          {events.length > 0 ? (
            `${events.length} ${lang === 'id' ? 'kegiatan terdaftar untuk hari ini' : 'event(s) scheduled for today'}`
          ) : (
            t.dashboard.noTodayEvents
          )}
        </span>
      </div>
    </Card>
  );
};
