import surahs from '../../shared/data/quran/surahs.json';
import type { PageBreak } from '../../shared/bookReader';
import { spellSigns } from './signs';

// see docs/plans/book-reader.md
export type TurathPage = { text: string; vol: string; page: number | null };
export type Chapter = { surah: number; text: string };

const DIGITS = '[٠-٩]+(?:\\s*(?:[-–/،,]|و)\\s*[٠-٩]+)*';
const WORD = '[\\u0621-\\u064A\\u0640]+';
const NAME = `${WORD}(?:\\s${WORD})?`;
const loose = (name: string) => name.replace(/[أإآا]/g, '[أإآا]').replace(/[ةه]$/, '[ةه]').replace(/[ىي]$/, '[ىي]');
const SURAH = `(?:سورة\\s+)?(?:${[...surahs.map(row => row.name), 'براءة', 'بني إسرائيل', 'المؤمن', 'المؤمنين', 'حم السجدة', 'القتال', 'المنافقين', 'التساؤل', 'ونس']
  .sort((a, b) => b.length - a.length).map(loose).join('|')})(?![ء-ي])`;
const EDITOR: RegExp[] = [
  /\s*[٠-٩]+\s*\/\s*[أب](?![ء-ي])/g,
  /\s*[([]\s*ينظر[^)\]]*[)\]]/g,
  new RegExp(`\\s*[[("“]\\s*(?:ى\\s*)?(?:${NAME}\\s*\\)?\\s*[:"]*\\s*/?\\s*)?${DIGITS}\\s*["”]?\\s*[\\])"”»]?`, 'g'),
  new RegExp(`(?<=[)\\]](?:\\s+الآية)?)\\s*\\.?\\s*(?:من\\s+)?${SURAH}\\s*[:،]*\\s*${DIGITS}`, 'g'),
  new RegExp(`\\s*(?:الآية|الآيات)\\s*:\\s*${DIGITS}`, 'g'),
  new RegExp(`\\s*،\\s*${SURAH}\\s*[،:]*\\s*${DIGITS}`, 'g'),
  /^[٠-٩]+\s*-\s*/gm,
];

export function authorsWords(text: string): string {
  let out = text.split(/\n?_{5,}/)[0]
    .replace(/<[^>]*>/g, '')
    .replace(/^\[([^\]]{0,300})\]$/gm, '$1')
    .replace(/\s*\[[^\]]{0,300}\]/g, '')
    .replace(/\s*\(\s*بياض[^)]*\)/g, '')
    .replace(/^\s*صفحة فارغة\s*$/gm, '');
  for (const pattern of EDITOR) out = out.replace(pattern, '');
  return spellSigns(out)
    .replace(new RegExp(`\\s*(?:و(?=[٠-٩]))?${DIGITS}`, 'g'), '')
    .replace(/:\s*[،,-]+(?:\s*[،,-])*/g, ':')
    .replace(/:(?:[ \t]*:)+/g, ':')
    .replace(/،[ \t]*\.(?!\.)/g, '.')
    .replace(/(?<!\.)\.[ \t]+\.(?!\.)/g, '.')
    .replace(/[ \t]+([،.:؛])/g, '$1')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{2,}/g, '\n');
}

const plain = (text: string) => text
  .replace(/[ً-ْٰـ]/g, '')
  .replace(/[أإآٱ]/g, 'ا')
  .replace(/ؤ/g, 'و')
  .replace(/[ىئ]/g, 'ي')
  .replace(/ة/g, 'ه');
const bare = (name: string) => plain(name).replace(/^ال/, '');

const OTHER_NAMES: Record<string, number[]> = {
  'ام القران': [1], 'براءه': [9], 'بني اسراييل': [17], 'مومنين': [23], 'مومن': [40], 'حم السجده': [41], 'سجده': [32, 41],
  'قتال': [47], 'محمد': [47], 'تبارك': [67], 'ن': [68], 'قلم': [68, 96], 'تساول': [78], 'منافقين': [63], 'كافرين': [109],
  'الم نشرح': [94], 'قل اعوذ برب الناس': [114], 'انشقاق': [84],
};
const NAMES = new Map<string, number[]>(Object.entries(OTHER_NAMES));
for (const row of surahs) NAMES.set(bare(row.name), [...(NAMES.get(bare(row.name)) ?? []), row.number]);

export function surahOfHeading(heading: string, after: number): number | null {
  const words = heading.replace(/[\u064B-\u0652\u0670]/g, '').replace(/[()﵀-﷿]/g, ' ').replace(/[-"]/g, ' ').trim().split(/\s+/);
  if (!/^سو+ر?[ةه]$/.test(words[0])) {
    if (/مقدم|بسم الله|بسم ال/.test(words.join(' '))) return 0;
  } else words.shift();
  for (let n = Math.min(4, words.length); n >= 1; n--) {
    const name = words.slice(0, n).join(' ').replace(/[ً-ْ]/g, '');
    const found = NAMES.get(plain(name)) ?? NAMES.get(bare(name)) ?? NAMES.get(bare(name.replace(/^و/, '')));
    const next = found?.find(number => number > after) ?? found?.find(number => number === after);
    if (next) return next;
  }
  return null;
}

const TITLE = /<span data-type="title" id=toc-(\d+)>((?:(?!<span)[\s\S])*?)<\/span>/g;

export function chaptersOf(pages: TurathPage[], levels: number[]): { chapters: Chapter[]; breaks: PageBreak[] } {
  const chapters: Chapter[] = [{ surah: 0, text: '' }];
  const breaks: PageBreak[] = [];
  let surah = 0;
  const cut = new RegExp(`(?:\\s*[[(]\\s*${NAME}\\s*:|(?<=[)\\]])\\s*\\.?\\s*(?:من\\s+)?(?:${SURAH}|آل)\\s*:?)\\s*$`);
  let carried = '';
  for (const page of pages) {
    if (page.page === null) continue;
    let text = carried + page.text.replace(/\r/g, '');
    carried = text.match(cut)?.[0] ?? '';
    if (carried) text = text.slice(0, -carried.length);
    let at = 0;
    let first = true;
    const mark = () => {
      if (!first) return;
      const chapter = chapters[chapters.length - 1];
      if (chapter.text && !chapter.text.endsWith('\n')) chapter.text += '\n';
      breaks.push([chapters.length - 1, chapter.text.length, Number(page.vol), page.page!]);
      first = false;
    };
    const add = (piece: string) => {
      const words = authorsWords(piece);
      if (!words.trim()) return;
      const chapter = chapters[chapters.length - 1];
      if (first) {
        if (chapter.text && !chapter.text.endsWith('\n') && !words.startsWith('\n')) chapter.text += /[.:؟!»]\s*$/.test(chapter.text) ? '\n' : ' ';
        breaks.push([chapters.length - 1, chapter.text.length, Number(page.vol), page.page!]);
        first = false;
      }
      chapter.text += words;
    };
    for (const match of text.matchAll(TITLE)) {
      add(text.slice(at, match.index));
      at = match.index + match[0].length;
      const heading = spellSigns(match[2]).replace(/\s+/g, ' ').trim();
      if (levels[Number(match[1]) - 1] !== 1) { add(`\n${heading}\n`); continue; }
      const found = surahOfHeading(heading, surah);
      if (found === null) throw new Error(`no surah for the heading «${heading}» after ${surah}`);
      if (found) surah = found;
      const open = chapters[chapters.length - 1];
      if (open.text.trim() && open.surah !== surah) chapters.push({ surah, text: '' });
      else open.surah = surah;
      mark();
      const chapter = chapters[chapters.length - 1];
      chapter.text += `${chapter.text && !chapter.text.endsWith('\n') ? '\n' : ''}${heading}\n`;
    }
    add(text.slice(at));
  }
  for (const chapter of chapters) chapter.text = chapter.text.trimEnd();
  return { chapters, breaks: breaks.map(([chapter, at, part, page]) => [chapter, Math.min(at, chapters[chapter].text.length), part, page]) };
}
