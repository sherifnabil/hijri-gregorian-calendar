<script setup lang="ts">
import { ref } from 'vue';
import { DualDatePicker } from '@dual-datepicker/vue3';
import '@dual-datepicker/vue3/styles';
import type { CalendarDate } from '@dual-datepicker/core';

const gregorianDate = ref<CalendarDate | null>(null);
const hijriDate = ref<CalendarDate | null>(null);
</script>

<template>
  <div class="container">
    <header>
      <h1>🗓️ Dual Calendar DatePicker</h1>
      <p>Vue 3 Example - Hijri & Gregorian Calendars</p>
    </header>

    <main>
      <section class="demo-section">
        <h2>Gregorian Calendar (English)</h2>
        <DualDatePicker
          v-model="gregorianDate"
          calendar="gregorian"
          locale="en"
          placeholder="Select Gregorian date"
        />
        <div v-if="gregorianDate" class="selected-date">
          Selected: {{ gregorianDate.year }}-{{ String(gregorianDate.month).padStart(2, '0') }}-{{ String(gregorianDate.day).padStart(2, '0') }}
        </div>
      </section>

      <section class="demo-section">
        <h2>Hijri Calendar (Arabic)</h2>
        <DualDatePicker
          v-model="hijriDate"
          calendar="hijri"
          locale="ar"
          placeholder="اختر التاريخ الهجري"
        />
        <div v-if="hijriDate" class="selected-date">
          Selected: {{ hijriDate.year }}/{{ String(hijriDate.month).padStart(2, '0') }}/{{ String(hijriDate.day).padStart(2, '0') }}
        </div>
      </section>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

header p {
  font-size: 1.125rem;
  opacity: 0.9;
}

main {
  display: grid;
  gap: 2rem;
}

.demo-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.demo-section h2 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.selected-date {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
}
</style>
