import type { App } from 'vue';
import DualDatePicker from './components/DualDatePicker.vue';
import './styles/datepicker.css';

// Export components
export { DualDatePicker };

// Export composables
export * from './composables';

// Export types from core
export type {
    CalendarDate,
    CalendarAdapter,
    LocaleConfig,
    CalendarMonth,
    CalendarDay
} from '@dual-datepicker/core';

// Vue plugin
export default {
    install(app: App) {
        app.component('DualDatePicker', DualDatePicker);
    }
};
