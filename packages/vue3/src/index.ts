import type { App } from 'vue';
import HijriGregorianCalendar from './components/HijriGregorianCalendar.vue';
import './styles/datepicker.css';

// Export components
export { HijriGregorianCalendar };

// Export composables
export * from './composables';

// Export types from core
export type {
    CalendarDate,
    CalendarAdapter,
    LocaleConfig,
    CalendarMonth,
    CalendarDay
} from '@sherifnabil/hijri-gregorian-calendar-core';

// Vue plugin
export default {
    install(app: App) {
        app.component('HijriGregorianCalendar', HijriGregorianCalendar);
    }
};
