import {
    format,
    parse,
    getDaysInMonth,
    getDay,
    addDays,
    addMonths,
    addYears,
    startOfToday,
    isValid as isValidDate
} from 'date-fns';
import { enUS, ar } from 'date-fns/locale';
import type { CalendarDate, LocaleConfig } from '../types/calendar';
import { BaseCalendarAdapter } from './base';

/**
 * Gregorian calendar adapter using date-fns
 */
export class GregorianAdapter extends BaseCalendarAdapter {
    readonly type = 'gregorian' as const;

    /**
     * Get locale object for date-fns
     */
    private getDateFnsLocale(locale: LocaleConfig) {
        switch (locale.code) {
            case 'ar':
                return ar;
            case 'en':
            default:
                return enUS;
        }
    }

    /**
     * Convert CalendarDate to JS Date
     */
    toJsDate(date: CalendarDate): Date {
        return new Date(date.year, date.month - 1, date.day);
    }

    /**
     * Convert JS Date to CalendarDate
     */
    fromJsDate(jsDate: Date): CalendarDate {
        return {
            year: jsDate.getFullYear(),
            month: jsDate.getMonth() + 1,
            day: jsDate.getDate()
        };
    }

    /**
     * Get today's date
     */
    today(): CalendarDate {
        return this.fromJsDate(startOfToday());
    }

    /**
     * Format a date to string
     */
    format(date: CalendarDate, formatStr: string, locale: LocaleConfig): string {
        const jsDate = this.toJsDate(date);
        return format(jsDate, formatStr, { locale: this.getDateFnsLocale(locale) });
    }

    /**
     * Parse a string to date
     */
    parse(dateStr: string, formatStr: string, locale: LocaleConfig): CalendarDate | null {
        try {
            const jsDate = parse(dateStr, formatStr, new Date(), {
                locale: this.getDateFnsLocale(locale)
            });

            if (!isValidDate(jsDate)) {
                return null;
            }

            return this.fromJsDate(jsDate);
        } catch {
            return null;
        }
    }

    /**
     * Get days in month
     */
    getDaysInMonth(year: number, month: number): number {
        return getDaysInMonth(new Date(year, month - 1));
    }

    /**
     * Get day of week (0 = Sunday)
     */
    getDayOfWeek(date: CalendarDate): number {
        return getDay(this.toJsDate(date));
    }

    /**
     * Add days to date
     */
    addDays(date: CalendarDate, days: number): CalendarDate {
        const jsDate = this.toJsDate(date);
        const newDate = addDays(jsDate, days);
        return this.fromJsDate(newDate);
    }

    /**
     * Add months to date
     */
    addMonths(date: CalendarDate, months: number): CalendarDate {
        const jsDate = this.toJsDate(date);
        const newDate = addMonths(jsDate, months);
        return this.fromJsDate(newDate);
    }

    /**
     * Add years to date
     */
    addYears(date: CalendarDate, years: number): CalendarDate {
        const jsDate = this.toJsDate(date);
        const newDate = addYears(jsDate, years);
        return this.fromJsDate(newDate);
    }

    /**
     * Get month name
     */
    getMonthName(month: number, locale: LocaleConfig): string {
        const date = new Date(2000, month - 1, 1);
        return format(date, 'MMMM', { locale: this.getDateFnsLocale(locale) });
    }

    /**
     * Get weekday names
     */
    getWeekdayNames(locale: LocaleConfig): string[] {
        const dateFnsLocale = this.getDateFnsLocale(locale);
        const names: string[] = [];

        // Start from the configured week start day
        for (let i = 0; i < 7; i++) {
            const dayIndex = (locale.weekStartsOn + i) % 7;
            const date = new Date(2000, 0, 2 + dayIndex); // Jan 2, 2000 is a Sunday
            names.push(format(date, 'EEEEEE', { locale: dateFnsLocale })); // Short name
        }

        return names;
    }
}
