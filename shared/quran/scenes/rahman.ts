import { mushafPlacesOf, type WordPlace, type WordsData } from '../words';
import { normalizeWord } from '../normalize';
import mutashabihFile from '../../data/quran/mutashabih.json';
import { dataOf } from '../../appData';

export const RAHMAN_KEY = 'rahman';

export const RAHMAN_LEMMA = 'رَّحۡمَٰن';

export function rahmanPlaces(data: WordsData): WordPlace[] {
  const id = data.lemmas.findIndex(([name]) => name === RAHMAN_LEMMA);
  if (id < 0) throw new Error(`no lemma ${RAHMAN_LEMMA} in words.json`);
  return mushafPlacesOf(data, id);
}

export const placeCount = (places: WordPlace[]) => places.reduce((sum, place) => sum + place.words.length, 0);

export const NO_BASMALA = 9;
export const BASMALA_AYAH = '27:30';
export const basmalasBySurah = (surahs = 114): number[] =>
  Array.from({ length: surahs }, (_, i) => (i + 1 === NO_BASMALA ? 0 : i + 1 === Number(BASMALA_AYAH.split(':')[0]) ? 2 : 1));

const COUNTED_TWICE = new Set(['1:1', BASMALA_AYAH]);
export type SurahBar = { basmala: number; name: number; both: number };
export function surahBars(places: WordPlace[], surahs = 114): SurahBar[] {
  const basmalas = basmalasBySurah(surahs);
  const bars = basmalas.map(count => ({ basmala: count, name: 0, both: 0 }));
  for (const place of places) {
    const bar = bars[Number(place.key.split(':')[0]) - 1];
    if (COUNTED_TWICE.has(place.key)) { bar.both += 1; bar.basmala -= 1; bar.name += place.words.length - 1; }
    else bar.name += place.words.length;
  }
  return bars;
}

export type SahihBookSlug = 'bukhari' | 'muslim';
export type HadithRef = { book: SahihBookSlug; n: number };

export type SceneHadith = HadithRef & { id: string; title: string; route?: string; from?: string; until?: string; cut?: boolean; part?: boolean; lead?: string; lit?: string; narrator?: string;
  also?: HadithRef[] };

const b = (n: number): HadithRef => ({ book: 'bukhari', n });
const m = (n: number): HadithRef => ({ book: 'muslim', n });

export const FATIHA_HADITH: SceneHadith = { id: 'fatiha', ...m(395), route: '٣٨', narrator: 'عَنْ أبي هريرة', title: 'أثنى علي عبدي', until: 'قَالَ سُفْيَانُ', lit: 'أثنى علي عبدي' };
export const FATIHA_PART: SceneHadith = { ...FATIHA_HADITH, id: 'fatiha-part', part: true, narrator: undefined, lead: 'في الحديث القدسي، عن أبي هريرة رضي الله عنه:', from: 'سَمِعْتُ رسول الله ﷺ يقول: ', until: ' وَإِذَا قال مالك' };

export const SCENE_HADITH: SceneHadith[] = [
  { id: 'madd', ...b(5046), narrator: 'عَنْ قَتَادَةَ', title: 'قراءة النبي ﷺ' },
  { id: 'habibatan', ...b(6406), narrator: 'عَنْ أَبِي هُرَيْرَةَ', title: 'حبيبتان إلى الرحمن', also: [b(6682), b(7563), m(2694)] },
  { id: 'sifah', ...b(7375), narrator: 'عَنْ عَائِشَةَ', title: 'لأنها صفة الرحمن', also: [m(813)] },
  { id: 'shijnah', ...b(5988), narrator: 'عَنْ أَبِي هُرَيْرَةَ', title: 'الرحم شجنة من الرحمن' },
  { id: 'rahim', ...b(4830), narrator: 'عَنْ أَبِي هُرَيْرَةَ', title: 'قامت الرحم' },
  { id: 'sadaqah', ...m(1014), narrator: 'سَمِعَ أَبَا هُرَيْرَةَ', title: 'الصدقة من طيب' },
  { id: 'muqsitun', ...m(1827), narrator: 'عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو', title: 'على منابر من نور', from: 'ﷺ (' },
  { id: 'qulub', ...m(2654), narrator: 'سَمِعَ عَبْدَ اللَّهِ بْنَ عَمْرِو', title: 'قلوب بني آدم' },
  { id: 'arsh', ...b(3803), narrator: 'عَنْ جَابِرٍ', title: 'اهتز عرش الرحمن', also: [m(2466), m(2467)] },
  { id: 'yajthu', ...b(3965), narrator: 'عَنْ عَلِيِّ بْنِ أَبِي طَالِبٍ', title: 'بين يدي الرحمن', also: [b(4744)] },
  { id: 'firdaws', ...b(2790), narrator: 'عَنْ أَبِي هُرَيْرَةَ', title: 'الفردوس', also: [b(7423)], cut: true },
  { id: 'baraka', ...b(6520), narrator: 'عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ', title: 'بارك الرحمن عليك', also: [m(2792)], cut: true },
  { id: 'umayyah', ...b(2301), narrator: 'عَبْدِ الرَّحْمَنِ بْنِ عَوْفٍ', title: 'لا أعرف الرحمن', cut: true },
  { id: 'hudaybiyah', ...b(2731), narrator: 'عَنِ الْمِسْوَرِ بْنِ مَخْرَمَةَ', title: 'الحديبية', cut: true },
  { id: 'ahd', ...b(4735), narrator: 'عَنْ خَبَّابٍ', title: 'أم اتخذ عند الرحمن عهدا', also: [b(2091), b(4733)], cut: true },
  { id: 'khalil', ...b(7510), narrator: 'مَعْبَدُ بْنُ هِلَالٍ', title: 'خليل الرحمن', also: [b(4476), b(7410), b(7440)], cut: true },
  { id: 'utaqa', ...b(7439), narrator: 'عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ', title: 'عتقاء الرحمن', cut: true },
];

export const MERCY_HADITH: SceneHadith = { id: 'mercy', ...b(6000), narrator: 'أَنَّ أَبَا هُرَيْرَةَ', title: 'مئة رحمة', also: [m(2752)] };

export const sceneHadithNumbers = (): HadithRef[] => {
  const all = [FATIHA_HADITH, ...SCENE_HADITH].flatMap(hadith => [{ book: hadith.book, n: hadith.n }, ...(hadith.also ?? [])]);
  return all.filter((ref, i) => all.findIndex(other => other.book === ref.book && other.n === ref.n) === i);
};

export type BuiltHadith = { book: SahihBookSlug; n: number; from: number; to: number; text: string; cutBefore: boolean; cutAfter: boolean;
  narrator?: string };

export const INTRO_AYAT = ['50:33', '19:96', '19:93'];
export const INTRO_HADITH = ['habibatan', 'shijnah', 'sifah'];
export const SURAH_AYAT = ['55:1', '55:2', '55:3', '55:4'];

export const SADI_OPENING = { key: '55:1', from: 'هذه السورة الكريمة الجليلة', to: 'أوصله الله إلى عباده' };
export function sadiOpening(text: string): string {
  const start = text.indexOf(SADI_OPENING.from);
  const end = text.indexOf(SADI_OPENING.to, start);
  if (start < 0 || end < 0) throw new Error('al-Sa\'di\'s words on the surah\'s opening are not in his passage');
  return text.slice(start, end + SADI_OPENING.to.length);
}

export const isName = (word: string, before = '') => {
  const plain = normalizeWord(word).replace(/[^ء-ي]/g, '');
  return /^(?:[وفب]?ال|[وف]?لل|[وف]?بال)رحمن$/.test(plain) && !/عبي?د$/.test(normalizeWord(before).replace(/[^ء-ي]/g, ''));
};

const plainWord = (word: string) => normalizeWord(word).replace(/[^ء-ي]/g, '');

export function nameRuns(text: string, lit?: string): { text: string; name: boolean; lit: boolean }[] {
  const words = text.split(' ');
  const want = lit ? lit.split(' ').map(plainWord) : [];
  const inLit = new Set<number>();
  for (let i = 0; want.length && i + want.length <= words.length; i++) {
    if (want.every((word, k) => plainWord(words[i + k]) === word)) for (let k = 0; k < want.length; k++) inLit.add(i + k);
  }
  return words.map((word, i) => ({ text: (i ? ' ' : '') + word, name: isName(word, words[i - 1]), lit: inLit.has(i) }));
}

export type RahmanBlock =
  | { kind: 'ayah'; key: string; basmala?: boolean;
    title?: boolean }
  | { kind: 'run'; keys: string[];
    bare?: boolean;
    breakAfter?: string }
  | { kind: 'hadith'; id: string }
  | { kind: 'sadi' }
  | { kind: 'cover' }
  | { kind: 'mercy' }
  | { kind: 'tikrar' }
  | { kind: 'kirmani'; key: string };

export type RahmanSection = { id: string; title: string; blocks: RahmanBlock[]; intro?: boolean };

const ayat = (keys: string[]): RahmanBlock[] => keys.map(key => ({ kind: 'ayah', key }));
const hadith = (ids: string[]): RahmanBlock[] => ids.map(id => ({ kind: 'hadith', id }));
const BASMALA: RahmanBlock = { kind: 'ayah', key: '1:1', basmala: true };

export function rahmanSections(placeKeys: string[]): RahmanSection[] {
  return [
    { id: 'name', title: '', blocks: [{ kind: 'ayah', key: '55:1', title: true }, { kind: 'cover' }], intro: true },
    { id: 'opening', title: 'البسملة والفاتحة', blocks: [{ kind: 'run', keys: ['1:1', '1:2', '1:3'], bare: true, breakAfter: '1:1' }, { kind: 'hadith', id: FATIHA_PART.id }], intro: true },
    { id: 'intro-ayat', title: 'من الآيات', blocks: [{ kind: 'run', keys: ['55:1', '55:2'] }, ...ayat(INTRO_AYAT)], intro: true },
    { id: 'intro-hadith', title: 'من الأحاديث', blocks: hadith(INTRO_HADITH.slice(0, 2)), intro: true },
    { id: 'intro-hadith-2', title: 'من الأحاديث', blocks: hadith(INTRO_HADITH.slice(2)), intro: true },
    { id: 'intro-mercy', title: MERCY_HADITH.title, blocks: [{ kind: 'mercy' }, ...hadith([MERCY_HADITH.id])], intro: true },
    { id: 'surah', title: 'سورة الرحمن', blocks: [BASMALA, ...ayat(SURAH_AYAT), { kind: 'sadi' }] },
    { id: 'tikrar', title: 'تكرار الآية في سورة الرحمن', blocks: [{ kind: 'ayah', key: TIKRAR_FIRST }, { kind: 'tikrar' }, { kind: 'kirmani', key: TIKRAR_FIRST }] },
    { id: 'fatiha', title: 'سورة الفاتحة', blocks: [{ kind: 'ayah', key: '1:3' }, { kind: 'kirmani', key: '1:3' }, { kind: 'hadith', id: FATIHA_HADITH.id }] },
    { id: 'ayat', title: 'الآيات', blocks: ayat(placeKeys) },
    ...SCENE_HADITH.map(each => ({ id: each.id, title: each.title, blocks: hadith([each.id]) })),
    { id: 'mercy', title: MERCY_HADITH.title, blocks: [{ kind: 'mercy' }, ...hadith([MERCY_HADITH.id])] },
  ];
}

export const SCENE_HADITH_BY_ID: Record<string, SceneHadith> = Object.fromEntries([FATIHA_HADITH, FATIHA_PART, ...SCENE_HADITH, MERCY_HADITH].map(each => [each.id, each]));

export function hadithNumbers(hadith: SceneHadith): { book: SahihBookSlug; numbers: number[] }[] {
  const refs = [{ book: hadith.book, n: hadith.n }, ...(hadith.also ?? [])];
  const books = [...new Set(refs.map(ref => ref.book))];
  return books.map(book => ({ book, numbers: refs.filter(ref => ref.book === book).map(ref => ref.n) }));
}

export function mostPlaces(places: WordPlace[]): { surah: number; count: number } {
  const counts = new Map<number, number>();
  for (const place of places) { const surah = Number(place.key.split(':')[0]); counts.set(surah, (counts.get(surah) ?? 0) + place.words.length); }
  const [surah, count] = [...counts].reduce((best, each) => (each[1] > best[1] ? each : best));
  return { surah, count };
}

export const MERCY_PARTS = 100;
export const MERCY_KEPT = 99;

type KirmaniCitation = { book: string; quote: string; locator: string; places: string[] };

export function kirmaniOn(key: string): KirmaniCitation {
  const groups = dataOf(mutashabihFile) as unknown as { citations: KirmaniCitation[] }[];
  const found = groups.flatMap(group => group.citations)
    .filter(citation => citation.book.includes('الكرماني') && citation.places.includes(key))
    .sort((x, y) => y.places.length - x.places.length)[0];
  if (!found) throw new Error(`no al-Kirmani citation on ${key}`);
  return found;
}
export const TIKRAR_FIRST = '55:13';

export const TIKRAR_RUNS = [
  { words: [16, 20], count: 8 },
  { words: [31, 34], count: 7 },
  { words: [62, 65], count: 8 },
  { words: [72, 75], count: 8 },
] as const;

export const tikrarWords = (run: (typeof TIKRAR_RUNS)[number]) => kirmaniOn(TIKRAR_FIRST).quote.split(' ').slice(...run.words).join(' ');
