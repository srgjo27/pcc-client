import React, { useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Loading } from '@/shared/components/ui/Loading';
import { useEvents } from '../hooks';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import DetailModal from './DetailModal';
import { Button } from '@/shared/components/ui/Button';
import { hasAnyConflict, getVisibleDates } from '../utils/date';
import {
  endOfWeek,
  format,
  startOfWeek,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { TimeInterval } from '../types';

interface CalendarAreaProps {
  activeContexts: string[];
  onConflictChange?: (hasConflict: boolean) => void;
}

export const CalendarArea: React.FC<CalendarAreaProps> = ({ activeContexts, onConflictChange }) => {
  const { t, lang } = useLanguage();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<TimeInterval>(TimeInterval.MONTH);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const { data: events, isLoading } = useEvents({
    startTime: currentView === TimeInterval.MONTH ? startOfMonth(currentDate) : startOfWeek(currentDate),
    endTime: currentView === TimeInterval.MONTH ? endOfMonth(currentDate) : endOfWeek(currentDate),
  });

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return events.filter(event => activeContexts.includes(event.context.toUpperCase()));
  }, [events, activeContexts]);

  const visibleDates = useMemo(() => {
    return getVisibleDates(currentDate, currentView);
  }, [currentDate, currentView]);

  const hasConflict = useMemo(() => {
    return hasAnyConflict(filteredEvents, visibleDates);
  }, [filteredEvents, visibleDates]);

  useEffect(() => {
    if (onConflictChange) {
      onConflictChange(hasConflict);
    }
  }, [hasConflict, onConflictChange]);

  const handlePrevious = () => {
    setCurrentDate((prev) => {
      if (currentView === TimeInterval.MONTH) return subMonths(prev, 1);
      if (currentView === TimeInterval.WEEK) return subWeeks(prev, 1);
      return subDays(prev, 1);
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      if (currentView === TimeInterval.MONTH) return addMonths(prev, 1);
      if (currentView === TimeInterval.WEEK) return addWeeks(prev, 1);
      return addDays(prev, 1);
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (id: string) => {
    setSelectedEventId(id);
    setIsDetailOpen(true);
  };

  const headerTitle = useMemo(() => {
    if (currentView === TimeInterval.MONTH) return format(currentDate, 'MMMM yyyy');
    if (currentView === TimeInterval.WEEK) {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, 'dd MMM')} - ${format(end, 'dd MMM yyyy')}`;
    }
    return format(currentDate, 'dd MMMM yyyy');
  }, [currentDate, currentView]);

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white border border-neutral-300 rounded-xl p-4">
        {/* Navigation */}
        <div className="flex items-center gap-2 justify-between sm:justify-start">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              aria-label="Sebelumnya">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}>
              {t.today}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              aria-label="Berikutnya">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-sm font-semibold ml-2">{headerTitle}</h1>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-neutral-100">
          {Object.values(TimeInterval).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setCurrentView(view)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 
                ${currentView === view
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'}
                `}
            >
              {t.schedule.views[view]}
            </button>
          ))}
        </div>
      </div>

      {/* Content View Grid */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="min-h-75">
          {currentView === TimeInterval.MONTH && (
            <MonthView
              lang={lang}
              events={filteredEvents}
              currentDate={currentDate}
              onEventClick={handleEventClick}
            />
          )}
          {currentView === TimeInterval.WEEK && (
            <WeekView
              events={filteredEvents}
              currentDate={currentDate}
              onEventClick={handleEventClick}
            />
          )}
          {currentView === TimeInterval.DAY && (
            <DayView
              events={filteredEvents}
              currentDate={currentDate}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      )}

      {/* Modals */}
      {selectedEventId && (
        <DetailModal
          id={selectedEventId}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedEventId(null);
          }}
        />
      )}
    </div>
  );
};

export default CalendarArea;