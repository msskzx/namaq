import { mushafPlacesOf, type WordPlace, type WordsData } from '../words';
import { normalizeWord } from '../normalize';

/**
 * «الرحمن», the second scene of «مشاهد» (owner, 2026-11-24, thread "Design a still scene on «الرحمن»"): still pages, not a
 * video, each one ready to share as a 4:5 picture. Five pages of introduction come first, with no button on them so they
 * share clean; then every place the name is written: the basmalas and the 57 places in the Quran, surat al-Rahman and
 * al-Fatiha, every ayah, and every hadith of the Sahihayn whose words name «الرحمن»; the hadith of the hundred mercies
 * closes it. Every page holds the name; there are no drawings (owner: «امسح الرسم»). Sketches in
 * /mnt/project-files/mashahid/rahman/.
 */
export const RAHMAN_KEY = 'rahman';

/** The lemma «رَّحۡمَٰن» in the Quranic Arabic Corpus (shared/data/quran/words.json). */
export const RAHMAN_LEMMA = 'رَّحۡمَٰن';

/** Every place the name is written in the ayat, as the corpus counts it (al-Fatiha's basmala is its first ayah). */
export function rahmanPlaces(data: WordsData): WordPlace[] {
  const id = data.lemmas.findIndex(([name]) => name === RAHMAN_LEMMA);
  if (id < 0) throw new Error(`no lemma ${RAHMAN_LEMMA} in words.json`);
  return mushafPlacesOf(data, id);
}

/** How many times the name stands in the ayat (an ayah may hold it twice, al-Furqan 60). */
export const placeCount = (places: WordPlace[]) => places.reduce((sum, place) => sum + place.words.length, 0);

/** The surah with no basmala over it, and the ayah that holds a second one (Sulayman's letter). */
export const NO_BASMALA = 9;
export const BASMALA_AYAH = '27:30';
/** Each surah's basmala in mushaf order: al-Fatiha's is its first ayah, at-Tawba has none, an-Naml holds two. */
export const basmalasBySurah = (surahs = 114): number[] =>
  Array.from({ length: surahs }, (_, i) => (i + 1 === NO_BASMALA ? 0 : i + 1 === Number(BASMALA_AYAH.split(':')[0]) ? 2 : 1));

export type SahihBookSlug = 'bukhari' | 'muslim';
export type HadithRef = { book: SahihBookSlug; n: number };

/**
 * A hadith the scene shows. Its words are never copied here (owner, 2026-11-24: one hadith text): `scripts/quran/
 * buildRahmanScene.ts` reads them from data/hadith/sahih and writes shared/data/quran/rahmanHadith.json.
 * - `route`: the printed route whose words show (the first by default).
 * - `from`/`until`: the words start after the first `from` and stop before `until`, where the edition marks no matn.
 * - `cut`: too long for a page (the Hudaybiyyah runs to 39); a part around the name shows, and its page opens the whole.
 * - `part`: `from`/`until` cut inside its words, so they show with «…» on both sides.
 */
export type SceneHadith = HadithRef & { id: string; title: string; route?: string; from?: string; until?: string; cut?: boolean; part?: boolean;
  /** The other numbers that hold the same words, in the same book or the other. */
  also?: HadithRef[] };

const b = (n: number): HadithRef => ({ book: 'bukhari', n });
const m = (n: number): HadithRef => ({ book: 'muslim', n });

/** «قسمت الصلاة…» in Muslim (395): al-Fatiha's page shows its words whole, up to Sufyan's own note after them. */
export const FATIHA_HADITH: SceneHadith = { id: 'fatiha', ...m(395), route: '٣٨', title: 'أثنى علي عبدي', until: 'قَالَ سُفْيَانُ' };
/** The same, on the introduction: from Allah's words up to «أثنى علي عبدي» (owner, 2026-11-24: the part before it too). */
export const FATIHA_PART: SceneHadith = { ...FATIHA_HADITH, id: 'fatiha-part', part: true, from: 'سَمِعْتُ رسول الله ﷺ يقول: ', until: ' وَإِذَا قال مالك' };

/** The hadith pages, in the order they show. Every hadith of the Sahihayn whose words name «الرحمن» is here (rahmanHadith.test.ts). */
export const SCENE_HADITH: SceneHadith[] = [
  { id: 'madd', ...b(5046), title: 'قراءة النبي ﷺ' },
  { id: 'habibatan', ...b(6406), title: 'حبيبتان إلى الرحمن', also: [b(6682), b(7563), m(2694)] },
  { id: 'sifah', ...b(7375), title: 'لأنها صفة الرحمن', also: [m(813)] },
  { id: 'shijnah', ...b(5988), title: 'الرحم شجنة من الرحمن' },
  { id: 'rahim', ...b(4830), title: 'قامت الرحم' },
  { id: 'sadaqah', ...m(1014), title: 'الصدقة من طيب' },
  { id: 'muqsitun', ...m(1827), title: 'على منابر من نور', from: 'ﷺ (' },
  { id: 'qulub', ...m(2654), title: 'قلوب بني آدم' },
  { id: 'arsh', ...b(3803), title: 'اهتز عرش الرحمن', also: [m(2466), m(2467)] },
  { id: 'yajthu', ...b(3965), title: 'بين يدي الرحمن', also: [b(4744)] },
  { id: 'firdaws', ...b(2790), title: 'الفردوس', also: [b(7423)], cut: true },
  { id: 'baraka', ...b(6520), title: 'بارك الرحمن عليك', also: [m(2792)], cut: true },
  { id: 'umayyah', ...b(2301), title: 'لا أعرف الرحمن', cut: true },
  { id: 'hudaybiyah', ...b(2731), title: 'الحديبية', cut: true },
  { id: 'ahd', ...b(4735), title: 'أم اتخذ عند الرحمن عهدا', also: [b(2091), b(4733)], cut: true },
  { id: 'khalil', ...b(7510), title: 'خليل الرحمن', also: [b(4476), b(7410), b(7440)], cut: true },
  { id: 'utaqa', ...b(7439), title: 'عتقاء الرحمن', cut: true },
];

/** The closing page: the hundred mercies (al-Bukhari 6000; its like in Muslim 2752), asked for by name (owner, 2026-11-24). */
export const MERCY_HADITH: SceneHadith = { id: 'mercy', ...b(6000), title: 'مئة رحمة', also: [m(2752)] };

/** Every hadith number the scene names: the count on its first page. */
export const sceneHadithNumbers = (): HadithRef[] => {
  const all = [FATIHA_HADITH, ...SCENE_HADITH].flatMap(hadith => [{ book: hadith.book, n: hadith.n }, ...(hadith.also ?? [])]);
  return all.filter((ref, i) => all.findIndex(other => other.book === ref.book && other.n === ref.n) === i);
};

/** A hadith's words as built (shared/data/quran/rahmanHadith.json): where they are in the book, and whether they are a part. */
export type BuiltHadith = { book: SahihBookSlug; n: number; from: number; to: number; text: string; cutBefore: boolean; cutAfter: boolean };

/** The introduction's ayat (owner, 2026-11-24; al-Furqan 60 swapped for Qaf 33). */
export const INTRO_AYAT = ['19:96', '19:93', '20:108', '50:33', '67:19'];
/** The introduction's hadith, each whole. */
export const INTRO_HADITH = ['habibatan', 'shijnah', 'sifah'];
/** Surat al-Rahman's page: its basmala, then its first ayat. */
export const SURAH_AYAT = ['55:1', '55:2', '55:3', '55:4'];

/** Al-Sa'di's words on the surah's opening, where they start and end in his passage on 55:1. */
export const SADI_OPENING = { key: '55:1', from: 'هذه السورة الكريمة الجليلة', to: 'أوصله الله إلى عباده' };
export function sadiOpening(text: string): string {
  const start = text.indexOf(SADI_OPENING.from);
  const end = text.indexOf(SADI_OPENING.to, start);
  if (start < 0 || end < 0) throw new Error('al-Sa\'di\'s words on the surah\'s opening are not in his passage');
  return text.slice(start, end + SADI_OPENING.to.length);
}

/** A word of a hadith's text that is the name, not part of «عبد الرحمن» or «عبيد الرحمن»: the scene colours it. */
export const isName = (word: string, before = '') => {
  const plain = normalizeWord(word).replace(/[^ء-ي]/g, '');
  return /^(?:[وفب]?ال|[وف]?لل|[وف]?بال)رحمن$/.test(plain) && !/عبي?د$/.test(normalizeWord(before).replace(/[^ء-ي]/g, ''));
};

/** A text's words, each with whether it is the name. */
export function nameRuns(text: string): { text: string; name: boolean }[] {
  const words = text.split(' ');
  return words.map((word, i) => ({ text: (i ? ' ' : '') + word, name: isName(word, words[i - 1]) }));
}

/** What a page of the scene holds, block by block: each block is measured, and a section's blocks flow over its pages. */
export type RahmanBlock =
  | { kind: 'counts' }
  /** An ayah whole; `basmala` draws al-Fatiha's first ayah with no number, as the basmala over a surah. */
  | { kind: 'ayah'; key: string; basmala?: boolean;
    /** The first page's name: big, with no number. */
    title?: boolean }
  | { kind: 'hadith'; id: string }
  | { kind: 'sadi' }
  | { kind: 'map' };

/** A run of pages: its title over each of them, its blocks flowing from page to page. `intro`: no taps on its pages. */
export type RahmanSection = { id: string; title: string; blocks: RahmanBlock[]; intro?: boolean };

const ayat = (keys: string[]): RahmanBlock[] => keys.map(key => ({ kind: 'ayah', key }));
const hadith = (ids: string[]): RahmanBlock[] => ids.map(id => ({ kind: 'hadith', id }));
const BASMALA: RahmanBlock = { kind: 'ayah', key: '1:1', basmala: true };

/**
 * The scene's pages (owner, 2026-11-24, sketches /mnt/project-files/mashahid/rahman/intro and paper3): five pages of
 * introduction, then the basmalas and the places, the two surahs, every ayah in the mushaf's order, every hadith on a page
 * of its own, and the hundred mercies to close. `placeKeys`: the ayat that hold the name (rahmanPlaces).
 */
export function rahmanSections(placeKeys: string[]): RahmanSection[] {
  return [
    { id: 'name', title: '', blocks: [{ kind: 'ayah', key: '55:1', title: true }, { kind: 'counts' }], intro: true },
    { id: 'opening', title: 'البسملة والفاتحة', blocks: [BASMALA, { kind: 'ayah', key: '1:3' }, { kind: 'hadith', id: FATIHA_PART.id }, ...ayat(['55:1', '55:2'])], intro: true },
    { id: 'intro-ayat', title: 'من الآيات', blocks: ayat(INTRO_AYAT), intro: true },
    { id: 'intro-hadith', title: 'من الأحاديث', blocks: hadith(INTRO_HADITH), intro: true },
    { id: 'intro-mercy', title: MERCY_HADITH.title, blocks: hadith([MERCY_HADITH.id]), intro: true },
    { id: 'map', title: 'البسملة والآيات', blocks: [{ kind: 'map' }] },
    { id: 'surah', title: 'سورة الرحمن', blocks: [BASMALA, ...ayat(SURAH_AYAT), { kind: 'sadi' }] },
    { id: 'fatiha', title: 'سورة الفاتحة', blocks: [{ kind: 'ayah', key: '1:3' }, { kind: 'hadith', id: FATIHA_HADITH.id }] },
    { id: 'ayat', title: 'الآيات', blocks: ayat(placeKeys) },
    ...SCENE_HADITH.map(each => ({ id: each.id, title: each.title, blocks: hadith([each.id]) })),
    { id: 'mercy', title: MERCY_HADITH.title, blocks: hadith([MERCY_HADITH.id]) },
  ];
}

/** Every hadith the scene shows, by its id. */
export const SCENE_HADITH_BY_ID: Record<string, SceneHadith> = Object.fromEntries([FATIHA_HADITH, FATIHA_PART, ...SCENE_HADITH, MERCY_HADITH].map(each => [each.id, each]));

/** A hadith's numbers in its book and the other, grouped by book, its own book first. */
export function hadithNumbers(hadith: SceneHadith): { book: SahihBookSlug; numbers: number[] }[] {
  const refs = [{ book: hadith.book, n: hadith.n }, ...(hadith.also ?? [])];
  const books = [...new Set(refs.map(ref => ref.book))];
  return books.map(book => ({ book, numbers: refs.filter(ref => ref.book === book).map(ref => ref.n) }));
}

/** The surah with the most places, and how many (the map's note: «١٦ منها في مريم»). */
export function mostPlaces(places: WordPlace[]): { surah: number; count: number } {
  const counts = new Map<number, number>();
  for (const place of places) { const surah = Number(place.key.split(':')[0]); counts.set(surah, (counts.get(surah) ?? 0) + place.words.length); }
  const [surah, count] = [...counts].reduce((best, each) => (each[1] > best[1] ? each : best));
  return { surah, count };
}
