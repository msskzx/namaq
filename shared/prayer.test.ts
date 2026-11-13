import { describe, expect, it } from 'vitest';
import * as adhan from 'adhan';
import { clock, CITIES, DEFAULT_PRAYER_SETTINGS, hijriMonth, inRamadan, isPlace, nextPrayer, prayerDay, qiblaBearing, searchPlaces, turnTo, type Adhan, type Place, type PrayerSettings } from './prayer';

const lib = adhan as unknown as Adhan;
const city = (name: string) => CITIES.find(place => place.name === name)!;
/** «16:56» in the city's own zone, whatever zone the tests run in. */
const at = (date: Date, zone: string) => date.toLocaleTimeString('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const day = (place: Place, iso: string, settings: PrayerSettings = DEFAULT_PRAYER_SETTINGS) => {
  const [y, m, d] = iso.split('-').map(Number);
  return prayerDay(lib, place, new Date(y, m - 1, d, 12), settings);
};
const six = (times: ReturnType<typeof day>, zone: string) => (['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(key => at(times[key], zone)).join(' ');

describe('prayerDay against the Egyptian General Authority for Survey', () => {
  // Official tables as printed by Sada El Balad and Egypt Telegraph (docs/prayer-times.md). Within a minute: their rounding and city points differ slightly.
  const official: [string, string, string][] = [
    ['القاهرة', '2025-11-22', '04:55 06:26 11:41 14:36 16:56 18:17'],
    ['القاهرة', '2026-01-11', '05:20 06:52 12:03 14:55 17:14 18:36'],
    ['الإسكندرية', '2026-01-11', '05:27 07:00 12:08 14:57 17:17 18:40'],
    ['القاهرة', '2026-01-24', '05:19 06:49 12:07 15:05 17:25 18:45'],
    ['الإسكندرية', '2026-01-24', '05:25 06:57 12:12 15:08 17:28 18:50'],
    ['أسوان', '2026-01-24', '05:07 06:32 12:00 15:07 17:29 18:45'],
  ];
  it.each(official)('%s on %s', (name, iso, table) => {
    const mine = six(day(city(name), iso), 'Africa/Cairo').split(' ');
    const minutes = (text: string) => Number(text.slice(0, 2)) * 60 + Number(text.slice(3));
    table.split(' ').forEach((want, i) => expect(Math.abs(minutes(mine[i]) - minutes(want))).toBeLessThanOrEqual(1));
  });
  it('has no extra minute on Dhuhr', () => {
    expect(at(day(city('القاهرة'), '2025-11-22').dhuhr, 'Africa/Cairo')).toBe('11:41');
  });
});

describe('prayerDay elsewhere', () => {
  it('keeps Fajr and Isha apart in a Berlin summer', () => {
    const times = day(city('برلين'), '2026-06-16', { method: 'MuslimWorldLeague', hanafi: false });
    expect(at(times.fajr, 'Europe/Berlin')).toBe('03:41');
    expect(at(times.isha, 'Europe/Berlin')).toBe('22:33');
  });
  it('gives Isha two hours after Maghrib in Ramadan with Umm al-Qura', () => {
    const settings: PrayerSettings = { method: 'UmmAlQura', hanafi: false };
    const ramadan = day(city('مكة المكرمة'), '2026-03-01', settings);
    const after = day(city('مكة المكرمة'), '2026-04-01', settings);
    expect(Math.round((ramadan.isha.getTime() - ramadan.maghrib.getTime()) / 60000)).toBe(120);
    expect(Math.round((after.isha.getTime() - after.maghrib.getTime()) / 60000)).toBe(90);
  });
  it('puts the Hanafi Asr later', () => {
    const shafi = day(city('كراتشي'), '2026-01-11');
    const hanafi = day(city('كراتشي'), '2026-01-11', { method: 'Egyptian', hanafi: true });
    expect(hanafi.asr.getTime()).toBeGreaterThan(shafi.asr.getTime() + 30 * 60000);
  });
  it('gives every listed city five times in order on every day of a year', () => {
    for (const place of CITIES) {
      for (let d = 0; d < 365; d += 7) {
        const times = prayerDay(lib, place, new Date(2026, 0, 1 + d, 12), DEFAULT_PRAYER_SETTINGS);
        const order = [times.fajr, times.sunrise, times.dhuhr, times.asr, times.maghrib, times.isha].map(time => time.getTime());
        order.forEach(time => expect(Number.isFinite(time)).toBe(true));
        order.slice(1).forEach((time, i) => expect(time).toBeGreaterThan(order[i]));
      }
    }
  });
});

describe('helpers', () => {
  it('finds the next prayer', () => {
    const times = day(city('القاهرة'), '2026-11-13');
    expect(nextPrayer(times, new Date(times.asr.getTime() + 60000))).toBe('maghrib');
    expect(nextPrayer(times, new Date(times.isha.getTime() + 60000))).toBeNull();
  });
  it('writes a twelve-hour clock in Arabic digits', () => {
    expect(clock(new Date(2026, 0, 1, 17, 5))).toBe('٥:٠٥');
    expect(clock(new Date(2026, 0, 1, 0, 30), true)).toBe('١٢:٣٠ ص');
    expect(clock(new Date(2026, 0, 1, 12, 0), true)).toBe('١٢:٠٠ م');
  });
  it('points the qibla from Cairo and Berlin', () => {
    expect(qiblaBearing(lib, city('القاهرة'))).toBeCloseTo(136.14, 1);
    expect(qiblaBearing(lib, city('برلين'))).toBeCloseTo(136.68, 1);
  });
  it('turns the short way', () => {
    expect(turnTo(350, 10)).toBe(20);
    expect(turnTo(10, 350)).toBe(-20);
    expect(turnTo(136, 136)).toBe(0);
  });
  it('checks stored places', () => {
    expect(isPlace({ name: 'x', lat: 30, lng: 31 })).toBe(true);
    expect(isPlace({ name: 'x', lat: 91, lng: 31 })).toBe(false);
    expect(isPlace(null)).toBe(false);
  });
  it('lists unique city names', () => {
    expect(new Set(CITIES.map(place => place.name)).size).toBe(CITIES.length);
  });
});

describe('Hijri calendar', () => {
  it('knows Ramadan', () => {
    expect(inRamadan(new Date(2026, 2, 1, 12))).toBe(true);
    expect(inRamadan(new Date(2026, 10, 13, 12))).toBe(false);
  });
  it('lays out Jumada al-Akhirah 1448', () => {
    const month = hijriMonth(new Date(2026, 10, 13, 9))!;
    expect(month.title).toBe('جمادى الآخرة ١٤٤٨ هـ');
    expect(month.days).toHaveLength(29);
    expect(month.days[0].gregorian.getDate()).toBe(11); // Wednesday 11 November
    expect(month.lead).toBe(4); // Saturday, Sunday, Monday, Tuesday empty
    expect(month.days.find(d => d.today)?.day).toBe(3);
    expect(month.gregorian).toBe('نوفمبر – ديسمبر ٢٠٢٦');
  });
  it('steps to the next and previous months', () => {
    const today = new Date(2026, 10, 13, 9);
    expect(hijriMonth(today, 1)!.title).toBe('رجب ١٤٤٨ هـ');
    expect(hijriMonth(today, 1)!.days[0].gregorian.getDate()).toBe(10); // 10 December
    expect(hijriMonth(today, -1)!.title).toBe('جمادى الأولى ١٤٤٨ هـ');
    expect(hijriMonth(today, -1)!.days.every(d => !d.today)).toBe(true);
    expect(hijriMonth(today, 12)!.title).toBe('جمادى الآخرة ١٤٤٩ هـ');
  });
});

describe('searchPlaces', () => {
  it('finds cities without the article or hamza', () => {
    expect(searchPlaces('اسكندرية').map(p => p.name)).toEqual(['الإسكندرية']);
    expect(searchPlaces('مكة').map(p => p.name)).toEqual(['مكة المكرمة']);
    expect(searchPlaces('').length).toBe(CITIES.length);
  });
});
