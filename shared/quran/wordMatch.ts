import { normalizeWord } from './normalize';
import { bare } from './quranText/ayahWords';

// docs/adr/0037-one-rule-colours-words-the-ayat-share.md
/**
 * How alike words the ayat share are: written the same, the same letters written differently (tashkeel, the hamza
 * of an alif, idgham: al-Zarkashi's «الإدغام وتركه», al-Iskafi's رفع/نصب), or only the same root.
 */
export type Likeness = 'exact' | 'written' | 'root';

const writing = (word: string) => bare(word).replace(/[ـ⁠]/g, '').normalize('NFC');

export function likeness(words: string[]): Likeness {
  const written = words.map(writing);
  if (written.every(word => word === written[0])) return 'exact';
  const letters = words.map(normalizeWord);
  return letters.every(word => word === letters[0]) ? 'written' : 'root';
}

/** The colour setting for these words: each likeness its own colour, one colour for all, or none. */
export const MARK_MODES = ['kinds', 'one', 'none'] as const;
export type MarkMode = (typeof MARK_MODES)[number];
export const isMarkMode = (value: unknown): value is MarkMode => MARK_MODES.includes(value as MarkMode);

/** A colour for each likeness under a mode: under `one` all take the exact colour, under `none` none has one (the text's own). */
export function markTones<T>(mode: MarkMode, tones: Record<Likeness, T>): Partial<Record<Likeness, T>> {
  if (mode === 'none') return {};
  return mode === 'one' ? { exact: tones.exact, written: tones.exact, root: tones.exact } : tones;
}

/**
 * The colour legend, app and website alike: each likeness with an example word, and the kind of difference al-Zarkashi
 * names for it in «البرهان في علوم القرآن» (docs/adr/0037). A plain word is one only some ayat have.
 */
export const MARK_LEGEND: { kind: Likeness | 'plain'; word: string; ar: string; en: string }[] = [
  { kind: 'exact', word: 'ٱلْكِتَٰبَ', ar: 'الكلمة نفسها بضبطها في كل الآيات', en: 'The same word, written alike in every ayah' },
  { kind: 'written', word: 'لَعْنَةُ', ar: 'الحروف نفسها بضبط مختلف: إعراب أو همز الألف أو إدغام («الإدغام وتركه»)', en: 'The same letters written differently: case ending, an alif\'s hamza or idgham (al-idgham wa tarkuh)' },
  { kind: 'root', word: 'يُؤْمِنُونَ', ar: 'نفس اللفظ أو الجذر بصيغة أخرى («الجمع والإفراد»، «إبدال كلمة بأخرى»)', en: 'The same lemma or root in another form (al-jam‘ wa al-ifrad, ibdal kalima)' },
  { kind: 'plain', word: 'وَسَوَآءٌ', ar: 'كلمة في آية دون أخرى («الزيادة والنقصان»)', en: 'A word only some ayat have (al-ziyada wa al-nuqsan)' },
];
export const LEGEND_SOURCE = { ar: 'أسماء الأنواع من «البرهان في علوم القرآن» للزركشي.', en: 'Names of the kinds from al-Zarkashi’s al-Burhan fi ‘Ulum al-Qur’an.' };

/** The colour setting's tiles, app and website alike. */
export const MARK_MODE_NAMES: Record<MarkMode, { ar: string; en: string }> = {
  kinds: { ar: 'حسب النوع', en: 'By kind' },
  one: { ar: 'لون واحد', en: 'One colour' },
  none: { ar: 'بلا ألوان', en: 'None' },
};
export const MARK_SETTING_LABEL = { ar: 'ألوان الكلمات المشتركة', en: 'Colours of shared words' };

/** A mark's short title (a word's tooltip), by likeness. */
export const LIKENESS_TITLE: Record<Likeness, { ar: string; en: string }> = {
  exact: { ar: 'نفس الكلمة', en: 'Same word' },
  written: { ar: 'الحروف نفسها بضبط مختلف', en: 'Same letters, written differently' },
  root: { ar: 'نفس اللفظ أو الجذر', en: 'Same lemma or root' },
};
