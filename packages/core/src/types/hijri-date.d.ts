declare module 'hijri-date' {
    class HijriDate {
        constructor(yearOrDate?: number | Date | string, month?: number, day?: number);
        getFullYear(): number;
        getMonth(): number;
        getDate(): number;
        toGregorian(): Date;
    }
    export default HijriDate;
}
