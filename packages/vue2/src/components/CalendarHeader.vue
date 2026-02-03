<template>
  <div class="hgc-calendar-header">
    <div class="hgc-calendar-header__navigation">
      <button type="button" class="hgc-calendar-header__btn" :aria-label="isRTL ? 'Next year' : 'Previous year'"
        @click="$emit(isRTL ? 'previous-year' : 'next-year')">
        &laquo;
      </button>
      <button type="button" class="hgc-calendar-header__btn" :aria-label="isRTL ? 'Next month' : 'Previous month'"
        @click="$emit(isRTL ? 'previous-month' : 'next-month')">
        &lsaquo;
      </button>

      <div class="hgc-calendar-header__current">
        <button type="button" class="hgc-calendar-header__month hgc-calendar-header__month--clickable"
          @click="toggleMonthPicker" :aria-label="'Select month'">
          {{ monthName }}
        </button>
        <button type="button" class="hgc-calendar-header__year hgc-calendar-header__year--clickable"
          @click="toggleYearPicker" :aria-label="'Select year'">
          {{ formattedYear }}
        </button>

        <!-- Month picker modal -->
        <div v-if="showMonthPicker" :dir="localeConfig.direction === 'rtl' ? 'rtl' : 'ltr'"
          class="hgc-calendar-header__modal" @click.self="closeMonthPicker">
          <div class="hgc-calendar-header__modal-content">
            <div class="hgc-calendar-header__modal-header">
              <span>{{ localeConfig.code === 'ar' ? 'اختر الشهر' : 'Select Month' }}</span>
              <button type="button" class="hgc-calendar-header__modal-close" @click="closeMonthPicker"
                aria-label="Close">
                &times;
              </button>
            </div>
            <div class="hgc-calendar-header__month-grid">
              <button v-for="monthIndex in 12" :key="monthIndex" type="button"
                class="hgc-calendar-header__month-grid-item"
                :class="{ 'hgc-calendar-header__month-grid-item--active': monthIndex === currentMonth }"
                @click="selectMonth(monthIndex)">
                {{ getMonthNameByIndex(monthIndex) }}
              </button>
            </div>
            <div class="hgc-calendar-header__modal-actions">
              <button type="button" class="hgc-calendar-header__modal-btn" @click="goToTodayMonth">
                {{ localeConfig.code === 'ar' ? 'الآن' : 'Now' }}
              </button>
              <button type="button" class="hgc-calendar-header__modal-btn hgc-calendar-header__modal-btn--primary"
                @click="closeMonthPicker">
                {{ localeConfig.code === 'ar' ? 'حسنا' : 'OK' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Year picker modal -->
        <div v-if="showYearPicker" :dir="localeConfig.direction === 'rtl' ? 'rtl' : 'ltr'"
          class="hgc-calendar-header__modal" @click.self="closeYearPicker">
          <div class="hgc-calendar-header__modal-content">
            <div class="hgc-calendar-header__modal-header">
              <button type="button" class="hgc-calendar-header__modal-nav" @click="previousDecade"
                :aria-label="isRTL ? 'Next decade' : 'Previous decade'">
                &laquo;
              </button>
              <span>{{ decadeStart }} - {{ decadeEnd }}</span>
              <button type="button" class="hgc-calendar-header__modal-nav" @click="nextDecade"
                :aria-label="isRTL ? 'Previous decade' : 'Next decade'">
                &raquo;
              </button>
              <button type="button" class="hgc-calendar-header__modal-close" @click="closeYearPicker"
                aria-label="Close">
                &times;
              </button>
            </div>
            <div class="hgc-calendar-header__year-grid">
              <button v-for="yearOption in yearOptions" :key="yearOption" type="button"
                class="hgc-calendar-header__year-grid-item"
                :class="{ 'hgc-calendar-header__year-grid-item--active': yearOption === year }"
                @click="selectYear(yearOption)">
                {{ formatNumber(yearOption, localeConfig) }}
              </button>
            </div>
            <div class="hgc-calendar-header__modal-actions">
              <button type="button" class="hgc-calendar-header__modal-btn" @click="goToTodayYear">
                {{ localeConfig.code === 'ar' ? 'الآن' : 'Now' }}
              </button>
              <button type="button" class="hgc-calendar-header__modal-btn hgc-calendar-header__modal-btn--primary"
                @click="closeYearPicker">
                {{ localeConfig.code === 'ar' ? 'حسنا' : 'OK' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button type="button" class="hgc-calendar-header__btn" :aria-label="isRTL ? 'Previous month' : 'Next month'"
        @click="$emit(isRTL ? 'next-month' : 'previous-month')">
        &rsaquo;
      </button>
      <button type="button" class="hgc-calendar-header__btn" :aria-label="isRTL ? 'Previous year' : 'Next year'"
        @click="$emit(isRTL ? 'next-year' : 'previous-year')">
        &raquo;
      </button>
    </div>

    <div class="hgc-calendar-header__actions">
      <!-- ... existing code ... -->
    </div>
  </div>
</template>

<script>
import { formatNumber, getLocale, GregorianAdapter, HijriAdapter } from '@sherifnabil/hijri-gregorian-calendar-core';

export default {
  name: 'CalendarHeader',
  props: {
    monthName: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    currentMonth: {
      type: Number,
      required: true
    },
    calendar: {
      type: String,
      required: true
    },
    locale: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showMonthPicker: false,
      showYearPicker: false,
      yearDecade: this.year
    };
  },
  computed: {
    isRTL() {
      return getLocale(this.locale).direction === 'rtl';
    },
    localeConfig() {
      return getLocale(this.locale);
    },
    formattedYear() {
      return formatNumber(this.year, this.localeConfig);
    },
    adapter() {
      return this.calendar === 'hijri' ? new HijriAdapter() : new GregorianAdapter();
    },
    decadeStart() {
      return Math.floor(this.yearDecade / 10) * 10;
    },
    decadeEnd() {
      return this.decadeStart + 9;
    },
    yearOptions() {
      // Generate 12 years (3x4 grid) starting from decade start
      const options = [];
      for (let i = 0; i < 12; i++) {
        options.push(this.decadeStart + i);
      }
      return options;
    }
  },
  watch: {
    year(newYear) {
      // Update decade when year changes externally
      this.yearDecade = newYear;
    }
  },
  methods: {
    formatNumber,
    onCalendarChange(event) {
      this.$emit('update:calendar', event.target.value);
    },
    onLocaleChange(event) {
      this.$emit('update:locale', event.target.value);
    },
    toggleMonthPicker() {
      this.showMonthPicker = !this.showMonthPicker;
      this.showYearPicker = false;
    },
    toggleYearPicker() {
      this.showYearPicker = !this.showYearPicker;
      this.showMonthPicker = false;
      // Reset to current year's decade when opening
      this.yearDecade = this.year;
    },
    closeMonthPicker() {
      this.showMonthPicker = false;
    },
    closeYearPicker() {
      this.showYearPicker = false;
    },
    getMonthNameByIndex(monthIndex) {
      return this.adapter.getMonthName(monthIndex, this.localeConfig);
    },
    selectMonth(monthIndex) {
      this.$emit('select-month', monthIndex);
      // Don't close immediately - let user click OK or Now
    },
    selectYear(yearValue) {
      this.$emit('select-year', yearValue);
      // Don't close immediately - let user click OK or Now
    },
    previousDecade() {
      this.yearDecade = this.decadeStart - 10;
    },
    nextDecade() {
      this.yearDecade = this.decadeStart + 10;
    },
    goToTodayMonth() {
      const today = this.adapter.today();
      this.$emit('select-month', today.month);
      this.closeMonthPicker();
    },
    goToTodayYear() {
      const today = this.adapter.today();
      this.$emit('select-year', today.year);
      this.yearDecade = today.year;
      this.closeYearPicker();
    },
    handleOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.showMonthPicker = false;
        this.showYearPicker = false;
      }
    }
  },
  mounted() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
  }
};
</script>

<style scoped>
.hgc-calendar-header__month--clickable,
.hgc-calendar-header__year--clickable {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  background: none;
  border: none;
  font: inherit;
  transition: background-color 0.2s;
}

.hgc-calendar-header__month--clickable:hover,
.hgc-calendar-header__year--clickable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.hgc-calendar-header__current {
  position: relative;
}

/* Modal overlay */
.hgc-calendar-header__modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Modal content */
.hgc-calendar-header__modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-width: 320px;
  max-width: 400px;
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.hgc-calendar-header__modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #3b82f6;
  color: white;
  border-radius: 12px 12px 0 0;
}

.hgc-calendar-header__modal-header span {
  font-weight: 600;
  font-size: 1rem;
}

.hgc-calendar-header__modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.hgc-calendar-header__modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.hgc-calendar-header__modal-nav {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.hgc-calendar-header__modal-nav:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Month grid - 3 columns x 4 rows */
.hgc-calendar-header__month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 16px;
}

.hgc-calendar-header__month-grid-item {
  padding: 12px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  text-align: center;
  font-weight: 500;
}

.hgc-calendar-header__month-grid-item:hover {
  background: #f3f4f6;
  border-color: #3b82f6;
  transform: scale(1.05);
}

.hgc-calendar-header__month-grid-item--active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  font-weight: 600;
}

.hgc-calendar-header__month-grid-item--active:hover {
  background: #2563eb;
}

/* Year grid - 3 columns x 4 rows */
.hgc-calendar-header__year-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 16px;
}

.hgc-calendar-header__year-grid-item {
  padding: 12px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  text-align: center;
  font-weight: 500;
}

.hgc-calendar-header__year-grid-item:hover {
  background: #f3f4f6;
  border-color: #3b82f6;
  transform: scale(1.05);
}

.hgc-calendar-header__year-grid-item--active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  font-weight: 600;
}

.hgc-calendar-header__year-grid-item--active:hover {
  background: #2563eb;
}

/* Modal actions */
.hgc-calendar-header__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 12px 12px;
}

[dir="rtl"] .hgc-calendar-header__modal-actions {
  flex-direction: row-reverse;
}

.hgc-calendar-header__modal-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.hgc-calendar-header__modal-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.hgc-calendar-header__modal-btn--primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.hgc-calendar-header__modal-btn--primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

/* Remove old dropdown styles */
.hgc-calendar-header__dropdown {
  display: none;
}
</style>