/**
 * Adhan alerts: which prayer times to set a phone notification for. Worked out here, scheduled by the app.
 * Notifications are local (no server): the phone keeps a list of upcoming ones and rings them itself.
 */
import { ALL, FIVE, MY_LOCATION, PRAYER_NAMES, type Place, type PrayerDay, type PrayerKey } from './prayer';

/** A time with a bell: the five prayers, and the sunrise (owner, 2026-11-23: a bell on every row, the end of fajr's time). */
export type Prayer = PrayerKey;
/** `sunrise` came later, so a list saved before it has none: off. */
export type AdhanAlerts = Record<Exclude<PrayerKey, 'sunrise'>, boolean> & { sunrise?: boolean };
export const NO_ALERTS: AdhanAlerts = { fajr: false, sunrise: false, dhuhr: false, asr: false, maghrib: false, isha: false };
export const isAdhanAlerts = (value: unknown): value is AdhanAlerts =>
  !!value && typeof value === 'object' && FIVE.every(key => typeof (value as AdhanAlerts)[key] === 'boolean')
  && ['boolean', 'undefined'].includes(typeof (value as AdhanAlerts).sunrise);
export const anyAlert = (alerts: AdhanAlerts) => ALL.some(key => alerts[key]);

/** iOS keeps at most 64 waiting notifications per app; stay under it. The app tops the list up each time it opens. */
export const MAX_ALERTS = 60;
/** Never plan further than this, so one prayer on alone doesn't reach months ahead (settings or the place may change). */
export const MAX_DAYS = 14;

export type Alert = { prayer: Prayer; at: Date; title: string; body: string };

/** The adhkar reminders (owner, 2026-11-17): the morning adhkar after fajr, the evening adhkar after asr. Off until switched on. */
export type AdhkarTime = 'morning' | 'evening';
export type AdhkarAlerts = Record<AdhkarTime, boolean>;
export const NO_ADHKAR_ALERTS: AdhkarAlerts = { morning: false, evening: false };
export const isAdhkarAlerts = (value: unknown): value is AdhkarAlerts =>
  !!value && typeof value === 'object' && typeof (value as AdhkarAlerts).morning === 'boolean' && typeof (value as AdhkarAlerts).evening === 'boolean';
export type AdhkarAlert = { adhkar: AdhkarTime; at: Date; title: string; body: string };

/** Each reminder's prayer and the time its adhkar end by. */
const ADHKAR_WINDOW = { morning: ['fajr', 'sunrise'], evening: ['asr', 'maghrib'] } as const;
/** Minutes after the adhan, so the reminder comes after the prayer rather than over the adhan alert. */
export const ADHKAR_AFTER = 20;
const ADHKAR_TEXT = { morning: 'أذكار الصباح', evening: 'أذكار المساء' } as const;

/** When a day's reminder rings: twenty minutes after fajr or asr, or halfway to sunrise or maghrib when they come sooner. */
export function adhkarAt(day: PrayerDay, time: AdhkarTime): Date {
  const [start, end] = ADHKAR_WINDOW[time];
  const from = day[start].getTime();
  const until = day[end].getTime();
  const after = from + ADHKAR_AFTER * 60_000;
  return new Date(Number.isNaN(until) || after < until ? after : (from + until) / 2);
}

/**
 * Prayer alerts and adhkar reminders from `now`, soonest first, sharing one budget: MAX_ALERTS in all, MAX_DAYS ahead.
 * Each kind keeps its own list, so the app marks them apart and one switch never cancels the other's.
 */
export function planAll(alerts: AdhanAlerts, adhkar: AdhkarAlerts, place: Place, now: Date, timesOn: (day: Date) => PrayerDay): { prayers: Alert[]; adhkar: AdhkarAlert[] } {
  const prayers: Alert[] = [];
  const reminders: AdhkarAlert[] = [];
  const on = ALL.filter(key => alerts[key]);
  const times = (['morning', 'evening'] as const).filter(time => adhkar[time]);
  if (!on.length && !times.length) return { prayers, adhkar: reminders };
  const upcoming = (at: Date) => !Number.isNaN(at.getTime()) && at.getTime() > now.getTime();
  for (let i = 0; i < MAX_DAYS && prayers.length + reminders.length < MAX_ALERTS; i++) {
    // Noon of each local day, so a clock change at night can't move it to the wrong day.
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

/**
 * The waiting notifications the planner owns, cancelled before each new plan: an adhan alert carries `prayer`, an adhkar
 * reminder `adhkar`. Both are planned together, so each new plan replaces both; any other notification stays.
 */
export const plannedHere = (data: Record<string, unknown> | undefined) =>
  !!data && (typeof data.prayer === 'string' || typeof data.adhkar === 'string');

/** The reminder a tapped notification was for, or null for an adhan alert or anything else. */
export const adhkarOf = (data: Record<string, unknown> | undefined): AdhkarTime | null =>
  data?.adhkar === 'morning' || data?.adhkar === 'evening' ? data.adhkar : null;

/** The upcoming adhan alerts alone, when no adhkar reminder is on. */
export const planAlerts = (alerts: AdhanAlerts, place: Place, now: Date, timesOn: (day: Date) => PrayerDay): Alert[] =>
  planAll(alerts, NO_ADHKAR_ALERTS, place, now, timesOn).prayers;

/** «الفجر» over «حان وقت أذان الفجر في القاهرة»; the phone's own place reads «حان وقت أذان الفجر». The sunrise has no adhan: «حان وقت الشروق». */
export function alertText(prayer: Prayer, place: Place) {
  const name = PRAYER_NAMES[prayer];
  const where = place.name && place.name !== MY_LOCATION ? ` في ${place.name}` : '';
  return { title: name, body: `حان وقت ${prayer === 'sunrise' ? '' : 'أذان '}${name}${where}` };
}

/** One string for what the plan depends on, so the app reschedules only when one of these, or the day, changes. */
export const planKey = (alerts: AdhanAlerts, adhkar: AdhkarAlerts, place: Place | null, settings: unknown, now: Date) =>
  JSON.stringify([alerts, adhkar, place, settings, now.toDateString()]);
