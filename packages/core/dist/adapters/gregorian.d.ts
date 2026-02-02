import type { CalendarDate, LocaleConfig } from '../types/calendar';
import { BaseCalendarAdapter } from './base';
/**
 * Gregorian calendar adapter using date-fns
 */
export declare class GregorianAdapter extends BaseCalendarAdapter {
    readonly type: "gregorian";
    /**
     * Get locale object for date-fns
     */
    private getDateFnsLocale;
    /**
     * Convert CalendarDate to JS Date
     */
    toJsDate(date: CalendarDate): Date;
    /**
     * Convert JS Date to CalendarDate
     */
    fromJsDate(jsDate: Date): CalendarDate;
    /**
     * Get today's date
     */
    today(): CalendarDate;
    /**
     * Format a date to string
     */
    format(date: CalendarDate, formatStr: string, locale: LocaleConfig): string;
    /**
     * Parse a string to date
     */
    parse(dateStr: string, formatStr: string, locale: LocaleConfig): CalendarDate | null;
    /**
     * Get days in month
     */
    getDaysInMonth(year: number, month: number): number;
    /**
     * Get day of week (0 = Sunday)
     */
    getDayOfWeek(date: CalendarDate): number;
    /**
     * Add days to date
     */
    addDays(date: CalendarDate, days: number): CalendarDate;
    /**
     * Add months to date
     */
    addMonths(date: CalendarDate, months: number): CalendarDate;
    /**
     * Add years to date
     */
    addYears(date: CalendarDate, years: number): CalendarDate;
    /**
     * Get month name
     */
    getMonthName(month: number, locale: LocaleConfig): string;
    /**
     * Get weekday names
     */
    getWeekdayNames(locale: LocaleConfig): string[];
}
//# sourceMappingURL=gregorian.d.ts.map