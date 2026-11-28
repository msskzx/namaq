import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as adhan from 'adhan';
import * as Location from 'expo-location';
import { MY_LOCATION, prayerDay, qiblaBearing, type Adhan, type Place, type PrayerDay, type PrayerSettings } from '@shared/prayer';
import { reportError } from '@shared/errors';

const lib = adhan as unknown as Adhan;

export const timesFor = (place: Place, date: Date, settings: PrayerSettings): PrayerDay => prayerDay(lib, place, date, settings);
export const qiblaFor = (place: Place) => qiblaBearing(lib, place);

export async function locate(): Promise<Place | null> {
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return null;
    const position = await Location.getLastKnownPositionAsync({ maxAge: 6 * 60 * 60 * 1000 })
      ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    if (!position) return null;
    const round = (value: number) => Math.round(value * 100) / 100;
    return { name: MY_LOCATION, lat: round(position.coords.latitude), lng: round(position.coords.longitude) };
  } catch (error) {
    reportError('prayer: read location', error);
    return null;
  }
}

export function useMinute() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(tick);
  }, []);
  return now;
}

const NO_COMPASS_MS = 4000;

export function useHeading(on: boolean): number | null | 'none' | 'denied' {
  const [heading, setHeading] = useState<number | null | 'none' | 'denied'>(null);
  const [wake, setWake] = useState(0);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => { if (state === 'active') setWake(count => count + 1); });
    return () => listener.remove();
  }, []);
  useEffect(() => {
    if (!on) return;
    setHeading(null);
    let sub: Location.LocationSubscription | undefined;
    let gone = false;
    let heard = false;
    let quiet: ReturnType<typeof setTimeout> | undefined;
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
  }, [on, wake]);
  return heading;
}
