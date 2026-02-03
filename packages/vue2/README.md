# @sherifnabil/hijri-gregorian-calendar-vue2

Vue 2 wrapper for the Hijri-Gregorian Calendar DatePicker library.

## Installation

```bash
npm install @sherifnabil/hijri-gregorian-calendar-core @sherifnabil/hijri-gregorian-calendar-vue2
```

## Quick Start

```vue
<template>
  <HijriGregorianCalendar
    v-model="selectedDate"
    calendar="gregorian"
    locale="en"
  />
</template>

<script>
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue2';
import '@sherifnabil/hijri-gregorian-calendar-vue2/styles';

export default {
  components: { HijriGregorianCalendar },
  data() {
    return {
      selectedDate: null
    };
  }
};
</script>
```

## Usage Examples

### Single Date Selection

```vue
<template>
  <HijriGregorianCalendar
    v-model="date"
    calendar="gregorian"
    locale="en"
    placeholder="Select a date"
  />
</template>

<script>
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue2';
import '@sherifnabil/hijri-gregorian-calendar-vue2/styles';

export default {
  components: { HijriGregorianCalendar },
  data() {
    return {
      date: null
    };
  }
};
</script>
```

### Date Range Selection

```vue
<template>
  <HijriGregorianCalendar
    v-model="dateRange"
    :range="true"
    calendar="hijri"
    locale="ar"
    placeholder="Select date range"
  />
</template>

<script>
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue2';
import '@sherifnabil/hijri-gregorian-calendar-vue2/styles';

export default {
  components: { HijriGregorianCalendar },
  data() {
    return {
      dateRange: { start: null, end: null }
    };
  }
};
</script>
```

### With Date Constraints

```vue
<template>
  <HijriGregorianCalendar
    v-model="date"
    :min-date="{ year: 2024, month: 1, day: 1 }"
    :max-date="{ year: 2024, month: 12, day: 31 }"
    :disabled-dates="[
      { year: 2024, month: 1, day: 1 },
      { year: 2024, month: 1, day: 15 }
    ]"
    :disabled-days-of-week="[0, 6]"
    calendar="gregorian"
  />
</template>

<script>
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue2';
import '@sherifnabil/hijri-gregorian-calendar-vue2/styles';

export default {
  components: { HijriGregorianCalendar },
  data() {
    return {
      date: null
    };
  }
};
</script>
```

### Editable Input

```vue
<template>
  <HijriGregorianCalendar
    v-model="date"
    :editable="true"
    format="dd/MM/yyyy"
    input-format="dd-MM-yyyy"
    calendar="gregorian"
  />
</template>

<script>
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue2';
import '@sherifnabil/hijri-gregorian-calendar-vue2/styles';

export default {
  components: { HijriGregorianCalendar },
  data() {
    return {
      date: null
    };
  }
};
</script>
```

### RTL Support (Arabic)

```vue
<template>
  <HijriGregorianCalendar
    v-model="date"
    calendar="hijri"
    locale="ar"
    placeholder="اختر التاريخ"
  />
</template>

<script>
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue2';
import '@sherifnabil/hijri-gregorian-calendar-vue2/styles';

export default {
  components: { HijriGregorianCalendar },
  data() {
    return {
      date: null
    };
  }
};
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `CalendarDate \| DateRange \| null` | `null` | Selected date or range |
| `calendar` | `'gregorian' \| 'hijri'` | `'gregorian'` | Calendar type to use |
| `locale` | `string` | `'en'` | Locale code (`'en'` or `'ar'`) |
| `range` | `boolean` | `false` | Enable date range selection |
| `time` | `boolean` | `false` | Include time picker (reserved for future) |
| `placeholder` | `string` | `'Select date'` | Input placeholder text |
| `ariaLabel` | `string` | `'Date picker'` | ARIA label for accessibility |
| `clearable` | `boolean` | `true` | Show clear button when date is selected |
| `format` | `string` | `'dd/MM/yyyy'` | Display format for the selected date |
| `inputFormat` | `string \| null` | `null` | Input format (if different from display format) |
| `editable` | `boolean` | `false` | Allow manual input editing with validation |
| `minDate` | `CalendarDate \| null` | `null` | Minimum selectable date |
| `maxDate` | `CalendarDate \| null` | `null` | Maximum selectable date |
| `disabledDates` | `CalendarDate[]` | `[]` | Array of dates to disable |
| `disabledDaysOfWeek` | `number[]` | `[]` | Array of day indices to disable (0 = Sunday, 6 = Saturday) |
| `inputClass` | `string` | `''` | Additional CSS classes for the input element |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `input` | `CalendarDate \| DateRange \| null` | Emitted when date changes (for v-model) |
| `change` | `CalendarDate \| DateRange \| null` | Emitted when date changes |

## Types

```typescript
interface CalendarDate {
  year: number;
  month: number;  // 1-indexed (1-12)
  day: number;    // 1-indexed
}

interface DateRange {
  start: CalendarDate | null;
  end: CalendarDate | null;
}
```

## Styling

Import the default styles:

```javascript
import '@sherifnabil/hijri-gregorian-calendar-vue2/styles';
```

## Requirements

- Vue 2.7.0 or higher
- `@sherifnabil/hijri-gregorian-calendar-core` (peer dependency)

## Documentation

For complete documentation, examples, and API reference, visit the [main repository](https://github.com/sherifnabil/hijri-gregorian-calendar).

## License

MIT
