<template>
  <div class="calendar-grid" role="grid">
    <div class="calendar-grid__weekdays" role="row">
      <div
        v-for="(day, index) in calendarMonth.weekdayLabels"
        :key="index"
        class="calendar-grid__weekday"
        role="columnheader"
      >
        {{ day }}
      </div>
    </div>
    
    <div class="calendar-grid__weeks">
      <div
        v-for="(week, weekIndex) in calendarMonth.weeks"
        :key="weekIndex"
        class="calendar-grid__week"
        role="row"
      >
        <button
          v-for="(day, dayIndex) in week"
          :key="dayIndex"
          type="button"
          class="calendar-grid__day"
          :class="{
            'calendar-grid__day--current-month': day.isCurrentMonth,
            'calendar-grid__day--other-month': !day.isCurrentMonth,
            'calendar-grid__day--today': day.isToday,
            'calendar-grid__day--selected': day.isSelected,
            'calendar-grid__day--disabled': day.isDisabled,
            'calendar-grid__day--in-range': isInRange(day),
            'calendar-grid__day--range-start': isRangeStart(day),
            'calendar-grid__day--range-end': isRangeEnd(day)
          }"
          :aria-label="formatDayLabel(day)"
          :aria-selected="day.isSelected"
          :disabled="day.isDisabled"
          role="gridcell"
          @click="onDayClick(day)"
        >
          {{ formatDayNumber(day.date.day) }}
        </button>
      </div>
    </div>
    <div class="calendar-header__actions">
      <button type="button" class="calendar-header__btn calendar-header__btn--today" @click="$emit('today')">
        {{ locale.code === 'ar' ? 'اليوم' : 'Today' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@sherifnabil/hijri-gregorian-calendar-core';
import type { CalendarMonth, CalendarDay, CalendarAdapter, LocaleConfig } from '@sherifnabil/hijri-gregorian-calendar-core';

interface DateRange {
  start: { year: number; month: number; day: number } | null;
  end: { year: number; month: number; day: number } | null;
}

const props = defineProps<{
  calendarMonth: CalendarMonth;
  adapter: CalendarAdapter;
  locale: LocaleConfig;
  selectedRange?: DateRange | null;
}>();

const emit = defineEmits<{
  'select-date': [day: CalendarDay];
  'today': [];
}>();

function onDayClick(day: CalendarDay) {
  if (day.isDisabled) return;
  emit('select-date', day);
}

function formatDayLabel(day: CalendarDay): string {
  return props.adapter.format(day.date, 'dd MMMM yyyy', props.locale);
}

function formatDayNumber(day: number): string {
  return formatNumber(day, props.locale);
}

function isInRange(day: CalendarDay): boolean {
  if (!props.selectedRange || !props.selectedRange.start || !props.selectedRange.end) {
    return false;
  }
  const compareStart = props.adapter.compare(day.date, props.selectedRange.start);
  const compareEnd = props.adapter.compare(day.date, props.selectedRange.end);
  return compareStart > 0 && compareEnd < 0;
}

function isRangeStart(day: CalendarDay): boolean {
  if (!props.selectedRange || !props.selectedRange.start) {
    return false;
  }
  return props.adapter.isSameDay(day.date, props.selectedRange.start);
}

function isRangeEnd(day: CalendarDay): boolean {
  if (!props.selectedRange || !props.selectedRange.end) {
    return false;
  }
  return props.adapter.isSameDay(day.date, props.selectedRange.end);
}
</script>
