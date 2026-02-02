import type { CalendarAdapter, CalendarDate, LocaleConfig } from '../types/calendar';

/**
 * Base abstract class for calendar adapters
 * Provides common utility methods
 */
export abstract class BaseCalendarAdapter implements CalendarAdapter {
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
    compare(date1: CalendarDate, date2: CalendarDate): number {
        if (date1.year !== date2.year) {
            return date1.year - date2.year;
        }
        if (date1.month !== date2.month) {
            return date1.month - date2.month;
        }
        return date1.day - date2.day;
    }

    /**
     * Check if two dates are the same day
     */
    isSameDay(date1: CalendarDate, date2: CalendarDate): boolean {
        return (
            date1.year === date2.year &&
            date1.month === date2.month &&
            date1.day === date2.day
        );
    }

    /**
     * Basic validation
     */
    isValid(date: CalendarDate): boolean {
        if (!date || typeof date.year !== 'number' || typeof date.month !== 'number' || typeof date.day !== 'number') {
            return false;
        }

        if (date.month < 1 || date.month > 12) {
            return false;
        }

        const daysInMonth = this.getDaysInMonth(date.year, date.month);
        if (date.day < 1 || date.day > daysInMonth) {
            return false;
        }

        return true;
    }
}
