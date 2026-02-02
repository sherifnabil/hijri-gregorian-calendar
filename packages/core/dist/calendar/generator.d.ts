import type { CalendarAdapter, CalendarDate, CalendarMonth, LocaleConfig } from '../types/calendar';
/**
 * Generate a calendar month grid
 */
export declare function generateCalendarMonth(year: number, month: number, adapter: CalendarAdapter, locale: LocaleConfig, selectedDate?: CalendarDate | null, selectedDates?: CalendarDate[]): CalendarMonth;
/**
 * Check if a date is within a range
 */
export declare function isDateInRange(date: CalendarDate, start: CalendarDate | null, end: CalendarDate | null, adapter: CalendarAdapter): boolean;
/**
 * Check if a date is disabled
 */
export declare function isDateDisabled(date: CalendarDate, minDate?: CalendarDate, maxDate?: CalendarDate, disabledDates?: CalendarDate[], disabledDaysOfWeek?: number[], adapter?: CalendarAdapter): boolean;
//# sourceMappingURL=generator.d.ts.map