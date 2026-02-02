import type { CalendarDate, LocaleConfig } from '../types/calendar';
import { BaseCalendarAdapter } from './base';

/**
 * Simple Hijri calendar adapter using algorithmic calculation
 * Based on Umm al-Qura calendar
 */
export class HijriAdapter extends BaseCalendarAdapter {
    readonly type = 'hijri' as const;

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

    /**
     * Simple Hijri to Gregorian conversion
     * Using approximation algorithm
     */
    toJsDate(date: CalendarDate): Date {
        // Hijri epoch: July 16, 622 CE
        const hijriEpoch = 1948440;

        // Calculate total days from Hijri epoch
        const totalMonths = (date.year * 12) + date.month - 1;
        const totalDays = Math.floor(totalMonths * 29.53) + date.day;

        // Convert to Julian day
        const julianDay = hijriEpoch + totalDays;

        // Convert Julian day to Gregorian
        return this.julianToGregorian(julianDay);
    }

    /**
     * Simple Gregorian to Hijri conversion
     */
    fromJsDate(jsDate: Date): CalendarDate {
        const julian = this.gregorianToJulian(jsDate);
        const hijriEpoch = 1948440;

        const daysSinceEpoch = julian - hijriEpoch;
        const months = Math.floor(daysSinceEpoch / 29.53);

        const year = Math.floor(months / 12) + 1;
        const month = (months % 12) + 1;
        const day = Math.floor(daysSinceEpoch - (months * 29.53)) + 1;

        return { year, month, day: Math.max(1, Math.min(30, day)) };
    }

    /**
     * Convert Gregorian date to Julian day number
     */
    private gregorianToJulian(date: Date): number {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        let a = Math.floor((14 - month) / 12);
        let y = year + 4800 - a;
        let m = month + 12 * a - 3;

        return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    }

    /**
     * Convert Julian day number to Gregorian date
     */
    private julianToGregorian(julian: number): Date {
        let a = julian + 32044;
        let b = Math.floor((4 * a + 3) / 146097);
        let c = a - Math.floor(146097 * b / 4);
        let d = Math.floor((4 * c + 3) / 1461);
        let e = c - Math.floor(1461 * d / 4);
        let m = Math.floor((5 * e + 2) / 153);

        const day = e - Math.floor((153 * m + 2) / 5) + 1;
        const month = m + 3 - 12 * Math.floor(m / 10);
        const year = 100 * b + d - 4800 + Math.floor(m / 10);

        return new Date(year, month - 1, day);
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
            // Format: yyyy-MM-dd or dd/MM/yyyy
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
     * Hijri months alternate between 29 and 30 days
     */
    getDaysInMonth(year: number, month: number): number {
        // Odd months have 30 days, even months have 29 days
        // Exception: 12th month has 30 days in leap years
        if (month % 2 === 1) {
            return 30;
        } else if (month === 12 && this.isLeapYear(year)) {
            return 30;
        }
        return 29;
    }

    /**
     * Check if Hijri year is a leap year
     */
    private isLeapYear(year: number): boolean {
        // In a 30-year cycle, years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29 are leap years
        const remainder = year % 30;
        return [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(remainder);
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
        let newMonth = date.month + months;
        let newYear = date.year;

        while (newMonth > 12) {
            newMonth -= 12;
            newYear++;
        }

        while (newMonth < 1) {
            newMonth += 12;
            newYear--;
        }

        const daysInNewMonth = this.getDaysInMonth(newYear, newMonth);
        const newDay = Math.min(date.day, daysInNewMonth);

        return { year: newYear, month: newMonth, day: newDay };
    }

    /**
     * Add years to a Hijri date
     */
    addYears(date: CalendarDate, years: number): CalendarDate {
        return { ...date, year: date.year + years };
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
