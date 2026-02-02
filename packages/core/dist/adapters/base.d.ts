import type { CalendarAdapter, CalendarDate, LocaleConfig } from '../types/calendar';
/**
 * Base abstract class for calendar adapters
 * Provides common utility methods
 */
export declare abstract class BaseCalendarAdapter implements CalendarAdapter {
    abstract readonly type: 'gregorian' | 'hijri';
    abstract today(): CalendarDate;
    abstract format(date: CalendarDate, formatStr: string, locale: LocaleConfig): string;
    abstract parse(dateStr: string, formatStr: string, locale: LocaleConfig): CalendarDate | null;
    abstract getDaysInMonth(year: number, month: number): number;
    abstract getDayOfWeek(date: CalendarDate): number;
    abstract addDays(date: CalendarDate, days: number): CalendarDate;
    abstract addMonths(date: CalendarDate, months: number): CalendarDate;
    abstract addYears(date: CalendarDate, years: number): CalendarDate;
    abstract getMonthName(month: number, locale: LocaleConfig): string;
    abstract getWeekdayNames(locale: LocaleConfig): string[];
    abstract toJsDate(date: CalendarDate): Date;
    abstract fromJsDate(jsDate: Date): CalendarDate;
    /**
     * Compare two dates
     */
    compare(date1: CalendarDate, date2: CalendarDate): number;
    /**
     * Check if two dates are the same day
     */
    isSameDay(date1: CalendarDate, date2: CalendarDate): boolean;
    /**
     * Basic validation
     */
    isValid(date: CalendarDate): boolean;
}
//# sourceMappingURL=base.d.ts.map