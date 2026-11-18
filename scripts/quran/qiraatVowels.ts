import { sameForm } from './qiraatFarsh';

/**
 * Build step only: gives each reading of qiraat.json its full tashkeel at the source. Quranpedia's dump writes many
 * readings with only the vowels that differ (يُكَذِّبون، عليهُمۡ) or none (يعملون). A reading that one of the seven riwayat
 * printed by the King Fahd Complex reads is copied whole from that riwaya's text; the rest are vowelled by hand in
 * qiraatVowels.json, each checked by a second reviewer against the dump's own description of the reading. A hand entry
 * «KEEP: why» leaves a reading the letters cannot write (ishmam) as the dump describes it.
 */

// A vowel or sukun: the harakat and tanween, the page's sukun ۡ and open tanween ٗ ٞ ٖ, and ۟ on a letter not read. The
// dagger alif, madda and pause signs are not vowels (ذٰلِك، بِهۦ).
const VOWEL = /[ً-ِْٖۡٗٞ۟]/;
const LETTER = /[ء-ؿف-يٱ]/;
// Letters that merge into a doubled letter after them and are then written bare (ٱلشَّمۡس، قَد تَّبَيَّنَ، مِن نِّعۡمَة، نَخۡلُقكُّم).
const MERGES = /[لنتدذطظثمق]/;
// Before these the ن is said clearly and carries its sukun.
const THROAT = /[ءأإآؤئهعحغخ]/;
/**
 * Every letter carries its vowel or sukun, except where the Madina page writes none: alif (ا آ ٱ) and alif maqsura, a madd
 * و or ي after its vowel (and the و before a silent alif, قَالُواْ ٱتَّقَواْ), a letter merged into the doubled letter after
 * it (the ل of ٱلشَّمۡس), the hidden ن, and a word's last letter read into the next word (قُل رَّبِّ). The reading's own
 * last letter is always marked (يَعۡمَلُون is not).
 */
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
      // A و or ي written for an alif (ٱلصَّلَوٰةَ), and an alif's hamza with its madda (ٱلۡأٓخِرَةِ).
      if ((/[وي]/.test(ch) && marks.includes('ٰ')) || (ch === 'أ' && marks.includes('ٓ'))) return true;
      const before = k ? marksAfter(letters[k - 1]) : '';
      if ((ch === 'و' && before.includes('ُ')) || (ch === 'ي' && before.includes('ِ'))) return true;
      // The reading's last letter may be hidden in or merged into the next word (أَن، يُنجِيكُم مِّن، قُل لَّآ), but not the ن of
      // a plural or dual (يعملون).
      if (k === letters.length - 1) return w < words.length - 1 || (MERGES.test(ch) && !(ch === 'ن' && /[اوي]/.test(chars[letters[k - 1]] ?? '')));
      const next = chars[letters[k + 1]];
      if (ch === 'ن' && !THROAT.test(next)) return true;
      if (ch === 'و' && next === 'ا') return true;
      return MERGES.test(ch) && marksAfter(letters[k + 1]).includes('ّ');
    });
  });
}

/**
 * The King Fahd riwayat written in the Madina page's conventions, most like Hafs first. Qalun and Warsh are left out: their
 * texts follow the Maghribi mushaf (ے for a final ya, ْ for sukun), which the page's font does not draw the same way.
 */
const PREFERRED = [9, 5, 6, 3, 4];

/**
 * A riwaya's word as the page writes it: the wasl alif ٱ (those texts write it اَ۬), its open tanween ٗ ٞ ٖ, and no marks
 * of performance (imala ۪, tashil ۬ or a dotless seat ٮ, the sila of a plural mim), which the readings leave to their usul.
 */
export const pageForm = (word: string) => word.replace(/‏/g, '').replace(/ا[َ-ِ]۬/g, 'ٱ')
  // Al-Bazzi's and Qunbul's eased hamza: a dotless seat whose ۪ is its kasra (أَٮ۪نَّكُمۡ), and the sila of a plural mim.
  .replace(/ٮ۪/g, 'ئِ').replace(/ٮ/g, 'ئ').replace(/مُۥ$/, 'مۡ')
  .replace(/[۪۬]/g, '')
  .replace(/ࣰ/g, 'ٗ').replace(/ࣱ/g, 'ٞ').replace(/ࣲ/g, 'ٖ');

/**
 * The reading as a riwaya of its group prints it, or null. `others` are the word's other readings: the copy must match
 * this reading and none of them, so a vowel the dump left out cannot pick another reading's word.
 */
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
    // A phrase that runs in from the ayah before (the Susi's «الرحيم مالك») starts in that ayah's words.
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
