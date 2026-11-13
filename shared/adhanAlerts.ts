/**
 * Adhan alerts: which prayer times to set a phone notification for. Worked out here, scheduled by the app.
 * Notifications are local (no server): the phone keeps a list of upcoming ones and rings them itself.
 */
import { FIVE, MY_LOCATION, PRAYER_NAMES, type Place, type PrayerDay, type PrayerKey } from './prayer';

export type Prayer = Exclude<PrayerKey, 'sunrise'>;
export type AdhanAlerts = Record<Prayer, boolean>;
export const NO_ALERTS: AdhanAlerts = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
export const isAdhanAlerts = (value: unknown): value is AdhanAlerts =>
  !!value && typeof value === 'object' && FIVE.every(key => typeof (value as AdhanAlerts)[key] === 'boolean');
export const anyAlert = (alerts: AdhanAlerts) => FIVE.some(key => alerts[key]);

/** iOS keeps at most 64 waiting notifications per app; stay under it. The app tops the list up each time it opens. */
export const MAX_ALERTS = 60;
/** Never plan further than this, so one prayer on alone doesn't reach months ahead (settings or the place may change). */
export const MAX_DAYS = 14;

export type Alert = { prayer: Prayer; at: Date; title: string; body: string };

/** The upcoming alerts from `now`: each switched-on prayer on each day, soonest first, skipping days with no time (near the poles). */
export function planAlerts(alerts: AdhanAlerts, place: Place, now: Date, timesOn: (day: Date) => PrayerDay): Alert[] {
  const on = FIVE.filter(key => alerts[key]);
  if (!on.length) return [];
  const plan: Alert[] = [];
  for (let i = 0; i < MAX_DAYS && plan.length < MAX_ALERTS; i++) {
    // Noon of each local day, so a clock change at night can't move it to the wrong day.
    const day = timesOn(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 12));
    for (const prayer of on) {
      const at = day[prayer];
      if (Number.isNaN(at.getTime()) || at.getTime() <= now.getTime()) continue;
      plan.push({ prayer, at, ...alertText(prayer, place) });
      if (plan.length >= MAX_ALERTS) break;
    }
  }
  return plan;
}

/** «الفجر» over «حان وقت أذان الفجر في القاهرة»; the phone's own place reads «حان وقت أذان الفجر». */
export function alertText(prayer: Prayer, place: Place) {
  const name = PRAYER_NAMES[prayer];
  const where = place.name && place.name !== MY_LOCATION ? ` في ${place.name}` : '';
  return { title: name, body: `حان وقت أذان ${name}${where}` };
}

/** One string for what the plan depends on, so the app reschedules only when one of these, or the day, changes. */
export const planKey = (alerts: AdhanAlerts, place: Place | null, settings: unknown, now: Date) =>
  JSON.stringify([alerts, place, settings, now.toDateString()]);
