<template>
  <div class="dual-datepicker" ref="datepickerRef" :dir="locale.direction">
    <div class="dual-datepicker__input-wrapper">
      <div class="dual-datepicker__input-container" :style="{ direction: locale.direction }">
        <button type="button" class="dual-datepicker__toggle"
          :class="{ 'dual-datepicker__toggle--rtl': locale.direction === 'rtl' }"
          :aria-label="isOpen ? 'Close calendar' : 'Open calendar'" @click="toggle">
          <svg version="1.1" width="16px" height="16px" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"
            fill="#AAA">
            <path d="M436 160H12C5.4 160 0 154.6 0 148V112C0 85.5 21.5 64 48 64H96V12C96 5.4 101.4 0 108 0H148C154.6 0 160 5.4 160
              12V64H288V12C288 5.4 293.4 0 300 0H340C346.6 0 352 5.4 352 12V64H400C426.5 64 448 85.5 448 112V148C448 154.6
              442.6 160 436 160zM12 192H436C442.6 192 448 197.4 448 204V464C448 490.5 426.5 512 400 512H48C21.5 512 0 490.5 0
              464V204C0 197.4 5.4 192 12 192zM128 396C128 389.4 122.6 384 116 384H76C69.4 384 64 389.4 64 396V436C64 442.6 69.4
              448 76 448H116C122.6 448 128 442.6 128 436V396zM128 268C128 261.4 122.6 256 116 256H76C69.4 256 64 261.4 64
              268V308C64 314.6 69.4 320 76 320H116C122.6 320 128 314.6 128 308V268zM256 396C256 389.4 250.6 384 244
              384H204C197.4 384 192 389.4 192 396V436C192 442.6 197.4 448 204 448H244C250.6 448 256 442.6 256 436V396zM256
              268C256 261.4 250.6 256 244 256H204C197.4 256 192 261.4 192 268V308C192 314.6 197.4 320 204 320H244C250.6 320 256
              314.6 256 308V268zM384 396C384 389.4 378.6 384 372 384H332C325.4 384 320 389.4 320 396V436C320 442.6 325.4 448
              332 448H372C378.6 448 384 442.6 384 436V396zM384 268C384 261.4 378.6 256 372 256H332C325.4 256 320 261.4 320
              268V308C320 314.6 325.4 320 332 320H372C378.6 320 384 314.6 384 308V268z"></path>
          </svg>
        </button>
        <input :value="editable ? inputValue : formattedDate" type="text" class="dual-datepicker__input" :class="{
          'dual-datepicker__input--has-clear': (selectedDate || (range && selectedRange)) && clearable,
          'dual-datepicker__input--error': inputError,
          'dual-datepicker__input--rtl': locale.direction === 'rtl',
          'dual-datepicker__input--ltr': locale.direction === 'ltr',
          [inputClass]: inputClass
        }" :placeholder="placeholder" :readonly="!editable" :aria-label="ariaLabel" :aria-expanded="isOpen"
          :aria-invalid="inputError" @click="!editable && toggle()" @keydown.enter="!editable && toggle()"
          @keydown.space.prevent="!editable && toggle()" @input="onInputChange" @blur="onInputBlur"
          @focus="onInputFocus" />
        <button v-if="(selectedDate || (range && selectedRange)) && clearable" type="button"
          class="dual-datepicker__clear" :class="{ 'dual-datepicker__clear--rtl': locale.direction === 'rtl' }"
          :aria-label="'Clear date'" @click.stop="clearSelection">
          ×
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isOpen" class="dual-datepicker__dropdown" role="dialog" aria-modal="true"
        :aria-label="`${calendarType} calendar picker`">
        <div class="dual-datepicker__panel">
          <CalendarHeader :month-name="currentMonthName" :year="currentYear" :current-month="currentMonth"
            :calendar="calendarType" :locale="localeCode" @previous-month="goToPreviousMonth"
            @next-month="goToNextMonth" @previous-year="goToPreviousYear" @next-year="goToNextYear"
            @today="goToTodayMonth" @update:calendar="onCalendarChange" @update:locale="onLocaleChange"
            @select-month="onSelectMonth" @select-year="onSelectYear" />

          <CalendarGrid :calendar-month="calendarMonth" :adapter="adapter" :locale="locale"
            :selected-range="range ? selectedRange : null" @select-date="onSelectDate" @today="goToTodayMonth" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { CalendarDate } from '@sherifnabil/hijri-gregorian-calendar-core';
import { useDatePicker, type DateRange } from '../composables/useDatePicker';
import CalendarHeader from './CalendarHeader.vue';
import CalendarGrid from './CalendarGrid.vue';

interface Props {
  modelValue?: CalendarDate | DateRange | null;
  calendar?: 'gregorian' | 'hijri';
  locale?: string;
  range?: boolean;
  time?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  clearable?: boolean;
  format?: string;
  inputFormat?: string | null;
  editable?: boolean;
  minDate?: CalendarDate | null;
  maxDate?: CalendarDate | null;
  disabledDates?: CalendarDate[];
  disabledDaysOfWeek?: number[];
  inputClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  calendar: 'gregorian',
  locale: 'en',
  range: false,
  time: false,
  placeholder: 'Select date',
  ariaLabel: 'Date picker',
  clearable: true,
  format: 'dd/MM/yyyy',
  inputFormat: null,
  editable: false,
  minDate: null,
  maxDate: null,
  disabledDates: () => [],
  disabledDaysOfWeek: () => [],
  inputClass: ''
});

const emit = defineEmits<{
  'update:modelValue': [value: CalendarDate | DateRange | null];
  'change': [value: CalendarDate | DateRange | null];
}>();

const datepickerRef = ref<HTMLElement | null>(null);

const {
  selectedDate,
  selectedRange,
  currentMonth,
  currentYear,
  currentMonthName,
  isOpen,
  calendarMonth,
  adapter,
  locale,
  calendarType,
  localeCode,
  inputValue,
  inputError,
  displayFormat,
  selectDate,
  clearSelection,
  updateView,
  goToNextMonth,
  goToPreviousMonth,
  goToNextYear,
  goToPreviousYear,
  goToTodayMonth,
  switchCalendar,
  toggle,
  formattedDate,
  parseInputValue,
  updateInputValue,
  validateDate
} = useDatePicker({
  calendar: computed(() => props.calendar),
  locale: computed(() => props.locale),
  range: computed(() => props.range),
  time: computed(() => props.time),
  modelValue: computed(() => props.modelValue),
  format: computed(() => props.format),
  inputFormat: computed(() => props.inputFormat),
  minDate: computed(() => props.minDate),
  maxDate: computed(() => props.maxDate),
  disabledDates: computed(() => props.disabledDates),
  disabledDaysOfWeek: computed(() => props.disabledDaysOfWeek)
});

// Sync selected date/range with v-model
watch([selectedDate, selectedRange], () => {
  if (props.range) {
    emit('update:modelValue', selectedRange.value);
    emit('change', selectedRange.value);
  } else {
    emit('update:modelValue', selectedDate.value);
    emit('change', selectedDate.value);
  }
}, { deep: true });

// Sync v-model changes back to internal state
watch(() => props.modelValue, (newVal) => {
  if (props.range) {
    if (newVal && typeof newVal === 'object' && 'start' in newVal) {
      // Already handled by composable watch
      updateInputValue();
    }
  } else {
    if (newVal && !('start' in newVal)) {
      // Already handled by composable watch
      updateInputValue();
    }
  }
});

// Watch range prop changes
watch(() => props.range, (newVal) => {
  if (newVal) {
    selectedDate.value = null;
    selectedRange.value = (props.modelValue as DateRange) || { start: null, end: null };
  } else {
    selectedRange.value = { start: null, end: null };
    selectedDate.value = (props.modelValue as CalendarDate) || null;
  }
  updateInputValue();
});

function onSelectDate(day: any) {
  if (day.isDisabled) return;
  selectDate(day.date);
  updateInputValue();
}

function onSelectMonth(month: number) {
  updateView(currentYear.value, month);
}

function onSelectYear(year: number) {
  updateView(year, currentMonth.value);
}

function onCalendarChange(newCalendar: 'gregorian' | 'hijri') {
  switchCalendar(newCalendar);
  updateInputValue();
}

function onLocaleChange(newLocale: string) {
  localeCode.value = newLocale;
}

function onInputChange(event: Event) {
  if (!props.editable) return;
  const target = event.target as HTMLInputElement;
  inputValue.value = target.value;
  inputError.value = false;
}

function onInputBlur() {
  if (!props.editable) return;
  parseInputValue(inputValue.value);
  updateInputValue();
}

function onInputFocus() {
  if (!props.editable) return;
  // Select all text on focus for easy editing
  nextTick(() => {
    const input = datepickerRef.value?.querySelector('.dual-datepicker__input') as HTMLInputElement;
    if (input) {
      input.select();
    }
  });
}

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  
  // Check if click is on the month/year picker modal
  const modal = target.closest('.calendar-header__modal');
  const modalContent = target.closest('.calendar-header__modal-content');
  
  // If click is on modal, don't close the main dropdown
  if (modal || modalContent) {
    return;
  }
  
  // Check if click is inside the teleported dropdown
  const dropdown = target.closest('.dual-datepicker__dropdown');
  if (dropdown) {
    return;
  }
  
  // Check if click is inside the input container
  if (datepickerRef.value && datepickerRef.value.contains(target)) {
    return;
  }
  
  // Close dropdown if click is outside both input and dropdown
  isOpen.value = false;
}

onMounted(() => {
  // Close dropdown when clicking outside
  document.addEventListener('click', handleOutsideClick);
  // Initialize input value
  updateInputValue();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>
