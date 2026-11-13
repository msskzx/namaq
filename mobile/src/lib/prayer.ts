import { useEffect, useState } from 'react';
import * as adhan from 'adhan';
import * as Location from 'expo-location';
import { MY_LOCATION, prayerDay, qiblaBearing, type Adhan, type Place, type PrayerDay, type PrayerSettings } from '@shared/prayer';

const lib = adhan as unknown as Adhan;

export const timesFor = (place: Place, date: Date, settings: PrayerSettings): PrayerDay => prayerDay(lib, place, date, settings);
export const qiblaFor = (place: Place) => qiblaBearing(lib, place);

/** The phone's place, asked for only when the person taps «موقعي الحالي». null when refused or unavailable. */
export async function locate(): Promise<Place | null> {
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return null;
    const position = await Location.getLastKnownPositionAsync({ maxAge: 6 * 60 * 60 * 1000 })
      ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    if (!position) return null;
    // Two decimals (about a kilometre) is plenty for prayer times and the qibla, and keeps less of the person's place.
    const round = (value: number) => Math.round(value * 100) / 100;
    return { name: MY_LOCATION, lat: round(position.coords.latitude), lng: round(position.coords.longitude) };
  } catch {
    return null;
  }
}

/** The time now, ticking each minute while the screen is open, so the shaded next prayer and the day move on. */
export function useMinute() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(tick);
  }, []);
  return now;
}

/**
 * Where the phone points, from true north (the phone works out magnetic declination from its place).
 * 'none' where there is no compass (the web build, some tablets); null while waiting for the first reading.
 */
const NO_COMPASS_MS = 4000;

export function useHeading(on: boolean): number | null | 'none' | 'denied' {
  const [heading, setHeading] = useState<number | null | 'none' | 'denied'>(null);
  useEffect(() => {
    if (!on) return;
    let sub: Location.LocationSubscription | undefined;
    let gone = false;
    let heard = false;
    // A browser or a phone without a compass may never answer: after a few seconds, say so.
    let quiet: ReturnType<typeof setTimeout> | undefined;
    // The phone's compass comes through the location module, which needs the location permission even for a picked city.
    Location.requestForegroundPermissionsAsync().then(({ granted }) => {
      if (gone) return;
      if (!granted) { setHeading('denied'); return; }
      quiet = setTimeout(() => { if (!heard) setHeading('none'); }, NO_COMPASS_MS);
      return Location.watchHeadingAsync(reading => {
        const value = reading.trueHeading >= 0 ? reading.trueHeading : reading.magHeading;
        if (value < 0) return;
        heard = true;
        setHeading(value);
      }).then(watch => { if (gone) watch.remove(); else sub = watch; });
    }).catch(() => { if (!gone) setHeading('none'); });
    return () => { gone = true; clearTimeout(quiet); sub?.remove(); };
  }, [on]);
  return heading;
}
