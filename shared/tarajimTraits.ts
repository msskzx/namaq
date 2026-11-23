import { unmarked } from './tarajim';

/**
 * A person's looks as the book words them, picked out of its sentences (owner, 2026-11-23: the «صفته» card, sketch
 * tarajim-feed-card/sketch/traits-dark.png): each trait is the book's own words, found in the text, never a word of ours
 * put for them. The list below names the descriptive words the Siyar uses in its appearance sentences; a sentence keeps
 * whatever it says besides them, read in full under the chips.
 */

/**
 * The book's words for looks, as a chip reads them: unvowelled, in the form the sentence puts them (the accusative
 * alif of «جعدا» is dropped in matching, so «جعد» finds both). Longer phrases before the words they hold, so
 * «أبيض الرأس واللحية» is one trait and not «أبيض».
 */
const TRAITS = [
  // colour
  'الجعد الأبيض', 'أبيض الرأس واللحية', 'أبيض', 'بيضاء', 'شديد البياض', 'أسمر اللون', 'أسمر', 'آدم', 'شديد الأدمة', 'أحمر الوجه', 'أحمر',
  'شديد الحمرة', 'أسود', 'شديد السواد', 'أصفر', 'أزهر اللون', 'أصهب الشعر', 'لحيته حمراء',
  // height
  'طويل جدا', 'طويل', 'طوال', 'قصير', 'ربعة', 'مربوع', 'دحداح', 'معتدل القامة', 'مديد القامة', 'معتدل',
  'ليس بالطويل', 'لا بالطويل', 'ولا بالقصير',
  // body
  'نحيف', 'ضخم الهامة', 'ضخم القدمين', 'ضخم', 'جسيم', 'سمين', 'عظيم البطن', 'ذا بطن', 'عظيم', 'غليظ', 'خفيف الجسم',
  'خفيف اللحم', 'حسن الجسم', 'لطيف', 'مسترق الوركين', 'عبل الذراعين', 'رحب الصدر', 'بعيد ما بين المنكبين',
  'عظيم الكراديس', 'شثن الأصابع', 'مدملك', 'بض', 'ذا هامة', 'صغير الرأس',
  // hair
  'جعد', 'قطط', 'أصلع', 'شديد الصلع', 'أشعر الرأس', 'أشعر', 'كثير الشعر', 'كث اللحية', 'كبير اللحية', 'عظيم اللحية',
  'خفيف اللحية', 'خفيف العارضين', 'حسن اللحية', 'أشيب', 'أشعث الرأس', 'محلوق', 'ذا ضفيرتين', 'له ضفيرتان', 'له عقيصتان',
  'يخضب بالحناء والكتم', 'يخضب بالصفرة', 'يخضب بالسواد', 'يخضب', 'لا يغير شيبه', 'لا يغير شعره',
  // face
  'حسن الوجه', 'أحسن الناس وجها', 'معروق الوجه', 'غائر العينين', 'عظيم العينين', 'ناتئ الجبهة', 'مقرون الحاجبين',
  'أعين', 'أقلص الشفتين', 'حسن الثغر', 'مرادف الأسنان', 'أفرق الثنيتين', 'ساقط الثنيتين', 'أهتم', 'مهتوم', 'أثط',
  'أوقص', 'أعور', 'ضرير', 'أعسر', 'أعرج',
  // beauty and bearing
  'جميل', 'جميلة', 'حسن', 'وسيم', 'مليح', 'بديع الحسن', 'كامل الجمال', 'بديع الجمال', 'من أجمل الرجال', 'من أجمل النساء', 'أجمل الصحابة',
  'من أطول الرجال', 'من أعظم الناس',
  'مهيب', 'وقور', 'جلد', 'صيت', 'لين',
];

/** A word as matched: no vowels or tatweel, no accusative alif at its end («نحيفا» → «نحيف»). */
const plain = (word: string) => {
  const bare = unmarked(word);
  return bare.length > 2 && bare.endsWith('ا') && !/^(?:لا|ولا|ذا)$/u.test(bare) ? bare.slice(0, -1) : bare;
};

const PHRASES = TRAITS.map(label => ({ label, words: label.split(' ').map(plain) }))
  .sort((a, b) => b.words.length - a.words.length);

/** Words that deny what follows them («ليس بجعد قطط»): a trait right after one is not his, unless the trait says so itself. */
const NOT = /^(?:ليس|لا|ولا|ليست)$/u;

export type TraitSpan = { start: number; end: number; label: string };

/** Where the book's looks words stand in one sentence, longest first; a word in a clause that denies it is left out. */
export function traitSpans(text: string): TraitSpan[] {
  const words = [...text.matchAll(/[^\s،؛.,:\-()«»]+/gu)].map(hit => ({ start: hit.index!, end: hit.index! + hit[0].length, word: plain(hit[0]) }));
  // A clause begins after «،», «؛», «.», or a dash.
  const clause = words.map((_, i) => (i === 0 || /[،؛.\-]/u.test(text.slice(words[i - 1].end, words[i].start)) ? i : -1));
  for (let i = 1; i < clause.length; i++) if (clause[i] < 0) clause[i] = clause[i - 1];
  const out: TraitSpan[] = [];
  for (let i = 0; i < words.length;) {
    // A phrase that opens with «لا» also reads after a joined «و» («ولا يغير شعره»).
    const hit = PHRASES.find(phrase => phrase.words.every((w, k) => words[i + k]?.word === w || (k === 0 && w === 'لا' && words[i]?.word === 'ولا')));
    if (!hit) { i++; continue; }
    // «ولا آدم», «ليس بجعد قطط»: the denial right before it, or before a «ب» word it follows.
    const before = words.slice(clause[i], i).map(w => w.word).reverse();
    const denied = !NOT.test(hit.words[0]) && (NOT.test(before[0] ?? '') || (/^ب/u.test(before[0] ?? '') && NOT.test(before[1] ?? '')));
    if (!denied) out.push({ start: words[i].start, end: words[i + hit.words.length - 1].end, label: hit.label });
    i += hit.words.length;
  }
  return out;
}

/**
 * The chips of a person's looks: each of the book's words once, in the order the sentences give them, with every
 * named sayer who gives it. `by` is the sayer to show for a sentence, or nothing when the book does not name him
 * («وقيل»): an unnamed sentence lights its words in its text but names no one under a chip, and is not a second voice.
 */
export function traitChips<F extends { text: string }>(facts: F[], by: (fact: F) => string | undefined) {
  const chips = new Map<string, string[]>();
  for (const fact of facts) {
    const sayer = by(fact);
    for (const span of traitSpans(fact.text)) {
      const names = chips.get(span.label) ?? [];
      if (sayer && !names.includes(sayer)) names.push(sayer);
      chips.set(span.label, names);
    }
  }
  return [...chips].map(([label, names]) => ({ label, names, agreed: names.length > 1 }));
}
