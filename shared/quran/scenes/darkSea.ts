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

export type SceneSaying = { by: string; text: string; source: QuizSource };
const said = (by: keyof typeof book, place: keyof typeof at, text: string): SceneSaying =>
  ({ by: book[by].author, text, source: { ...book[by], ...at[place], quote: text } });

export const DARK_SEA_TEASER = said('tabari', 'tabari', 'وهذا مَثَلٌ آخرُ ضرَبَه اللهُ لأعمالِ الكفارِ');

export type Layer = 'surface' | 'sea' | 'wave' | 'wave2' | 'cloud' | 'night' | 'hand' | 'end';
export type SceneStep = { layer: Layer; name: string; phrase: string; sayings: SceneSaying[]; more?: boolean;
  head?: string;
  parts?: string[] };

export const DARK_SEA_KEY = '24:40';

export const DARK_SEA_READINGS: SceneSaying[] = [
  said('sadi', 'sadi', 'كذلك الكفار، تراكمت على قلوبهم الظلمات، ظلمة الطبيعة، التي لا خير فيها، وفوقها ظلمة الكفر، وفوق ذلك، ظلمة الجهل، وفوق ذلك، ظلمة الأعمال الصادرة عما ذكر'),
  said('ibnQayyim', 'ibnQayyim17', 'فتراكمت عليه ظلمة الطبع وظلمة النفوس وظلمة الجهل حيث لم يعلموا بعلمهم فصاروا جاهلين وظلمة اتباع الغي والهوى'),
  said('ibnQayyim', 'ibnQayyim18', 'وهكذا أمواج الشكوك والشبه في قلوبهم المظلمة التي قد تراكمت عليها سحب الغي والهوى والباطل'),
  said('ibnKathir', 'ibnKathir', 'فهذا مثل قلب الكافر الجاهل البسيط المقلد الذي لا يدري أين يذهب'),
];

const SADI_DARK = said('sadi', 'sadi', 'ظلمة البحر اللجي، ثم فوقه ظلمة الأمواج المتراكمة، ثم فوق ذلك، ظلمة السحب المدلهمة، ثم فوق ذلك ظلمة الليل البهيم، فاشتدت الظلمة جدا');
const WHAT = 'ما هذه الظلمات؟';
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

export const darkSeaShots = () => DARK_SEA_STEPS.flatMap((step, page) => (step.more ? [] : [{ ...step, page }]));
export const shotOf = (page: number) => DARK_SEA_STEPS.slice(0, page + 1).filter(step => !step.more).length - 1;

export const darkSeaSources = (): QuizSource[] => {
  const seen = new Set<string>();
  return DARK_SEA_STEPS.flatMap(step => step.sayings)
    .map(saying => saying.source)
    .filter(source => { const id = `${source.book}|${source.at}|${source.quote}`; return !seen.has(id) && !!seen.add(id); });
};

export const darkSeaTitle = (surahName: string) => `${surahName} ${num(Number(DARK_SEA_KEY.split(':')[1]))}`;

export type SceneWord = { text: string; step: number };
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

export const wordsPage = (page: number) => { let at = page; while (at > 0 && !DARK_SEA_STEPS[at].phrase) at--; return at; };
