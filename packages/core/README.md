# @sherifnabil/hijri-gregorian-calendar-core

Framework-agnostic calendar logic for Hijri and Gregorian calendars.

## Installation

```bash
npm install @sherifnabil/hijri-gregorian-calendar-core
```

## Features

- **Calendar Adapters**: Gregorian (using `date-fns`) and Hijri (using `hijri-date`)
- **Calendar Grid Generator**: Generate calendar months with date constraints
- **Date Utilities**: Formatting, parsing, and navigation
- **Locale Support**: English and Arabic locales with RTL support
- **TypeScript**: Full type definitions included

## Usage

### Calendar Adapters

```typescript
import { GregorianAdapter, HijriAdapter } from '@sherifnabil/hijri-gregorian-calendar-core';

// Gregorian calendar
const gregorian = new GregorianAdapter();
const today = gregorian.today();
const formatted = gregorian.format(today, 'dd/MM/yyyy', getLocale('en'));

// Hijri calendar
const hijri = new HijriAdapter();
const todayHijri = hijri.today();
const formattedHijri = hijri.format(todayHijri, 'dd/MM/yyyy', getLocale('ar'));
```

### Calendar Month Generation

```typescript
import { generateCalendarMonth, GregorianAdapter, getLocale } from '@sherifnabil/hijri-gregorian-calendar-core';

const adapter = new GregorianAdapter();
const locale = getLocale('en');

const calendarMonth = generateCalendarMonth(
  2024,
  1, // January
  adapter,
  locale,
  { year: 2024, month: 1, day: 15 }, // selected date
  undefined, // selected range (optional)
  {
    minDate: { year: 2024, month: 1, day: 1 },
    maxDate: { year: 2024, month: 1, day: 31 },
    disabledDates: [
      { year: 2024, month: 1, day: 1 }
    ],
    disabledDaysOfWeek: [0, 6] // Sunday and Saturday
  }
);
```

### Date Navigation

```typescript
import { nextMonth, previousMonth, nextYear, previousYear, goToToday } from '@sherifnabil/hijri-gregorian-calendar-core';
import { GregorianAdapter } from '@sherifnabil/hijri-gregorian-calendar-core';

const adapter = new GregorianAdapter();
const date = { year: 2024, month: 1, day: 15 };

const next = nextMonth(date, adapter);
const prev = previousMonth(date, adapter);
const nextYr = nextYear(date, adapter);
const prevYr = previousYear(date, adapter);
const today = goToToday(adapter);
```

### Locale Support

```typescript
import { getLocale } from '@sherifnabil/hijri-gregorian-calendar-core';

const english = getLocale('en');
const arabic = getLocale('ar');

// Locale includes:
// - monthNames: Array of month names
// - dayNames: Array of day names
// - direction: 'ltr' or 'rtl'
// - code: locale code
```

## API Reference

### CalendarAdapter

Base interface for calendar adapters:

```typescript
interface CalendarAdapter {
  today(): CalendarDate;
  format(date: CalendarDate, format: string, locale: LocaleConfig): string;
  parse(dateString: string, format: string, locale: LocaleConfig): CalendarDate | null;
  getMonthName(month: number, locale: LocaleConfig): string;
  getDayName(day: number, locale: LocaleConfig): string;
  // ... and more
}
```

### Types

```typescript
interface CalendarDate {
  year: number;
  month: number;  // 1-indexed
  day: number;    // 1-indexed
}

interface LocaleConfig {
  code: string;
  direction: 'ltr' | 'rtl';
  monthNames: string[];
  dayNames: string[];
  // ... and more
}

interface CalendarMonth {
  weeks: CalendarWeek[];
}

interface CalendarWeek {
  days: CalendarDay[];
}

interface CalendarDay {
  date: CalendarDate;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
}
```

## Exports

### Adapters
- `GregorianAdapter`
- `HijriAdapter`
- `BaseAdapter` (abstract base class)

### Calendar Generation
- `generateCalendarMonth`

### Navigation
- `nextMonth`
- `previousMonth`
- `nextYear`
- `previousYear`
- `goToToday`

### Utilities
- `getLocale`
- `formatNumber`

### Types
- `CalendarDate`
- `CalendarAdapter`
- `LocaleConfig`
- `CalendarMonth`
- `CalendarDay`
- And more...

## Requirements

- `date-fns` ^3.3.1
- `hijri-date` ^0.2.2

## Documentation

For complete documentation and examples, visit the [main repository](https://github.com/sherifnabil/hijri-gregorian-calendar).

## License

MIT
