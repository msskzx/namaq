import { describe, expect, it } from 'vitest';
import * as adhan from 'adhan';
import { alertText, MAX_ALERTS, MAX_DAYS, NO_ALERTS, isAdhanAlerts, planAlerts, planKey } from './adhanAlerts';
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
    // Dhuhr, in whatever zone the tests run in, so Fajr is behind and Asr ahead.
    const now = today.dhuhr;
    const plan = planAlerts({ ...NO_ALERTS, asr: true, fajr: true }, cairo, now, times(cairo));
    // Fajr today has passed, so the first alert is today's Asr, then tomorrow's Fajr.
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

  it('checks stored values and changes key with the day', () => {
    expect(isAdhanAlerts(NO_ALERTS)).toBe(true);
    expect(isAdhanAlerts({ fajr: true })).toBe(false);
    expect(planKey(NO_ALERTS, cairo, DEFAULT_PRAYER_SETTINGS, new Date(2026, 10, 13, 1)))
      .not.toBe(planKey(NO_ALERTS, cairo, DEFAULT_PRAYER_SETTINGS, new Date(2026, 10, 14, 1)));
  });
});
