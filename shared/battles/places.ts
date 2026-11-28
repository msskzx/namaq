import type { AppCite } from './battle';
import type { LonLat } from './map';
import placesJson from '../data/places.json';

export type Place = { name: string; at: LonLat; refs: AppCite[] };

export const BILADI = 'معجم المعالم الجغرافية في السيرة النبوية';
export const YAQUT = 'معجم البلدان';
export const SHURRAB = 'المعالم الأثيرة في السنة والسيرة';
export const LUGHA = 'مجلة لغة العرب';
export { GEONAMES } from './geonames';

export const PLACES = placesJson as unknown as Record<string, Place>;

export const LANDMARKS = ['madinah', 'makkah', 'damascus', 'jerusalem', 'ctesiphon'] as const;

export function placeSayer(cite: string): string | undefined {
  if (cite.startsWith(BILADI)) return 'قال البلادي:';
  if (cite.startsWith(YAQUT)) return 'قال ياقوت الحموي:';
  if (cite.startsWith(SHURRAB)) return 'قال محمد شراب:';
  if (cite.startsWith(LUGHA)) return 'في مجلة لغة العرب:';
  return undefined;
}
