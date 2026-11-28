import { sameForm } from './qiraatFarsh';

const VOWEL = /[ً-ِْٖۡٗٞ۟]/;
const LETTER = /[ء-ؿف-يٱ]/;
const MERGES = /[لنتدذطظثمق]/;
const THROAT = /[ءأإآؤئهعحغخ]/;
export function fullyVowelled(text: string): boolean {
  const words = text.normalize('NFC').trim().split(/\s+/);
  return words.every((word, w) => {
    const chars = [...word];
    const marksAfter = (i: number) => { let m = ''; for (let j = i + 1; j < chars.length && !LETTER.test(chars[j]); j++) m += chars[j]; return m; };
    const letters = chars.map((ch, i) => i).filter(i => LETTER.test(chars[i]));
    return letters.every((i, k) => {
      const ch = chars[i];
      const marks = marksAfter(i);
      if (VOWEL.test(marks) || /[اآىٱ]/.test(ch)) return true;
      if ((/[وي]/.test(ch) && marks.includes('ٰ')) || (ch === 'أ' && marks.includes('ٓ'))) return true;
      const before = k ? marksAfter(letters[k - 1]) : '';
      if ((ch === 'و' && before.includes('ُ')) || (ch === 'ي' && before.includes('ِ'))) return true;
      if (k === letters.length - 1) return w < words.length - 1 || (MERGES.test(ch) && !(ch === 'ن' && /[اوي]/.test(chars[letters[k - 1]] ?? '')));
      const next = chars[letters[k + 1]];
      if (ch === 'ن' && !THROAT.test(next)) return true;
      if (ch === 'و' && next === 'ا') return true;
      return MERGES.test(ch) && marksAfter(letters[k + 1]).includes('ّ');
    });
  });
}

const PREFERRED = [9, 5, 6, 3, 4];

export const pageForm = (word: string) => word.replace(/‏/g, '').replace(/ا[َ-ِ]۬/g, 'ٱ')
  .replace(/ٮ۪/g, 'ئِ').replace(/ٮ/g, 'ئ').replace(/مُۥ$/, 'مۡ')
  .replace(/[۪۬]/g, '')
  .replace(/ࣰ/g, 'ٗ').replace(/ࣱ/g, 'ٞ').replace(/ࣲ/g, 'ٖ');

export function officialForm(
  reading: string,
  rawis: number[],
  others: string[],
  official: Map<number, Map<string, string[]>>,
  key: string,
  at: number,
): { text: string; rawi: number } | null {
  const [surah, ayah] = key.split(':').map(Number);
  const n = reading.trim().split(/\s+/).length;
  for (const rawi of PREFERRED.filter(r => rawis.includes(r))) {
    const text = official.get(rawi);
    const own = text?.get(key);
    if (!own) continue;
    const before = text!.get(`${surah}:${ayah - 1}`) ?? [];
    const words = [...before, ...own];
    const hits = words.map((_, i) => i).filter(i => i + n <= words.length)
      .filter(i => { const span = words.slice(i, i + n).join(' '); return sameForm(span, reading) && !others.some(o => sameForm(span, o)); });
    if (!hits.length) continue;
    const near = hits.reduce((best, i) => (Math.abs(i - before.length - at) < Math.abs(best - before.length - at) ? i : best));
    return { text: words.slice(near, near + n).map(pageForm).join(' '), rawi };
  }
  return null;
}
