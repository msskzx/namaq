// docs/plans/balagha.md: al-Suyuti's al-Itqan, kinds 52 to 58 (the chapters on balagha), from Turath's export of
// Shamela book 11728. Each line of the export is one of his paragraphs; a printed page may break one in two.
import { same, skeleton } from './irabUkbari';
import type { ItqanEntry, ItqanPlace } from '../../shared/quran/itqanBalagha';

export type TurathPage = { text: string; vol: string; page: number };

/** One of his paragraphs: its kind, the heading it falls under, its pages and Shamela id, and the text. */
export type Paragraph = { kind: number; heading: string; part: number; first: number; last: number; id: number; text: string };

// Marks are compared in Unicode's order (NFC): the export writes shadda before fatha, the canonical order is the reverse.
const KIND = /^النَّوْعُ \S+ وَالْخَمْسُونَ\s*:/;
const ORDINALS = ['الثَّانِي', 'الثَّالِثُ', 'الرَّابِعُ', 'الْخَامِسُ', 'السَّادِسُ', 'السَّابِعُ', 'الثَّامِنُ'];
// Headings that name no device (a note, a rule, a closing word, «already covered»); the device heading before them
// still holds.
const PLAIN = /^(?:تَنْبِيهٌ|تَنْبِيهَاتٌ|فَصْلٌ|فصل|فَائِدَةٌ(?: ثَانِيَةٌ)?|قَاعِدَةٌ|خَاتِمَةٌ|فَرْعٌ|تَذَنِيبٌ|ذِكْرُ أَقْسَامِهِ|ذِكْرُ شُرُوطِهِ|وَهِيَ سِتَّةٌ|حَذْفُ الْعَاطِفِ مَعَ الْمَعْطُوفِ تَقَدَّمَ)$/;

const words = (line: string) => line.split(/\s+/).filter(Boolean);
/** A short line of his own, no Quran in it, not a lead-in («…:») or the end of a sentence. */
const short = (line: string, most = 5) => words(line).length <= most && !line.includes('﴿') && !/[:.،]$/.test(line.trim());
/** A line as short as a line of verse: a heading standing next to one is verse too. */
const brief = (line: string) => short(line, 8);

/** The device a heading names, in his words: «فصل: ومن أقسامه النهي» names «النهي», «النوع الرابع- التكرير» «التكرير». */
export function headingName(line: string): string | null {
  const text = line.trim();
  if (PLAIN.test(text)) return null;
  return text
    .replace(/^(?:فَصْلٌ|فصل)\s*:?\s*/, '')
    .replace(/^(?:وَمِنْ|ومن)\s+(?:أَقْسَامِهِ|أقسامه)\s*:?\s*/, '')
    .replace(/^مِنْ أَقْسَامِ الْإِنْشَاءِ\s+/, '')
    .replace(/^النَّوْعُ\s+\S+(?:\s+(?:عَشَرَ|وَالْعِشْرُونَ))?\s*[:-]?\s*/, '')
    .replace(/^(?:وَمِنْهَا|ثانيها:|ثَانِيهَا:)\s*/, '')
    .replace(/[.:]$/, '')
    .trim() || null;
}

/**
 * His paragraphs in the pages given, in order. The pages are laid end to end: a page that does not open on a heading
 * carries on the paragraph before it. A kind opens on its title («النوع الثالث والخمسون: …»), as a marked title or a
 * plain line. A short line is a heading when neither line beside it is as short as a line of verse: short lines in a
 * row are verse.
 */
export function readParagraphs(pages: (TurathPage & { id: number })[]): { paragraphs: Paragraph[]; kinds: Record<number, string> } {
  type Line = { text: string; part: number; page: number; id: number; joined: boolean };
  const lines: Line[] = [];
  for (const page of pages) {
    const texts = page.text.replace(/<span data-type="title"[^>]*>([^<]*)<\/span>/g, '$1').replace(/<[^>]+>/g, '').normalize('NFC').split('\n').map(line => line.trim()).filter(line => line && line !== '...');
    texts.forEach((text, i) => lines.push({ text, part: Number(page.vol), page: page.page, id: page.id, joined: i === 0 }));
  }
  const kinds: Record<number, string> = {};
  const paragraphs: Paragraph[] = [];
  let kind = 0;
  let heading = '';
  // A kind's title is no verse, though as short.
  const isBrief = (i: number) => i >= 0 && i < lines.length && !KIND.test(lines[i].text) && brief(lines[i].text);
  lines.forEach((line, i) => {
    if (KIND.test(line.text)) {
      kind = 52 + ORDINALS.findIndex(ordinal => line.text.startsWith(`النَّوْعُ ${ordinal}`));
      kinds[kind] = line.text;
      heading = '';
      return;
    }
    if (short(line.text) && !isBrief(i - 1) && !isBrief(i + 1)) {
      const name = headingName(line.text);
      if (name) heading = name;
      return;
    }
    const last = paragraphs.at(-1);
    // A page's first line carries on the paragraph the page before broke off, unless a heading came between.
    if (line.joined && last && last.kind === kind && last.heading === heading && lines[i - 1] && !KIND.test(lines[i - 1].text) && !short(lines[i - 1].text)) {
      last.text += ` ${line.text}`;
      last.last = line.page;
      return;
    }
    paragraphs.push({ kind, heading, part: line.part, first: line.page, last: line.page, id: line.id, text: line.text });
  });
  return { paragraphs: paragraphs.filter(paragraph => paragraph.kind >= 52), kinds };
}

/** The mushaf's words in order, each with its ayah and place in it. */
export type MushafWord = { surah: number; ayah: number; at: number; skeleton: string; text?: string };

const quoteWords = (quote: string) => quote.replace(/[^ء-ۭ࣓-ࣿ\s]/g, ' ').split(/\s+/).map(skeleton).filter(Boolean);

/** Every place a quote's words run in the mushaf, within one surah: the index of its first word. */
export function placesOf(quote: string, mushaf: MushafWord[], first: Map<string, number[]>): number[] {
  const wanted = quoteWords(quote);
  if (!wanted.length || wanted.join('').length < 3) return [];
  const starts = new Set([...(first.get(wanted[0]) ?? []), ...(first.get(wanted[0].slice(1)) ?? [])]);
  return [...starts].sort((a, b) => a - b).filter(start => wanted.every((token, j) => {
    const word = mushaf[start + j];
    return word && word.surah === mushaf[start].surah && same(token, word.skeleton);
  }));
}

/** The index the search starts from: each skeleton (and each without a leading ف، ل، ب، ك) to where it stands. */
export function firstWords(mushaf: MushafWord[]) {
  const index = new Map<string, number[]>();
  const add = (key: string, at: number) => index.set(key, [...(index.get(key) ?? []), at]);
  mushaf.forEach((word, at) => { add(word.skeleton, at); if (/^[فلبك]/.test(word.skeleton) && word.skeleton.length > 1) add(word.skeleton.slice(1), at); });
  return index;
}

/**
 * The ayah words a paragraph quotes. A quote found in one place is placed there. A quote found in several is placed on
 * the one in the surah of the paragraph's other placed quotes, nearest to them; failing that, on every one of them, with
 * their count, however many: the sheet says he named none of them and lists them all (owner, 2026-11-18: quote him as
 * he wrote, never pin his words on an ayah he did not name, and hide no place).
 */
export function placeQuotes(text: string, mushaf: MushafWord[], first: Map<string, number[]>): ItqanPlace[] {
  const found = [...text.matchAll(/﴿([^﴾]*)﴾/g)].map(match => ({ quote: match[1], starts: placesOf(match[1], mushaf, first), length: quoteWords(match[1]).length }));
  const sure = found.filter(item => item.starts.length === 1).map(item => mushaf[item.starts[0]]);
  const places: ItqanPlace[] = [];
  const add = (start: number, length: number, count: number, quote: number) => {
    for (let j = 0; j < length; j++) {
      const word = mushaf[start + j];
      const same = places.find(place => place[0] === word.surah && place[1] === word.ayah && place[4] === count && place[5] === quote && place[3] === word.at - 1);
      if (same) same[3] = word.at;
      else places.push([word.surah, word.ayah, word.at, word.at, count, quote]);
    }
  };
  for (const [quote, item] of found.entries()) {
    if (item.starts.length === 1) { add(item.starts[0], item.length, 1, quote); continue; }
    if (!item.starts.length) continue;
    const near = item.starts
      .map(start => ({ start, distance: Math.min(...sure.filter(word => word.surah === mushaf[start].surah).map(word => Math.abs(word.ayah - mushaf[start].ayah))) }))
      .filter(option => Number.isFinite(option.distance))
      .sort((a, b) => a.distance - b.distance);
    if (near.length && (near.length === 1 || near[0].distance < near[1].distance)) add(near[0].start, item.length, 1, quote);
    else for (const start of item.starts) add(start, item.length, item.starts.length, quote);
  }
  return places;
}

export const entryOf = (paragraph: Paragraph, places: ItqanPlace[]): ItqanEntry =>
  [paragraph.kind, paragraph.heading, paragraph.part, paragraph.first, paragraph.last, paragraph.id, paragraph.text, places];
