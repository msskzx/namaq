/**
 * Sorts one word position of the Quranpedia qira'at dump into readings that differ in letters or vowels (farsh),
 * setting aside differences of performance: elongation, imala, merging, sila of the plural mim, hamza treatment.
 * docs/plans/quran-qiraat.md has the rules and what they leave out.
 */
export type DumpReading = { text: string; rawis: number[] };
export type FarshGroup = { text: string; rawis: number[] };
export type FarshResult = { kind: 'usul' } | { kind: 'unclear'; reason: string } | { kind: 'farsh'; groups: FarshGroup[] };

const HARAKA = /[\u064B-\u0650\u08F0-\u08F2]/;
const SUKUN = /[\u0652\u06E1]/;
const HAMZA = /[ءأإآؤئ]/;
const OPEN_TANWEEN: Record<string, string> = { '\u08F0': '\u064B', '\u08F1': '\u064C', '\u08F2': '\u064D' };

/** The written form a reading quotes: the words in brackets, or the opening words up to the first vocalized one. */
export function readingForm(text: string): string | null {
  const bracket = text.match(/\(+([^()]*)\)/);
  if (bracket?.[1].trim()) return bracket[1].trim();
  const tokens = text.trim().split(/\s+/).slice(0, 3);
  const end = tokens.findIndex(t => HARAKA.test(t) || /[\u0651\u0652]/.test(t));
  return end < 0 ? null : tokens.slice(0, end + 1).join(' ');
}

type Letter = { ch: string; vowel?: string; shadda: boolean };
type Word = { letters: Letter[]; vocalized: boolean };

// The article's alif is never read inside a phrase, and naql drops the hamza after its lam (والأنصار/وَلَنصار، الآن/لاَن).
const article = (word: string) => word.replace(/^([وفبك]?)[اٱ](?=ل)/, '$1').replace(/^([وفبك]?ل[\u0652\u06E1\u064E]?)[أإاآ]/, '$1');

function parseWord(raw: string, index: number): Word {
  const text = article(raw.normalize('NFC').replace(/\u0670/g, 'ا').replace(/[\u0654\u0655]/g, 'ء').replace(/[\u0640\u200f\u200e]/g, ''));
  const letters: Letter[] = [];
  let skipMarks = false;
  const chars = [...text];
  for (const [i, ch] of chars.entries()) {
    if (/[\u0621-\u064A\u0671]/.test(ch)) {
      skipMarks = false;
      // An alif let in between two hamzas (أَآئِفكا) is performance.
      if (letters.length === 1 && letters[0].ch === 'ء' && /[اآ]/.test(ch) && HAMZA.test(chars.slice(i + 1).find(c => /[\u0621-\u064A]/.test(c)) ?? '')) continue;
      // A word's opening hamza keeps its vowel (إنّ/أنّ).
      if (!letters.length && /[اأإآٱء]/.test(ch)) {
        letters.push({ ch: 'ء', shadda: false, vowel: ch === 'إ' ? '\u0650' : undefined });
        skipMarks = ch !== 'أ' && ch !== 'إ' && ch !== 'ء';
        continue;
      }
      // Inside a word, tahqiq, tashil, ibdal and naql of hamza are performance (يأتي/ياتي، أفرءيت/أفرآيت، قُلَ اْنتم):
      // hamza becomes the letter of its seat, bare hamza an alif, and the vowel before it and on it are not compared.
      let base = ch;
      if (HAMZA.test(ch)) {
        letters.at(-1) && (letters[letters.length - 1].vowel = undefined);
        base = ch === 'ؤ' ? 'و' : ch === 'ئ' ? 'ي' : 'ا';
        skipMarks = true;
      }
      if (ch === 'ٱ') base = 'ا';
      if (ch === 'ى') base = 'ي';
      if (ch === 'ة') base = 'ه';
      if (base === 'ا' && letters.at(-1)?.ch === 'ا') continue;
      letters.push({ ch: base, shadda: false });
      continue;
    }
    const last = letters.at(-1);
    if (!last || skipMarks) continue;
    if (letters.length === 1 && last.ch === 'ء' && !/[\u064E-\u0650]/.test(ch)) continue;
    if (ch === '\u0651') last.shadda = true;
    else if (HARAKA.test(ch)) last.vowel = OPEN_TANWEEN[ch] ?? ch;
    else if (SUKUN.test(ch)) last.vowel = '\u0652';
  }
  // A shadda on a word's first letter is merging across words: performance.
  if (index > 0 && letters[0]) letters[0].shadda = false;
  // Sila or silence of the plural mim (عليهمُ، عليهمْ) and the vowel of its ha after ya (عليهُم/عليهِم) are performance.
  const last = letters.at(-1);
  if (last?.ch === 'م' && /[هكت]/.test(letters.at(-2)?.ch ?? '')) last.vowel = undefined;
  for (let i = 1; i < letters.length - 1; i++) {
    if (letters[i].ch === 'ه' && letters[i - 1].ch === 'ي' && /[من]/.test(letters[i + 1].ch)) letters[i].vowel = undefined;
  }
  // So are the vowels of a final هم before a silent letter (يومهِمِ/يومهُمُ) and of a short particle's last letter
  // (أنِ/أنُ اعبدوا).
  if (letters.length > 2 && last?.ch === 'م' && letters.at(-2)?.ch === 'ه') letters[letters.length - 2].vowel = undefined;
  if (letters.length <= 2 && last) last.vowel = undefined;
  return { letters, vocalized: [...text].some(ch => HARAKA.test(ch) || ch === '\u0651') };
}

function parse(form: string): Word[] {
  const raw = form.split(/\s+/).filter(w => /[\u0621-\u064A\u0671]/.test(w));
  const words = raw.map(parseWord);
  // Naql across words: the last letter before a word that opens with hamza takes its vowel.
  raw.forEach((w, i) => { if (i && HAMZA.test(w.normalize('NFC')[0]) && words[i - 1].letters.length) words[i - 1].letters.at(-1)!.vowel = undefined; });
  return words;
}

function sameLetters(a: Letter[], b: Letter[], strictShadda: boolean): boolean {
  // Naql leaves a word with no hamza and a silent first letter (من أجل/مِنَ جْل).
  if (a[0]?.ch === 'ء' && b[0]?.ch !== 'ء' && b[0]?.vowel === '\u0652') return sameLetters(a.slice(1), b, strictShadda);
  if (b[0]?.ch === 'ء' && a[0]?.ch !== 'ء' && a[0]?.vowel === '\u0652') return sameLetters(a, b.slice(1), strictShadda);
  // A ya at the end that one reading keeps and the other drops (الداعِ/الداعي، اتبعونِ/اتبعوني) is ya' zawa'id: performance.
  if (Math.abs(a.length - b.length) === 1) {
    const [long, short] = a.length > b.length ? [a, b] : [b, a];
    if (long.at(-1)?.ch === 'ي' && short.length > 1) return sameLetters(long.slice(0, -1), short.map((l, i) => (i === short.length - 1 ? { ...l, vowel: undefined } : l)), strictShadda);
  }
  if (a.length !== b.length) return false;
  return a.every((x, i) => {
    const y = b[i];
    // The vowel of a final ya (إنّيَ/إنّي) is ya' idafa, and a word's opening hamza read as و or ي (السفهاء ولا) is
    // ibdal between two hamzas: both performance.
    if (i === a.length - 1 && x.ch === 'ي' && y.ch === 'ي') return true;
    if (i === 0 && x.ch !== y.ch && (x.ch === 'ء' || y.ch === 'ء') && /[وي]/.test(x.ch + y.ch)) return true;
    if (x.ch !== y.ch) return false;
    // A silent ذ ث د ت ط ظ merged into the ت د ط after it (اتخذْتم/اتخذتّم، عذت) is performance; other doubled letters
    // (اسطّاعوا، هاتينّ) are farsh.
    const silent = (l: Letter) => !l.vowel || l.vowel === '\u0652';
    const merged = i > 0 && /[ذثدتطظ]/.test(a[i - 1].ch) && /[تدط]/.test(x.ch) && silent(a[i - 1]) && silent(b[i - 1]) && (a[i - 1].vowel ?? b[i - 1].vowel) === '\u0652';
    if (strictShadda && x.shadda !== y.shadda && i > 0 && !merged) return false;
    return !x.vowel || !y.vowel || x.vowel === y.vowel;
  });
}

/** With merging (لبثت/لبتّ), a letter that disappears into a doubled letter after it is not a difference. */
function sameWord(a: Word, b: Word, merging: boolean): boolean {
  const strictShadda = a.vocalized && b.vocalized;
  if (sameLetters(a.letters, b.letters, strictShadda)) return true;
  if (!merging || Math.abs(a.letters.length - b.letters.length) !== 1) return false;
  const [long, short] = a.letters.length > b.letters.length ? [a.letters, b.letters] : [b.letters, a.letters];
  return long.some((_, i) => short[i]?.shadda && sameLetters([...long.slice(0, i), ...long.slice(i + 1)].map((l, k) => (k === i ? { ...l, shadda: true } : l)), short, false));
}

/** Two forms agree when their shared opening words agree; an extra word of context on one side is not a difference. */
export function sameForm(a: string, b: string, merging = false): boolean {
  const x = parse(a);
  const y = parse(b);
  const n = Math.min(x.length, y.length);
  if (!n) return false;
  for (let i = 0; i < n; i++) if (!sameWord(x[i], y[i], merging)) return false;
  return true;
}

const MERGING = /[اإ]دغام/;

export function farshGroups(readings: DumpReading[]): FarshResult {
  const forms = readings.map(r => readingForm(r.text));
  const known = forms.filter((f): f is string => !!f);
  const merging = readings.filter((_, i) => forms[i]).map(r => MERGING.test(r.text));
  if (!known.length) return { kind: 'usul' };
  const parent = known.map((_, i) => i);
  const root = (i: number): number => (parent[i] === i ? i : (parent[i] = root(parent[i])));
  for (let i = 0; i < known.length; i++) {
    for (let j = i + 1; j < known.length; j++) if (sameForm(known[i], known[j], merging[i] || merging[j])) parent[root(i)] = root(j);
  }
  const roots = [...new Set(known.map((_, i) => root(i)))];
  if (roots.length === 1) return { kind: 'usul' };
  if (forms.some(f => !f)) return { kind: 'unclear', reason: 'a reading quotes no word while others differ' };
  for (const r of roots) {
    const members = known.map((_, i) => i).filter(i => root(i) === r);
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        if (!sameForm(known[members[i]], known[members[j]], merging[members[i]] || merging[members[j]])) return { kind: 'unclear', reason: `«${known[members[i]]}» and «${known[members[j]]}» fall in one group without matching` };
      }
    }
  }
  const groups = roots.map(r => {
    const idx = known.map((_, i) => i).filter(i => root(i) === r);
    const rawis = [...new Set(idx.flatMap(i => readings[i].rawis))].sort((a, b) => a - b);
    const best = idx.reduce((p, i) => (readings[i].rawis.length > readings[p].rawis.length ? i : p), idx[0]);
    return { text: known[best], rawis };
  });
  return { kind: 'farsh', groups };
}
