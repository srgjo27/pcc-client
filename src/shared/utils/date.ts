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
 * Convert ISO string to YYYY-MM-DD for date inputs
 */
export const formatToDateLocal = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
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

