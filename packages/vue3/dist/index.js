import { ref as b, computed as c, watch as U, defineComponent as ve, onMounted as _e, onBeforeUnmount as ye, openBlock as g, createElementBlock as x, createElementVNode as r, toDisplayString as w, createBlock as ce, Teleport as se, withModifiers as te, Fragment as G, renderList as q, normalizeClass as I, createCommentVNode as le, unref as n, normalizeStyle as pe, withKeys as me, createVNode as he, nextTick as ge } from "vue";
import { HijriAdapter as ee, GregorianAdapter as ae, getLocale as be, generateCalendarMonth as ke, nextMonth as Ce, previousMonth as De, nextYear as Me, previousYear as xe, formatNumber as ie } from "@dual-datepicker/core";
function Ve(a = {}) {
  const $ = b(
    typeof a.calendar == "object" ? a.calendar.value : a.calendar || "gregorian"
  ), l = b(
    typeof a.locale == "object" ? a.locale.value : a.locale || "en"
  ), m = b(
    typeof a.range == "object" ? a.range.value : a.range || !1
  );
  b(
    typeof a.time == "object" ? a.time.value : a.time || !1
  );
  const u = c(() => $.value === "hijri" ? new ee() : new ae()), s = c(() => be(l.value)), h = b(
    typeof a.format == "object" ? a.format.value : a.format || "dd/MM/yyyy"
  ), k = b(
    typeof a.inputFormat == "object" ? a.inputFormat.value : a.inputFormat || null
  ), V = b(
    typeof a.minDate == "object" ? a.minDate.value : a.minDate || null
  ), R = b(
    typeof a.maxDate == "object" ? a.maxDate.value : a.maxDate || null
  ), v = b(
    typeof a.disabledDates == "object" ? a.disabledDates.value : a.disabledDates || []
  ), D = b(
    typeof a.disabledDaysOfWeek == "object" ? a.disabledDaysOfWeek.value : a.disabledDaysOfWeek || []
  ), N = c(() => {
    var e;
    return (e = a.modelValue) == null ? void 0 : e.value;
  }), o = b(
    m.value ? null : N.value
  ), t = b(
    m.value ? N.value || { start: null, end: null } : { start: null, end: null }
  ), j = c(() => u.value.today()), _ = b(null), p = b(null), Y = c(() => _.value !== null ? _.value : o.value ? o.value.month : j.value.month), O = c(() => p.value !== null ? p.value : o.value ? o.value.year : j.value.year), A = b(null), T = b(!1), F = b(""), P = b(!1), J = c(() => ke(
    O.value,
    Y.value,
    u.value,
    s.value,
    m.value ? null : o.value,
    void 0,
    {
      selectedRange: m.value ? t.value : void 0,
      minDate: V.value || void 0,
      maxDate: R.value || void 0,
      disabledDates: v.value.length > 0 ? v.value : void 0,
      disabledDaysOfWeek: D.value.length > 0 ? D.value : void 0
    }
  )), B = c(() => u.value.getMonthName(Y.value, s.value));
  function H(e, y) {
    p.value = e, _.value = y;
  }
  function f() {
    const e = Ce(O.value, Y.value);
    H(e.year, e.month);
  }
  function i() {
    const e = De(O.value, Y.value);
    H(e.year, e.month);
  }
  function C() {
    const e = Me(O.value, Y.value);
    H(e.year, e.month);
  }
  function K() {
    const e = xe(O.value, Y.value);
    H(e.year, e.month);
  }
  function E() {
    const e = u.value.today();
    L(e) && (m.value ? t.value = { start: e, end: e } : o.value = e, _.value = null, p.value = null);
  }
  function fe(e) {
    m.value ? !t.value.start || t.value.start && t.value.end ? t.value = { start: e, end: null } : (u.value.compare(e, t.value.start) < 0 ? t.value = { start: e, end: t.value.start } : t.value = { start: t.value.start, end: e }, T.value = !1) : (o.value = e, _.value = null, p.value = null, T.value = !1);
  }
  function ne() {
    m.value ? t.value = { start: null, end: null } : o.value = null, F.value = "", P.value = !1, _.value = null, p.value = null;
  }
  function L(e) {
    if (!e || !u.value.isValid(e) || V.value && u.value.compare(e, V.value) < 0 || R.value && u.value.compare(e, R.value) > 0 || v.value.some((M) => u.value.isSameDay(M, e))) return !1;
    const y = u.value.getDayOfWeek(e);
    return !D.value.includes(y);
  }
  const Q = c(() => k.value || h.value);
  function re(e) {
    if (!e.trim())
      return m.value ? t.value = { start: null, end: null } : o.value = null, P.value = !1, !0;
    const y = Q.value;
    if (m.value) {
      const M = e.split(/[\s-–—]+/).filter((S) => S.trim());
      if (M.length === 2) {
        const S = u.value.parse(M[0].trim(), y, s.value), W = u.value.parse(M[1].trim(), y, s.value);
        if (S && W && L(S) && L(W)) {
          const de = u.value.compare(S, W);
          return t.value = de <= 0 ? { start: S, end: W } : { start: W, end: S }, P.value = !1, !0;
        }
      }
      return P.value = !0, !1;
    } else {
      const M = u.value.parse(e, y, s.value);
      return M && L(M) ? (o.value = M, P.value = !1, _.value = null, p.value = null, !0) : (P.value = !0, !1);
    }
  }
  function z() {
    F.value = X.value, P.value = !1;
  }
  function ue(e) {
    if ($.value !== e)
      if (m.value && t.value.start) {
        const y = u.value.toJsDate(t.value.start);
        $.value = e;
        const M = $.value === "hijri" ? new ee() : new ae(), S = M.fromJsDate(y);
        if (t.value.end) {
          const W = u.value.toJsDate(t.value.end), de = M.fromJsDate(W);
          t.value = { start: S, end: de };
        } else
          t.value = { start: S, end: null };
        _.value = null, p.value = null;
      } else if (o.value) {
        const y = u.value.toJsDate(o.value);
        $.value = e;
        const M = $.value === "hijri" ? new ee() : new ae();
        o.value = M.fromJsDate(y), _.value = null, p.value = null;
      } else
        $.value = e, u.value.today(), _.value = null, p.value = null;
  }
  const X = c(() => {
    if (m.value) {
      if (!t.value || !t.value.start && !t.value.end)
        return "";
      if (t.value.start && t.value.end) {
        const e = u.value.format(t.value.start, h.value, s.value), y = u.value.format(t.value.end, h.value, s.value);
        return `${e} - ${y}`;
      }
      return t.value.start ? u.value.format(t.value.start, h.value, s.value) : "";
    }
    return o.value ? u.value.format(o.value, h.value, s.value) : "";
  });
  function oe() {
    T.value = !T.value;
  }
  function Z() {
    T.value = !0;
  }
  function d() {
    T.value = !1;
  }
  return a.modelValue && U(() => a.modelValue.value, (e) => {
    m.value ? e && typeof e == "object" && "start" in e ? (t.value = e, z()) : e || (t.value = { start: null, end: null }, z()) : e && !("start" in e) ? (o.value = e, z(), _.value = null, p.value = null) : e || (o.value = null, z(), _.value = null, p.value = null);
  }, { immediate: !0 }), {
    // State
    selectedDate: o,
    selectedRange: t,
    today: j,
    currentMonth: Y,
    currentYear: O,
    currentMonthName: B,
    focusedDate: A,
    isOpen: T,
    calendarMonth: J,
    adapter: u,
    locale: s,
    calendarType: $,
    localeCode: l,
    viewMonth: _,
    viewYear: p,
    inputValue: F,
    inputError: P,
    displayFormat: Q,
    // Actions
    selectDate: fe,
    clearSelection: ne,
    updateView: H,
    goToNextMonth: f,
    goToPreviousMonth: i,
    goToNextYear: C,
    goToPreviousYear: K,
    goToTodayMonth: E,
    switchCalendar: ue,
    toggle: oe,
    open: Z,
    close: d,
    validateDate: L,
    parseInputValue: re,
    updateInputValue: z,
    // Computed
    formattedDate: X
  };
}
const $e = { class: "calendar-header__navigation" }, we = ["aria-label"], Ne = ["aria-label"], Te = { class: "calendar-header__current" }, Pe = ["dir"], Re = { class: "calendar-header__modal-content" }, He = { class: "calendar-header__modal-header" }, Se = { class: "calendar-header__month-grid" }, je = ["onClick"], Ye = { class: "calendar-header__modal-actions" }, Oe = ["dir"], Ee = { class: "calendar-header__modal-content" }, Fe = { class: "calendar-header__modal-header" }, Be = ["aria-label"], Le = ["aria-label"], ze = { class: "calendar-header__year-grid" }, We = ["onClick"], Ae = { class: "calendar-header__modal-actions" }, Ie = ["aria-label"], Je = ["aria-label"], Ke = /* @__PURE__ */ ve({
  __name: "CalendarHeader",
  props: {
    monthName: {},
    year: {},
    currentMonth: {},
    calendar: {},
    locale: {}
  },
  emits: ["previous-month", "next-month", "previous-year", "next-year", "today", "update:calendar", "update:locale", "select-month", "select-year"],
  setup(a, { emit: $ }) {
    const l = a, m = $, u = b(!1), s = b(!1), h = b(l.year), k = c(() => be(l.locale)), V = c(() => k.value.direction === "rtl"), R = c(
      () => l.calendar === "hijri" ? new ee() : new ae()
    ), v = c(() => ie(l.year, k.value)), D = c(() => Math.floor(h.value / 10) * 10), N = c(() => D.value + 9), o = c(() => {
      const f = [];
      for (let i = 0; i < 12; i++)
        f.push(D.value + i);
      return f;
    });
    U(() => l.year, (f) => {
      h.value = f;
    });
    function t() {
      u.value = !u.value, s.value = !1;
    }
    function j() {
      s.value = !s.value, u.value = !1, h.value = l.year;
    }
    function _() {
      u.value = !1;
    }
    function p() {
      s.value = !1;
    }
    function Y(f) {
      return R.value.getMonthName(f, k.value);
    }
    function O(f) {
      m("select-month", f);
    }
    function A(f) {
      m("select-year", f);
    }
    function T() {
      h.value = D.value - 10;
    }
    function F() {
      h.value = D.value + 10;
    }
    function P() {
      const f = R.value.today();
      m("select-month", f.month), _();
    }
    function J() {
      const f = R.value.today();
      m("select-year", f.year), h.value = f.year, p();
    }
    const B = b(null);
    function H(f) {
      const i = f.target;
      i.closest(".calendar-header__month--clickable") || i.closest(".calendar-header__year--clickable") || i.closest(".calendar-header__modal") || B.value && !B.value.contains(i) && (u.value = !1, s.value = !1);
    }
    return _e(() => {
      document.addEventListener("click", H);
    }), ye(() => {
      document.removeEventListener("click", H);
    }), (f, i) => (g(), x("div", {
      ref_key: "headerRef",
      ref: B,
      class: "calendar-header"
    }, [
      r("div", $e, [
        r("button", {
          type: "button",
          class: "calendar-header__btn",
          "aria-label": V.value ? "Next year" : "Previous year",
          onClick: i[0] || (i[0] = (C) => f.$emit("next-year"))
        }, " « ", 8, we),
        r("button", {
          type: "button",
          class: "calendar-header__btn",
          "aria-label": V.value ? "Next month" : "Previous month",
          onClick: i[1] || (i[1] = (C) => f.$emit("next-month"))
        }, " ‹ ", 8, Ne),
        r("div", Te, [
          r("button", {
            type: "button",
            class: "calendar-header__month calendar-header__month--clickable",
            onClick: t,
            "aria-label": "Select month"
          }, w(a.monthName), 1),
          r("button", {
            type: "button",
            class: "calendar-header__year calendar-header__year--clickable",
            onClick: j,
            "aria-label": "Select year"
          }, w(v.value), 1),
          (g(), ce(se, { to: "body" }, [
            u.value ? (g(), x("div", {
              key: 0,
              dir: k.value.direction === "rtl" ? "rtl" : "ltr",
              class: "calendar-header__modal",
              onClick: te(_, ["self"])
            }, [
              r("div", Re, [
                r("div", He, [
                  r("span", null, w(k.value.code === "ar" ? "اختر الشهر" : "Select Month"), 1),
                  r("button", {
                    type: "button",
                    class: "calendar-header__modal-close",
                    onClick: _,
                    "aria-label": "Close"
                  }, " × ")
                ]),
                r("div", Se, [
                  (g(), x(G, null, q(12, (C) => r("button", {
                    key: C,
                    type: "button",
                    class: I(["calendar-header__month-grid-item", { "calendar-header__month-grid-item--active": C === a.currentMonth }]),
                    onClick: (K) => O(C)
                  }, w(Y(C)), 11, je)), 64))
                ]),
                r("div", Ye, [
                  r("button", {
                    type: "button",
                    class: "calendar-header__modal-btn",
                    onClick: P
                  }, w(k.value.code === "ar" ? "الآن" : "Now"), 1),
                  r("button", {
                    type: "button",
                    class: "calendar-header__modal-btn calendar-header__modal-btn--primary",
                    onClick: _
                  }, w(k.value.code === "ar" ? "حسنا" : "OK"), 1)
                ])
              ])
            ], 8, Pe)) : le("", !0)
          ])),
          (g(), ce(se, { to: "body" }, [
            s.value ? (g(), x("div", {
              key: 0,
              dir: k.value.direction === "rtl" ? "rtl" : "ltr",
              class: "calendar-header__modal",
              onClick: te(p, ["self"])
            }, [
              r("div", Ee, [
                r("div", Fe, [
                  r("button", {
                    type: "button",
                    class: "calendar-header__modal-nav",
                    onClick: T,
                    "aria-label": V.value ? "Next decade" : "Previous decade"
                  }, " « ", 8, Be),
                  r("span", null, w(D.value) + " - " + w(N.value), 1),
                  r("button", {
                    type: "button",
                    class: "calendar-header__modal-nav",
                    onClick: F,
                    "aria-label": V.value ? "Previous decade" : "Next decade"
                  }, " » ", 8, Le),
                  r("button", {
                    type: "button",
                    class: "calendar-header__modal-close",
                    onClick: p,
                    "aria-label": "Close"
                  }, " × ")
                ]),
                r("div", ze, [
                  (g(!0), x(G, null, q(o.value, (C) => (g(), x("button", {
                    key: C,
                    type: "button",
                    class: I(["calendar-header__year-grid-item", { "calendar-header__year-grid-item--active": C === a.year }]),
                    onClick: (K) => A(C)
                  }, w(n(ie)(C, k.value)), 11, We))), 128))
                ]),
                r("div", Ae, [
                  r("button", {
                    type: "button",
                    class: "calendar-header__modal-btn",
                    onClick: J
                  }, w(k.value.code === "ar" ? "الآن" : "Now"), 1),
                  r("button", {
                    type: "button",
                    class: "calendar-header__modal-btn calendar-header__modal-btn--primary",
                    onClick: p
                  }, w(k.value.code === "ar" ? "حسنا" : "OK"), 1)
                ])
              ])
            ], 8, Oe)) : le("", !0)
          ]))
        ]),
        r("button", {
          type: "button",
          class: "calendar-header__btn",
          "aria-label": V.value ? "Previous month" : "Next month",
          onClick: i[2] || (i[2] = (C) => f.$emit("previous-month"))
        }, " › ", 8, Ie),
        r("button", {
          type: "button",
          class: "calendar-header__btn",
          "aria-label": V.value ? "Previous year" : "Next year",
          onClick: i[3] || (i[3] = (C) => f.$emit("previous-year"))
        }, " » ", 8, Je)
      ]),
      i[4] || (i[4] = r("div", { class: "calendar-header__actions" }, null, -1))
    ], 512));
  }
}), Ue = {
  class: "calendar-grid",
  role: "grid"
}, Ge = {
  class: "calendar-grid__weekdays",
  role: "row"
}, qe = { class: "calendar-grid__weeks" }, Qe = ["aria-label", "aria-selected", "disabled", "onClick"], Xe = { class: "calendar-header__actions" }, Ze = /* @__PURE__ */ ve({
  __name: "CalendarGrid",
  props: {
    calendarMonth: {},
    adapter: {},
    locale: {},
    selectedRange: {}
  },
  emits: ["select-date", "today"],
  setup(a, { emit: $ }) {
    const l = a, m = $;
    function u(v) {
      v.isDisabled || m("select-date", v);
    }
    function s(v) {
      return l.adapter.format(v.date, "dd MMMM yyyy", l.locale);
    }
    function h(v) {
      return ie(v, l.locale);
    }
    function k(v) {
      if (!l.selectedRange || !l.selectedRange.start || !l.selectedRange.end)
        return !1;
      const D = l.adapter.compare(v.date, l.selectedRange.start), N = l.adapter.compare(v.date, l.selectedRange.end);
      return D > 0 && N < 0;
    }
    function V(v) {
      return !l.selectedRange || !l.selectedRange.start ? !1 : l.adapter.isSameDay(v.date, l.selectedRange.start);
    }
    function R(v) {
      return !l.selectedRange || !l.selectedRange.end ? !1 : l.adapter.isSameDay(v.date, l.selectedRange.end);
    }
    return (v, D) => (g(), x("div", Ue, [
      r("div", Ge, [
        (g(!0), x(G, null, q(a.calendarMonth.weekdayLabels, (N, o) => (g(), x("div", {
          key: o,
          class: "calendar-grid__weekday",
          role: "columnheader"
        }, w(N), 1))), 128))
      ]),
      r("div", qe, [
        (g(!0), x(G, null, q(a.calendarMonth.weeks, (N, o) => (g(), x("div", {
          key: o,
          class: "calendar-grid__week",
          role: "row"
        }, [
          (g(!0), x(G, null, q(N, (t, j) => (g(), x("button", {
            key: j,
            type: "button",
            class: I(["calendar-grid__day", {
              "calendar-grid__day--current-month": t.isCurrentMonth,
              "calendar-grid__day--other-month": !t.isCurrentMonth,
              "calendar-grid__day--today": t.isToday,
              "calendar-grid__day--selected": t.isSelected,
              "calendar-grid__day--disabled": t.isDisabled,
              "calendar-grid__day--in-range": k(t),
              "calendar-grid__day--range-start": V(t),
              "calendar-grid__day--range-end": R(t)
            }]),
            "aria-label": s(t),
            "aria-selected": t.isSelected,
            disabled: t.isDisabled,
            role: "gridcell",
            onClick: (_) => u(t)
          }, w(h(t.date.day)), 11, Qe))), 128))
        ]))), 128))
      ]),
      r("div", Xe, [
        r("button", {
          type: "button",
          class: "calendar-header__btn calendar-header__btn--today",
          onClick: D[0] || (D[0] = (N) => v.$emit("today"))
        }, w(a.locale.code === "ar" ? "اليوم" : "Today"), 1)
      ])
    ]));
  }
}), ea = ["dir"], aa = { class: "dual-datepicker__input-wrapper" }, ta = ["aria-label"], la = ["value", "placeholder", "readonly", "aria-label", "aria-expanded", "aria-invalid"], na = ["aria-label"], ra = { class: "dual-datepicker__panel" }, ua = /* @__PURE__ */ ve({
  __name: "DualDatePicker",
  props: {
    modelValue: { default: null },
    calendar: { default: "gregorian" },
    locale: { default: "en" },
    range: { type: Boolean, default: !1 },
    time: { type: Boolean, default: !1 },
    placeholder: { default: "Select date" },
    ariaLabel: { default: "Date picker" },
    clearable: { type: Boolean, default: !0 },
    format: { default: "dd/MM/yyyy" },
    inputFormat: { default: null },
    editable: { type: Boolean, default: !1 },
    minDate: { default: null },
    maxDate: { default: null },
    disabledDates: { default: () => [] },
    disabledDaysOfWeek: { default: () => [] },
    inputClass: { default: "" }
  },
  emits: ["update:modelValue", "change"],
  setup(a, { emit: $ }) {
    const l = a, m = $, u = b(null), {
      selectedDate: s,
      selectedRange: h,
      currentMonth: k,
      currentYear: V,
      currentMonthName: R,
      isOpen: v,
      calendarMonth: D,
      adapter: N,
      locale: o,
      calendarType: t,
      localeCode: j,
      inputValue: _,
      inputError: p,
      displayFormat: Y,
      selectDate: O,
      clearSelection: A,
      updateView: T,
      goToNextMonth: F,
      goToPreviousMonth: P,
      goToNextYear: J,
      goToPreviousYear: B,
      goToTodayMonth: H,
      switchCalendar: f,
      toggle: i,
      formattedDate: C,
      parseInputValue: K,
      updateInputValue: E,
      validateDate: fe
    } = Ve({
      calendar: c(() => l.calendar),
      locale: c(() => l.locale),
      range: c(() => l.range),
      time: c(() => l.time),
      modelValue: c(() => l.modelValue),
      format: c(() => l.format),
      inputFormat: c(() => l.inputFormat),
      minDate: c(() => l.minDate),
      maxDate: c(() => l.maxDate),
      disabledDates: c(() => l.disabledDates),
      disabledDaysOfWeek: c(() => l.disabledDaysOfWeek)
    });
    U([s, h], () => {
      l.range ? (m("update:modelValue", h.value), m("change", h.value)) : (m("update:modelValue", s.value), m("change", s.value));
    }, { deep: !0 }), U(() => l.modelValue, (d) => {
      l.range ? d && typeof d == "object" && "start" in d && E() : d && !("start" in d) && E();
    }), U(() => l.range, (d) => {
      d ? (s.value = null, h.value = l.modelValue || { start: null, end: null }) : (h.value = { start: null, end: null }, s.value = l.modelValue || null), E();
    });
    function ne(d) {
      d.isDisabled || (O(d.date), E());
    }
    function L(d) {
      T(V.value, d);
    }
    function Q(d) {
      T(d, k.value);
    }
    function re(d) {
      f(d), E();
    }
    function z(d) {
      j.value = d;
    }
    function ue(d) {
      if (!l.editable) return;
      const e = d.target;
      _.value = e.value, p.value = !1;
    }
    function X() {
      l.editable && (K(_.value), E());
    }
    function oe() {
      l.editable && ge(() => {
        var e;
        const d = (e = u.value) == null ? void 0 : e.querySelector(".dual-datepicker__input");
        d && d.select();
      });
    }
    function Z(d) {
      const e = d.target, y = e.closest(".calendar-header__modal"), M = e.closest(".calendar-header__modal-content");
      y || M || e.closest(".dual-datepicker__dropdown") || u.value && u.value.contains(e) || (v.value = !1);
    }
    return _e(() => {
      document.addEventListener("click", Z), E();
    }), ye(() => {
      document.removeEventListener("click", Z);
    }), (d, e) => (g(), x("div", {
      class: "dual-datepicker",
      ref_key: "datepickerRef",
      ref: u,
      dir: n(o).direction
    }, [
      r("div", aa, [
        r("div", {
          class: "dual-datepicker__input-container",
          style: pe({ direction: n(o).direction })
        }, [
          r("button", {
            type: "button",
            class: I(["dual-datepicker__toggle", { "dual-datepicker__toggle--rtl": n(o).direction === "rtl" }]),
            "aria-label": n(v) ? "Close calendar" : "Open calendar",
            onClick: e[0] || (e[0] = //@ts-ignore
            (...y) => n(i) && n(i)(...y))
          }, [...e[5] || (e[5] = [
            r("svg", {
              version: "1.1",
              width: "16px",
              height: "16px",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "#AAA"
            }, [
              r("path", { d: `M436 160H12C5.4 160 0 154.6 0 148V112C0 85.5 21.5 64 48 64H96V12C96 5.4 101.4 0 108 0H148C154.6 0 160 5.4 160
              12V64H288V12C288 5.4 293.4 0 300 0H340C346.6 0 352 5.4 352 12V64H400C426.5 64 448 85.5 448 112V148C448 154.6
              442.6 160 436 160zM12 192H436C442.6 192 448 197.4 448 204V464C448 490.5 426.5 512 400 512H48C21.5 512 0 490.5 0
              464V204C0 197.4 5.4 192 12 192zM128 396C128 389.4 122.6 384 116 384H76C69.4 384 64 389.4 64 396V436C64 442.6 69.4
              448 76 448H116C122.6 448 128 442.6 128 436V396zM128 268C128 261.4 122.6 256 116 256H76C69.4 256 64 261.4 64
              268V308C64 314.6 69.4 320 76 320H116C122.6 320 128 314.6 128 308V268zM256 396C256 389.4 250.6 384 244
              384H204C197.4 384 192 389.4 192 396V436C192 442.6 197.4 448 204 448H244C250.6 448 256 442.6 256 436V396zM256
              268C256 261.4 250.6 256 244 256H204C197.4 256 192 261.4 192 268V308C192 314.6 197.4 320 204 320H244C250.6 320 256
              314.6 256 308V268zM384 396C384 389.4 378.6 384 372 384H332C325.4 384 320 389.4 320 396V436C320 442.6 325.4 448
              332 448H372C378.6 448 384 442.6 384 436V396zM384 268C384 261.4 378.6 256 372 256H332C325.4 256 320 261.4 320
              268V308C320 314.6 325.4 320 332 320H372C378.6 320 384 314.6 384 308V268z` })
            ], -1)
          ])], 10, ta),
          r("input", {
            value: a.editable ? n(_) : n(C),
            type: "text",
            class: I(["dual-datepicker__input", {
              "dual-datepicker__input--has-clear": (n(s) || a.range && n(h)) && a.clearable,
              "dual-datepicker__input--error": n(p),
              "dual-datepicker__input--rtl": n(o).direction === "rtl",
              "dual-datepicker__input--ltr": n(o).direction === "ltr",
              [a.inputClass]: a.inputClass
            }]),
            placeholder: a.placeholder,
            readonly: !a.editable,
            "aria-label": a.ariaLabel,
            "aria-expanded": n(v),
            "aria-invalid": n(p),
            onClick: e[1] || (e[1] = (y) => !a.editable && n(i)()),
            onKeydown: [
              e[2] || (e[2] = me((y) => !a.editable && n(i)(), ["enter"])),
              e[3] || (e[3] = me(te((y) => !a.editable && n(i)(), ["prevent"]), ["space"]))
            ],
            onInput: ue,
            onBlur: X,
            onFocus: oe
          }, null, 42, la),
          (n(s) || a.range && n(h)) && a.clearable ? (g(), x("button", {
            key: 0,
            type: "button",
            class: I(["dual-datepicker__clear", { "dual-datepicker__clear--rtl": n(o).direction === "rtl" }]),
            "aria-label": "Clear date",
            onClick: e[4] || (e[4] = te(
              //@ts-ignore
              (...y) => n(A) && n(A)(...y),
              ["stop"]
            ))
          }, " × ", 2)) : le("", !0)
        ], 4)
      ]),
      (g(), ce(se, { to: "body" }, [
        n(v) ? (g(), x("div", {
          key: 0,
          class: "dual-datepicker__dropdown",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `${n(t)} calendar picker`
        }, [
          r("div", ra, [
            he(Ke, {
              "month-name": n(R),
              year: n(V),
              "current-month": n(k),
              calendar: n(t),
              locale: n(j),
              onPreviousMonth: n(P),
              onNextMonth: n(F),
              onPreviousYear: n(B),
              onNextYear: n(J),
              onToday: n(H),
              "onUpdate:calendar": re,
              "onUpdate:locale": z,
              onSelectMonth: L,
              onSelectYear: Q
            }, null, 8, ["month-name", "year", "current-month", "calendar", "locale", "onPreviousMonth", "onNextMonth", "onPreviousYear", "onNextYear", "onToday"]),
            he(Ze, {
              "calendar-month": n(D),
              adapter: n(N),
              locale: n(o),
              "selected-range": a.range ? n(h) : null,
              onSelectDate: ne,
              onToday: n(H)
            }, null, 8, ["calendar-month", "adapter", "locale", "selected-range", "onToday"])
          ])
        ], 8, na)) : le("", !0)
      ]))
    ], 8, ea));
  }
}), ca = {
  install(a) {
    a.component("DualDatePicker", ua);
  }
};
export {
  ua as DualDatePicker,
  ca as default,
  Ve as useDatePicker
};
//# sourceMappingURL=index.js.map
