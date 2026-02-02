import { ref, computed, watch, type Ref } from 'vue';
import type {
    CalendarAdapter,
    CalendarDate,
    CalendarMonth,
    LocaleConfig
} from '@dual-datepicker/core';
import {
    GregorianAdapter,
    HijriAdapter,
    generateCalendarMonth,
    nextMonth,
    previousMonth,
    nextYear,
    previousYear,
    goToToday,
    getLocale
} from '@dual-datepicker/core';

export interface DateRange {
    start: CalendarDate | null;
    end: CalendarDate | null;
}

export interface UseDatePickerOptions {
    calendar?: Ref<'gregorian' | 'hijri'> | 'gregorian' | 'hijri';
    locale?: Ref<string> | string;
    range?: Ref<boolean> | boolean;
    time?: Ref<boolean> | boolean;
    modelValue?: Ref<CalendarDate | null | DateRange>;
    format?: Ref<string> | string;
    inputFormat?: Ref<string | null> | string | null;
    minDate?: Ref<CalendarDate | null> | CalendarDate | null;
    maxDate?: Ref<CalendarDate | null> | CalendarDate | null;
    disabledDates?: Ref<CalendarDate[]> | CalendarDate[];
    disabledDaysOfWeek?: Ref<number[]> | number[];
}

export function useDatePicker(options: UseDatePickerOptions = {}) {
    // Reactive options
    const calendarType = ref(
        typeof options.calendar === 'object' ? options.calendar.value : (options.calendar || 'gregorian')
    );
    const localeCode = ref(
        typeof options.locale === 'object' ? options.locale.value : (options.locale || 'en')
    );
    const isRange = ref(
        typeof options.range === 'object' ? options.range.value : (options.range || false)
    );
    const includeTime = ref(
        typeof options.time === 'object' ? options.time.value : (options.time || false)
    );

    // Adapter management
    const adapter = computed<CalendarAdapter>(() => {
        return calendarType.value === 'hijri' ? new HijriAdapter() : new GregorianAdapter();
    });

    const locale = computed<LocaleConfig>(() => {
        return getLocale(localeCode.value);
    });

    // Options
    const dateFormat = ref(
        typeof options.format === 'object' ? options.format.value : (options.format || 'dd/MM/yyyy')
    );
    const inputDateFormat = ref(
        typeof options.inputFormat === 'object' 
            ? options.inputFormat.value 
            : (options.inputFormat || null)
    );
    const minDate = ref(
        typeof options.minDate === 'object' 
            ? options.minDate.value 
            : (options.minDate || null)
    );
    const maxDate = ref(
        typeof options.maxDate === 'object' 
            ? options.maxDate.value 
            : (options.maxDate || null)
    );
    const disabledDates = ref(
        typeof options.disabledDates === 'object' 
            ? options.disabledDates.value 
            : (options.disabledDates || [])
    );
    const disabledDaysOfWeek = ref(
        typeof options.disabledDaysOfWeek === 'object' 
            ? options.disabledDaysOfWeek.value 
            : (options.disabledDaysOfWeek || [])
    );

    // State
    const modelValue = computed(() => options.modelValue?.value);
    const selectedDate = ref<CalendarDate | null>(
        isRange.value ? null : (modelValue.value as CalendarDate | null)
    );
    const selectedRange = ref<DateRange>(
        isRange.value 
            ? (modelValue.value as DateRange || { start: null, end: null })
            : { start: null, end: null }
    );
    const today = computed(() => adapter.value.today());
    // Separate view state (independent of selectedDate)
    const viewMonth = ref<number | null>(null);
    const viewYear = ref<number | null>(null);
    const currentMonth = computed(() => {
        if (viewMonth.value !== null) return viewMonth.value;
        return selectedDate.value ? selectedDate.value.month : today.value.month;
    });
    const currentYear = computed(() => {
        if (viewYear.value !== null) return viewYear.value;
        return selectedDate.value ? selectedDate.value.year : today.value.year;
    });
    const focusedDate = ref<CalendarDate | null>(null);
    const isOpen = ref(false);
    const inputValue = ref('');
    const inputError = ref(false);

    // Calendar month generation
    const calendarMonth = computed<CalendarMonth>(() => {
        return generateCalendarMonth(
            currentYear.value,
            currentMonth.value,
            adapter.value,
            locale.value,
            isRange.value ? null : selectedDate.value,
            undefined,
            {
                selectedRange: isRange.value ? selectedRange.value : undefined,
                minDate: minDate.value || undefined,
                maxDate: maxDate.value || undefined,
                disabledDates: disabledDates.value.length > 0 ? disabledDates.value : undefined,
                disabledDaysOfWeek: disabledDaysOfWeek.value.length > 0 ? disabledDaysOfWeek.value : undefined
            }
        );
    });

    // Month name
    const currentMonthName = computed(() => {
        return adapter.value.getMonthName(currentMonth.value, locale.value);
    });

    // Navigation - only updates view, not selection
    function updateView(year: number, month: number) {
        viewYear.value = year;
        viewMonth.value = month;
    }

    function goToNextMonth() {
        const next = nextMonth(currentYear.value, currentMonth.value);
        updateView(next.year, next.month);
    }

    function goToPreviousMonth() {
        const prev = previousMonth(currentYear.value, currentMonth.value);
        updateView(prev.year, prev.month);
    }

    function goToNextYear() {
        const next = nextYear(currentYear.value, currentMonth.value);
        updateView(next.year, next.month);
    }

    function goToPreviousYear() {
        const prev = previousYear(currentYear.value, currentMonth.value);
        updateView(prev.year, prev.month);
    }

    function goToTodayMonth() {
        const todayDate = adapter.value.today();
        if (validateDate(todayDate)) {
            if (isRange.value) {
                selectedRange.value = { start: todayDate, end: todayDate };
            } else {
                selectedDate.value = todayDate;
            }
            viewMonth.value = null;
            viewYear.value = null;
        }
    }

    // Date selection
    function selectDate(date: CalendarDate) {
        if (isRange.value) {
            // Range selection logic
            if (!selectedRange.value.start || (selectedRange.value.start && selectedRange.value.end)) {
                // Start new range
                selectedRange.value = { start: date, end: null };
            } else {
                // Complete the range
                const compare = adapter.value.compare(date, selectedRange.value.start);
                if (compare < 0) {
                    // Selected date is before start, make it the new start
                    selectedRange.value = { start: date, end: selectedRange.value.start };
                } else {
                    // Selected date is after start, make it the end
                    selectedRange.value = { start: selectedRange.value.start, end: date };
                }
                isOpen.value = false;
            }
        } else {
            // Single date selection
        selectedDate.value = date;
            viewMonth.value = null;
            viewYear.value = null;
            isOpen.value = false;
        }
    }

    function clearSelection() {
        if (isRange.value) {
            selectedRange.value = { start: null, end: null };
        } else {
            selectedDate.value = null;
        }
        inputValue.value = '';
        inputError.value = false;
        viewMonth.value = null;
        viewYear.value = null;
    }

    // Validation
    function validateDate(date: CalendarDate): boolean {
        if (!date || !adapter.value.isValid(date)) return false;
        
        // Check min/max constraints
        if (minDate.value && adapter.value.compare(date, minDate.value) < 0) return false;
        if (maxDate.value && adapter.value.compare(date, maxDate.value) > 0) return false;
        
        // Check disabled dates
        if (disabledDates.value.some(d => adapter.value.isSameDay(d, date))) return false;
        
        // Check disabled days of week
        const dayOfWeek = adapter.value.getDayOfWeek(date);
        if (disabledDaysOfWeek.value.includes(dayOfWeek)) return false;
        
        return true;
    }

    // Input parsing
    const displayFormat = computed(() => inputDateFormat.value || dateFormat.value);

    function parseInputValue(value: string): boolean {
        if (!value.trim()) {
            if (isRange.value) {
                selectedRange.value = { start: null, end: null };
            } else {
        selectedDate.value = null;
            }
            inputError.value = false;
            return true;
        }

        const format = displayFormat.value;

        if (isRange.value) {
            // Try to parse range (format: "start - end" or "start-end")
            const parts = value.split(/[\s-–—]+/).filter(p => p.trim());
            if (parts.length === 2) {
                const start = adapter.value.parse(parts[0].trim(), format, locale.value);
                const end = adapter.value.parse(parts[1].trim(), format, locale.value);
                if (start && end && validateDate(start) && validateDate(end)) {
                    const compare = adapter.value.compare(start, end);
                    selectedRange.value = compare <= 0 
                        ? { start, end }
                        : { start: end, end: start };
                    inputError.value = false;
                    return true;
                }
            }
            inputError.value = true;
            return false;
        } else {
            const parsed = adapter.value.parse(value, format, locale.value);
            if (parsed && validateDate(parsed)) {
                selectedDate.value = parsed;
                inputError.value = false;
                viewMonth.value = null;
                viewYear.value = null;
                return true;
            } else {
                inputError.value = true;
                return false;
            }
        }
    }

    function updateInputValue() {
        inputValue.value = formattedDate.value;
        inputError.value = false;
    }

    // Calendar switching
    function switchCalendar(newCalendar: 'gregorian' | 'hijri') {
        if (calendarType.value === newCalendar) return;

        // Convert current selected date to new calendar system
        if (isRange.value && selectedRange.value.start) {
            const jsDate = adapter.value.toJsDate(selectedRange.value.start);
            calendarType.value = newCalendar;
            const newAdapter = calendarType.value === 'hijri' ? new HijriAdapter() : new GregorianAdapter();
            const convertedStart = newAdapter.fromJsDate(jsDate);
            if (selectedRange.value.end) {
                const jsDateEnd = adapter.value.toJsDate(selectedRange.value.end);
                const convertedEnd = newAdapter.fromJsDate(jsDateEnd);
                selectedRange.value = { start: convertedStart, end: convertedEnd };
            } else {
                selectedRange.value = { start: convertedStart, end: null };
            }
            viewMonth.value = null;
            viewYear.value = null;
        } else if (selectedDate.value) {
            const jsDate = adapter.value.toJsDate(selectedDate.value);
            calendarType.value = newCalendar;
            const newAdapter = calendarType.value === 'hijri' ? new HijriAdapter() : new GregorianAdapter();
            selectedDate.value = newAdapter.fromJsDate(jsDate);
            viewMonth.value = null;
            viewYear.value = null;
        } else {
            calendarType.value = newCalendar;
            const todayInNewCalendar = adapter.value.today();
            viewMonth.value = null;
            viewYear.value = null;
        }
    }

    // Format selected date
    const formattedDate = computed(() => {
        if (isRange.value) {
            if (!selectedRange.value || (!selectedRange.value.start && !selectedRange.value.end)) {
                return '';
            }
            if (selectedRange.value.start && selectedRange.value.end) {
                const start = adapter.value.format(selectedRange.value.start, dateFormat.value, locale.value);
                const end = adapter.value.format(selectedRange.value.end, dateFormat.value, locale.value);
                return `${start} - ${end}`;
            }
            if (selectedRange.value.start) {
                return adapter.value.format(selectedRange.value.start, dateFormat.value, locale.value);
            }
            return '';
        }
        if (!selectedDate.value) return '';
        return adapter.value.format(selectedDate.value, dateFormat.value, locale.value);
    });

    // Toggle picker
    function toggle() {
        isOpen.value = !isOpen.value;
    }

    function open() {
        isOpen.value = true;
    }

    function close() {
        isOpen.value = false;
    }

    // Sync modelValue changes to internal state
    if (options.modelValue) {
        watch(() => options.modelValue.value, (newVal) => {
            if (isRange.value) {
                if (newVal && typeof newVal === 'object' && 'start' in newVal) {
                    selectedRange.value = newVal as DateRange;
                    updateInputValue();
                } else if (!newVal) {
                    selectedRange.value = { start: null, end: null };
                    updateInputValue();
                }
            } else {
                if (newVal && !('start' in newVal)) {
                    selectedDate.value = newVal as CalendarDate;
                    updateInputValue();
                    viewMonth.value = null;
                    viewYear.value = null;
                } else if (!newVal) {
                    selectedDate.value = null;
                    updateInputValue();
                    viewMonth.value = null;
                    viewYear.value = null;
                }
            }
        }, { immediate: true });
    }

    return {
        // State
        selectedDate,
        selectedRange,
        today,
        currentMonth,
        currentYear,
        currentMonthName,
        focusedDate,
        isOpen,
        calendarMonth,
        adapter,
        locale,
        calendarType,
        localeCode,
        viewMonth,
        viewYear,
        inputValue,
        inputError,
        displayFormat,

        // Actions
        selectDate,
        clearSelection,
        updateView,
        goToNextMonth,
        goToPreviousMonth,
        goToNextYear,
        goToPreviousYear,
        goToTodayMonth,
        switchCalendar,
        toggle,
        open,
        close,
        validateDate,
        parseInputValue,
        updateInputValue,

        // Computed
        formattedDate
    };
}
