# Hijri-Gregorian Calendar DatePicker

A production-ready datepicker library supporting both **Hijri (Islamic)** and **Gregorian** calendars, with full Vue 2 and Vue 3 compatibility.


[![npm version](https://img.shields.io/npm/v/@sherifnabil/hijri-gregorian-calendar-core.svg)](https://www.npmjs.com/package/@sherifnabil/hijri-gregorian-calendar-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✨ **Dual Calendar Support**
- Gregorian calendar using `date-fns`
- Hijri calendar using `hijri-date`
- Runtime calendar switching
- Month and year grid pickers with decade navigation

🎨 **Modern Design**
- Clean, minimal UI
- RTL layout support (Arabic/English)
- Responsive design
- Calendar icon prefix
- Clearable input with button

📅 **Date Selection**
- Single date selection
- Date range selection (start and end dates)
- Visual range highlighting
- Today button for quick navigation

🔒 **Date Constraints**
- Minimum date (`minDate`)
- Maximum date (`maxDate`)
- Disabled specific dates (`disabledDates`)
- Disabled days of week (`disabledDaysOfWeek`)

✏️ **Input Features**
- Editable input with validation
- Custom date format (`format`, `inputFormat`)
- Input error states
- Placeholder customization

♿ **Accessible**
- ARIA attributes
- Keyboard navigation
- Screen reader friendly
- Click-outside-to-close

🏗️ **Clean Architecture**
- Headless core (framework-agnostic)
- Adapter pattern for calendars
- Separate Vue 2 and Vue 3 builds
- Zero runtime cross-dependencies

📦 **Build System**
- Tree-shakable ESM modules
- SSR compatible
- TypeScript support
- No polyfills required

## Installation

### Vue 3

```bash
npm install @sherifnabil/hijri-gregorian-calendar-core @sherifnabil/hijri-gregorian-calendar-vue3
```

### Vue 2

```bash
npm install @sherifnabil/hijri-gregorian-calendar-core @sherifnabil/hijri-gregorian-calendar-vue2
```

## Quick Start

### Vue 3

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

### Vue 2

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

<script setup>
import { ref } from 'vue';

const dateRange = ref({ start: null, end: null });
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
```

### Custom Format

```vue
<template>
  <HijriGregorianCalendar
    v-model="date"
    format="yyyy-MM-dd"
    calendar="hijri"
    locale="ar"
  />
</template>
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
```

### Non-clearable Input

```vue
<template>
  <HijriGregorianCalendar
    v-model="date"
    :clearable="false"
    calendar="gregorian"
  />
</template>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` / `value` | `CalendarDate \| DateRange \| null` | `null` | Selected date or range (Vue 3 uses `modelValue`, Vue 2 uses `value`) |
| `calendar` | `'gregorian' \| 'hijri'` | `'gregorian'` | Calendar type to use |
| `locale` | `string` | `'en'` | Locale code (`'en'` or `'ar'`) |
| `range` | `boolean` | `false` | Enable date range selection |
| `time` | `boolean` | `false` | Include time picker (reserved for future) |
| `placeholder` | `string` | `'Select date'` | Input placeholder text |
| `ariaLabel` | `string` | `'Date picker'` | ARIA label for accessibility |
| `clearable` | `boolean` | `true` | Show clear button when date is selected |
| `format` | `string` | `'dd/MM/yyyy'` | Display format for the selected date |
| `inputFormat` | `string \| null` | `null` | Input format (if different from display format). If `null`, uses `format` |
| `editable` | `boolean` | `false` | Allow manual input editing with validation |
| `minDate` | `CalendarDate \| null` | `null` | Minimum selectable date |
| `maxDate` | `CalendarDate \| null` | `null` | Maximum selectable date |
| `disabledDates` | `CalendarDate[]` | `[]` | Array of dates to disable |
| `disabledDaysOfWeek` | `number[]` | `[]` | Array of day indices to disable (0 = Sunday, 6 = Saturday) |
| `inputClass` | `string` | `''` | Additional CSS classes for the input element |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` / `input` | `CalendarDate \| DateRange \| null` | Emitted when date changes (Vue 3 uses `update:modelValue`, Vue 2 uses `input`) |
| `change` | `CalendarDate \| DateRange \| null` | Emitted when date changes (alternative to v-model) |

### Types

#### CalendarDate

```typescript
interface CalendarDate {
  year: number;
  month: number;  // 1-indexed (1-12 for Gregorian, 1-12 for Hijri)
  day: number;    // 1-indexed
}
```

#### DateRange

```typescript
interface DateRange {
  start: CalendarDate | null;
  end: CalendarDate | null;
}
```

### Date Format Patterns

The `format` and `inputFormat` props support the following patterns:

- `dd` - Day of month (01-31)
- `MM` - Month (01-12)
- `yyyy` - Full year (e.g., 2024)
- `yy` - Short year (e.g., 24)
- `/` - Separator (can use `-`, `.`, or space)

Examples:
- `dd/MM/yyyy` → `01/12/2024`
- `yyyy-MM-dd` → `2024-12-01`
- `dd.MM.yy` → `01.12.24`

## Packages

### `@sherifnabil/hijri-gregorian-calendar-core`
Framework-agnostic calendar logic with adapter pattern. Contains:
- Calendar adapters (Gregorian, Hijri)
- Calendar grid generator
- Date utilities and formatting
- Locale support

### `@sherifnabil/hijri-gregorian-calendar-vue3`
Vue 3 wrapper using Composition API with:
- `HijriGregorianCalendar` component
- `useDatePicker` composable
- TypeScript support

### `@sherifnabil/hijri-gregorian-calendar-vue2`
Vue 2 wrapper using Options API with:
- `HijriGregorianCalendar` component
- Vue 2.7+ compatibility

## Advanced Usage

### Using the Composable (Vue 3)

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
  clearSelection
} = useDatePicker({
  calendar: computed(() => calendar.value),
  locale: computed(() => locale.value),
  range: computed(() => range.value)
});
</script>
```

### Component Naming


### Programmatic Control

```vue
<script setup>
import { ref } from 'vue';
import { HijriGregorianCalendar } from '@sherifnabil/hijri-gregorian-calendar-vue3';

const datePickerRef = ref(null);
const selectedDate = ref(null);

function setToday() {
  // Access internal methods if needed
  // Note: Direct access to internal methods is not exposed
  // Use props and events for control
}
</script>
```

## Styling

The component includes default styles. Import them:

```javascript
// Vue 3
import '@sherifnabil/hijri-gregorian-calendar-vue3/styles';

// Vue 2
import '@sherifnabil/hijri-gregorian-calendar-vue2/styles';
```

### Custom Styling

You can override CSS variables or add custom classes:

```vue
<template>
  <HijriGregorianCalendar
    v-model="date"
    input-class="my-custom-input"
  />
</template>

<style>
.my-custom-input {
  border: 2px solid #007bff;
}
</style>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Architecture

```
Core Package (framework-agnostic)
├── Types & Interfaces
├── Calendar Adapters
│   ├── Gregorian (date-fns)
│   └── Hijri (hijri-date)
├── Calendar Grid Generator
└── Utilities

Vue 3 Package
├── Composition API
├── useDatePicker Composable
└── Components

Vue 2 Package
├── Options API
└── Components
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Sherif Nabil <sherifnabil441@gmail.com>

## Links

- [GitHub Repository](https://github.com/sherifnabil/hijri-gregorian-calendar)
- [npm Package (Core)](https://www.npmjs.com/package/@sherifnabil/hijri-gregorian-calendar-core)
- [npm Package (Vue 3)](https://www.npmjs.com/package/@sherifnabil/hijri-gregorian-calendar-vue3)
- [npm Package (Vue 2)](https://www.npmjs.com/package/@sherifnabil/hijri-gregorian-calendar-vue2)
