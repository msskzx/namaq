import { describe, expect, it } from 'vitest';
import * as adhan from 'adhan';
import { ADHKAR_AFTER, adhkarAt, adhkarOf, alertText, isAdhkarAlerts, MAX_ALERTS, MAX_DAYS, NO_ADHKAR_ALERTS, NO_ALERTS, isAdhanAlerts, type AdhanAlerts, planAll, planAlerts, plannedHere, planKey } from './adhanAlerts';
import { DEFAULT_PRAYER_SETTINGS, MY_LOCATION, prayerDay, type Adhan, type Place } from './prayer';

const lib = adhan as unknown as Adhan;
const cairo: Place = { name: 'القاهرة', lat: 30.04, lng: 31.24 };
const times = (place: Place) => (day: Date) => prayerDay(lib, place, day, DEFAULT_PRAYER_SETTINGS);

describe('adhan alerts plan', () => {
  it('is empty when every prayer is off', () => {
    expect(planAlerts(NO_ALERTS, cairo, new Date(2026, 10, 13, 9), times(cairo))).toEqual([]);
  });

  it('starts from the next time today and matches the prayer page times', () => {
    const today = times(cairo)(new Date(2026, 10, 13, 12));
    const now = today.dhuhr;
    const plan = planAlerts({ ...NO_ALERTS, asr: true, fajr: true }, cairo, now, times(cairo));
    expect(plan[0]).toMatchObject({ prayer: 'asr', at: today.asr });
    expect(plan[1].prayer).toBe('fajr');
    expect(plan[1].at.getTime()).toBe(times(cairo)(new Date(2026, 10, 14, 12)).fajr.getTime());
    expect(plan.every(alert => alert.at > now)).toBe(true);
    expect(plan.map(alert => alert.at.getTime())).toEqual([...plan.map(alert => alert.at.getTime())].sort((a, b) => a - b));
  });

  it('stays under the iOS limit with all five on, and within the day limit with one', () => {
    const all = planAlerts({ fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true }, cairo, new Date(2026, 10, 13, 1), times(cairo));
    expect(all.length).toBe(MAX_ALERTS);
    const one = planAlerts({ ...NO_ALERTS, isha: true }, cairo, new Date(2026, 10, 13, 1), times(cairo));
    expect(one.length).toBe(MAX_DAYS);
  });

  it('skips days with no time near the poles instead of scheduling an invalid date', () => {
    const tromso: Place = { name: 'ترومسو', lat: 69.65, lng: 18.96 };
    const plan = planAlerts({ fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true }, tromso, new Date(2026, 5, 21, 1), times(tromso));
    expect(plan.every(alert => !Number.isNaN(alert.at.getTime()))).toBe(true);
  });

  it('names the city, but not the phone\'s own place', () => {
    expect(alertText('fajr', cairo)).toEqual({ title: 'الفجر', body: 'حان وقت أذان الفجر في القاهرة' });
    expect(alertText('maghrib', { ...cairo, name: MY_LOCATION }).body).toBe('حان وقت أذان المغرب');
  });

  it('rings at sunrise without calling it an adhan (owner, 2026-11-23)', () => {
    expect(alertText('sunrise', cairo).body).toBe('حان وقت الشروق في القاهرة');
    const now = new Date(2026, 10, 13, 1);
    const plan = planAlerts({ ...NO_ALERTS, sunrise: true }, cairo, now, times(cairo));
    expect(plan.length).toBeGreaterThan(0);
    expect(plan.every(alert => alert.prayer === 'sunrise' && alert.at.getTime() === times(cairo)(new Date(alert.at.getFullYear(), alert.at.getMonth(), alert.at.getDate(), 12)).sunrise.getTime())).toBe(true);
  });

  it('keeps a list saved before the sunrise bell, with the sunrise off', () => {
    const saved: AdhanAlerts = { ...NO_ALERTS, fajr: true };
    delete saved.sunrise;
    expect(isAdhanAlerts(saved)).toBe(true);
    expect(planAlerts(saved, cairo, new Date(2026, 10, 13, 1), times(cairo)).every(alert => alert.prayer === 'fajr')).toBe(true);
  });

  it('checks stored values and changes key with the day', () => {
    expect(isAdhanAlerts(NO_ALERTS)).toBe(true);
    expect(isAdhanAlerts({ fajr: true })).toBe(false);
    expect(planKey(NO_ALERTS, NO_ADHKAR_ALERTS, cairo, DEFAULT_PRAYER_SETTINGS, new Date(2026, 10, 13, 1)))
      .not.toBe(planKey(NO_ALERTS, NO_ADHKAR_ALERTS, cairo, DEFAULT_PRAYER_SETTINGS, new Date(2026, 10, 14, 1)));
    expect(planKey(NO_ALERTS, NO_ADHKAR_ALERTS, cairo, DEFAULT_PRAYER_SETTINGS, new Date(2026, 10, 13, 1)))
      .not.toBe(planKey(NO_ALERTS, { morning: true, evening: false }, cairo, DEFAULT_PRAYER_SETTINGS, new Date(2026, 10, 13, 1)));
  });
});

describe('adhkar reminders', () => {
  const both = { morning: true, evening: true };
  const day = (date: Date) => date.toDateString();

  it('rings after fajr and after asr, before sunrise and maghrib', () => {
    const today = times(cairo)(new Date(2026, 10, 18, 12));
    expect(adhkarAt(today, 'morning').getTime()).toBe(today.fajr.getTime() + ADHKAR_AFTER * 60_000);
    expect(adhkarAt(today, 'evening').getTime()).toBe(today.asr.getTime() + ADHKAR_AFTER * 60_000);
    expect(adhkarAt(today, 'morning').getTime()).toBeLessThan(today.sunrise.getTime());
    expect(adhkarAt(today, 'evening').getTime()).toBeLessThan(today.maghrib.getTime());
    const short = { ...today, sunrise: new Date(today.fajr.getTime() + 10 * 60_000) };
    expect(adhkarAt(short, 'morning').getTime()).toBe(today.fajr.getTime() + 5 * 60_000);
  });

  it('is empty when both are off, and plans each day when on', () => {
    const now = new Date(2026, 10, 18, 1);
    expect(planAll(NO_ALERTS, NO_ADHKAR_ALERTS, cairo, now, times(cairo))).toEqual({ prayers: [], adhkar: [] });
    const plan = planAll(NO_ALERTS, both, cairo, now, times(cairo));
    expect(plan.prayers).toEqual([]);
    expect(plan.adhkar).toHaveLength(MAX_DAYS * 2);
    expect(plan.adhkar[0]).toMatchObject({ adhkar: 'morning', title: 'أذكار الصباح', body: 'حان وقت أذكار الصباح' });
    expect(plan.adhkar[1]).toMatchObject({ adhkar: 'evening', title: 'أذكار المساء' });
    expect(new Set(plan.adhkar.filter(item => item.adhkar === 'morning').map(item => day(item.at))).size).toBe(MAX_DAYS);
    const evening = planAll(NO_ALERTS, both, cairo, new Date(2026, 10, 18, 23), times(cairo));
    expect(day(evening.adhkar[0].at)).toBe(day(new Date(2026, 10, 19)));
  });

  it('shares the 60 alerts with the adhan, soonest first, and leaves the adhan plan as it was', () => {
    const all = { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true };
    const now = new Date(2026, 10, 18, 1);
    const plan = planAll(all, both, cairo, now, times(cairo));
    expect(plan.prayers.length + plan.adhkar.length).toBe(MAX_ALERTS);
    const every = Array.from({ length: MAX_DAYS }, (_, i) => times(cairo)(new Date(2026, 10, 18 + i, 12))).flatMap(that => [
      that.fajr, that.dhuhr, that.asr, that.maghrib, that.isha, adhkarAt(that, 'morning'), adhkarAt(that, 'evening'),
    ]).map(at => at.getTime()).filter(at => at > now.getTime()).sort((a, b) => a - b).slice(0, MAX_ALERTS);
    expect([...plan.prayers, ...plan.adhkar].map(item => item.at.getTime()).sort((a, b) => a - b)).toEqual(every);
    expect(plan.adhkar.every(item => !('prayer' in item))).toBe(true);
    expect(plan.prayers.every(item => !('adhkar' in item))).toBe(true);
    expect(planAll(all, NO_ADHKAR_ALERTS, cairo, now, times(cairo)).prayers).toEqual(planAlerts(all, cairo, now, times(cairo)));
  });

  it('keeps one reminder per local day across a clock change', () => {
    const berlin: Place = { name: 'برلين', lat: 52.52, lng: 13.4 };
    const plan = planAll(NO_ALERTS, both, berlin, new Date(2026, 9, 20, 1), times(berlin));
    for (const time of ['morning', 'evening'] as const) {
      const days = plan.adhkar.filter(item => item.adhkar === time).map(item => day(item.at));
      expect(new Set(days).size).toBe(days.length);
      expect(days).toHaveLength(MAX_DAYS);
    }
    for (const item of plan.adhkar) {
      const that = times(berlin)(new Date(item.at.getFullYear(), item.at.getMonth(), item.at.getDate(), 12));
      const [from, until] = item.adhkar === 'morning' ? [that.fajr, that.sunrise] : [that.asr, that.maghrib];
      expect(item.at.getTime()).toBeGreaterThan(from.getTime());
      expect(item.at.getTime()).toBeLessThan(until.getTime());
    }
  });

  it('skips a day with no fajr near the poles', () => {
    const tromso: Place = { name: 'ترومسو', lat: 69.65, lng: 18.96 };
    const plan = planAll(NO_ALERTS, both, tromso, new Date(2026, 5, 21, 1), times(tromso));
    expect(plan.adhkar.every(item => !Number.isNaN(item.at.getTime()))).toBe(true);
  });

  it('cancels only its own notifications, each kind under its own key', () => {
    expect(plannedHere({ prayer: 'fajr' })).toBe(true);
    expect(plannedHere({ adhkar: 'morning' })).toBe(true);
    expect(plannedHere({ other: 'x' })).toBe(false);
    expect(plannedHere(undefined)).toBe(false);
  });

  it('opens a tapped reminder\'s adhkar, and nothing for an adhan alert', () => {
    expect(adhkarOf({ adhkar: 'morning' })).toBe('morning');
    expect(adhkarOf({ adhkar: 'evening' })).toBe('evening');
    expect(adhkarOf({ prayer: 'fajr' })).toBeNull();
    expect(adhkarOf({ adhkar: 'noon' })).toBeNull();
    expect(adhkarOf(undefined)).toBeNull();
  });

  it('checks stored values', () => {
    expect(isAdhkarAlerts(NO_ADHKAR_ALERTS)).toBe(true);
    expect(isAdhkarAlerts({ morning: true })).toBe(false);
  });
});
