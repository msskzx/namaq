// «مشاهد» (owner, 2026-11-21): an ayah's own scene drawn layer by layer, each layer lighting its words and saying, in the
// scholars' own words, what it is. The scene's lines are quoted from the books whole, each with its sayer and its page;
// only what a scholar says is said, and never «قيل» (owner, 2026-11-21: «قيل» weakens a saying). Notes and the texts read:
// /mnt/project-files/mashahid/sea-scene-sources.md.
import { num } from '../arabicNumber';
import { normalizeWord } from '../normalize';
import type { AyahWordsOf } from '../quranText/ayahWords';
import type { QuizSource } from '../../quiz/sources';

const book = {
  tabari: { book: 'جامع البيان', author: 'الطبري', edition: 'ت. التركي' },
  ibnKathir: { book: 'تفسير القرآن العظيم', author: 'ابن كثير', edition: 'ت. سامي سلامة' },
  sadi: { book: 'تيسير الكريم الرحمن', author: 'السعدي', edition: 'ط. الرسالة' },
  kashshaf: { book: 'الكشاف', author: 'الزمخشري', edition: 'ط. دار الكتاب العربي' },
  raghib: { book: 'المفردات في غريب القرآن', author: 'الراغب الأصفهاني', edition: 'ت. صفوان داودي' },
  ibnQayyim: { book: 'الأمثال في القرآن', author: 'ابن القيم', edition: 'ط. مكتبة الصحابة' },
};
const at = {
  tabari: { at: '١٧/٣٢٩', url: 'https://shamela.ws/book/7798/11748' },
  tabariCore: { at: '١٧/٣٢٩–٣٣٠', url: 'https://shamela.ws/book/7798/11748' },
  ibnKathir: { at: '٦/٧١', url: 'https://shamela.ws/book/8473/2977' },
  sadi: { at: 'ص ٥٦٩', url: 'https://quranpedia.net/book/3/1/569' },
  kashshaf: { at: '٣/٢٤٤', url: 'https://quranpedia.net/book/346/3/244' },
  raghib: { at: 'ص ٧٣٦', url: 'https://shamela.ws/book/23636/718' },
  ibnQayyim17: { at: 'ص ١٧', url: 'https://shamela.ws/book/928/15' },
  ibnQayyim18: { at: 'ص ١٨', url: 'https://shamela.ws/book/928/16' },
};

/** A scholar's own words on a layer, with the book and page they are in. */
export type SceneSaying = { by: string; text: string; source: QuizSource };
const said = (by: keyof typeof book, place: keyof typeof at, text: string): SceneSaying =>
  ({ by: book[by].author, text, source: { ...book[by], ...at[place], quote: text } });

/**
 * The scene's line under its cover in the list (owner, 2026-11-24: the cover, and under it a line or two that make one
 * want to open it): al-Tabari on what the whole likeness is, quoted as the last shot quotes it.
 */
export const DARK_SEA_TEASER = said('tabari', 'tabari', 'وهذا مَثَلٌ آخرُ ضرَبَه اللهُ لأعمالِ الكفارِ');

/**
 * What a shot draws (owner, 2026-11-22: a full-screen short, swiped anywhere). The opening sea, then each layer in the ayah's
 * order; `night` is the darknesses going out one over another, `hand` darker still with the hand's words (no hand is drawn:
 * no source says where the man is), `end` the ayah's last words alone in the black.
 */
export type Layer = 'surface' | 'sea' | 'wave' | 'wave2' | 'cloud' | 'night' | 'hand' | 'end';
/**
 * One page of the scene: the ayah's words it shows (normalized, as they stand in the ayah) and the sayings on it. A page
 * with `more` goes on its shot (the same dot); with no phrase it shows its shot's words.
 */
export type SceneStep = { layer: Layer; name: string; phrase: string; sayings: SceneSaying[]; more?: boolean;
  /** A line over the page's sayings (the readings after the end: «ما هذه الظلمات؟»). */
  head?: string;
  /** Its one saying in pieces, in its own order, each shown as its layer goes out: together they are the saying word for word. */
  parts?: string[] };

export const DARK_SEA_KEY = '24:40';

/**
 * What the darknesses are, as each scholar who names them says it (owner, 2026-11-21: shown attributed). Reports through a
 * chain no source grades (Ibn Abbas by al-Awfi, Ubayy by Abu Ja'far al-Razi) are left out.
 */
export const DARK_SEA_READINGS: SceneSaying[] = [
  said('sadi', 'sadi', 'كذلك الكفار، تراكمت على قلوبهم الظلمات، ظلمة الطبيعة، التي لا خير فيها، وفوقها ظلمة الكفر، وفوق ذلك، ظلمة الجهل، وفوق ذلك، ظلمة الأعمال الصادرة عما ذكر'),
  said('ibnQayyim', 'ibnQayyim17', 'فتراكمت عليه ظلمة الطبع وظلمة النفوس وظلمة الجهل حيث لم يعلموا بعلمهم فصاروا جاهلين وظلمة اتباع الغي والهوى'),
  said('ibnQayyim', 'ibnQayyim18', 'وهكذا أمواج الشكوك والشبه في قلوبهم المظلمة التي قد تراكمت عليها سحب الغي والهوى والباطل'),
  said('ibnKathir', 'ibnKathir', 'فهذا مثل قلب الكافر الجاهل البسيط المقلد الذي لا يدري أين يذهب'),
];

const SADI_DARK = said('sadi', 'sadi', 'ظلمة البحر اللجي، ثم فوقه ظلمة الأمواج المتراكمة، ثم فوق ذلك، ظلمة السحب المدلهمة، ثم فوق ذلك ظلمة الليل البهيم، فاشتدت الظلمة جدا');
const WHAT = 'ما هذه الظلمات؟';
/**
 * The scene's pages (owner, 2026-11-22, prototype /mnt/project-files/mashahid/shorts-prototype/sea-scene.html): the ayah
 * alone, then each layer with its words and one saying, the other sayings on a page of the same shot; the darknesses with
 * al-Sa'di's words in his order as each goes out (`parts`), then the hand's words darker still; the last words alone; and
 * after them what the parable and its darknesses are.
 */
export const DARK_SEA_STEPS: SceneStep[] = [
  { layer: 'surface', name: 'الآية', phrase: '', sayings: [] },
  { layer: 'sea', name: 'بحر لجي', phrase: 'او كظلمت في بحر لجي', sayings: [said('tabari', 'tabari', 'عميقٌ كثيرُ الماءِ، ولُجَّةُ البحرِ مُعْظَمُه')] },
  { layer: 'sea', name: 'بحر لجي', phrase: '', more: true, sayings: [
    said('sadi', 'sadi', 'بعيد قعره، طويل مداه'),
    said('ibnQayyim', 'ibnQayyim17', 'في بحر لجي لا ساحل له'),
  ] },
  { layer: 'wave', name: 'موج', phrase: 'يغشيه موج', sayings: [said('tabari', 'tabari', 'يَغْشَى البحرَ موجٌ')] },
  { layer: 'wave2', name: 'موج فوقه', phrase: 'من فوقه موج', sayings: [said('tabari', 'tabari', 'مِن فوقِ الموجِ موجٌ آخرُ يَغْشاه')] },
  { layer: 'wave2', name: 'موج فوقه', phrase: '', more: true, sayings: [said('raghib', 'raghib', 'ولُجَّةُ البحر بالضّم: تردّد أمواجه')] },
  { layer: 'cloud', name: 'سحاب', phrase: 'من فوقه سحاب', sayings: [said('tabari', 'tabari', 'مِن فوقِ الموجِ الثاني الذي يَغْشَى الموجَ الأَوَّلَ، سَحابٌ')] },
  { layer: 'night', name: 'ظلمات بعضها فوق بعض', phrase: 'ظلمت بعضها فوق بعض', sayings: [SADI_DARK],
    parts: ['ظلمة البحر اللجي،', 'ثم فوقه ظلمة الأمواج المتراكمة،', 'ثم فوق ذلك، ظلمة السحب المدلهمة،', 'ثم فوق ذلك ظلمة الليل البهيم، فاشتدت الظلمة جدا'] },
  { layer: 'hand', name: 'لم يكد يراها', phrase: 'اذا اخرج يده لم يكد يريها', more: true, sayings: [said('ibnKathir', 'ibnKathir', 'لم يقارب رؤيتها من شدة الظلام')] },
  { layer: 'hand', name: 'لم يكد يراها', phrase: '', more: true, sayings: [
    said('kashshaf', 'kashshaf', 'لم يقرب أن يراها، فضلا عن أن يراها'),
    said('sadi', 'sadi', 'مع قربها إليه، فكيف بغيرها'),
  ] },
  { layer: 'end', name: 'فما له من نور', phrase: 'ومن لم يجعل الله له نورا فما له من نور', sayings: [] },
  { layer: 'end', name: WHAT, phrase: '', more: true, head: WHAT, sayings: [
    DARK_SEA_TEASER,
    said('tabari', 'tabariCore', 'فجعَل الظُّلُماتِ مَثَلًا لأعمالِهم، والبحرَ اللُّجِّيَّ مثَلًا لقلبِ الكافِرِ'),
    DARK_SEA_READINGS[0],
  ] },
  { layer: 'end', name: WHAT, phrase: '', more: true, head: WHAT, sayings: DARK_SEA_READINGS.slice(1) },
];

/** The scene's shots: its pages without the ones that go on a shot (the dots). */
export const darkSeaShots = () => DARK_SEA_STEPS.flatMap((step, page) => (step.more ? [] : [{ ...step, page }]));
/** The shot a page is on. */
export const shotOf = (page: number) => DARK_SEA_STEPS.slice(0, page + 1).filter(step => !step.more).length - 1;

/** Every book the scene quotes, each place once: the card's source line. */
export const darkSeaSources = (): QuizSource[] => {
  const seen = new Set<string>();
  return DARK_SEA_STEPS.flatMap(step => step.sayings)
    .map(saying => saying.source)
    .filter(source => { const id = `${source.book}|${source.at}|${source.quote}`; return !seen.has(id) && !!seen.add(id); });
};

/** The scene's place, «النور ٤٠». */
export const darkSeaTitle = (surahName: string) => `${surahName} ${num(Number(DARK_SEA_KEY.split(':')[1]))}`;

export type SceneWord = { text: string; step: number };
/**
 * The ayah's page words, each with the page that lights it. A phrase is found in the ayah's words after the previous
 * page's, so the pages walk the ayah in order; one not found there throws. The opening, with no phrase, lights them all.
 */
export function darkSeaWords(of: AyahWordsOf): SceneWord[] {
  const words = of(DARK_SEA_KEY) ?? [];
  const norm = words.map(normalizeWord);
  const step = new Array<number>(words.length).fill(-1);
  let from = 0;
  DARK_SEA_STEPS.forEach((each, k) => {
    if (!each.phrase) return;
    const phrase = each.phrase.split(' ');
    const start = norm.findIndex((_, i) => i >= from && phrase.every((word, j) => norm[i + j] === word));
    if (start < 0) throw new Error(`«${each.phrase}» not found in ${DARK_SEA_KEY} after word ${from}`);
    for (let j = 0; j < phrase.length; j++) step[start + j] = k;
    from = start + phrase.length;
  });
  return words.map((text, i) => ({ text, step: step[i] }));
}

/** The page whose words a page shows: its own, or the last before it with words (the opening has the whole ayah). */
export const wordsPage = (page: number) => { let at = page; while (at > 0 && !DARK_SEA_STEPS[at].phrase) at--; return at; };
