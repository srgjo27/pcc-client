import {
  isSameDay,
  startOfDay,
  isSameWeek,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
} from 'date-fns';
import { TimeInterval } from '../types';
import type { Event } from '../types';

const DAYS_MAP = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

// Helper to convert Date to minutes since midnight
const getMinutesFromDate = (dateInput: string | Date): number => {
  const date = new Date(dateInput);
  return date.getHours() * 60 + date.getMinutes();
};

/**
 * Checks if two events overlap in time of day (ignoring their date parts).
 * Helpful for detecting conflicts in recurring events.
 */
export function isOverlappingTimeOnly(
  eventA: { startTime: string | Date; endTime: string | Date },
  eventB: { startTime: string | Date; endTime: string | Date }
): boolean {
  const startA = getMinutesFromDate(eventA.startTime);
  const endA = getMinutesFromDate(eventA.endTime);
  const startB = getMinutesFromDate(eventB.startTime);
  const endB = getMinutesFromDate(eventB.endTime);
  return startA < endB && startB < endA;
}

/**
 * Checks if there is any overlapping conflict in a list of events on specific visible dates.
 */
export function hasAnyConflict(events: Event[], visibleDates: Date[]): boolean {
  if (events.length < 2) return false;
  for (const date of visibleDates) {
    const dayOccurrences = events.filter((occ) => isEventOnDate(occ, date));
    if (dayOccurrences.length >= 2) {
      for (let i = 0; i < dayOccurrences.length; i++) {
        for (let j = i + 1; j < dayOccurrences.length; j++) {
          if (isOverlappingTimeOnly(dayOccurrences[i], dayOccurrences[j])) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

/**
 * Checks if an event occurs on a specific date, accounting for recurrence.
 */
export function isEventOnDate(event: Event, date: Date): boolean {
  const eventStart = new Date(event.startTime);
  const targetDate = startOfDay(date);
  const eventStartDate = startOfDay(eventStart);

  // If the target date is before the start date of the event, it doesn't occur yet
  if (targetDate < eventStartDate) {
    return false;
  }

  // Check if it's the exact same day
  if (isSameDay(eventStart, date)) {
    return true;
  }

  // Check if it's recurring and matches the frequency/days within the same week
  if (event.isRecurring && event.recurrence) {
    if (isSameWeek(eventStart, date)) {
      if (event.recurrence.frequency === 'WEEKLY') {
        const dayName = DAYS_MAP[date.getDay()];
        return event.recurrence.days?.includes(dayName) || false;
      }
      if (event.recurrence.frequency === 'DAILY') {
        return true;
      }
    }
  }

  return false;
}

/**
 * Returns the list of visible dates based on the current date and time interval view.
 */
export function getVisibleDates(currentDate: Date, view: TimeInterval): Date[] {
  const dates: Date[] = [];
  if (view === TimeInterval.MONTH) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const start = startOfWeek(monthStart);
    const end = endOfWeek(monthEnd);
    const temp = new Date(start);
    while (temp <= end) {
      dates.push(new Date(temp));
      temp.setDate(temp.getDate() + 1);
    }
  } else if (view === TimeInterval.WEEK) {
    const start = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(start, i));
    }
  } else {
    dates.push(new Date(currentDate));
  }
  return dates;
}