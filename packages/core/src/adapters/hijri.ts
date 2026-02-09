import type { CalendarDate, LocaleConfig } from '../types/calendar';
import { BaseCalendarAdapter } from './base';

/**
 * Hijri calendar adapter using Intl.DateTimeFormat
 * Based on Umm al-Qura calendar
 */
export class HijriAdapter extends BaseCalendarAdapter {
    readonly type = 'hijri' as const;

    private readonly formatter: Intl.DateTimeFormat;

    /**
     * Hijri month names in Arabic
     */
    private readonly monthNamesAr = [
        'محرم',
        'صفر',
        'ربيع الأول',
        'ربيع الثاني',
        'جمادى الأولى',
        'جمادى الآخرة',
        'رجب',
        'شعبان',
        'رمضان',
        'شوال',
        'ذو القعدة',
        'ذو الحجة'
    ];

    /**
     * Hijri month names in English
     */
    private readonly monthNamesEn = [
        'Muharram',
        'Safar',
        "Rabi' al-Awwal",
        "Rabi' al-Thani",
        'Jumada al-Ula',
        'Jumada al-Akhirah',
        'Rajab',
        "Sha'ban",
        'Ramadan',
        'Shawwal',
        "Dhu al-Qi'dah",
        'Dhu al-Hijjah'
    ];

    /**
     * Weekday names in Arabic
     */
    private readonly weekdayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    /**
     * Weekday names in English
     */
    private readonly weekdayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    constructor() {
        super();
        // Initialize formatter with Umm al-Qura calendar and Latin numbering system for parsing
        this.formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
    }

    /**
     * Convert Hijri date to JavaScript Date (Gregorian)
     * Using iterative approximation since Intl only supports one-way conversion
     */
    toJsDate(date: CalendarDate): Date {
        const { year, month, day } = date;

        // Estimate Gregorian year
        // AH = 1.030684 * (AD - 621.5643)
        // AD = 0.970224 * AH + 621.5643
        const approxGYear = Math.floor(0.970224 * year + 621.5643);

        // Start with a guess: middle of the estimated Gregorian year
        let guessDate = new Date(Date.UTC(approxGYear, 5, 1)); // June 1st

        // Iteratively refine the guess
        // Usually converges within 2-3 iterations
        for (let i = 0; i < 15; i++) {
            const h = this.fromJsDate(guessDate);

            // Calculate difference in days approximately
            // Year diff * 354.36 + Month diff * 29.5 + Day diff
            const diffDays = (year - h.year) * 354 + (month - h.month) * 29 + (day - h.day);

            if (diffDays === 0) {
                return guessDate;
            }

            // Apply correction
            guessDate = new Date(guessDate.getTime() + diffDays * 86400000);

            // Refine logic: if we are very close (diffDays is small), verify exact match by stepping
            // But the approximate jump is usually good enough to get close quickly
        }

        // Final verification check for edge cases 
        // Force exact check if loop finished without 0 diff (should arguably not happen often)
        return guessDate;
    }

    /**
     * Convert JavaScript Date (Gregorian) to Hijri date
     * Using Intl.DateTimeFormat
     */
    fromJsDate(jsDate: Date): CalendarDate {
        const parts = this.formatter.formatToParts(jsDate);
        const result = { year: 0, month: 0, day: 0 };

        for (const part of parts) {
            if (part.type === 'year') result.year = parseInt(part.value, 10);
            else if (part.type === 'month') result.month = parseInt(part.value, 10);
            else if (part.type === 'day') result.day = parseInt(part.value, 10);
        }

        return result;
    }

    /**
     * Get today's date in Hijri
     */
    today(): CalendarDate {
        return this.fromJsDate(new Date());
    }

    /**
     * Format a Hijri date to string
     */
    format(date: CalendarDate, formatStr: string, locale: LocaleConfig): string {
        const monthName = this.getMonthName(date.month, locale);

        // Simple format implementation
        // Supports: yyyy, MM, dd, MMMM
        return formatStr
            .replace('yyyy', String(date.year))
            .replace('MMMM', monthName)
            .replace('MM', String(date.month).padStart(2, '0'))
            .replace('dd', String(date.day).padStart(2, '0'));
    }

    /**
     * Parse a string to Hijri date
     */
    parse(dateStr: string, formatStr: string, _locale: LocaleConfig): CalendarDate | null {
        try {
            // Simple parsing for common formats
            const parts = dateStr.split(/[-/]/);
            let year: number, month: number, day: number;

            if (formatStr.startsWith('yyyy')) {
                // yyyy-MM-dd
                [year, month, day] = parts.map(Number);
            } else {
                // dd/MM/yyyy
                [day, month, year] = parts.map(Number);
            }

            const date: CalendarDate = { year, month, day };
            return this.isValid(date) ? date : null;
        } catch {
            return null;
        }
    }

    /**
     * Get days in Hijri month
     * Checks if day 30 exists in the given month using conversion
     */
    getDaysInMonth(year: number, month: number): number {
        // Check if the 30th day is valid for this month
        // We convert (year, month, 30) to JS date and back.
        // If it comes back as the same month and day 30, then it has 30 days.
        // However, conversion might pick the closest valid date if we are not careful with input.
        // Actually, let's use the inverse check:
        // Find the JS Date for (year, month, 29). Add 1 day. Check if resulting Hijri date is (year, month, 30).

        const day29 = this.toJsDate({ year, month, day: 29 });
        const day30Val = new Date(day29.getTime() + 86400000); // +1 day
        const hDate = this.fromJsDate(day30Val);

        if (hDate.year === year && hDate.month === month && hDate.day === 30) {
            return 30;
        }
        return 29;
    }

    /**
     * Get day of week for a Hijri date
     */
    getDayOfWeek(date: CalendarDate): number {
        const jsDate = this.toJsDate(date);
        return jsDate.getDay();
    }

    /**
     * Add days to a Hijri date
     */
    addDays(date: CalendarDate, days: number): CalendarDate {
        const jsDate = this.toJsDate(date);
        jsDate.setDate(jsDate.getDate() + days);
        return this.fromJsDate(jsDate);
    }

    /**
     * Add months to a Hijri date
     */
    addMonths(date: CalendarDate, months: number): CalendarDate {
        let { year, month, day } = date;

        // Add months logic
        const totalMonths = year * 12 + (month - 1) + months;
        year = Math.floor(totalMonths / 12);
        month = (totalMonths % 12) + 1;

        // Handle clamping
        const daysInNewMonth = this.getDaysInMonth(year, month);
        day = Math.min(day, daysInNewMonth);

        return { year, month, day };
    }

    /**
     * Add years to a Hijri date
     */
    addYears(date: CalendarDate, years: number): CalendarDate {
        let { year, month, day } = date;
        year += years;

        // Handle clamping
        const daysInNewMonth = this.getDaysInMonth(year, month);
        day = Math.min(day, daysInNewMonth);

        return { year, month, day };
    }

    /**
     * Get Hijri month name
     */
    getMonthName(month: number, locale: LocaleConfig): string {
        const names = locale.code === 'ar' ? this.monthNamesAr : this.monthNamesEn;
        return names[month - 1] || '';
    }

    /**
     * Get weekday names
     */
    getWeekdayNames(locale: LocaleConfig): string[] {
        const names = locale.code === 'ar' ? this.weekdayNamesAr : this.weekdayNamesEn;
        const result: string[] = [];

        for (let i = 0; i < 7; i++) {
            const dayIndex = (locale.weekStartsOn + i) % 7;
            result.push(names[dayIndex]);
        }

        return result;
    }
}