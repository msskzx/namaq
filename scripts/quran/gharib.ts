// docs/plans/alfaz-al-quran.md: Ibn Qutaybah's «تفسير غريب القرآن» and al-Raghib's «المفردات», from Turath's exports of
// Shamela 3259 and 23636. Only the authors' text: the editors' footnotes (below «_________») and note calls are dropped.
import { same, skeleton } from './irabUkbari';
import { firstWords, placesOf, type MushafWord, type TurathPage } from './itqanBalagha';
import type { GharibEntry, GharibPlace, MufradatEntry } from '../../shared/quran/gharib';

export { firstWords, type MushafWord, type TurathPage };

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const number = (text: string) => Number([...text].map(c => ARABIC_DIGITS.indexOf(c)).join(''));

/** The author's words of a page: no editor's notes, no note calls, no tags. */
export const authorText = (text: string) =>
  text.split('_________')[0]
    .replace(/<span data-type="title"[^>]*>([^<]*)<\/span>/g, '\n$1\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s*\(\s*[٠-٩]+\s*\)/g, '')
    .replace(/\s*«\s*[٠-٩]+\s*»/g, '')
    .replace(/[ \t]+([.،؛:])/g, '$1')
    .normalize('NFC');

/** A line that opens an entry: «١٤- …», «١-٢- …», «﴿…﴾ …», «و﴿…﴾ …». */
const NUMBERED = /^([٠-٩]+)(?:\s*-\s*([٠-٩]+))?\s*-\s*/;
const OPENS = /^(?:و\s*)?[﴿(]/;
const SURAH = /^سُ?ورة\s/;

export type RawEntry = { surah: number; from: number; to: number; numbered: boolean; page: number; id: number; text: string };

/**
 * Ibn Qutaybah's entries in surah order, from the first surah's page on. Each opens on a line with an ayah number or a quote
 * and runs on over the lines after it (his further explanation, a line of verse) until the next one opens. `from`/`to` are
 * the ayah numbers he writes, carried on to an entry that writes none.
 */
export function readGharib(pages: (TurathPage & { id: number })[]): RawEntry[] {
  const entries: RawEntry[] = [];
  let surah = 0;
  let from = 0;
  let to = 0;
  for (const page of pages) {
    for (const raw of authorText(page.text).split('\n')) {
      const line = raw.trim();
      if (!line || /^\*(\s*\*)*$/.test(line)) continue;
      if (SURAH.test(line)) { surah++; from = to = 0; continue; }
      if (!surah) continue;
      const head = line.match(NUMBERED);
      if (head) {
        from = number(head[1]);
        to = head[2] ? number(head[2]) : from;
        entries.push({ surah, from, to, numbered: true, page: page.page, id: page.id, text: line });
      } else if (OPENS.test(line) && entries.length) {
        entries.push({ surah, from, to, numbered: false, page: page.page, id: page.id, text: line });
      } else if (entries.length && entries.at(-1)!.surah === surah) {
        entries.at(-1)!.text += `\n${line}`;
      }
    }
  }
  return entries;
}

/** The Quran an entry quotes: ﴿…﴾, and a word in parentheses where he writes it so («٣١- و (الأَبُّ) المَرْعَى»). */
export function quotesOf(text: string): string[] {
  const line = text.split('\n')[0];
  const marked = [...line.matchAll(/﴿([^﴾]*)﴾/g)].map(match => match[1]);
  if (marked.length) return marked.flatMap(quote => quote.split('*').map(part => part.trim()).filter(Boolean));
  const paren = line.replace(NUMBERED, '').match(/^(?:و\s*)?\(([^)]+)\)/);
  return paren ? [paren[1]] : [];
}

/** A word with no leading و، ف or article: he often names a word as «الصَّيِّبُ» where the ayah has «كَصَيِّبٖ». */
const loose = (word: string) => word.replace(/^[وف](?=..)/, '').replace(/^[بكل]?ال(?=..)/, '').replace(/^[بكل](?=...)/, '');

/** Where his quote runs in one ayah, loosely: words without prefixes, and two of his words may be one of the mushaf's
 * («هَا أَنْتُمْ» for «هَٰٓأَنتُمۡ»). */
function looseRun(quote: string[], ayah: MushafWord[]): [number, number] | null {
  const want = quote.map(loose);
  if (!want.length) return null;
  for (let start = 0; start < ayah.length; start++) {
    let i = 0;
    let j = start;
    while (i < want.length && j < ayah.length) {
      const have = loose(ayah[j].skeleton);
      if (want[i] === have) i++;
      else if (i + 1 < want.length && want[i] + want[i + 1] === have) i += 2;
      else break;
      j++;
    }
    if (i === want.length) return [ayah[start].at, ayah[j - 1].at];
  }
  return null;
}

/**
 * Where an entry's quotes stand: in its surah, on the ayah he numbers (or within his range); an entry with no number of
 * its own takes the nearest place at or after the ayah before it. A quote that is not word for word in the mushaf is looked
 * for loosely in those ayat. An entry he numbers whose quote is still not found stands on his ayah with no words lit
 * ([ayah, -1, -1]); any other is left out.
 */
export function placeEntry(entry: RawEntry, mushaf: MushafWord[], first: Map<string, number[]>, after: number): GharibPlace[] {
  const places: GharibPlace[] = [];
  const add = (ayah: number, from: number, to: number) => {
    const run = places.find(place => place[0] === ayah && place[2] === from - 1);
    if (run) run[2] = to;
    else places.push([ayah, from, to]);
  };
  const ayahWords = (ayah: number) => mushaf.filter(word => word.surah === entry.surah && word.ayah === ayah);
  let floor = after;
  for (const quote of quotesOf(entry.text)) {
    const tokens = quote.replace(/[^ء-ۭ\s]/g, ' ').split(/\s+/).map(skeleton).filter(Boolean);
    const starts = placesOf(quote, mushaf, first).filter(start => mushaf[start].surah === entry.surah);
    const inRange = starts.filter(start => mushaf[start].ayah >= entry.from && mushaf[start].ayah <= entry.to);
    const later = starts.filter(start => mushaf[start].ayah >= floor).sort((a, b) => a - b);
    const start = entry.numbered ? inRange[0] : later[0] ?? (starts.length === 1 ? starts[0] : undefined);
    if (start !== undefined) {
      for (let j = 0; j < tokens.length; j++) {
        const word = mushaf[start + j];
        if (!word || word.surah !== entry.surah) break;
        add(word.ayah, word.at, word.at);
      }
      floor = mushaf[start].ayah;
      continue;
    }
    const near = entry.numbered ? Array.from({ length: entry.to - entry.from + 1 }, (_, i) => entry.from + i) : floor ? [floor, floor + 1, floor + 2] : [];
    for (const ayah of near) {
      const run = looseRun(tokens, ayahWords(ayah));
      if (run) { add(ayah, run[0], run[1]); floor = ayah; break; }
    }
  }
  if (!places.length && entry.numbered && ayahWords(entry.from).length) places.push([entry.from, -1, -1]);
  return places;
}

export const gharibEntry = (entry: RawEntry, places: GharibPlace[]): GharibEntry => [entry.surah, entry.page, entry.id, entry.text, places];

/**
 * Al-Raghib's articles, each under his own heading, with its pages. The export marks a heading as a title, but some titles
 * fall inside a running word («فلان م[أخ]وذ») and some headings are plain lines: a heading is a line that is a title or two to
 * six letters alone; a title inside a line is text. The book's divisions («كتاب الألف») open the articles; the editor's
 * introduction before them and his indexes after «مقدّمة للفهارس» are left out.
 */
export function readMufradat(pages: (TurathPage & { id: number })[]): MufradatEntry[] {
  const entries: MufradatEntry[] = [];
  let started = false;
  let ended = false;
  for (const page of pages) {
    for (const raw of page.text.split('_________')[0].split('\n')) {
      const line = raw.trim();
      const title = line.match(/^(?:<span data-type="title"[^>]*>)+([^<]*)(?:<\/span>)+\s*(?:«[٠-٩]+»)?$/)?.[1].trim();
      const plain = line.replace(/<[^>]+>/g, '').trim().normalize('NFC');
      const heading = title?.normalize('NFC') ?? (/^[ء-ي\u064B-\u0652\u0670]{2,6}$/.test(plain) ? plain : undefined);
      if (heading) {
        if (/^كتاب\s/.test(heading)) { started = true; continue; }
        if (/^مقدّمة للفهارس/.test(heading)) ended = true;
        if (started && !ended) entries.push([heading, page.page, page.page, page.id, '']);
        continue;
      }
      if (!started || ended || !entries.length) continue;
      const text = authorText(line.replace(/<[^>]+>/g, '')).replace(/^[٠-٩]+\s*-\s*$/, '').trim();
      if (!text) continue;
      const last = entries.at(-1)!;
      // An ayah's reference («[النبأ/ ١٤]») stands on its own line after the quote: it joins the quote's line.
      last[4] = last[4] ? `${last[4]}${text.startsWith('[') ? ' ' : '\n'}${text}` : text;
      last[2] = page.page;
    }
  }
  return entries.filter(entry => entry[4]);
}

/** A heading's letters for matching: no marks, hamza seats as one. */
export const letters = (text: string) => text.normalize('NFC').replace(/[ً-ٰٟۖ-ۭ]/g, '').replace(/[أإآٱؤئء]/g, 'ء').replace(/ى/g, 'ي');

/**
 * The headings a Quranic Arabic Corpus root (in Arabic letters) can stand under: the root itself or a doubled last letter
 * written once (ثجج → ثج); failing those, a weak letter written as alif (ءبو → ءبا، كون → كان); failing those, a weak last
 * letter dropped (يدي → يد). All headings at the first spelling that fits are returned; the build keeps a word's link only
 * when there is one.
 */
export function headingsFor(root: string, headings: Map<string, number[]>): number[] {
  // The corpus writes a hamza in a root as alif.
  const r = letters(root).replace(/ا/g, 'ء');
  const weakLast = r.length === 3 && /[وي]/.test(r[2]);
  // Closest spelling first: the first of these that names any heading decides.
  const tiers: string[][] = [
    [r, ...(r.length === 3 && r[1] === r[2] ? [r.slice(0, 2)] : [])],
    // A و-root's alif, a ي-root's ya: not the other, since نسو (women) is not نسى (forgetting).
    [...(weakLast ? (r[2] === 'و' ? [`${r.slice(0, 2)}ا`, `${r.slice(0, 2)}و`] : [`${r.slice(0, 2)}ي`]) : []), ...(r.length === 3 && /[وي]/.test(r[1]) ? [`${r[0]}ا${r[2]}`] : [])],
    weakLast ? [r.slice(0, 2)] : [],
  ];
  for (const forms of tiers) {
    const found = [...new Set(forms.flatMap(form => headings.get(form) ?? []))];
    if (found.length) return found;
  }
  return [];
}

export { same };

/** One question of «ما معنى؟»: the entry asked, and the three entries whose meanings are offered beside its own. */
export type MeaningPick = { asked: number; others: [number, number, number] };

/** What he says a quoted word means, when it is one short explanation of his own on the entry's first line: the words after
 * the quote, with no second quote, no second opinion (يقال، قيل), no report (قال), no pointer to another book or place, and no
 * editor's [addition]. */
export function meaningOf(entry: { text: string; places: GharibPlace[] }): string | null {
  if (entry.text.includes('\n') || entry.places.length !== 1 || entry.places[0][1] < 0) return null;
  const line = entry.text.replace(NUMBERED, '');
  const quote = line.match(/^(?:و\s*)?(?:﴿[^﴾]*﴾|\([^)]*\))\s*:?\s*/);
  if (!quote) return null;
  if (quote[0].replace(/[^ء-ۭ\s]/g, ' ').trim().split(/\s+/).length > 3) return null;
  const meaning = line.slice(quote[0].length).trim();
  const words = meaning.split(/\s+/).filter(Boolean);
  if (!words.length || words.length > 8) return null;
  if (/[﴿\[\]"«(]|يقال|قيل|قال|المشكل|تقدم|ذكرت|مفسر|كتاب|موضع|أو\s/.test(meaning)) return null;
  // A second sentence (a note on the word's form or another place), or words that carry on the ayah («لكم»، «في الأرحام») rather
  // than say what the word means.
  if (/[.:؛]\s*\S/.test(meaning.replace(/^(?:أي|يعني|يريد|هم)\s*:/, '').replace(/\.$/, '')) || /^(?:في|من|على|عن|إلى|لكم|لهم|له|حسب)(?:\s|$)/.test(meaning)) return null;
  return meaning;
}

/** The letters of a meaning's own words (three letters or more, not «أي، يعني، الذي»), to keep a near synonym out of the
 * wrong choices. */
const contentWords = (meaning: string) => new Set(meaning.split(/[\s،؛.:]+/).map(word => skeleton(word).replace(/^(?:وال|ال|و)/, '')).filter(word => word.length >= 3 && !['يعني', 'الذي', 'التي', 'الذين'].includes(word)));

/**
 * Three wrong choices for each askable entry, all his own meanings of other words: from the same surah, nearest first,
 * then the surahs beside it, of a length near the right one's; none that shares a word with it or with another choice,
 * repeats one, or explains the same word.
 */
export function meaningPicks(entries: { surah: number; text: string; places: GharibPlace[]; quote: string }[]): MeaningPick[] {
  const askable = entries.map((entry, at) => ({ at, entry, meaning: meaningOf(entry) })).filter((item): item is { at: number; entry: typeof entries[number]; meaning: string } => !!item.meaning);
  const picks: MeaningPick[] = [];
  for (const item of askable) {
    const ayah = item.entry.places[0][0];
    const length = item.meaning.split(/\s+/).length;
    const taken = [contentWords(item.meaning)];
    const seen = new Set([item.meaning.replace(/[.\s]/g, '')]);
    const quote = skeleton(item.entry.quote);
    const pool = askable
      .filter(other => other.at !== item.at && skeleton(other.entry.quote) !== quote && Math.abs(other.entry.surah - item.entry.surah) <= 3)
      .map(other => ({ other, distance: Math.abs(other.entry.surah - item.entry.surah) * 1000 + Math.abs(other.entry.places[0][0] - ayah) + Math.abs(other.meaning.split(/\s+/).length - length) * 5 }))
      .sort((a, b) => a.distance - b.distance || a.other.at - b.other.at);
    const others: number[] = [];
    for (const { other } of pool) {
      const flat = other.meaning.replace(/[.\s]/g, '');
      const words = contentWords(other.meaning);
      if (seen.has(flat) || taken.some(set => [...words].some(word => set.has(word)))) continue;
      others.push(other.at);
      seen.add(flat);
      taken.push(words);
      if (others.length === 3) break;
    }
    if (others.length === 3) picks.push({ asked: item.at, others: others as [number, number, number] });
  }
  return picks;
}
