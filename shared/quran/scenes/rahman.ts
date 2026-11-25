import { mushafPlacesOf, type WordPlace, type WordsData } from '../words';
import { normalizeWord } from '../normalize';
import mutashabihFile from '../../data/quran/mutashabih.json';
import { dataOf } from '../../appData';

/**
 * «الرحمن», the second scene of «مشاهد» (owner, 2026-11-24, thread "Design a still scene on «الرحمن»"): still pages, not a
 * video, each one ready to share as a 4:5 picture. Seven pages of introduction (owner, 2026-11-25) come first, with no button on them so they
 * share clean; then every place the name is written: the basmalas and the 57 places in the Quran, surat al-Rahman and
 * al-Fatiha, every ayah, and every hadith of the Sahihayn whose words name «الرحمن»; the hadith of the hundred mercies
 * closes it. Every page holds the name; the only drawings are the map, al-Kirmani's repeated ayah and the hundred mercies
 * (owner, 2026-11-25). Sketches in
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

/** Basmalas that are also ayat holding the name: counted once among the basmalas and once among the places. */
const COUNTED_TWICE = new Set(['1:1', BASMALA_AYAH]);
export type SurahBar = { basmala: number; name: number; both: number };
/**
 * Each surah's bar for the first page (owner, 2026-11-25: one plot, a colour for the basmala over the surah, one for the
 * name inside it, and a third for a basmala that is counted twice, al-Fatiha 1 and an-Naml 30).
 */
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

/**
 * A hadith the scene shows. Its words are never copied here (owner, 2026-11-24: one hadith text): `scripts/quran/
 * buildRahmanScene.ts` reads them from data/hadith/sahih and writes shared/data/quran/rahmanHadith.json.
 * - `route`: the printed route whose words show (the first by default).
 * - `from`/`until`: the words start after the first `from` and stop before `until`, where the edition marks no matn.
 * - `cut`: too long for a page (the Hudaybiyyah runs to 39); a part around the name shows, and its page opens the whole.
 * - `part`: `from`/`until` cut inside its words, so they show with «…» on both sides.
 * - `lead`: a muted line over its words saying what it is and who narrates it, as the scholars introduce it.
 * - `lit`: words of it in a second colour (owner, 2026-11-25: «أثنى علي عبدي», not the name's red).
 * - `narrator`: the printed words in its isnad where its words begin to be told, the Companion first (owner, 2026-11-25:
 *   «ابدأ كل حديث بالراوي»); they show from there to the matn, as printed.
 */
export type SceneHadith = HadithRef & { id: string; title: string; route?: string; from?: string; until?: string; cut?: boolean; part?: boolean; lead?: string; lit?: string; narrator?: string;
  /** The other numbers that hold the same words, in the same book or the other. */
  also?: HadithRef[] };

const b = (n: number): HadithRef => ({ book: 'bukhari', n });
const m = (n: number): HadithRef => ({ book: 'muslim', n });

/** «قسمت الصلاة…» in Muslim (395): al-Fatiha's page shows its words whole, up to Sufyan's own note after them. */
export const FATIHA_HADITH: SceneHadith = { id: 'fatiha', ...m(395), route: '٣٨', narrator: 'عَنْ أبي هريرة', title: 'أثنى علي عبدي', until: 'قَالَ سُفْيَانُ', lit: 'أثنى علي عبدي' };
/** The same, on the introduction: from Allah's words up to «أثنى علي عبدي» (owner, 2026-11-24: the part before it too). */
/** Its narrator is Abu Hurayra (route ٣٨: «عن أبي هريرة، عن النبي ﷺ»); the owner asked for the line (2026-11-25). */
export const FATIHA_PART: SceneHadith = { ...FATIHA_HADITH, id: 'fatiha-part', part: true, narrator: undefined, lead: 'في الحديث القدسي، عن أبي هريرة رضي الله عنه:', from: 'سَمِعْتُ رسول الله ﷺ يقول: ', until: ' وَإِذَا قال مالك' };

/** The hadith pages, in the order they show. Every hadith of the Sahihayn whose words name «الرحمن» is here (rahmanHadith.test.ts). */
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

/** The closing page: the hundred mercies (al-Bukhari 6000; its like in Muslim 2752), asked for by name (owner, 2026-11-24). */
export const MERCY_HADITH: SceneHadith = { id: 'mercy', ...b(6000), narrator: 'أَنَّ أَبَا هُرَيْرَةَ', title: 'مئة رحمة', also: [m(2752)] };

/** Every hadith number the scene names: the count on its first page. */
export const sceneHadithNumbers = (): HadithRef[] => {
  const all = [FATIHA_HADITH, ...SCENE_HADITH].flatMap(hadith => [{ book: hadith.book, n: hadith.n }, ...(hadith.also ?? [])]);
  return all.filter((ref, i) => all.findIndex(other => other.book === ref.book && other.n === ref.n) === i);
};

/** A hadith's words as built (shared/data/quran/rahmanHadith.json): where they are in the book, and whether they are a part. */
export type BuiltHadith = { book: SahihBookSlug; n: number; from: number; to: number; text: string; cutBefore: boolean; cutAfter: boolean;
  /** The isnad's words from the `narrator` to where `text`'s matn begins, as printed. */
  narrator?: string };

/** The introduction's ayat (owner, 2026-11-24; al-Furqan 60 swapped for Qaf 33). */
export const INTRO_AYAT = ['50:33', '19:96', '19:93'];
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

const plainWord = (word: string) => normalizeWord(word).replace(/[^ء-ي]/g, '');

/** A text's words, each with whether it is the name, or one of the `lit` words (matched without marks). */
export function nameRuns(text: string, lit?: string): { text: string; name: boolean; lit: boolean }[] {
  const words = text.split(' ');
  const want = lit ? lit.split(' ').map(plainWord) : [];
  const inLit = new Set<number>();
  for (let i = 0; want.length && i + want.length <= words.length; i++) {
    if (want.every((word, k) => plainWord(words[i + k]) === word)) for (let k = 0; k < want.length; k++) inLit.add(i + k);
  }
  return words.map((word, i) => ({ text: (i ? ' ' : '') + word, name: isName(word, words[i - 1]), lit: inLit.has(i) }));
}

/** What a page of the scene holds, block by block: each block is measured, and a section's blocks flow over its pages. */
export type RahmanBlock =
  /** An ayah whole; `basmala` draws al-Fatiha's first ayah with no number, as the basmala over a surah. */
  | { kind: 'ayah'; key: string; basmala?: boolean;
    /** The first page's name: big, with no number. */
    title?: boolean }
  /** Ayat of one surah that follow each other, in one flow with their numbers (owner, 2026-11-25: «الرحمن علم القرآن» on one line). */
  | { kind: 'run'; keys: string[];
    /** No surah name over it (owner, 2026-11-25: al-Fatiha's basmala and ayah 3 on the second page). */
    bare?: boolean }
  | { kind: 'hadith'; id: string }
  | { kind: 'sadi' }
  /** The first page's plot of the name in the surahs, and the basmalas and hadith in one line (owner, 2026-11-25). */
  | { kind: 'cover' }
  /** The hundred parts of mercy, as sketch B the owner chose (owner, 2026-11-25): ninety-nine kept, one sent down. */
  | { kind: 'mercy' }
  /** «فبأي آلاء ربكما تكذبان» in al-Kirmani's four runs, then his words (owner, 2026-11-25). */
  | { kind: 'tikrar' }
  /** Al-Kirmani's words on a repeated ayah, whole (Asrar al-Tikrar). */
  | { kind: 'kirmani'; key: string };

/** A run of pages: its title over each of them, its blocks flowing from page to page. `intro`: no taps on its pages. */
export type RahmanSection = { id: string; title: string; blocks: RahmanBlock[]; intro?: boolean };

const ayat = (keys: string[]): RahmanBlock[] => keys.map(key => ({ kind: 'ayah', key }));
const hadith = (ids: string[]): RahmanBlock[] => ids.map(id => ({ kind: 'hadith', id }));
const BASMALA: RahmanBlock = { kind: 'ayah', key: '1:1', basmala: true };

/**
 * The scene's pages (owner, 2026-11-24, sketches /mnt/project-files/mashahid/rahman/intro and paper3): seven pages of
 * introduction, then the basmalas and the places, the two surahs, every ayah in the mushaf's order, every hadith on a page
 * of its own, and the hundred mercies to close. `placeKeys`: the ayat that hold the name (rahmanPlaces).
 */
export function rahmanSections(placeKeys: string[]): RahmanSection[] {
  return [
    { id: 'name', title: '', blocks: [{ kind: 'ayah', key: '55:1', title: true }, { kind: 'cover' }], intro: true },
    { id: 'opening', title: 'البسملة والفاتحة', blocks: [{ kind: 'run', keys: ['1:1', '1:2', '1:3'], bare: true }, { kind: 'hadith', id: FATIHA_PART.id }], intro: true },
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

/** The parts of mercy in the hadith of the hundred mercies, and those Allah kept with Him. */
export const MERCY_PARTS = 100;
export const MERCY_KEPT = 99;

type KirmaniCitation = { book: string; quote: string; locator: string; places: string[] };

/**
 * Al-Kirmani on a repeated ayah, as the mutashabih data quotes him (Asrar al-Tikrar): the citation that names `key` and
 * the most places with it (on al-Rahman's refrain, the one that counts all thirty-one).
 */
export function kirmaniOn(key: string): KirmaniCitation {
  const groups = dataOf(mutashabihFile) as unknown as { citations: KirmaniCitation[] }[];
  const found = groups.flatMap(group => group.citations)
    .filter(citation => citation.book.includes('الكرماني') && citation.places.includes(key))
    .sort((x, y) => y.places.length - x.places.length)[0];
  if (!found) throw new Error(`no al-Kirmani citation on ${key}`);
  return found;
}
/** The first place of al-Rahman's refrain «فبأي آلاء ربكما تكذبان». */
export const TIKRAR_FIRST = '55:13';

/**
 * Al-Kirmani's four runs of the repeated ayah, each named by the words of his quote at `words` (word positions, end
 * excluded) and counted as he counts them (ص ٢٣١): after the
 * wonders of creation, after the Fire, the Gardens, and the two Gardens below them.
 */
export const TIKRAR_RUNS = [
  { words: [16, 20], count: 8 },
  { words: [31, 34], count: 7 },
  { words: [62, 65], count: 8 },
  { words: [72, 75], count: 8 },
] as const;

/** A run's name: its words in al-Kirmani's quote, read from it (owner, 2026-11-25: nothing copied). */
export const tikrarWords = (run: (typeof TIKRAR_RUNS)[number]) => kirmaniOn(TIKRAR_FIRST).quote.split(' ').slice(...run.words).join(' ');
