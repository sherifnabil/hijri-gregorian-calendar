<template>
  <div ref="headerRef" class="calendar-header">
    <div class="calendar-header__navigation">
      <button type="button" class="calendar-header__btn" :aria-label="isRTL ? 'Next year' : 'Previous year'"
        @click="$emit('next-year')">
        &laquo;
      </button>
      <button type="button" class="calendar-header__btn" :aria-label="isRTL ? 'Next month' : 'Previous month'"
        @click="$emit('next-month')">
        &lsaquo;
      </button>

      <div class="calendar-header__current">
        <button type="button" class="calendar-header__month calendar-header__month--clickable"
          @click="toggleMonthPicker" :aria-label="'Select month'">
          {{ monthName }}
        </button>
        <button type="button" class="calendar-header__year calendar-header__year--clickable" @click="toggleYearPicker"
          :aria-label="'Select year'">
          {{ formattedYear }}
        </button>

        <!-- Month picker modal -->
        <Teleport to="body">
          <div v-if="showMonthPicker" :dir="localeConfig.direction === 'rtl' ? 'rtl' : 'ltr'"
            class="calendar-header__modal" @click.self="closeMonthPicker">
            <div class="calendar-header__modal-content">
              <div class="calendar-header__modal-header">
                <span>{{ localeConfig.code === 'ar' ? 'اختر الشهر' : 'Select Month' }}</span>
                <button type="button" class="calendar-header__modal-close" @click="closeMonthPicker" aria-label="Close">
                  &times;
                </button>
              </div>
              <div class="calendar-header__month-grid">
                <button v-for="monthIndex in 12" :key="monthIndex" type="button"
                  class="calendar-header__month-grid-item"
                  :class="{ 'calendar-header__month-grid-item--active': monthIndex === currentMonth }"
                  @click="selectMonth(monthIndex)">
                  {{ getMonthNameByIndex(monthIndex) }}
                </button>
              </div>
              <div class="calendar-header__modal-actions">
                <button type="button" class="calendar-header__modal-btn" @click="goToTodayMonth">
                  {{ localeConfig.code === 'ar' ? 'الآن' : 'Now' }}
                </button>
                <button type="button" class="calendar-header__modal-btn calendar-header__modal-btn--primary"
                  @click="closeMonthPicker">
                  {{ localeConfig.code === 'ar' ? 'حسنا' : 'OK' }}
                </button>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- Year picker modal -->
        <Teleport to="body">
          <div v-if="showYearPicker" :dir="localeConfig.direction === 'rtl' ? 'rtl' : 'ltr'"
            class="calendar-header__modal" @click.self="closeYearPicker">
            <div class="calendar-header__modal-content">
              <div class="calendar-header__modal-header">
                <button type="button" class="calendar-header__modal-nav" @click="previousDecade"
                  :aria-label="isRTL ? 'Next decade' : 'Previous decade'">
                  &laquo;
                </button>
                <span>{{ decadeStart }} - {{ decadeEnd }}</span>
                <button type="button" class="calendar-header__modal-nav" @click="nextDecade"
                  :aria-label="isRTL ? 'Previous decade' : 'Next decade'">
                  &raquo;
                </button>
                <button type="button" class="calendar-header__modal-close" @click="closeYearPicker" aria-label="Close">
                  &times;
                </button>
              </div>
              <div class="calendar-header__year-grid">
                <button v-for="yearOption in yearOptions" :key="yearOption" type="button"
                  class="calendar-header__year-grid-item"
                  :class="{ 'calendar-header__year-grid-item--active': yearOption === year }"
                  @click="selectYear(yearOption)">
                  {{ formatNumber(yearOption, localeConfig) }}
                </button>
              </div>
              <div class="calendar-header__modal-actions">
                <button type="button" class="calendar-header__modal-btn" @click="goToTodayYear">
                  {{ localeConfig.code === 'ar' ? 'الآن' : 'Now' }}
                </button>
                <button type="button" class="calendar-header__modal-btn calendar-header__modal-btn--primary"
                  @click="closeYearPicker">
                  {{ localeConfig.code === 'ar' ? 'حسنا' : 'OK' }}
                </button>
              </div>
            </div>
          </div>
        </Teleport>
      </div>

      <button type="button" class="calendar-header__btn" :aria-label="isRTL ? 'Previous month' : 'Next month'"
        @click="$emit('previous-month')">
        &rsaquo;
      </button>
      <button type="button" class="calendar-header__btn" :aria-label="isRTL ? 'Previous year' : 'Next year'"
        @click="$emit('previous-year')">
        &raquo;
      </button>
    </div>

    <div class="calendar-header__actions">
      <!-- ... existing code ... -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { formatNumber, getLocale, GregorianAdapter, HijriAdapter } from '@dual-datepicker/core';
import type { CalendarAdapter, LocaleConfig } from '@dual-datepicker/core';

const props = defineProps<{
  monthName: string;
  year: number;
  currentMonth: number;
  calendar: 'gregorian' | 'hijri';
  locale: string;
}>();

const emit = defineEmits<{
  'previous-month': [];
  'next-month': [];
  'previous-year': [];
  'next-year': [];
  'today': [];
  'update:calendar': [value: 'gregorian' | 'hijri'];
  'update:locale': [value: string];
  'select-month': [month: number];
  'select-year': [year: number];
}>();

const showMonthPicker = ref(false);
const showYearPicker = ref(false);
const yearDecade = ref(props.year);

const localeConfig = computed<LocaleConfig>(() => getLocale(props.locale));
const isRTL = computed(() => localeConfig.value.direction === 'rtl');
const adapter = computed<CalendarAdapter>(() =>
  props.calendar === 'hijri' ? new HijriAdapter() : new GregorianAdapter()
);
const formattedYear = computed(() => formatNumber(props.year, localeConfig.value));
const decadeStart = computed(() => Math.floor(yearDecade.value / 10) * 10);
const decadeEnd = computed(() => decadeStart.value + 9);
const yearOptions = computed(() => {
  const options = [];
  for (let i = 0; i < 12; i++) {
    options.push(decadeStart.value + i);
  }
  return options;
});

watch(() => props.year, (newYear) => {
  yearDecade.value = newYear;
});


function toggleMonthPicker() {
  showMonthPicker.value = !showMonthPicker.value;
  showYearPicker.value = false;
}

function toggleYearPicker() {
  showYearPicker.value = !showYearPicker.value;
  showMonthPicker.value = false;
  yearDecade.value = props.year;
}

function closeMonthPicker() {
  showMonthPicker.value = false;
}

function closeYearPicker() {
  showYearPicker.value = false;
}

function getMonthNameByIndex(monthIndex: number) {
  return adapter.value.getMonthName(monthIndex, localeConfig.value);
}

function selectMonth(monthIndex: number) {
  emit('select-month', monthIndex);
}

function selectYear(yearValue: number) {
  emit('select-year', yearValue);
}

function previousDecade() {
  yearDecade.value = decadeStart.value - 10;
}

function nextDecade() {
  yearDecade.value = decadeStart.value + 10;
}

function goToTodayMonth() {
  const today = adapter.value.today();
  emit('select-month', today.month);
  closeMonthPicker();
}

function goToTodayYear() {
  const today = adapter.value.today();
  emit('select-year', today.year);
  yearDecade.value = today.year;
  closeYearPicker();
}

// Click outside handler to close modals
const headerRef = ref<HTMLElement | null>(null);

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  // Don't close if clicking on month/year toggle buttons
  if (target.closest('.calendar-header__month--clickable') ||
    target.closest('.calendar-header__year--clickable')) {
    return;
  }

  // Don't close if clicking on modal (which is teleported to body)
  if (target.closest('.calendar-header__modal')) {
    return;
  }

  // Close modals if click is outside the component
  if (headerRef.value && !headerRef.value.contains(target)) {
    showMonthPicker.value = false;
    showYearPicker.value = false;
  }
}

onMounted(() => {
  // Close modals when clicking outside
  document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>
