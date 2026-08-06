import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

/**
 * Format start and end date/time to localized human readable string.
 */
export const formatStartEndDate = (startStr: string, endStr: string, lang: string = 'id'): string => {
  if (!startStr || !endStr) return '';
  const start = new Date(startStr);
  const end = new Date(endStr);
  const pattern = 'EEEE, d MMMM yyyy HH:mm';
  const opt = { locale: lang === 'id' ? localeID : undefined };
  return `${format(start, pattern, opt)} - ${format(end, 'HH:mm', opt)}`;
};

/**
 * Convert ISO string to YYYY-MM-DDTHH:MM for datetime-local inputs
 */
export const formatToDatetimeLocal = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * Convert ISO string or Date to YYYY-MM-DD for date inputs
 */
export const formatToDateLocal = (dateInput?: string | Date): string => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * Generate relative dates for mock data
 */
export function getRelativeDate(daysOffset: number, hours: number, minutes = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

/**
 * Format ISO string to localized short date (e.g. 25 Jun 2026)
 */
export const formatDateShort = (isoString: string, lang: 'id' | 'en' = 'id'): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format ISO string or Date to HH:MM time format
 */
export const formatTimeShort = (dateInput?: string | Date): string => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format total seconds into MM:SS format (e.g. 1500 seconds -> 25:00)
 */
export const formatDurationSeconds = (totalSecs: number | null): string => {
  if (totalSecs === null) return '00:00';
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Array of short weekday names in English (0 = Sunday)
 */
export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Array of short weekday names in Indonesian (0 = Sunday)
 */
export const WEEKDAYS_SHORT_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];