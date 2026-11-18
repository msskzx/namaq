// Where each battle took place on today's map. The coordinates are ours, not a source's (owner, 2026-11-18: ours marked
// as ours): each is the place's usual identification today, near enough for a pin on a map of Arabia. A battle whose
// place we could not pin with confidence has none, and its page shows the source's place name only.
import type { LonLat } from './map';

export type Place = { name: string; at: LonLat };

export const PLACES: Record<string, Place> = {
  madinah: { name: 'المدينة', at: [39.611, 24.468] },
  makkah: { name: 'مكة', at: [39.826, 21.4225] },
  badr: { name: 'بدر', at: [38.79, 23.78] },
  uhud: { name: 'أحد', at: [39.615, 24.505] },
  khaybar: { name: 'خيبر', at: [39.29, 25.7] },
  hudaybiyyah: { name: 'الحديبية', at: [39.62, 21.44] },
  hunayn: { name: 'حنين', at: [40.05, 21.55] },
  taif: { name: 'الطائف', at: [40.42, 21.27] },
  tabuk: { name: 'تبوك', at: [36.57, 28.38] },
  mutah: { name: 'مؤتة', at: [35.7, 31.08] },
  nakhlah: { name: 'نخلة', at: [40.2, 21.6] },
  hamraAlAsad: { name: 'حمراء الأسد', at: [39.45, 24.3] },
  yarmuk: { name: 'اليرموك', at: [35.95, 32.75] },
  fihl: { name: 'فحل', at: [35.62, 32.45] },
  damascus: { name: 'دمشق', at: [36.29, 33.51] },
  jerusalem: { name: 'بيت المقدس', at: [35.23, 31.78] },
  alexandria: { name: 'الإسكندرية', at: [29.92, 31.2] },
  cyprus: { name: 'قبرص', at: [33.2, 35.0] },
  qadisiyyah: { name: 'القادسية', at: [44.48, 31.7] },
  ctesiphon: { name: 'المدائن', at: [44.58, 33.09] },
  nahavand: { name: 'نهاوند', at: [48.37, 34.19] },
  basra: { name: 'البصرة', at: [47.8, 30.5] },
  siffin: { name: 'صفين', at: [38.98, 35.95] },
  nahrawan: { name: 'النهروان', at: [44.8, 33.2] },
};

/** Each battle's place, by the battle's catalog slug. */
export const BATTLE_PLACE: Record<string, keyof typeof PLACES> = {
  badr: 'badr', 'badr-al-ula': 'badr', uhud: 'uhud', khandaq: 'madinah', 'banu-qurayzah': 'madinah',
  'ghazwah-bani-qaynuqa': 'madinah', 'ghazwah-hamra-al-asad': 'hamraAlAsad', khaybar: 'khaybar', hudaybiyyah: 'hudaybiyyah',
  'fath-makkah': 'makkah', hunayn: 'hunayn', taif: 'taif', tabuk: 'tabuk', mutah: 'mutah', 'sariyyah-nakhlah': 'nakhlah',
  yarmuk: 'yarmuk', fihl: 'fihl', 'fath-damascus': 'damascus', 'fath-jerusalem': 'jerusalem', 'fath-alexandria': 'alexandria',
  'fath-cyprus': 'cyprus', qadisiyyah: 'qadisiyyah', 'fath-ctesiphon': 'ctesiphon', nahavand: 'nahavand', jamal: 'basra',
  siffin: 'siffin', nahrawan: 'nahrawan',
};

/** Well-known cities a battle's map shows beside it when they are near, so a reader can tell where it was. */
export const LANDMARKS = ['madinah', 'makkah', 'damascus', 'jerusalem', 'ctesiphon', 'basra'] as const;
