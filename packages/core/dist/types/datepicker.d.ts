import type { CalendarDate } from './calendar';
/**
 * Date range for range picker
 */
export interface DateRange {
    start: CalendarDate | null;
    end: CalendarDate | null;
}
/**
 * Time value (hours, minutes, seconds)
 */
export interface TimeValue {
    hours: number;
    minutes: number;
    seconds: number;
}
/**
 * Date + Time combination
 */
export interface DateTime {
    date: CalendarDate;
    time: TimeValue;
}
/**
 * Datepicker mode
 */
export type DatePickerMode = 'single' | 'range' | 'multiple';
/**
 * Datepicker state
 */
export interface DatePickerState {
    mode: DatePickerMode;
    selectedDate: CalendarDate | null;
    selectedRange: DateRange | null;
    selectedDates: CalendarDate[];
    currentMonth: number;
    currentYear: number;
    isOpen: boolean;
    includeTime: boolean;
    selectedTime: TimeValue | null;
}
/**
 * Datepicker configuration
 */
export interface DatePickerConfig {
    mode?: DatePickerMode;
    minDate?: CalendarDate;
    maxDate?: CalendarDate;
    disabledDates?: CalendarDate[];
    disabledDaysOfWeek?: number[];
    includeTime?: boolean;
    closeOnSelect?: boolean;
    defaultMonth?: number;
    defaultYear?: number;
}
//# sourceMappingURL=datepicker.d.ts.map