import { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import * as adhan from 'adhan';
import * as Location from 'expo-location';
import { MY_LOCATION, prayerDay, qiblaBearing, type Adhan, type Place, type PrayerDay, type PrayerSettings } from '@shared/prayer';
import { reportError } from '@shared/errors';
import { useNow } from '@/lib/hooks/useNow';
import { useAdjustOn } from '@/lib/hooks/useAdjustOn';

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
  const now = useNow(30_000);
  return useMemo(() => new Date(now), [now]);
}

const NO_COMPASS_MS = 4000;

type Heading = number | null | 'none' | 'denied';

export function useHeading(on: boolean): Heading {
  const [read, setRead] = useState<{ run: number; heading: Heading }>({ run: 0, heading: null });
  const [run, setRun] = useState(0);
  const [wake, setWake] = useState(0);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => { if (state === 'active') setWake(count => count + 1); });
    return () => listener.remove();
  }, []);
  useAdjustOn([on, wake], () => { if (on) setRun(count => count + 1); });
  useEffect(() => {
    if (!on) return;
    const setHeading = (heading: Heading) => setRead({ run, heading });
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
  }, [on, run]);
  return read.run === run ? read.heading : null;
}
