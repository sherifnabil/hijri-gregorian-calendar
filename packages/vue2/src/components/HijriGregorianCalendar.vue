<template>
  <div class="hgc-datepicker" ref="datepicker">
    <div class="hgc-datepicker__input-wrapper">
      <div class="hgc-datepicker__input-container" :style="{ direction: localeConfig.direction }">
        <button type="button" class="hgc-datepicker__toggle"
          :class="{ 'hgc-datepicker__toggle--rtl': localeConfig.direction === 'rtl' }"
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
        <input :value="editable ? inputValue : formattedDate" type="text" class="hgc-datepicker__input" :class="{
          'hgc-datepicker__input--has-clear': (selectedDate || (range && selectedRange)) && clearable,
          'hgc-datepicker__input--error': inputError,
          'hgc-datepicker__input--rtl': localeConfig.direction === 'rtl',
          'hgc-datepicker__input--ltr': localeConfig.direction === 'ltr',
          [inputClass]: inputClass
        }" :placeholder="placeholder" :readonly="!editable" :aria-label="ariaLabel" :aria-expanded="isOpen"
          :aria-invalid="inputError" @click="!editable && toggle()" @keydown.enter="!editable && toggle()"
          @keydown.space.prevent="!editable && toggle()" @input="onInputChange" @blur="onInputBlur"
          @focus="onInputFocus" />
        <button v-if="(selectedDate || (range && selectedRange)) && clearable" type="button"
          class="hgc-datepicker__clear" :class="{ 'hgc-datepicker__clear--rtl': localeConfig.direction === 'rtl' }"
          :aria-label="'Clear date'" @click.stop="clearDate">
          ×
        </button>
      </div>
    </div>

    <div v-if="isOpen" class="hgc-datepicker__dropdown" role="dialog" aria-modal="true"
      :aria-label="`${calendarType} calendar picker`">
      <div class="hgc-datepicker__panel">
        <CalendarHeader :month-name="currentMonthName" :year="currentYear" :current-month="currentMonth"
          :calendar="calendarType" :locale="localeCode" @previous-month="goToPreviousMonth" @next-month="goToNextMonth"
          @previous-year="goToPreviousYear" @next-year="goToNextYear" @today="goToTodayMonth"
          @update:calendar="onCalendarChange" @update:locale="onLocaleChange" @select-month="onSelectMonth"
          @select-year="onSelectYear" />

        <CalendarGrid :calendar-month="calendarMonth" :adapter="adapter" :locale="localeConfig"
          :selected-range="range ? selectedRange : null" @select-date="onSelectDate" @today="goToTodayMonth" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  GregorianAdapter,
  HijriAdapter,
  generateCalendarMonth,
  nextMonth,
  previousMonth,
  nextYear,
  previousYear,
  getLocale
} from '@sherifnabil/hijri-gregorian-calendar-core';
import CalendarHeader from './CalendarHeader.vue';
import CalendarGrid from './CalendarGrid.vue';

export default {
  name: 'HijriGregorianCalendar',
  components: {
    CalendarHeader,
    CalendarGrid
  },
  props: {
    value: {
      type: [Object, Array, String],
      default: null
    },
    calendar: {
      type: String,
      default: 'gregorian'
    },
    locale: {
      type: String,
      default: 'en'
    },
    range: {
      type: Boolean,
      default: false
    },
    time: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Select date'
    },
    ariaLabel: {
      type: String,
      default: 'Date picker'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    format: {
      type: String,
      default: 'dd/MM/yyyy'
    },
    inputFormat: {
      type: String,
      default: null
    },
    editable: {
      type: Boolean,
      default: false
    },
    minDate: {
      type: Object,
      default: null
    },
    maxDate: {
      type: Object,
      default: null
    },
    disabledDates: {
      type: Array,
      default: () => []
    },
    disabledDaysOfWeek: {
      type: Array,
      default: () => []
    },
    inputClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedDate: this.range ? null : this.parseValue(this.value),
      selectedRange: this.range ? (this.value || { start: null, end: null }) : null,
      isOpen: false,
      calendarType: this.calendar,
      localeCode: this.locale,
      // Separate tracking for current view (independent of selectedDate)
      viewMonth: null,
      viewYear: null,
      inputValue: '',
      inputError: false
    };
  },
  computed: {
    adapter() {
      return this.calendarType === 'hijri' ? new HijriAdapter() : new GregorianAdapter();
    },
    localeConfig() {
      return getLocale(this.localeCode);
    },
    today() {
      return this.adapter.today();
    },
    currentMonth() {
      // Use viewMonth if set, otherwise use selectedDate or today
      if (this.viewMonth !== null) {
        return this.viewMonth;
      }
      return this.selectedDate ? this.selectedDate.month : this.today.month;
    },
    currentYear() {
      // Use viewYear if set, otherwise use selectedDate or today
      if (this.viewYear !== null) {
        return this.viewYear;
      }
      return this.selectedDate ? this.selectedDate.year : this.today.year;
    },
    currentMonthName() {
      return this.adapter.getMonthName(this.currentMonth, this.localeConfig);
    },
    calendarMonth() {
      const format = this.inputFormat || this.format;
      return generateCalendarMonth(
        this.currentYear,
        this.currentMonth,
        this.adapter,
        this.localeConfig,
        this.range ? null : this.selectedDate,
        undefined,
        {
          selectedRange: this.range ? this.selectedRange : undefined,
          minDate: this.minDate,
          maxDate: this.maxDate,
          disabledDates: this.disabledDates,
          disabledDaysOfWeek: this.disabledDaysOfWeek
        }
      );
    },
    formattedDate() {
      if (this.range) {
        if (!this.selectedRange || (!this.selectedRange.start && !this.selectedRange.end)) {
          return '';
        }
        if (this.selectedRange.start && this.selectedRange.end) {
          // Validate dates before formatting
          if (!this.adapter.isValid(this.selectedRange.start) || !this.adapter.isValid(this.selectedRange.end)) {
            return '';
          }
          const start = this.adapter.format(this.selectedRange.start, this.format, this.localeConfig);
          const end = this.adapter.format(this.selectedRange.end, this.format, this.localeConfig);
          return `${start} - ${end}`;
        }
        if (this.selectedRange.start) {
          // Validate date before formatting
          if (!this.adapter.isValid(this.selectedRange.start)) {
            return '';
          }
          return this.adapter.format(this.selectedRange.start, this.format, this.localeConfig);
        }
        return '';
      }
      if (!this.selectedDate) return '';
      // Validate date before formatting
      if (!this.adapter.isValid(this.selectedDate)) {
        return '';
      }
      return this.adapter.format(this.selectedDate, this.format, this.localeConfig);
    },
    displayFormat() {
      return this.inputFormat || this.format;
    }
  },
  watch: {
    value(newVal) {
      if (this.range) {
        if (newVal !== this.selectedRange) {
          this.selectedRange = newVal || { start: null, end: null };
          this.updateInputValue();
          if (newVal && (newVal.start || newVal.end)) {
            this.viewMonth = null;
            this.viewYear = null;
          }
        }
      } else {
        const parsedValue = this.parseValue(newVal);
        if (parsedValue !== this.selectedDate &&
          (parsedValue === null || this.selectedDate === null ||
            !this.adapter.isSameDay(parsedValue, this.selectedDate))) {
          this.selectedDate = parsedValue;
          this.updateInputValue();
          // Reset view when value changes externally
          if (parsedValue) {
            this.viewMonth = null;
            this.viewYear = null;
          }
        }
      }
    },
    calendar(newVal) {
      if (newVal !== this.calendarType) {
        this.calendarType = newVal;
      }
    },
    locale(newVal) {
      if (newVal !== this.localeCode) {
        this.localeCode = newVal;
      }
    },
    range(newVal) {
      // When range mode changes, reset selection
      if (newVal) {
        this.selectedDate = null;
        this.selectedRange = this.value || { start: null, end: null };
      } else {
        this.selectedRange = null;
        this.selectedDate = this.parseValue(this.value);
      }
      this.updateInputValue();
    },
    selectedDate(newVal) {
      if (!this.range) {
        const formattedValue = newVal
          ? this.adapter.format(newVal, this.format, this.localeConfig)
          : null;
        this.$emit('input', formattedValue);
        this.$emit('change', formattedValue);
      }
    },
    selectedRange: {
      handler(newVal) {
        if (this.range) {
          this.$emit('input', newVal);
          this.$emit('change', newVal);
        }
      },
      deep: true
    }
  },

  methods: {
    parseValue(value) {
      if (!value) return null;
      // If it's already an object with year, month, day, validate it
      if (typeof value === 'object' && value.year && value.month && value.day) {
        const date = { year: value.year, month: value.month, day: value.day };
        return this.adapter.isValid(date) ? date : null;
      }
      // If it's a string, parse it
      if (typeof value === 'string') {
        const parsed = this.adapter.parse(value, this.format, this.localeConfig);
        // Double-check validity after parsing
        if (parsed && this.adapter.isValid(parsed)) {
          return parsed;
        }
        return null;
      }
      return null;
    },
    toggle() {
      this.isOpen = !this.isOpen;
    },
    goToNextMonth() {
      const next = nextMonth(this.currentYear, this.currentMonth);
      this.updateView(next.year, next.month);
    },
    goToPreviousMonth() {
      const prev = previousMonth(this.currentYear, this.currentMonth);
      this.updateView(prev.year, prev.month);
    },
    goToNextYear() {
      const next = nextYear(this.currentYear, this.currentMonth);
      this.updateView(next.year, next.month);
    },
    goToPreviousYear() {
      const prev = previousYear(this.currentYear, this.currentMonth);
      this.updateView(prev.year, prev.month);
    },
    goToTodayMonth() {
      const todayDate = this.adapter.today();
      if (this.validateDate(todayDate)) {
        if (this.range) {
          this.selectedRange = { start: todayDate, end: todayDate };
        } else {
          this.selectedDate = todayDate;
        }
        this.updateInputValue();
        // Reset view to follow selectedDate
        this.viewMonth = null;
        this.viewYear = null;
      }
    },
    updateView(year, month) {
      // Only update the view, not the selectedDate
      this.viewYear = year;
      this.viewMonth = month;
    },
    updateCurrentDate(year, month) {
      // This method is deprecated - use updateView instead
      // Keeping for backward compatibility but it shouldn't be used for navigation
      this.updateView(year, month);
    },
    onSelectDate(day) {
      if (day.isDisabled) return;

      if (this.range) {
        // Range selection logic
        if (!this.selectedRange.start || (this.selectedRange.start && this.selectedRange.end)) {
          // Start new range
          this.selectedRange = { start: day.date, end: null };
        } else {
          // Complete the range
          const compare = this.adapter.compare(day.date, this.selectedRange.start);
          if (compare < 0) {
            // Selected date is before start, make it the new start
            this.selectedRange = { start: day.date, end: this.selectedRange.start };
          } else {
            // Selected date is after start, make it the end
            this.selectedRange = { start: this.selectedRange.start, end: day.date };
          }
          this.updateInputValue();
          this.isOpen = false;
        }
      } else {
        // Single date selection
        this.selectedDate = day.date;
        this.updateInputValue();
        this.viewMonth = null;
        this.viewYear = null;
        this.isOpen = false;
      }
    },
    updateInputValue() {
      if (this.editable) {
        this.inputValue = this.formattedDate;
        this.inputError = false;
      }
    },
    onInputChange(event) {
      if (!this.editable) return;
      this.inputValue = event.target.value;
      this.inputError = false;
    },
    onInputBlur() {
      if (!this.editable) return;
      this.parseInputValue();
    },
    onInputFocus() {
      if (!this.editable) return;
      // Select all text on focus for easy editing
      this.$nextTick(() => {
        const input = this.$el.querySelector('.hgc-datepicker__input');
        if (input) {
          input.select();
        }
      });
    },
    parseInputValue() {
      if (!this.editable || !this.inputValue.trim()) {
        if (this.range) {
          this.selectedRange = { start: null, end: null };
        } else {
          this.selectedDate = null;
        }
        this.inputError = false;
        return;
      }

      const format = this.displayFormat;
      let parsed;

      if (this.range) {
        // Try to parse range (format: "start - end" or "start-end")
        const parts = this.inputValue.split(/[\s-–—]+/).filter(p => p.trim());
        if (parts.length === 2) {
          const start = this.adapter.parse(parts[0].trim(), format, this.localeConfig);
          const end = this.adapter.parse(parts[1].trim(), format, this.localeConfig);
          if (start && end && this.validateDate(start) && this.validateDate(end)) {
            const compare = this.adapter.compare(start, end);
            this.selectedRange = compare <= 0
              ? { start, end }
              : { start: end, end: start };
            this.inputError = false;
            this.updateInputValue();
            return;
          }
        }
        this.inputError = true;
      } else {
        parsed = this.adapter.parse(this.inputValue, format, this.localeConfig);
        if (parsed && this.validateDate(parsed)) {
          this.selectedDate = parsed;
          this.inputError = false;
          this.updateInputValue();
          this.viewMonth = null;
          this.viewYear = null;
        } else {
          this.inputError = true;
        }
      }
    },
    validateDate(date) {
      if (!date || !this.adapter.isValid(date)) return false;

      // Check min/max constraints
      if (this.minDate && this.adapter.compare(date, this.minDate) < 0) return false;
      if (this.maxDate && this.adapter.compare(date, this.maxDate) > 0) return false;

      // Check disabled dates
      if (this.disabledDates.some(d => this.adapter.isSameDay(d, date))) return false;

      // Check disabled days of week
      const dayOfWeek = this.adapter.getDayOfWeek(date);
      if (this.disabledDaysOfWeek.includes(dayOfWeek)) return false;

      return true;
    },
    onCalendarChange(newCalendar) {
      if (this.calendarType === newCalendar) return;

      // Convert current selected date to new calendar system
      if (this.selectedDate) {
        const jsDate = this.adapter.toJsDate(this.selectedDate);
        this.calendarType = newCalendar;
        const newAdapter = this.calendarType === 'hijri' ? new HijriAdapter() : new GregorianAdapter();
        this.selectedDate = newAdapter.fromJsDate(jsDate);
        // Reset view to follow selectedDate
        this.viewMonth = null;
        this.viewYear = null;
      } else {
        this.calendarType = newCalendar;
        // Reset view when switching calendars without a selected date
        this.viewMonth = null;
        this.viewYear = null;
      }
    },
    onLocaleChange(newLocale) {
      this.localeCode = newLocale;
    },
    onSelectMonth(month) {
      // Only update the view, not the selectedDate
      this.updateView(this.currentYear, month);
    },
    onSelectYear(year) {
      // Only update the view, not the selectedDate
      this.updateView(year, this.currentMonth);
    },
    clearDate() {
      if (this.range) {
        this.selectedRange = { start: null, end: null };
      } else {
        this.selectedDate = null;
      }
      this.inputValue = '';
      this.inputError = false;
      this.viewMonth = null;
      this.viewYear = null;
    },
    handleOutsideClick(event) {
      // Check if click is on the month/year picker modal
      const modal = event.target.closest('.hgc-calendar-header__modal');
      const modalContent = event.target.closest('.hgc-calendar-header__modal-content');

      // If click is on modal, don't close the main dropdown (let modal handle its own closing)
      if (modal || modalContent) {
        return;
      }

      // If click is outside the datepicker component, close the dropdown
      if (this.$refs.datepicker && !this.$refs.datepicker.contains(event.target)) {
        this.isOpen = false;
      }
    }
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
    // Initialize input value
    this.updateInputValue();
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
  }
};
</script>
