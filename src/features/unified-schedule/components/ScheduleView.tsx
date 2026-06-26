import React, { useState, useMemo } from 'react';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  format,
} from 'date-fns';
import { Plus, ChevronLeft, ChevronRight, Filter, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Button } from '@/shared/components/ui/Button';
import { useGetEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '../hooks';
import { generateOccurrences, checkConflicts } from '../utils/recurrence';
import type { ScheduleEvent, EventFormPayload } from '../types';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import EventModal from './EventModal';
import { Loading } from '@/shared/components/ui/Loading';

export const ScheduleView: React.FC = () => {
  const { t, lang } = useLanguage();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const [activeContexts, setActiveContexts] = useState<string[]>(['college', 'work', 'business', 'personal']);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  // Queries & Mutations
  const { data: events = [], isLoading } = useGetEvents();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  // Compute date interval boundaries for occurrences generation
  const viewRange = useMemo(() => {
    if (currentView === 'month') {
      const monthStart = startOfMonth(currentDate);
      return { start: startOfWeek(monthStart), end: endOfWeek(endOfMonth(currentDate)) };
    } else if (currentView === 'week') {
      return { start: startOfWeek(currentDate), end: endOfWeek(currentDate) };
    } else {
      return { start: startOfDay(currentDate), end: endOfDay(currentDate) };
    }
  }, [currentDate, currentView]);

  // Generate all occurrences in range
  const occurrences = useMemo(() => {
    return generateOccurrences(events, viewRange.start, viewRange.end);
  }, [events, viewRange]);

  // Check conflicts
  const conflicts = useMemo(() => {
    return checkConflicts(occurrences);
  }, [occurrences]);

  // Has conflict indicator in current view
  const hasConflictInView = useMemo(() => {
    return Object.keys(conflicts).some(occId => {
      const occ = occurrences.find(o => o.occurrenceId === occId);
      return occ && activeContexts.includes(occ.context);
    });
  }, [conflicts, occurrences, activeContexts]);

  // Date Navigation handlers
  const handlePrev = () => {
    if (currentView === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (currentView === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (currentView === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (currentView === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedEvent(null);
    const prefilledDate = new Date(date);
    prefilledDate.setHours(9, 0, 0, 0); // default to 09:00 AM
    setSelectedEvent({
      id: '',
      title: '',
      context: 'personal',
      startDate: prefilledDate.toISOString(),
      endDate: new Date(prefilledDate.getTime() + 60 * 60 * 1000).toISOString(),
      isRecurring: false,
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (payload: EventFormPayload) => {
    if (selectedEvent && selectedEvent.id) {
      await updateEventMutation.mutateAsync({ id: selectedEvent.id, payload });
    } else {
      await createEventMutation.mutateAsync(payload);
    }
  };

  const handleEventDelete = async () => {
    if (selectedEvent && selectedEvent.id) {
      if (window.confirm(t.schedule.deleteConfirm)) {
        await deleteEventMutation.mutateAsync(selectedEvent.id);
        setIsModalOpen(false);
      }
    }
  };

  const toggleContext = (context: string) => {
    setActiveContexts((prev) =>
      prev.includes(context) ? prev.filter((c) => c !== context) : [...prev, context]
    );
  };

  // Header Title Text
  const headerTitle = useMemo(() => {
    if (currentView === 'month') return format(currentDate, 'MMMM yyyy');
    if (currentView === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, 'dd MMM')} - ${format(end, 'dd MMM yyyy')}`;
    }
    return format(currentDate, 'dd MMMM yyyy');
  }, [currentDate, currentView]);

  return (
    <div className="space-y-6">
      {/* Header section with Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">{t.schedule.title}</h1>
          <p className="text-slate-500 text-sm">{t.schedule.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Controls */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4 border border-neutral-300 rounded-xl p-4 bg-white">
          <Button
            variant="custom"
            size="sm"
            className="gap-2 bg-[#26A69A] hover:bg-[#23968b] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => {
              setSelectedEvent(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>{t.schedule.addEvent}</span>
          </Button>

          {/* Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Filter className="h-3.5 w-3.5" />
              <span>FILTER</span>
            </div>
            <div className="flex flex-col gap-2">
              {(['college', 'work', 'business', 'personal'] as const).map((ctx) => (
                <label
                  key={ctx}
                  className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={activeContexts.includes(ctx)}
                    onChange={() => toggleContext(ctx)}
                    className="h-4.5 w-4.5 accent-[#FFB300]"
                  />
                  <span className="text-xs font-medium">
                    {t.todo.aside.contexts[ctx]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Conflict Warning Indicator */}
          {hasConflictInView && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-[11px] font-semibold animate-pulse">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">{t.schedule.conflictWarningTitle}</p>
                <p className="text-red-700 font-medium">{t.schedule.conflictWarningDesc}</p>
              </div>
            </div>
          )}
        </aside>

        {/* Calendar Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Navigation & View switcher header */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white border border-neutral-300 rounded-xl p-4">
            <div className="flex items-center gap-2 justify-between sm:justify-start">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={handlePrev} aria-label="Sebelumnya">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleToday}>
                  {t.today}
                </Button>
                <Button variant="outline" size="icon" onClick={handleNext} aria-label="Berikutnya">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h1 className="text-sm font-bold ml-2">{headerTitle}</h1>
            </div>

            {/* View switcher */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-neutral-200">
              {(['month', 'week', 'day'] as const).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setCurrentView(view)}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${currentView === view
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
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
              {currentView === 'month' && (
                <MonthView
                  lang={lang}
                  currentDate={currentDate}
                  occurrences={occurrences}
                  conflicts={conflicts}
                  onEventClick={handleEventClick}
                  onDateClick={handleDateClick}
                  activeContexts={activeContexts}
                />
              )}
              {currentView === 'week' && (
                <WeekView
                  currentDate={currentDate}
                  occurrences={occurrences}
                  conflicts={conflicts}
                  onEventClick={handleEventClick}
                  activeContexts={activeContexts}
                />
              )}
              {currentView === 'day' && (
                <DayView
                  currentDate={currentDate}
                  occurrences={occurrences}
                  conflicts={conflicts}
                  onEventClick={handleEventClick}
                  activeContexts={activeContexts}
                />
              )}
            </div>
          )}
        </div>

        {/* Add / Edit Event Dialog */}
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          onDelete={handleEventDelete}
          event={selectedEvent}
          isLoading={createEventMutation.isPending || updateEventMutation.isPending || deleteEventMutation.isPending}
        />
      </div>
    </div>
  );
};
export default ScheduleView;
