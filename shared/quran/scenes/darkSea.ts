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

/** What a layer draws: the art under it, from the surface down. The night and the hand are drawn over the rest. */
export type Layer = 'surface' | 'sea' | 'wave' | 'wave2' | 'cloud' | 'night' | 'hand' | 'meaning';
/** One step of the scene: the ayah's words it lights (normalized, as they stand in the ayah) and the sayings on it. */
export type SceneStep = { layer: Layer; name: string; phrase: string; sayings: SceneSaying[] };

export const DARK_SEA_KEY = '24:40';

export const DARK_SEA_STEPS: SceneStep[] = [
  { layer: 'surface', name: 'مثل', phrase: 'او كظلمت في', sayings: [said('tabari', 'tabari', 'وهذا مَثَلٌ آخرُ ضرَبَه اللهُ لأعمالِ الكفارِ')] },
  { layer: 'sea', name: 'بحر لجي', phrase: 'بحر لجي', sayings: [
    said('tabari', 'tabari', 'عميقٌ كثيرُ الماءِ، ولُجَّةُ البحرِ مُعْظَمُه'),
    said('sadi', 'sadi', 'بعيد قعره، طويل مداه'),
    said('ibnQayyim', 'ibnQayyim17', 'في بحر لجي لا ساحل له'),
  ] },
  { layer: 'wave', name: 'موج', phrase: 'يغشيه موج', sayings: [said('tabari', 'tabari', 'يَغْشَى البحرَ موجٌ')] },
  { layer: 'wave2', name: 'موج فوقه', phrase: 'من فوقه موج', sayings: [
    said('tabari', 'tabari', 'مِن فوقِ الموجِ موجٌ آخرُ يَغْشاه'),
    said('raghib', 'raghib', 'ولُجَّةُ البحر بالضّم: تردّد أمواجه'),
  ] },
  { layer: 'cloud', name: 'سحاب', phrase: 'من فوقه سحاب', sayings: [said('tabari', 'tabari', 'مِن فوقِ الموجِ الثاني الذي يَغْشَى الموجَ الأَوَّلَ، سَحابٌ')] },
  { layer: 'night', name: 'ظلمات بعضها فوق بعض', phrase: 'ظلمت بعضها فوق بعض', sayings: [
    said('sadi', 'sadi', 'ظلمة البحر اللجي، ثم فوقه ظلمة الأمواج المتراكمة، ثم فوق ذلك، ظلمة السحب المدلهمة، ثم فوق ذلك ظلمة الليل البهيم، فاشتدت الظلمة جدا'),
  ] },
  { layer: 'hand', name: 'اليد', phrase: 'اذا اخرج يده لم يكد يريها', sayings: [
    said('kashshaf', 'kashshaf', 'لم يقرب أن يراها، فضلا عن أن يراها'),
    said('ibnKathir', 'ibnKathir', 'لم يقارب رؤيتها من شدة الظلام'),
    said('sadi', 'sadi', 'مع قربها إليه، فكيف بغيرها'),
  ] },
  { layer: 'meaning', name: 'المعنى', phrase: 'ومن لم يجعل الله له نورا فما له من نور', sayings: [
    said('tabari', 'tabariCore', 'فجعَل الظُّلُماتِ مَثَلًا لأعمالِهم، والبحرَ اللُّجِّيَّ مثَلًا لقلبِ الكافِرِ'),
  ] },
];

/**
 * What the darknesses are, as each scholar who names them says it (owner, 2026-11-21: shown attributed, one at a time).
 * Reports through a chain no source grades (Ibn Abbas by al-Awfi, Ubayy by Abu Ja'far al-Razi) are left out.
 */
export const DARK_SEA_READINGS: SceneSaying[] = [
  said('sadi', 'sadi', 'كذلك الكفار، تراكمت على قلوبهم الظلمات، ظلمة الطبيعة، التي لا خير فيها، وفوقها ظلمة الكفر، وفوق ذلك، ظلمة الجهل، وفوق ذلك، ظلمة الأعمال الصادرة عما ذكر'),
  said('ibnQayyim', 'ibnQayyim17', 'فتراكمت عليه ظلمة الطبع وظلمة النفوس وظلمة الجهل حيث لم يعلموا بعلمهم فصاروا جاهلين وظلمة اتباع الغي والهوى'),
  said('ibnQayyim', 'ibnQayyim18', 'وهكذا أمواج الشكوك والشبه في قلوبهم المظلمة التي قد تراكمت عليها سحب الغي والهوى والباطل'),
  said('ibnKathir', 'ibnKathir', 'فهذا مثل قلب الكافر الجاهل البسيط المقلد الذي لا يدري أين يذهب'),
];

/** Every book the scene quotes, each place once: the card's source line. */
export const darkSeaSources = (): QuizSource[] => {
  const seen = new Set<string>();
  return [...DARK_SEA_STEPS.flatMap(step => step.sayings), ...DARK_SEA_READINGS]
    .map(saying => saying.source)
    .filter(source => { const id = `${source.book}|${source.at}|${source.quote}`; return !seen.has(id) && !!seen.add(id); });
};

/** The scene's place, «النور ٤٠». */
export const darkSeaTitle = (surahName: string) => `${surahName} ${num(Number(DARK_SEA_KEY.split(':')[1]))}`;

export type SceneWord = { text: string; step: number };
/**
 * The ayah's page words, each with the step that lights it. A phrase is found in the ayah's words after the previous
 * step's, so the steps walk the ayah in order; one not found there throws.
 */
export function darkSeaWords(of: AyahWordsOf): SceneWord[] {
  const words = of(DARK_SEA_KEY) ?? [];
  const norm = words.map(normalizeWord);
  const step = new Array<number>(words.length).fill(-1);
  let from = 0;
  DARK_SEA_STEPS.forEach((each, k) => {
    const phrase = each.phrase.split(' ');
    const start = norm.findIndex((_, i) => i >= from && phrase.every((word, j) => norm[i + j] === word));
    if (start < 0) throw new Error(`«${each.phrase}» not found in ${DARK_SEA_KEY} after word ${from}`);
    for (let j = 0; j < phrase.length; j++) step[start + j] = k;
    from = start + phrase.length;
  });
  return words.map((text, i) => ({ text, step: step[i] }));
}
