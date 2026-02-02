"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const dateFns = require("date-fns");
const locale = require("date-fns/locale");
class BaseCalendarAdapter {
  /**
   * Compare two dates
   */
  compare(date1, date2) {
    if (date1.year !== date2.year) {
      return date1.year - date2.year;
    }
    if (date1.month !== date2.month) {
      return date1.month - date2.month;
    }
    return date1.day - date2.day;
  }
  /**
   * Check if two dates are the same day
   */
  isSameDay(date1, date2) {
    return date1.year === date2.year && date1.month === date2.month && date1.day === date2.day;
  }
  /**
   * Basic validation
   */
  isValid(date) {
    if (!date || typeof date.year !== "number" || typeof date.month !== "number" || typeof date.day !== "number") {
      return false;
    }
    if (date.month < 1 || date.month > 12) {
      return false;
    }
    const daysInMonth = this.getDaysInMonth(date.year, date.month);
    if (date.day < 1 || date.day > daysInMonth) {
      return false;
    }
    return true;
  }
}
class GregorianAdapter extends BaseCalendarAdapter {
  constructor() {
    super(...arguments);
    this.type = "gregorian";
  }
  /**
   * Get locale object for date-fns
   */
  getDateFnsLocale(locale$1) {
    switch (locale$1.code) {
      case "ar":
        return locale.ar;
      case "en":
      default:
        return locale.enUS;
    }
  }
  /**
   * Convert CalendarDate to JS Date
   */
  toJsDate(date) {
    return new Date(date.year, date.month - 1, date.day);
  }
  /**
   * Convert JS Date to CalendarDate
   */
  fromJsDate(jsDate) {
    return {
      year: jsDate.getFullYear(),
      month: jsDate.getMonth() + 1,
      day: jsDate.getDate()
    };
  }
  /**
   * Get today's date
   */
  today() {
    return this.fromJsDate(dateFns.startOfToday());
  }
  /**
   * Format a date to string
   */
  format(date, formatStr, locale2) {
    const jsDate = this.toJsDate(date);
    return dateFns.format(jsDate, formatStr, { locale: this.getDateFnsLocale(locale2) });
  }
  /**
   * Parse a string to date
   */
  parse(dateStr, formatStr, locale2) {
    try {
      const jsDate = dateFns.parse(dateStr, formatStr, /* @__PURE__ */ new Date(), {
        locale: this.getDateFnsLocale(locale2)
      });
      if (!dateFns.isValid(jsDate)) {
        return null;
      }
      return this.fromJsDate(jsDate);
    } catch {
      return null;
    }
  }
  /**
   * Get days in month
   */
  getDaysInMonth(year, month) {
    return dateFns.getDaysInMonth(new Date(year, month - 1));
  }
  /**
   * Get day of week (0 = Sunday)
   */
  getDayOfWeek(date) {
    return dateFns.getDay(this.toJsDate(date));
  }
  /**
   * Add days to date
   */
  addDays(date, days) {
    const jsDate = this.toJsDate(date);
    const newDate = dateFns.addDays(jsDate, days);
    return this.fromJsDate(newDate);
  }
  /**
   * Add months to date
   */
  addMonths(date, months) {
    const jsDate = this.toJsDate(date);
    const newDate = dateFns.addMonths(jsDate, months);
    return this.fromJsDate(newDate);
  }
  /**
   * Add years to date
   */
  addYears(date, years) {
    const jsDate = this.toJsDate(date);
    const newDate = dateFns.addYears(jsDate, years);
    return this.fromJsDate(newDate);
  }
  /**
   * Get month name
   */
  getMonthName(month, locale2) {
    const date = new Date(2e3, month - 1, 1);
    return dateFns.format(date, "MMMM", { locale: this.getDateFnsLocale(locale2) });
  }
  /**
   * Get weekday names
   */
  getWeekdayNames(locale2) {
    const dateFnsLocale = this.getDateFnsLocale(locale2);
    const names = [];
    for (let i = 0; i < 7; i++) {
      const dayIndex = (locale2.weekStartsOn + i) % 7;
      const date = new Date(2e3, 0, 2 + dayIndex);
      names.push(dateFns.format(date, "EEEEEE", { locale: dateFnsLocale }));
    }
    return names;
  }
}
class HijriAdapter extends BaseCalendarAdapter {
  constructor() {
    super(...arguments);
    this.type = "hijri";
    this.monthNamesAr = [
      "محرم",
      "صفر",
      "ربيع الأول",
      "ربيع الثاني",
      "جمادى الأولى",
      "جمادى الآخرة",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذو القعدة",
      "ذو الحجة"
    ];
    this.monthNamesEn = [
      "Muharram",
      "Safar",
      "Rabi' al-Awwal",
      "Rabi' al-Thani",
      "Jumada al-Ula",
      "Jumada al-Akhirah",
      "Rajab",
      "Sha'ban",
      "Ramadan",
      "Shawwal",
      "Dhu al-Qi'dah",
      "Dhu al-Hijjah"
    ];
    this.weekdayNamesAr = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    this.weekdayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  }
  /**
   * Simple Hijri to Gregorian conversion
   * Using approximation algorithm
   */
  toJsDate(date) {
    const hijriEpoch = 1948440;
    const totalMonths = date.year * 12 + date.month - 1;
    const totalDays = Math.floor(totalMonths * 29.53) + date.day;
    const julianDay = hijriEpoch + totalDays;
    return this.julianToGregorian(julianDay);
  }
  /**
   * Simple Gregorian to Hijri conversion
   */
  fromJsDate(jsDate) {
    const julian = this.gregorianToJulian(jsDate);
    const hijriEpoch = 1948440;
    const daysSinceEpoch = julian - hijriEpoch;
    const months = Math.floor(daysSinceEpoch / 29.53);
    const year = Math.floor(months / 12) + 1;
    const month = months % 12 + 1;
    const day = Math.floor(daysSinceEpoch - months * 29.53) + 1;
    return { year, month, day: Math.max(1, Math.min(30, day)) };
  }
  /**
   * Convert Gregorian date to Julian day number
   */
  gregorianToJulian(date) {
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
  julianToGregorian(julian) {
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
  today() {
    return this.fromJsDate(/* @__PURE__ */ new Date());
  }
  /**
   * Format a Hijri date to string
   */
  format(date, formatStr, locale2) {
    const monthName = this.getMonthName(date.month, locale2);
    return formatStr.replace("yyyy", String(date.year)).replace("MMMM", monthName).replace("MM", String(date.month).padStart(2, "0")).replace("dd", String(date.day).padStart(2, "0"));
  }
  /**
   * Parse a string to Hijri date
   */
  parse(dateStr, formatStr, _locale) {
    try {
      const parts = dateStr.split(/[-/]/);
      let year, month, day;
      if (formatStr.startsWith("yyyy")) {
        [year, month, day] = parts.map(Number);
      } else {
        [day, month, year] = parts.map(Number);
      }
      const date = { year, month, day };
      return this.isValid(date) ? date : null;
    } catch {
      return null;
    }
  }
  /**
   * Get days in Hijri month
   * Hijri months alternate between 29 and 30 days
   */
  getDaysInMonth(year, month) {
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
  isLeapYear(year) {
    const remainder = year % 30;
    return [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(remainder);
  }
  /**
   * Get day of week for a Hijri date
   */
  getDayOfWeek(date) {
    const jsDate = this.toJsDate(date);
    return jsDate.getDay();
  }
  /**
   * Add days to a Hijri date
   */
  addDays(date, days) {
    const jsDate = this.toJsDate(date);
    jsDate.setDate(jsDate.getDate() + days);
    return this.fromJsDate(jsDate);
  }
  /**
   * Add months to a Hijri date
   */
  addMonths(date, months) {
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
  addYears(date, years) {
    return { ...date, year: date.year + years };
  }
  /**
   * Get Hijri month name
   */
  getMonthName(month, locale2) {
    const names = locale2.code === "ar" ? this.monthNamesAr : this.monthNamesEn;
    return names[month - 1] || "";
  }
  /**
   * Get weekday names
   */
  getWeekdayNames(locale2) {
    const names = locale2.code === "ar" ? this.weekdayNamesAr : this.weekdayNamesEn;
    const result = [];
    for (let i = 0; i < 7; i++) {
      const dayIndex = (locale2.weekStartsOn + i) % 7;
      result.push(names[dayIndex]);
    }
    return result;
  }
}
function generateCalendarMonth(year, month, adapter, locale2, selectedDate, selectedDates) {
  const daysInMonth = adapter.getDaysInMonth(year, month);
  const firstDayOfMonth = { year, month, day: 1 };
  const firstDayWeekday = adapter.getDayOfWeek(firstDayOfMonth);
  const offset = (firstDayWeekday - locale2.weekStartsOn + 7) % 7;
  const today = adapter.today();
  const weeks = [];
  let currentWeek = [];
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = adapter.getDaysInMonth(prevYear, prevMonth);
  for (let i = offset - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = { year: prevYear, month: prevMonth, day };
    currentWeek.push(createCalendarDay(date, adapter, today, false, selectedDate, selectedDates));
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = { year, month, day };
    currentWeek.push(createCalendarDay(date, adapter, today, true, selectedDate, selectedDates));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    const nextMonth2 = month === 12 ? 1 : month + 1;
    const nextYear2 = month === 12 ? year + 1 : year;
    let day = 1;
    while (currentWeek.length < 7) {
      const date = { year: nextYear2, month: nextMonth2, day };
      currentWeek.push(createCalendarDay(date, adapter, today, false, selectedDate, selectedDates));
      day++;
    }
    weeks.push(currentWeek);
  }
  return {
    year,
    month,
    weeks,
    weekdayLabels: adapter.getWeekdayNames(locale2)
  };
}
function createCalendarDay(date, adapter, today, isCurrentMonth, selectedDate, selectedDates) {
  const isToday = adapter.isSameDay(date, today);
  const isSelected = selectedDate ? adapter.isSameDay(date, selectedDate) : (selectedDates == null ? void 0 : selectedDates.some((d) => adapter.isSameDay(d, date))) ?? false;
  const dayOfWeek = adapter.getDayOfWeek(date);
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  return {
    date,
    isCurrentMonth,
    isToday,
    isSelected,
    isDisabled: false,
    isWeekend
  };
}
function isDateInRange(date, start, end, adapter) {
  if (!start || !end) return false;
  const compareStart = adapter.compare(date, start);
  const compareEnd = adapter.compare(date, end);
  return compareStart >= 0 && compareEnd <= 0;
}
function isDateDisabled(date, minDate, maxDate, disabledDates, disabledDaysOfWeek, adapter) {
  if (!adapter) return false;
  if (minDate && adapter.compare(date, minDate) < 0) return true;
  if (maxDate && adapter.compare(date, maxDate) > 0) return true;
  if (disabledDates == null ? void 0 : disabledDates.some((d) => adapter.isSameDay(d, date))) return true;
  if (disabledDaysOfWeek == null ? void 0 : disabledDaysOfWeek.includes(adapter.getDayOfWeek(date))) return true;
  return false;
}
function nextMonth(year, month) {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}
function previousMonth(year, month) {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}
function nextYear(year, month) {
  return { year: year + 1, month };
}
function previousYear(year, month) {
  return { year: year - 1, month };
}
function goToMonth(year, month) {
  return { year, month };
}
function goToToday(today) {
  return { year: today.year, month: today.month };
}
function getKeyboardAction(event) {
  switch (event.key) {
    case "ArrowUp":
      return { type: "navigate", direction: "up" };
    case "ArrowDown":
      return { type: "navigate", direction: "down" };
    case "ArrowLeft":
      return { type: "navigate", direction: "left" };
    case "ArrowRight":
      return { type: "navigate", direction: "right" };
    case "Enter":
    case " ":
      return { type: "select" };
    case "Escape":
      return { type: "close" };
    case "t":
    case "T":
      if (event.ctrlKey || event.metaKey) {
        return { type: "today" };
      }
      return null;
    default:
      return null;
  }
}
function getNavigatedDate(currentDate, direction, addDays) {
  switch (direction) {
    case "left":
      return addDays(currentDate, -1);
    case "right":
      return addDays(currentDate, 1);
    case "up":
      return addDays(currentDate, -7);
    case "down":
      return addDays(currentDate, 7);
  }
}
const LOCALE_EN = {
  code: "en",
  direction: "ltr",
  weekStartsOn: 0
  // Sunday
};
const LOCALE_AR = {
  code: "ar",
  direction: "rtl",
  weekStartsOn: 6
  // Saturday
};
function getLocale(code) {
  switch (code.toLowerCase()) {
    case "ar":
      return LOCALE_AR;
    case "en":
    default:
      return LOCALE_EN;
  }
}
function createLocale(code, direction = "ltr", weekStartsOn = 0) {
  return { code, direction, weekStartsOn };
}
function toArabicNumerals(num) {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num).replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}
function fromArabicNumerals(str) {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let result = str;
  arabicNumerals.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, "g"), String(index));
  });
  return result;
}
function formatNumber(num, locale2) {
  if (locale2.code === "ar") {
    return toArabicNumerals(num);
  }
  return String(num);
}
exports.BaseCalendarAdapter = BaseCalendarAdapter;
exports.GregorianAdapter = GregorianAdapter;
exports.HijriAdapter = HijriAdapter;
exports.LOCALE_AR = LOCALE_AR;
exports.LOCALE_EN = LOCALE_EN;
exports.createLocale = createLocale;
exports.formatNumber = formatNumber;
exports.fromArabicNumerals = fromArabicNumerals;
exports.generateCalendarMonth = generateCalendarMonth;
exports.getKeyboardAction = getKeyboardAction;
exports.getLocale = getLocale;
exports.getNavigatedDate = getNavigatedDate;
exports.goToMonth = goToMonth;
exports.goToToday = goToToday;
exports.isDateDisabled = isDateDisabled;
exports.isDateInRange = isDateInRange;
exports.nextMonth = nextMonth;
exports.nextYear = nextYear;
exports.previousMonth = previousMonth;
exports.previousYear = previousYear;
exports.toArabicNumerals = toArabicNumerals;
//# sourceMappingURL=index.cjs.map
