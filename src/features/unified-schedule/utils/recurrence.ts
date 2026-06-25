import { parseISO, getDay, addDays, format } from 'date-fns';
import type { ScheduleEvent, ScheduleEventOccurrence } from '../types';

/**
 * Generates all occurrences of events (recurring and non-recurring) within a given date range.
 */
export function generateOccurrences(
  events: ScheduleEvent[],
  viewStartDate: Date,
  viewEndDate: Date
): ScheduleEventOccurrence[] {
  const occurrences: ScheduleEventOccurrence[] = [];

  events.forEach((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    const durationMs = eventEnd.getTime() - eventStart.getTime();

    if (!event.isRecurring) {
      // Non-recurring: check if it overlaps with view interval
      if (eventStart <= viewEndDate && eventEnd >= viewStartDate) {
        occurrences.push({
          ...event,
          occurrenceId: event.id,
          actualStartDate: event.startDate,
          actualEndDate: event.endDate,
        });
      }
    } else {
      // Recurring event: loop day-by-day starting from the event start date
      // up to the minimum of (viewEndDate, recurringEndDate)
      const recurrenceEndLimit = event.recurringEndDate
        ? parseISO(event.recurringEndDate)
        : viewEndDate;

      const loopLimit = recurrenceEndLimit < viewEndDate ? recurrenceEndLimit : viewEndDate;
      const daysToRepeat = event.recurringDays || [];

      let currentDay = new Date(eventStart);

      // Loop to generate instances
      while (currentDay <= loopLimit) {
        const dayOfWeek = getDay(currentDay); // 0 = Sunday, 1 = Monday, ...

        if (daysToRepeat.includes(dayOfWeek)) {
          // Construct start & end date for this occurrence
          const occurrenceStart = new Date(currentDay);
          occurrenceStart.setHours(eventStart.getHours(), eventStart.getMinutes(), 0, 0);

          const occurrenceEnd = new Date(occurrenceStart.getTime() + durationMs);

          // Add only if it falls within the view range and starts on or after original start date
          if (
            occurrenceStart >= eventStart &&
            occurrenceStart <= viewEndDate &&
            occurrenceEnd >= viewStartDate
          ) {
            const dateStr = format(occurrenceStart, 'yyyy-MM-dd');
            occurrences.push({
              ...event,
              occurrenceId: `${event.id}-${dateStr}`,
              actualStartDate: occurrenceStart.toISOString(),
              actualEndDate: occurrenceEnd.toISOString(),
            });
          }
        }

        currentDay = addDays(currentDay, 1);
      }
    }
  });

  // Sort by start date ascending
  return occurrences.sort(
    (a, b) => new Date(a.actualStartDate).getTime() - new Date(b.actualStartDate).getTime()
  );
}

/**
 * Detects overlapping occurrences of events.
 * Returns a Record mapping occurrenceId to a boolean indicating if it has a conflict.
 */
export function checkConflicts(occurrences: ScheduleEventOccurrence[]): Record<string, boolean> {
  const conflicts: Record<string, boolean> = {};

  for (let i = 0; i < occurrences.length; i++) {
    const occA = occurrences[i];
    const startA = new Date(occA.actualStartDate).getTime();
    const endA = new Date(occA.actualEndDate).getTime();

    for (let j = i + 1; j < occurrences.length; j++) {
      const occB = occurrences[j];
      const startB = new Date(occB.actualStartDate).getTime();
      const endB = new Date(occB.actualEndDate).getTime();

      // Overlap condition: A starts before B ends, and B starts before A ends
      if (startA < endB && startB < endA) {
        conflicts[occA.occurrenceId] = true;
        conflicts[occB.occurrenceId] = true;
      }
    }
  }

  return conflicts;
}
