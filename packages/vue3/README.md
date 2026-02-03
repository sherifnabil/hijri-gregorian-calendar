# @sherifnabil/hijri-gregorian-calendar-vue3

Vue 3 wrapper for the Hijri-Gregorian Calendar DatePicker library.

## Installation

```bash
npm install @sherifnabil/hijri-gregorian-calendar-core @sherifnabil/hijri-gregorian-calendar-vue3
```

## Quick Start

```vue
<script setup>
import { ref } from 'vue';
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue3';
import '@sherifnabil/hijri-gregorian-calendar-vue3/styles';

const selectedDate = ref(null);
</script>

<template>
  <HijriGregorianCalendar
    v-model="selectedDate"
    calendar="hijri"
    locale="ar"
  />
</template>
```

## Usage Examples

### Single Date Selection

```vue
<script setup>
import { ref } from 'vue';
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue3';
import '@sherifnabil/hijri-gregorian-calendar-vue3/styles';

const date = ref(null);
</script>

<template>
  <HijriGregorianCalendar
    v-model="date"
    calendar="gregorian"
    locale="en"
    placeholder="Select a date"
  />
</template>
```

### Date Range Selection

```vue
<script setup>
import { ref } from 'vue';
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue3';
import '@sherifnabil/hijri-gregorian-calendar-vue3/styles';
import type { DateRange } from '@sherifnabil/hijri-gregorian-calendar-vue3';

const dateRange = ref<DateRange>({ start: null, end: null });
</script>

<template>
  <HijriGregorianCalendar
    v-model="dateRange"
    :range="true"
    calendar="hijri"
    locale="ar"
    placeholder="Select date range"
  />
</template>
```

### With Date Constraints

```vue
<script setup>
import { ref } from 'vue';
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue3';
import '@sherifnabil/hijri-gregorian-calendar-vue3/styles';
import type { CalendarDate } from '@sherifnabil/hijri-gregorian-calendar-core';

const date = ref<CalendarDate | null>(null);
const minDate: CalendarDate = { year: 2024, month: 1, day: 1 };
const maxDate: CalendarDate = { year: 2024, month: 12, day: 31 };
const disabledDates: CalendarDate[] = [
  { year: 2024, month: 1, day: 1 },
  { year: 2024, month: 1, day: 15 }
];
</script>

<template>
  <HijriGregorianCalendar
    v-model="date"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="disabledDates"
    :disabled-days-of-week="[0, 6]"
    calendar="gregorian"
  />
</template>
```

### Editable Input

```vue
<script setup>
import { ref } from 'vue';
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue3';
import '@sherifnabil/hijri-gregorian-calendar-vue3/styles';

const date = ref(null);
</script>

<template>
  <HijriGregorianCalendar
    v-model="date"
    :editable="true"
    format="dd/MM/yyyy"
    input-format="dd-MM-yyyy"
    calendar="gregorian"
  />
</template>
```

### Using the Composable

```vue
<script setup>
import { useDatePicker } from '@sherifnabil/hijri-gregorian-calendar-vue3';
import { ref, computed } from 'vue';

const calendar = ref('gregorian');
const locale = ref('en');
const range = ref(false);

const {
  selectedDate,
  selectedRange,
  formattedDate,
  selectDate,
  clearSelection,
  toggle
} = useDatePicker({
  calendar: computed(() => calendar.value),
  locale: computed(() => locale.value),
  range: computed(() => range.value)
});
</script>

<template>
  <div>
    <button @click="toggle">Open Calendar</button>
    <p>Selected: {{ formattedDate }}</p>
  </div>
</template>
```

### RTL Support (Arabic)

```vue
<script setup>
import { ref } from 'vue';
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue3';
import '@sherifnabil/hijri-gregorian-calendar-vue3/styles';

const date = ref(null);
</script>

<template>
  <HijriGregorianCalendar
    v-model="date"
    calendar="hijri"
    locale="ar"
    placeholder="اختر التاريخ"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `CalendarDate \| DateRange \| null` | `null` | Selected date or range |
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
| `update:modelValue` | `CalendarDate \| DateRange \| null` | Emitted when date changes (for v-model) |
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

## Composable API

The `useDatePicker` composable provides programmatic control:

```typescript
const {
  selectedDate,      // Ref<CalendarDate | null>
  selectedRange,    // Ref<DateRange>
  formattedDate,    // Computed<string>
  selectDate,       // (date: CalendarDate) => void
  clearSelection,   // () => void
  toggle,           // () => void
  // ... and more
} = useDatePicker(options);
```

## Styling

Import the default styles:

```javascript
import '@sherifnabil/hijri-gregorian-calendar-vue3/styles';
```

## Requirements

- Vue 3.3.0 or higher
- `@sherifnabil/hijri-gregorian-calendar-core` (peer dependency)

## Documentation

For complete documentation, examples, and API reference, visit the [main repository](https://github.com/sherifnabil/hijri-gregorian-calendar).

## License

MIT
