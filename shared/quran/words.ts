import { holdsWord, normalizeWord } from './normalize';

// see docs/plans/word-counts-app.md
export type WordsData = {
  lemmas: [name: string, count: number, root: string][];
  ayat: string[][];
};

export const WORDS_SOURCE = 'quranic-arabic-corpus';

export const WORDS_COUNTING = [
  'تُعدّ الكلمة بمدخلها المعجمي في المدوّنة القرآنية العربية، فـ«والله» و«لله» تحت «ٱللَّه». وأعدادنا تطابق أعدادها.',
  'لا تُعدّ الحروف المتصلة بالكلمة كالواو والفاء والباء واللام وأل، ولا الضمائر المنفصلة كـ«هو» و«هم»، ولا الحروف المقطعة في أوائل السور. والبسملة تُعدّ مرة واحدة، في الفاتحة.',
  'وإذا اتفقت كلمتان في الرسم واختلفتا في المعنى عُدّت كل منهما وحدها، وبجانبها ما يميّزها، مثل «عصا» و«عصى».',
];

export type WordPlace = { key: string; words: number[] };

export function lemmasOfWord(data: WordsData, key: string, word: number): number[] {
  const [surah, ayah] = key.split(':').map(Number);
  const entry = data.ayat[surah - 1]?.[ayah - 1]?.split(' ')[word];
  return entry ? entry.split('+').map(Number) : [];
}

const indexes = new WeakMap<WordsData, WordPlace[][]>();

export function placesOf(data: WordsData, id: number): WordPlace[] {
  let index = indexes.get(data);
  if (!index) {
    const built: WordPlace[][] = data.lemmas.map(() => []);
    data.ayat.forEach((surah, s) => surah.forEach((text, a) => {
      const key = `${s + 1}:${a + 1}`;
      text.split(' ').forEach((entry, word) => {
        if (!entry) return;
        for (const lemma of entry.split('+').map(Number)) {
          const places = built[lemma];
          const last = places[places.length - 1];
          if (last?.key === key) last.words.push(word);
          else places.push({ key, words: [word] });
        }
      });
    }));
    indexes.set(data, (index = built));
  }
  return index[id] ?? [];
}

export const SURAHS = 114;

export function countsBySurah(places: WordPlace[]): number[] {
  const counts = new Array<number>(SURAHS).fill(0);
  for (const { key, words } of places) counts[Number(key.split(':')[0]) - 1] += words.length;
  return counts;
}

export function searchWords(data: WordsData, query: string, limit: number): number[] {
  const needle = normalizeWord(query.trim());
  if (!needle) return [];
  const found: number[] = [];
  for (let id = 0; id < data.lemmas.length && found.length < limit; id++) {
    if (holdsWord(normalizeWord(data.lemmas[id][0]), needle)) found.push(id);
  }
  return found;
}

const SPACING: Record<string, { at: number; mushaf: 'two' | 'one' }> = {
  '2:181': { at: 2, mushaf: 'two' },
  '8:6': { at: 3, mushaf: 'two' },
  '13:37': { at: 7, mushaf: 'two' },
  '37:130': { at: 2, mushaf: 'two' },
  '15:7': { at: 0, mushaf: 'one' },
  '27:20': { at: 3, mushaf: 'one' },
  '36:22': { at: 0, mushaf: 'one' },
};

export function corpusWords(key: string, mushafWord: number): number[] {
  const spacing = SPACING[key];
  if (!spacing || mushafWord < spacing.at) return [mushafWord];
  if (spacing.mushaf === 'two') return [mushafWord <= spacing.at + 1 ? spacing.at : mushafWord - 1];
  return mushafWord === spacing.at ? [spacing.at, spacing.at + 1] : [mushafWord + 1];
}

export function mushafWords(key: string, corpusWord: number): number[] {
  const spacing = SPACING[key];
  if (!spacing || corpusWord < spacing.at) return [corpusWord];
  if (spacing.mushaf === 'two') return corpusWord === spacing.at ? [spacing.at, spacing.at + 1] : [corpusWord + 1];
  return [corpusWord <= spacing.at + 1 ? spacing.at : corpusWord - 1];
}

export const mushafPlacesOf = (data: WordsData, id: number): WordPlace[] =>
  placesOf(data, id).map(({ key, words }) => ({ key, words: [...new Set(words.flatMap(word => mushafWords(key, word)))] }));

export const lemmasAtMushafWord = (data: WordsData, key: string, mushafWord: number) =>
  [...new Set(corpusWords(key, mushafWord).flatMap(word => lemmasOfWord(data, key, word)))];
