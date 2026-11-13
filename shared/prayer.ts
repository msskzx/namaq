/**
 * Prayer times and the qibla, worked out on the device with the adhan library (adhan-js).
 * Code in shared/ imports no packages, so each side passes its own `adhan` module in.
 * The checks behind the choices below are in docs/prayer-times.md.
 */

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
/** The five prayers; sunrise is shown only on the prayer page, faintly. */
export const FIVE: Exclude<PrayerKey, 'sunrise'>[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
export const ALL: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
export const PRAYER_NAMES: Record<PrayerKey, string> = {
  fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء',
};

export const METHODS = [
  { id: 'Egyptian', label: 'الهيئة المصرية العامة للمساحة' },
  { id: 'UmmAlQura', label: 'أم القرى، مكة المكرمة' },
  { id: 'MuslimWorldLeague', label: 'رابطة العالم الإسلامي' },
  { id: 'Karachi', label: 'جامعة العلوم الإسلامية، كراتشي' },
  { id: 'NorthAmerica', label: 'الجمعية الإسلامية لأمريكا الشمالية' },
  { id: 'Dubai', label: 'دبي' },
  { id: 'Kuwait', label: 'الكويت' },
  { id: 'Qatar', label: 'قطر' },
  { id: 'Singapore', label: 'سنغافورة' },
  { id: 'Turkey', label: 'رئاسة الشؤون الدينية، تركيا' },
  { id: 'MoonsightingCommittee', label: 'لجنة رؤية الهلال' },
] as const;
export type MethodId = (typeof METHODS)[number]['id'];
export const isMethod = (value: unknown): value is MethodId => METHODS.some(method => method.id === value);

export type PrayerSettings = { method: MethodId; hanafi: boolean };
export const DEFAULT_PRAYER_SETTINGS: PrayerSettings = { method: 'Egyptian', hanafi: false };
export const isPrayerSettings = (value: unknown): value is PrayerSettings =>
  !!value && typeof value === 'object' && isMethod((value as PrayerSettings).method) && typeof (value as PrayerSettings).hanafi === 'boolean';

/** Where the times are for: the phone's location («موقعي») or a city picked from the list. */
export type Place = { name: string; lat: number; lng: number };
export const isPlace = (value: unknown): value is Place =>
  !!value && typeof value === 'object' && typeof (value as Place).name === 'string'
  && Number.isFinite((value as Place).lat) && Number.isFinite((value as Place).lng)
  && Math.abs((value as Place).lat) <= 90 && Math.abs((value as Place).lng) <= 180;
export const MY_LOCATION = 'موقعي';

/** The parts of adhan used here, so shared/ needs no package. */
type Params = {
  madhab: string;
  highLatitudeRule: string;
  methodAdjustments: Record<PrayerKey, number>;
  adjustments: Record<PrayerKey, number>;
};
export type Adhan = {
  Coordinates: new (lat: number, lng: number) => object;
  CalculationMethod: Record<MethodId, () => Params>;
  Madhab: { Shafi: string; Hanafi: string };
  HighLatitudeRule: { recommended: (coordinates: never) => string };
  PrayerTimes: new (coordinates: never, date: Date, params: never) => Record<PrayerKey, Date>;
  Qibla: (coordinates: never) => number;
};

export type PrayerDay = Record<PrayerKey, Date>;

/** Is this day in Ramadan in the Umm al-Qura calendar? null when the platform has no Hijri calendar. */
export function inRamadan(date: Date): boolean | null {
  try {
    const format = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'numeric' });
    if (!format.resolvedOptions().calendar.startsWith('islamic')) return null;
    return Number(format.format(date)) === 9;
  } catch {
    return null;
  }
}

/** The six times of the local day that `date` falls on. */
export function prayerDay(adhan: Adhan, place: Place, date: Date, settings: PrayerSettings): PrayerDay {
  const coordinates = new adhan.Coordinates(place.lat, place.lng) as never;
  const params = adhan.CalculationMethod[settings.method]();
  params.madhab = settings.hanafi ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi;
  // Above 48° the default (middle of the night) puts Fajr and Isha both near 1 AM in summer; one seventh of the night is what adhan recommends.
  params.highLatitudeRule = adhan.HighLatitudeRule.recommended(coordinates);
  // adhan adds a minute to Dhuhr for the Egyptian method; the Egyptian Survey Authority's own tables don't.
  if (settings.method === 'Egyptian') params.methodAdjustments = { ...params.methodAdjustments, dhuhr: 0 };
  // Umm al-Qura: Isha is two hours after Maghrib in Ramadan instead of an hour and a half.
  if (settings.method === 'UmmAlQura' && inRamadan(date)) params.adjustments = { ...params.adjustments, isha: 30 };
  // adhan reads the date's local year, month and day.
  const times = new adhan.PrayerTimes(coordinates, date, params as never);
  return Object.fromEntries(ALL.map(key => [key, times[key]])) as PrayerDay;
}

/** The next of the five prayers today, or null after Isha (the row then shades nothing). */
export function nextPrayer(day: PrayerDay, now: Date): Exclude<PrayerKey, 'sunrise'> | null {
  return FIVE.find(key => day[key].getTime() > now.getTime()) ?? null; // an invalid time compares false, so it is never shaded
}

/** The qibla's bearing from true north, in degrees clockwise. */
export const qiblaBearing = (adhan: Adhan, place: Place) => adhan.Qibla(new adhan.Coordinates(place.lat, place.lng) as never);

const DIGITS = '٠١٢٣٤٥٦٧٨٩';
const arabic = (text: string) => text.replace(/\d/g, digit => DIGITS[Number(digit)]);

/** «٥:٠٠» in the phone's own clock, twelve-hour; with `half`, «٥:٠٠ م». Done by hand: Intl differs between phones. */
export function clock(date: Date, half = false) {
  // Near the poles some days have no sunrise or sunset, and adhan gives no time.
  if (Number.isNaN(date.getTime())) return '—';
  const hours = date.getHours();
  const text = `${hours % 12 || 12}:${String(date.getMinutes()).padStart(2, '0')}`;
  return arabic(text) + (half ? (hours < 12 ? ' ص' : ' م') : '');
}

/** Turn from where the phone points to the qibla, in -180…180 (positive = turn right). */
export function turnTo(heading: number, bearing: number) {
  return ((bearing - heading + 540) % 360) - 180;
}
/** What a screen reader says for the compass: the bearing, and which way to turn while the compass runs. */
export function qiblaLabel(bearing: number, turn: number | null) {
  const base = `القبلة ${arabic(String(Math.round(bearing)))}° من الشمال`;
  if (turn === null) return base;
  if (Math.abs(turn) <= FACING) return `${base}، أنت متجه إليها`;
  return `${base}، استدر ${turn > 0 ? 'يمينًا' : 'يسارًا'} ${arabic(String(Math.round(Math.abs(turn))))}°`;
}
/** Close enough to say «أنت متجه إلى القبلة». */
export const FACING = 5;

export type HijriDay = { day: number; gregorian: Date; today: boolean };
export type HijriMonth = { title: string; gregorian: string; lead: number; days: HijriDay[] };

const hijriParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(date);
  const part = (type: string) => Number(parts.find(item => item.type === type)?.value);
  return { day: part('day'), month: part('month'), year: part('year') };
};
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);

/**
 * The Hijri month `offset` months from today's, laid out from Saturday, with the Gregorian day under each.
 * null where the platform has no Hijri calendar.
 */
export function hijriMonth(today: Date, offset = 0): HijriMonth | null {
  try {
    if (!new Intl.DateTimeFormat('en-u-ca-islamic-umalqura').resolvedOptions().calendar.startsWith('islamic')) return null;
    const noon = addDays(today, 0);
    // Walk to the first day of this month, then a month at a time.
    let first = addDays(noon, 1 - hijriParts(noon).day);
    for (let step = 0; step < Math.abs(offset); step++) {
      // A Hijri month has 29 or 30 days, so 30 days on lands in the next month, and a day back in the one before.
      const inside = addDays(first, offset > 0 ? 30 : -1);
      first = addDays(inside, 1 - hijriParts(inside).day);
    }
    const { month } = hijriParts(first);
    const days: HijriDay[] = [];
    for (let date = first; hijriParts(date).month === month; date = addDays(date, 1)) {
      days.push({ day: hijriParts(date).day, gregorian: date, today: date.toDateString() === today.toDateString() });
    }
    const title = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab', { month: 'long', year: 'numeric' }).format(first);
    const gregorianName = (date: Date) => new Intl.DateTimeFormat('ar-EG-u-ca-gregory-nu-arab', { month: 'long' }).format(date);
    const last = days[days.length - 1].gregorian;
    const startName = gregorianName(first), endName = gregorianName(last);
    const gregorian = (startName === endName ? startName : `${startName} – ${endName}`) + ' ' + arabic(String(last.getFullYear()));
    return { title, gregorian, lead: (first.getDay() + 1) % 7, days };
  } catch {
    return null;
  }
}

/** Arabic digits for a day number. */
export const dayDigits = (day: number) => arabic(String(day));

/** Cities to pick when the phone's location is refused or not wanted. */
export const CITIES: Place[] = [
  { name: 'القاهرة', lat: 30.0444, lng: 31.2357 },
  { name: 'الجيزة', lat: 30.0131, lng: 31.2089 },
  { name: 'الإسكندرية', lat: 31.2001, lng: 29.9187 },
  { name: 'المنصورة', lat: 31.0409, lng: 31.3785 },
  { name: 'طنطا', lat: 30.7865, lng: 31.0004 },
  { name: 'الزقازيق', lat: 30.5877, lng: 31.502 },
  { name: 'بورسعيد', lat: 31.2653, lng: 32.3019 },
  { name: 'الإسماعيلية', lat: 30.5965, lng: 32.2715 },
  { name: 'السويس', lat: 29.9668, lng: 32.5498 },
  { name: 'الفيوم', lat: 29.3084, lng: 30.8428 },
  { name: 'بني سويف', lat: 29.0661, lng: 31.0994 },
  { name: 'المنيا', lat: 28.1099, lng: 30.7503 },
  { name: 'أسيوط', lat: 27.1809, lng: 31.1837 },
  { name: 'سوهاج', lat: 26.5591, lng: 31.6957 },
  { name: 'قنا', lat: 26.1551, lng: 32.716 },
  { name: 'الأقصر', lat: 25.6872, lng: 32.6396 },
  { name: 'أسوان', lat: 24.0889, lng: 32.8998 },
  { name: 'الغردقة', lat: 27.2579, lng: 33.8116 },
  { name: 'مرسى مطروح', lat: 31.3543, lng: 27.2373 },
  { name: 'شرم الشيخ', lat: 27.9158, lng: 34.33 },
  { name: 'مكة المكرمة', lat: 21.4225, lng: 39.8262 },
  { name: 'المدينة المنورة', lat: 24.4672, lng: 39.6111 },
  { name: 'الرياض', lat: 24.7136, lng: 46.6753 },
  { name: 'جدة', lat: 21.4858, lng: 39.1925 },
  { name: 'الدمام', lat: 26.4207, lng: 50.0888 },
  { name: 'الكويت', lat: 29.3759, lng: 47.9774 },
  { name: 'الدوحة', lat: 25.2854, lng: 51.531 },
  { name: 'المنامة', lat: 26.2285, lng: 50.586 },
  { name: 'دبي', lat: 25.2048, lng: 55.2708 },
  { name: 'أبوظبي', lat: 24.4539, lng: 54.3773 },
  { name: 'مسقط', lat: 23.588, lng: 58.3829 },
  { name: 'صنعاء', lat: 15.3694, lng: 44.191 },
  { name: 'عمّان', lat: 31.9454, lng: 35.9284 },
  { name: 'القدس', lat: 31.7683, lng: 35.2137 },
  { name: 'غزة', lat: 31.5017, lng: 34.4668 },
  { name: 'دمشق', lat: 33.5138, lng: 36.2765 },
  { name: 'بيروت', lat: 33.8938, lng: 35.5018 },
  { name: 'بغداد', lat: 33.3152, lng: 44.3661 },
  { name: 'الخرطوم', lat: 15.5007, lng: 32.5599 },
  { name: 'طرابلس', lat: 32.8872, lng: 13.1913 },
  { name: 'تونس', lat: 36.8065, lng: 10.1815 },
  { name: 'الجزائر', lat: 36.7538, lng: 3.0588 },
  { name: 'الرباط', lat: 34.0209, lng: -6.8416 },
  { name: 'الدار البيضاء', lat: 33.5731, lng: -7.5898 },
  { name: 'نواكشوط', lat: 18.0735, lng: -15.9582 },
  { name: 'مقديشو', lat: 2.0469, lng: 45.3182 },
  { name: 'إسطنبول', lat: 41.0082, lng: 28.9784 },
  { name: 'أنقرة', lat: 39.9334, lng: 32.8597 },
  { name: 'طهران', lat: 35.6892, lng: 51.389 },
  { name: 'كراتشي', lat: 24.8607, lng: 67.0011 },
  { name: 'لاهور', lat: 31.5204, lng: 74.3587 },
  { name: 'دكا', lat: 23.8103, lng: 90.4125 },
  { name: 'دلهي', lat: 28.6139, lng: 77.209 },
  { name: 'كوالالمبور', lat: 3.139, lng: 101.6869 },
  { name: 'جاكرتا', lat: -6.2088, lng: 106.8456 },
  { name: 'سنغافورة', lat: 1.3521, lng: 103.8198 },
  { name: 'لندن', lat: 51.5072, lng: -0.1276 },
  { name: 'باريس', lat: 48.8566, lng: 2.3522 },
  { name: 'برلين', lat: 52.52, lng: 13.405 },
  { name: 'ميونخ', lat: 48.1351, lng: 11.582 },
  { name: 'فرانكفورت', lat: 50.1109, lng: 8.6821 },
  { name: 'هامبورغ', lat: 53.5511, lng: 9.9937 },
  { name: 'فيينا', lat: 48.2082, lng: 16.3738 },
  { name: 'أمستردام', lat: 52.3676, lng: 4.9041 },
  { name: 'بروكسل', lat: 50.8503, lng: 4.3517 },
  { name: 'مدريد', lat: 40.4168, lng: -3.7038 },
  { name: 'روما', lat: 41.9028, lng: 12.4964 },
  { name: 'ستوكهولم', lat: 59.3293, lng: 18.0686 },
  { name: 'موسكو', lat: 55.7558, lng: 37.6173 },
  { name: 'نيويورك', lat: 40.7128, lng: -74.006 },
  { name: 'شيكاغو', lat: 41.8781, lng: -87.6298 },
  { name: 'هيوستن', lat: 29.7604, lng: -95.3698 },
  { name: 'لوس أنجلوس', lat: 34.0522, lng: -118.2437 },
  { name: 'تورونتو', lat: 43.6532, lng: -79.3832 },
  { name: 'سيدني', lat: -33.8688, lng: 151.2093 },
];

/** Arabic letters folded so «اسكندرية» finds «الإسكندرية». */
const fold = (text: string) => text.replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/^ال/, '').trim();
export function searchPlaces(query: string, places: Place[] = CITIES) {
  const needle = fold(query);
  return needle ? places.filter(place => fold(place.name).includes(needle) || place.name.includes(query.trim())) : places;
}
