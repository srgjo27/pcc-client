import { getRelativeDate } from '@/shared/utils/date';
import type { ScheduleEvent, EventFormPayload } from '../types';

const STORAGE_KEY = 'pcc_schedule_events';

// Initial mock data if localStorage is empty
const INITIAL_EVENTS: ScheduleEvent[] = [
  {
    id: 'evt_1',
    title: 'Kuliah Aljabar Linear',
    description: 'Ruang 402, Gedung Baru. Jangan lupa bawa kalkulator saintifik.',
    context: 'college',
    startDate: getRelativeDate(-5, 9, 0), // Starts 5 days ago, Monday 09:00
    endDate: getRelativeDate(-5, 10, 30),
    isRecurring: true,
    recurringDays: [1, 3], // Monday and Wednesday
    recurringEndDate: getRelativeDate(30, 0, 0), // Ends in 30 days
  },
  {
    id: 'evt_2',
    title: 'Daily Standup Meeting',
    description: 'Sync up harian via Google Meet.',
    context: 'work',
    startDate: getRelativeDate(0, 10, 0), // Today 10:00
    endDate: getRelativeDate(0, 10, 30),
    isRecurring: true,
    recurringDays: [1, 2, 3, 4, 5], // Mon to Fri
    recurringEndDate: getRelativeDate(30, 0, 0),
  },
  {
    id: 'evt_3',
    title: 'Bimbingan Tugas Akhir',
    description: 'Diskusi bab 3 dan 4 dengan dosen pembimbing.',
    context: 'college',
    startDate: getRelativeDate(0, 10, 15), // Today 10:15 (Overlaps with standup from 10:00 to 10:30)
    endDate: getRelativeDate(0, 11, 45),
    isRecurring: false,
  },
  {
    id: 'evt_4',
    title: 'Penyusunan Konten Marketing',
    description: 'Brainstorming ide promosi produk baru.',
    context: 'business',
    startDate: getRelativeDate(1, 14, 0), // Tomorrow 14:00
    endDate: getRelativeDate(1, 16, 0),
    isRecurring: false,
  },
  {
    id: 'evt_5',
    title: 'Sesi Gym & Kardio',
    description: 'Fokus latihan kaki (Leg day).',
    context: 'personal',
    startDate: getRelativeDate(2, 7, 0), // Day after tomorrow 07:00
    endDate: getRelativeDate(2, 8, 30),
    isRecurring: true,
    recurringDays: [2, 4, 6], // Tue, Thu, Sat
    recurringEndDate: getRelativeDate(14, 0, 0),
  }
];

function getStoredEvents(): ScheduleEvent[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_EVENTS;
  }
}

function setStoredEvents(events: ScheduleEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export async function fetchEvents(): Promise<ScheduleEvent[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredEvents());
    }, 600); // simulated latency
  });
}

export async function createEvent(payload: EventFormPayload): Promise<ScheduleEvent> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const events = getStoredEvents();
      const newEvent: ScheduleEvent = {
        ...payload,
        id: `evt_${Math.random().toString(36).substring(2, 9)}`,
      };
      events.push(newEvent);
      setStoredEvents(events);
      resolve(newEvent);
    }, 600);
  });
}

export async function updateEvent(id: string, payload: EventFormPayload): Promise<ScheduleEvent> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const events = getStoredEvents();
      const index = events.findIndex((e) => e.id === id);
      if (index === -1) {
        reject(new Error('Event not found'));
        return;
      }
      const updatedEvent: ScheduleEvent = {
        ...payload,
        id,
      };
      events[index] = updatedEvent;
      setStoredEvents(events);
      resolve(updatedEvent);
    }, 600);
  });
}

export async function deleteEvent(id: string): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const events = getStoredEvents();
      const filtered = events.filter((e) => e.id !== id);
      if (events.length === filtered.length) {
        reject(new Error('Event not found'));
        return;
      }
      setStoredEvents(filtered);
      resolve(id);
    }, 600);
  });
}
