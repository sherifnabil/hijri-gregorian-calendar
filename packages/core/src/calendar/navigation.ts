import type { CalendarDate } from '../types/calendar';

/**
 * Navigate to next month
 */
export function nextMonth(year: number, month: number): { year: number; month: number } {
    if (month === 12) {
        return { year: year + 1, month: 1 };
    }
    return { year, month: month + 1 };
}

/**
 * Navigate to previous month
 */
export function previousMonth(year: number, month: number): { year: number; month: number } {
    if (month === 1) {
        return { year: year - 1, month: 12 };
    }
    return { year, month: month - 1 };
}

/**
 * Navigate to next year
 */
export function nextYear(year: number, month: number): { year: number; month: number } {
    return { year: year + 1, month };
}

/**
 * Navigate to previous year
 */
export function previousYear(year: number, month: number): { year: number; month: number } {
    return { year: year - 1, month };
}

/**
 * Navigate to specific month
 */
export function goToMonth(year: number, month: number): { year: number; month: number } {
    return { year, month };
}

/**
 * Navigate to today
 */
export function goToToday(today: CalendarDate): { year: number; month: number } {
    return { year: today.year, month: today.month };
}
