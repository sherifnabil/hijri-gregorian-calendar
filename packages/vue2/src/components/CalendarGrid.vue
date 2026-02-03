<template>
  <div class="calendar-grid" role="grid">
    <div class="calendar-grid__weekdays" role="row">
      <div v-for="(day, index) in calendarMonth.weekdayLabels" :key="index" class="calendar-grid__weekday"
        role="columnheader">
        {{ day }}
      </div>
    </div>

    <div class="calendar-grid__weeks">
      <div v-for="(week, weekIndex) in calendarMonth.weeks" :key="weekIndex" class="calendar-grid__week" role="row">
        <button v-for="(day, dayIndex) in week" :key="dayIndex" type="button" class="calendar-grid__day" :class="{
          'calendar-grid__day--current-month': day.isCurrentMonth,
          'calendar-grid__day--other-month': !day.isCurrentMonth,
          'calendar-grid__day--today': day.isToday,
          'calendar-grid__day--selected': day.isSelected,
          'calendar-grid__day--in-range': isInRange(day),
          'calendar-grid__day--range-start': isRangeStart(day),
          'calendar-grid__day--range-end': isRangeEnd(day),
          'calendar-grid__day--disabled': day.isDisabled
        }" :aria-label="formatDayLabel(day)" :aria-selected="day.isSelected" :disabled="day.isDisabled" role="gridcell"
          @click="onDayClick(day)">
          {{ formatDayNumber(day.date.day) }}
        </button>
      </div>
    </div>
    <div class="calendar-header__actions">
      <button type="button" class="calendar-header__btn calendar-header__btn--today" @click="$emit('today')">
        {{ locale.code == 'ar' ? 'اليوم' : 'Today' }}
      </button>
    </div>
  </div>
</template>

<script>
import { formatNumber } from '@sherifnabil/hijri-gregorian-calendar-core';

export default {
  name: 'CalendarGrid',
  props: {
    calendarMonth: {
      type: Object,
      required: true
    },
    adapter: {
      type: Object,
      required: true
    },
    locale: {
      type: Object,
      required: true
    },
    selectedRange: {
      type: Object,
      default: null
    }
  },
  methods: {
    onDayClick(day) {
      if (day.isDisabled) return;
      this.$emit('select-date', day);
    },
    formatDayLabel(day) {
      return this.adapter.format(day.date, 'dd MMMM yyyy', this.locale);
    },
    formatDayNumber(day) {
      return formatNumber(day, this.locale);
    },
    isInRange(day) {
      if (!this.selectedRange || !this.selectedRange.start || !this.selectedRange.end) {
        return false;
      }
      const compareStart = this.adapter.compare(day.date, this.selectedRange.start);
      const compareEnd = this.adapter.compare(day.date, this.selectedRange.end);
      return compareStart > 0 && compareEnd < 0;
    },
    isRangeStart(day) {
      if (!this.selectedRange || !this.selectedRange.start) {
        return false;
      }
      return this.adapter.isSameDay(day.date, this.selectedRange.start);
    },
    isRangeEnd(day) {
      if (!this.selectedRange || !this.selectedRange.end) {
        return false;
      }
      return this.adapter.isSameDay(day.date, this.selectedRange.end);
    }
  }
};
</script>
