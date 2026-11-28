import { ALL, FIVE, MY_LOCATION, PRAYER_NAMES, type Place, type PrayerDay, type PrayerKey } from './prayer';

export type Prayer = PrayerKey;
export type AdhanAlerts = Record<Exclude<PrayerKey, 'sunrise'>, boolean> & { sunrise?: boolean };
export const NO_ALERTS: AdhanAlerts = { fajr: false, sunrise: false, dhuhr: false, asr: false, maghrib: false, isha: false };
export const isAdhanAlerts = (value: unknown): value is AdhanAlerts =>
  !!value && typeof value === 'object' && FIVE.every(key => typeof (value as AdhanAlerts)[key] === 'boolean')
  && ['boolean', 'undefined'].includes(typeof (value as AdhanAlerts).sunrise);
export const anyAlert = (alerts: AdhanAlerts) => ALL.some(key => alerts[key]);

export const MAX_ALERTS = 60;
export const MAX_DAYS = 14;

export type Alert = { prayer: Prayer; at: Date; title: string; body: string };

export type AdhkarTime = 'morning' | 'evening';
export type AdhkarAlerts = Record<AdhkarTime, boolean>;
export const NO_ADHKAR_ALERTS: AdhkarAlerts = { morning: false, evening: false };
export const isAdhkarAlerts = (value: unknown): value is AdhkarAlerts =>
  !!value && typeof value === 'object' && typeof (value as AdhkarAlerts).morning === 'boolean' && typeof (value as AdhkarAlerts).evening === 'boolean';
export type AdhkarAlert = { adhkar: AdhkarTime; at: Date; title: string; body: string };

const ADHKAR_WINDOW = { morning: ['fajr', 'sunrise'], evening: ['asr', 'maghrib'] } as const;
export const ADHKAR_AFTER = 20;
const ADHKAR_TEXT = { morning: 'أذكار الصباح', evening: 'أذكار المساء' } as const;

export function adhkarAt(day: PrayerDay, time: AdhkarTime): Date {
  const [start, end] = ADHKAR_WINDOW[time];
  const from = day[start].getTime();
  const until = day[end].getTime();
  const after = from + ADHKAR_AFTER * 60_000;
  return new Date(Number.isNaN(until) || after < until ? after : (from + until) / 2);
}

export function planAll(alerts: AdhanAlerts, adhkar: AdhkarAlerts, place: Place, now: Date, timesOn: (day: Date) => PrayerDay): { prayers: Alert[]; adhkar: AdhkarAlert[] } {
  const prayers: Alert[] = [];
  const reminders: AdhkarAlert[] = [];
  const on = ALL.filter(key => alerts[key]);
  const times = (['morning', 'evening'] as const).filter(time => adhkar[time]);
  if (!on.length && !times.length) return { prayers, adhkar: reminders };
  const upcoming = (at: Date) => !Number.isNaN(at.getTime()) && at.getTime() > now.getTime();
  for (let i = 0; i < MAX_DAYS && prayers.length + reminders.length < MAX_ALERTS; i++) {
    const day = timesOn(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 12));
    const today = [
      ...on.map(prayer => ({ at: day[prayer], add: () => prayers.push({ prayer, at: day[prayer], ...alertText(prayer, place) }) })),
      ...times.map(time => {
        const at = adhkarAt(day, time);
        return { at, add: () => reminders.push({ adhkar: time, at, title: ADHKAR_TEXT[time], body: `حان وقت ${ADHKAR_TEXT[time]}` }) };
      }),
    ].filter(item => upcoming(item.at)).sort((a, b) => a.at.getTime() - b.at.getTime());
    for (const item of today) {
      if (prayers.length + reminders.length >= MAX_ALERTS) break;
      item.add();
    }
  }
  return { prayers, adhkar: reminders };
}

export const plannedHere = (data: Record<string, unknown> | undefined) =>
  !!data && (typeof data.prayer === 'string' || typeof data.adhkar === 'string');

export const adhkarOf = (data: Record<string, unknown> | undefined): AdhkarTime | null =>
  data?.adhkar === 'morning' || data?.adhkar === 'evening' ? data.adhkar : null;

export const planAlerts = (alerts: AdhanAlerts, place: Place, now: Date, timesOn: (day: Date) => PrayerDay): Alert[] =>
  planAll(alerts, NO_ADHKAR_ALERTS, place, now, timesOn).prayers;

export function alertText(prayer: Prayer, place: Place) {
  const name = PRAYER_NAMES[prayer];
  const where = place.name && place.name !== MY_LOCATION ? ` في ${place.name}` : '';
  return { title: name, body: `حان وقت ${prayer === 'sunrise' ? '' : 'أذان '}${name}${where}` };
}

export const planKey = (alerts: AdhanAlerts, adhkar: AdhkarAlerts, place: Place | null, settings: unknown, now: Date) =>
  JSON.stringify([alerts, adhkar, place, settings, now.toDateString()]);
