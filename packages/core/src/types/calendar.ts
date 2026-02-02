/**
 * Represents a calendar date with year, month, and day
 */
export interface CalendarDate {
    year: number;
    month: number; // 1-indexed (1 = January/Muharram)
    day: number;
}

/**
 * Represents a single day in the calendar grid
 */
export interface CalendarDay {
    date: CalendarDate;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
    isWeekend: boolean;
}

/**
 * Represents a week in the calendar
 */
export type CalendarWeek = CalendarDay[];

/**
 * Represents a full month grid (weeks × days)
 */
export interface CalendarMonth {
    year: number;
    month: number;
    weeks: CalendarWeek[];
    weekdayLabels: string[];
}

/**
 * Locale configuration
 */
export interface LocaleConfig {
    code: string; // 'en', 'ar', etc.
    direction: 'ltr' | 'rtl';
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
}

/**
 * Calendar adapter interface - must be implemented by all calendar systems
 */
export interface CalendarAdapter {
    /**
     * Calendar system identifier
     */
    readonly type: 'gregorian' | 'hijri';

    /**
     * Get today's date in this calendar system
     */
    today(): CalendarDate;

    /**
     * Format a date to a string
     */
    format(date: CalendarDate, formatStr: string, locale: LocaleConfig): string;

    /**
     * Parse a string to a date
     */
    parse(dateStr: string, formatStr: string, locale: LocaleConfig): CalendarDate | null;

    /**
     * Get the number of days in a specific month
     */
    getDaysInMonth(year: number, month: number): number;

    /**
     * Get the day of week for a specific date (0 = Sunday)
     */
    getDayOfWeek(date: CalendarDate): number;

    /**
     * Add/subtract days to a date
     */
    addDays(date: CalendarDate, days: number): CalendarDate;

    /**
     * Add/subtract months to a date
     */
    addMonths(date: CalendarDate, months: number): CalendarDate;

    /**
     * Add/subtract years to a date
     */
    addYears(date: CalendarDate, years: number): CalendarDate;

    /**
     * Compare two dates (-1: date1 < date2, 0: equal, 1: date1 > date2)
     */
    compare(date1: CalendarDate, date2: CalendarDate): number;

    /**
     * Check if two dates are the same day
     */
    isSameDay(date1: CalendarDate, date2: CalendarDate): boolean;

    /**
     * Check if a date is valid
     */
    isValid(date: CalendarDate): boolean;

    /**
     * Get the name of the month
     */
    getMonthName(month: number, locale: LocaleConfig): string;

    /**
     * Get weekday names (short form)
     */
    getWeekdayNames(locale: LocaleConfig): string[];

    /**
     * Convert to JavaScript Date object (for interop)
     */
    toJsDate(date: CalendarDate): Date;

    /**
     * Convert from JavaScript Date object
     */
    fromJsDate(jsDate: Date): CalendarDate;
}
