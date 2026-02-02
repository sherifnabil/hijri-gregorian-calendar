import type { LocaleConfig } from '../types/calendar';
/**
 * Predefined locale configurations
 */
export declare const LOCALE_EN: LocaleConfig;
export declare const LOCALE_AR: LocaleConfig;
/**
 * Get locale by code
 */
export declare function getLocale(code: string): LocaleConfig;
/**
 * Create custom locale
 */
export declare function createLocale(code: string, direction?: 'ltr' | 'rtl', weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6): LocaleConfig;
/**
 * Convert Western numerals (0-9) to Eastern Arabic numerals (٠-٩)
 */
export declare function toArabicNumerals(num: number | string): string;
/**
 * Convert Eastern Arabic numerals (٠-٩) to Western numerals (0-9)
 */
export declare function fromArabicNumerals(str: string): string;
/**
 * Format number according to locale
 */
export declare function formatNumber(num: number, locale: LocaleConfig): string;
//# sourceMappingURL=locale.d.ts.map