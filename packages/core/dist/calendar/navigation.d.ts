import type { CalendarDate } from '../types/calendar';
/**
 * Navigate to next month
 */
export declare function nextMonth(year: number, month: number): {
    year: number;
    month: number;
};
/**
 * Navigate to previous month
 */
export declare function previousMonth(year: number, month: number): {
    year: number;
    month: number;
};
/**
 * Navigate to next year
 */
export declare function nextYear(year: number, month: number): {
    year: number;
    month: number;
};
/**
 * Navigate to previous year
 */
export declare function previousYear(year: number, month: number): {
    year: number;
    month: number;
};
/**
 * Navigate to specific month
 */
export declare function goToMonth(year: number, month: number): {
    year: number;
    month: number;
};
/**
 * Navigate to today
 */
export declare function goToToday(today: CalendarDate): {
    year: number;
    month: number;
};
//# sourceMappingURL=navigation.d.ts.map