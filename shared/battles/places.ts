// The places on the maps, built from their records in data/catalog/places (owner, 2026-11-23: every place on the map is
// correct and carries its reference) by npm run battles:app. A fix goes into the record, never into places.json.
import type { AppCite } from './battle';
import type { LonLat } from './map';
import placesJson from '../data/places.json';

export type Place = { name: string; at: LonLat; refs: AppCite[] };

export const BILADI = 'معجم المعالم الجغرافية في السيرة النبوية';
export const YAQUT = 'معجم البلدان';
export const SHURRAB = 'المعالم الأثيرة في السنة والسيرة';
export const LUGHA = 'مجلة لغة العرب';
export { GEONAMES } from './geonames';

/** Every place, by its record's slug. */
export const PLACES = placesJson as unknown as Record<string, Place>;

/** Well-known cities a battle's map shows beside it when they are near, so a reader can tell where it was. */
export const LANDMARKS = ['madinah', 'makkah', 'damascus', 'jerusalem', 'ctesiphon'] as const;

/** Who a place's quote is from, as a reader new to the books follows it: «قال البلادي:», or the journal it is in. */
export function placeSayer(cite: string): string | undefined {
  if (cite.startsWith(BILADI)) return 'قال البلادي:';
  if (cite.startsWith(YAQUT)) return 'قال ياقوت الحموي:';
  if (cite.startsWith(SHURRAB)) return 'قال محمد شراب:';
  if (cite.startsWith(LUGHA)) return 'في مجلة لغة العرب:';
  return undefined;
}
