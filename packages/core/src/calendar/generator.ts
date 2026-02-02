import type {
    CalendarAdapter,
    CalendarDate,
    CalendarDay,
    CalendarMonth,
    LocaleConfig
} from '../types/calendar';

/**
 * Options for generating calendar month
 */
export interface GenerateCalendarMonthOptions {
    selectedDate?: CalendarDate | null;
    selectedDates?: CalendarDate[];
    selectedRange?: { start: CalendarDate | null; end: CalendarDate | null };
    minDate?: CalendarDate;
    maxDate?: CalendarDate;
    disabledDates?: CalendarDate[];
    disabledDaysOfWeek?: number[];
}

/**
 * Generate a calendar month grid
 */
export function generateCalendarMonth(
    year: number,
    month: number,
    adapter: CalendarAdapter,
    locale: LocaleConfig,
    selectedDate?: CalendarDate | null,
    selectedDates?: CalendarDate[],
    options?: GenerateCalendarMonthOptions
): CalendarMonth {
    const daysInMonth = adapter.getDaysInMonth(year, month);
    const firstDayOfMonth: CalendarDate = { year, month, day: 1 };
    const firstDayWeekday = adapter.getDayOfWeek(firstDayOfMonth);

    // Calculate offset based on locale week start
    const offset = (firstDayWeekday - locale.weekStartsOn + 7) % 7;

    const opts = options || {};
    const today = adapter.today();
    const weeks: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];

    // Fill leading days from previous month
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const daysInPrevMonth = adapter.getDaysInMonth(prevYear, prevMonth);

    for (let i = offset - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date: CalendarDate = { year: prevYear, month: prevMonth, day };
        currentWeek.push(createCalendarDay(
            date, 
            adapter, 
            today, 
            false, 
            selectedDate, 
            selectedDates,
            opts.selectedRange,
            opts.minDate,
            opts.maxDate,
            opts.disabledDates,
            opts.disabledDaysOfWeek
        ));
    }

    // Fill current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const date: CalendarDate = { year, month, day };
        currentWeek.push(createCalendarDay(
            date, 
            adapter, 
            today, 
            true, 
            selectedDate, 
            selectedDates,
            opts.selectedRange,
            opts.minDate,
            opts.maxDate,
            opts.disabledDates,
            opts.disabledDaysOfWeek
        ));

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    // Fill trailing days from next month
    if (currentWeek.length > 0) {
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        let day = 1;

        while (currentWeek.length < 7) {
            const date: CalendarDate = { year: nextYear, month: nextMonth, day };
            currentWeek.push(createCalendarDay(
                date, 
                adapter, 
                today, 
                false, 
                selectedDate, 
                selectedDates,
                opts.selectedRange,
                opts.minDate,
                opts.maxDate,
                opts.disabledDates,
                opts.disabledDaysOfWeek
            ));
            day++;
        }

        weeks.push(currentWeek);
    }

    return {
        year,
        month,
        weeks,
        weekdayLabels: adapter.getWeekdayNames(locale)
    };
}

/**
 * Create a calendar day object
 */
function createCalendarDay(
    date: CalendarDate,
    adapter: CalendarAdapter,
    today: CalendarDate,
    isCurrentMonth: boolean,
    selectedDate?: CalendarDate | null,
    selectedDates?: CalendarDate[],
    selectedRange?: { start: CalendarDate | null; end: CalendarDate | null },
    minDate?: CalendarDate,
    maxDate?: CalendarDate,
    disabledDates?: CalendarDate[],
    disabledDaysOfWeek?: number[]
): CalendarDay {
    const isToday = adapter.isSameDay(date, today);
    
    // Check if date is selected (single or in array)
    const isSelected = selectedDate
        ? adapter.isSameDay(date, selectedDate)
        : selectedDates?.some(d => adapter.isSameDay(d, date)) ?? false;
    
    // Check if date is in range
    const isInRange = selectedRange 
        ? isDateInRange(date, selectedRange.start, selectedRange.end, adapter)
        : false;

    // Check if date is disabled
    const isDisabled = isDateDisabled(
        date,
        minDate,
        maxDate,
        disabledDates,
        disabledDaysOfWeek,
        adapter
    );

    const dayOfWeek = adapter.getDayOfWeek(date);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Saturday or Sunday

    return {
        date,
        isCurrentMonth,
        isToday,
        isSelected: isSelected || isInRange,
        isDisabled,
        isWeekend
    };
}

/**
 * Check if a date is within a range
 */
export function isDateInRange(
    date: CalendarDate,
    start: CalendarDate | null,
    end: CalendarDate | null,
    adapter: CalendarAdapter
): boolean {
    if (!start || !end) return false;

    const compareStart = adapter.compare(date, start);
    const compareEnd = adapter.compare(date, end);

    return compareStart >= 0 && compareEnd <= 0;
}

/**
 * Check if a date is disabled
 */
export function isDateDisabled(
    date: CalendarDate,
    minDate?: CalendarDate,
    maxDate?: CalendarDate,
    disabledDates?: CalendarDate[],
    disabledDaysOfWeek?: number[],
    adapter?: CalendarAdapter
): boolean {
    if (!adapter) return false;

    // Check min/max dates
    if (minDate && adapter.compare(date, minDate) < 0) return true;
    if (maxDate && adapter.compare(date, maxDate) > 0) return true;

    // Check disabled dates
    if (disabledDates?.some(d => adapter.isSameDay(d, date))) return true;

    // Check disabled days of week
    if (disabledDaysOfWeek?.includes(adapter.getDayOfWeek(date))) return true;

    return false;
}
