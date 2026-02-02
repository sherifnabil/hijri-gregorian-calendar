import type { LocaleConfig } from '../types/calendar';

/**
 * Predefined locale configurations
 */
export const LOCALE_EN: LocaleConfig = {
    code: 'en',
    direction: 'ltr',
    weekStartsOn: 0 // Sunday
};

export const LOCALE_AR: LocaleConfig = {
    code: 'ar',
    direction: 'rtl',
    weekStartsOn: 6 // Saturday
};

/**
 * Get locale by code
 */
export function getLocale(code: string): LocaleConfig {
    switch (code.toLowerCase()) {
        case 'ar':
            return LOCALE_AR;
        case 'en':
        default:
            return LOCALE_EN;
    }
}

/**
 * Create custom locale
 */
export function createLocale(
    code: string,
    direction: 'ltr' | 'rtl' = 'ltr',
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0
): LocaleConfig {
    return { code, direction, weekStartsOn };
}

/**
 * Convert Western numerals (0-9) to Eastern Arabic numerals (٠-٩)
 */
export function toArabicNumerals(num: number | string): string {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

/**
 * Convert Eastern Arabic numerals (٠-٩) to Western numerals (0-9)
 */
export function fromArabicNumerals(str: string): string {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    let result = str;
    arabicNumerals.forEach((arabic, index) => {
        result = result.replace(new RegExp(arabic, 'g'), String(index));
    });
    return result;
}

/**
 * Format number according to locale
 */
export function formatNumber(num: number, locale: LocaleConfig): string {
    if (locale.code === 'ar') {
        return toArabicNumerals(num);
    }
    return String(num);
}
