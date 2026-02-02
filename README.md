# Dual Calendar DatePicker

A production-ready datepicker library supporting both **Hijri (Islamic)** and **Gregorian** calendars, with full Vue 2 and Vue 3 compatibility.

## Features

✨ **Dual Calendar Support**
- Gregorian calendar using `date-fns`
- Hijri calendar using `hijri-date`
- Runtime calendar switching

🎨 **Modern Design**
- Minimal CSS with CSS variables
- Dark mode support
- RTL layout support
- Responsive design

♿ **Accessible**
- ARIA attributes
- Keyboard navigation
- Screen reader friendly

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

## Packages

### `@dual-datepicker/core`
Framework-agnostic calendar logic with adapter pattern.

### `@dual-datepicker/vue3`
Vue 3 wrapper using Composition API.

### `@dual-datepicker/vue2`
Vue 2 wrapper using Options API.

## Installation

```bash
# Using pnpm
pnpm install

# Using npm
npm install

# Using yarn
yarn install
```

## Build

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:core
pnpm build:vue3
pnpm build:vue2
```

## Usage

### Vue 3

```vue
<script setup>
import { ref } from 'vue';
import { DualDatePicker } from '@dual-datepicker/vue3';
import '@dual-datepicker/vue3/styles';

const selectedDate = ref(null);
</script>

<template>
  <DualDatePicker
    v-model="selectedDate"
    calendar="hijri"
    locale="ar"
  />
</template>
```

### Vue 2

```vue
<template>
  <DualDatePicker
    v-model="selectedDate"
    calendar="gregorian"
    locale="en"
  />
</template>

<script>
import { DualDatePicker } from '@dual-datepicker/vue2';
import '@dual-datepicker/vue2/styles';

export default {
  components: { DualDatePicker },
  data() {
    return {
      selectedDate: null
    };
  }
};
</script>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` / `value` | `CalendarDate \| null` | `null` | Selected date (Vue 3 uses `modelValue`, Vue 2 uses `value`) |
| `calendar` | `'gregorian' \| 'hijri'` | `'gregorian'` | Calendar type |
| `locale` | `string` | `'en'` | Locale code (`'en'` or `'ar'`) |
| `range` | `boolean` | `false` | Enable range selection |
| `time` | `boolean` | `false` | Include time picker |
| `placeholder` | `string` | `'Select date'` | Input placeholder |
| `ariaLabel` | `string` | `'Date picker'` | ARIA label |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` / `input` | `CalendarDate \| null` | Emitted when date changes |
| `change` | `CalendarDate \| null` | Emitted when date changes |

### Types

```typescript
interface CalendarDate {
  year: number;
  month: number; // 1-indexed
  day: number;
}
```

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
└── Components

Vue 2 Package
├── Options API
└── Components
```

## License

MIT
