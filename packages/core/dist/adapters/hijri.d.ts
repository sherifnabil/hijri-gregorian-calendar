import type { CalendarDate, LocaleConfig } from '../types/calendar';
import { BaseCalendarAdapter } from './base';
/**
 * Simple Hijri calendar adapter using algorithmic calculation
 * Based on Umm al-Qura calendar
 */
export declare class HijriAdapter extends BaseCalendarAdapter {
    readonly type: "hijri";
    /**
     * Hijri month names in Arabic
     */
    private readonly monthNamesAr;
    /**
     * Hijri month names in English
     */
    private readonly monthNamesEn;
    /**
     * Weekday names in Arabic
     */
    private readonly weekdayNamesAr;
    /**
     * Weekday names in English
     */
    private readonly weekdayNamesEn;
    /**
     * Simple Hijri to Gregorian conversion
     * Using approximation algorithm
     */
    toJsDate(date: CalendarDate): Date;
    /**
     * Simple Gregorian to Hijri conversion
     */
    fromJsDate(jsDate: Date): CalendarDate;
    /**
     * Convert Gregorian date to Julian day number
     */
    private gregorianToJulian;
    /**
     * Convert Julian day number to Gregorian date
     */
    private julianToGregorian;
    /**
     * Get today's date in Hijri
     */
    today(): CalendarDate;
    /**
     * Format a Hijri date to string
     */
    format(date: CalendarDate, formatStr: string, locale: LocaleConfig): string;
    /**
     * Parse a string to Hijri date
     */
    parse(dateStr: string, formatStr: string, _locale: LocaleConfig): CalendarDate | null;
    /**
     * Get days in Hijri month
     * Hijri months alternate between 29 and 30 days
     */
    getDaysInMonth(year: number, month: number): number;
    /**
     * Check if Hijri year is a leap year
     */
    private isLeapYear;
    /**
     * Get day of week for a Hijri date
     */
    getDayOfWeek(date: CalendarDate): number;
    /**
     * Add days to a Hijri date
     */
    addDays(date: CalendarDate, days: number): CalendarDate;
    /**
     * Add months to a Hijri date
     */
    addMonths(date: CalendarDate, months: number): CalendarDate;
    /**
     * Add years to a Hijri date
     */
    addYears(date: CalendarDate, years: number): CalendarDate;
    /**
     * Get Hijri month name
     */
    getMonthName(month: number, locale: LocaleConfig): string;
    /**
     * Get weekday names
     */
    getWeekdayNames(locale: LocaleConfig): string[];
}
//# sourceMappingURL=hijri.d.ts.map