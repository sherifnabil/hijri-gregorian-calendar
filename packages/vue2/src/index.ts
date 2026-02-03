import HijriGregorianCalendar from './components/HijriGregorianCalendar.vue';
export { default as HijriGregorianCalendar } from './components/HijriGregorianCalendar.vue';

import './styles/datepicker.css';

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
    install(Vue) {
        Vue.component('HijriGregorianCalendar', HijriGregorianCalendar);
    }
};
