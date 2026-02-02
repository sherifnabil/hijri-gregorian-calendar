import DualDatePicker from './components/DualDatePicker.vue';
import './styles/datepicker.css';

// Export component
export { DualDatePicker };

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
    install(Vue) {
        Vue.component('DualDatePicker', DualDatePicker);
    }
};
