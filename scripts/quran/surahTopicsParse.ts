// see docs/plans/surah-topics.md

export type Section = { title: string; from?: number; to?: number; parts?: Section[] };
export type SurahTopics = { volume: number; page: number; sections: Section[] };

const DIGITS = '٠١٢٣٤٥٦٧٨٩';
const latin = (arabic: string) => Number([...arabic].map(c => DIGITS.indexOf(c)).join(''));
const RANGE = /\(\s*([٠-٩]+)\s*(?:[-–]\s*([٠-٩]+)\s*)?\)\s*\.?/;
const CITATION = /ينظر:?\s*"التفسير الموضوعي[^"]*"\s*لمجموعة من العلماء\s*\((\d+)\s*\/\s*(\d+)\)/;

export const noteLines = (html: string) => html
  .replace(/<\/p>|<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
  .split('\n').map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean);

type Item = { title: string; from?: number; to?: number; group: boolean };

function items(line: string): Item[] {
  const out: Item[] = [];
  let rest = line;
  for (let m = RANGE.exec(rest); m; m = RANGE.exec(rest)) {
    out.push(item(rest.slice(0, m.index), latin(m[1]), latin(m[2] ?? m[1])));
    rest = rest.slice(m.index + m[0].length);
  }
  if (rest.trim()) out.push(item(rest));
  return out;
}

function item(text: string, from?: number, to?: number): Item {
  const group = /^\s*\*/.test(text);
  const title = text.replace(/^\s*(?:\*|\d+\s*[.-])\s*/, '').replace(/[\s.:،]+$/, '').trim();
  return from === undefined ? { title, group } : { title, from, to, group };
}

export function parseSurahTopics(html: string): SurahTopics | null {
  const lines = noteLines(html);
  const at = lines.findIndex(line => CITATION.test(line));
  if (at < 0) return null;
  const [before, ...cited] = lines[at].split(/ينظر:?/);
  const [, volume, page] = CITATION.exec(`ينظر:${cited.join('ينظر:')}`)!;
  const body = [...lines.slice(0, at), before].map(line => line.trim()).filter(Boolean);
  const joined: string[] = [];
  for (const line of body) {
    if (/^\(\s*[٠-٩]/.test(line) && joined.length) joined[joined.length - 1] += ` ${line}`;
    else joined.push(line);
  }
  while (joined.length && !RANGE.test(joined[0]) && !/^\s*[*\d]/.test(joined[0])) joined.shift();

  const all = joined.flatMap(items);
  const sections: Section[] = [];
  let group: Section | null = null;
  let last: Section | null = null;
  for (const it of all) {
    const section: Section = it.from === undefined ? { title: it.title } : { title: it.title, from: it.from, to: it.to };
    if (it.group) { group = section; sections.push(section); last = null; continue; }
    if (it.from === undefined && last) { (last.parts ??= []).push(section); continue; }
    (group ? (group.parts ??= []) : sections).push(section);
    last = section;
  }
  return { volume: Number(volume), page: Number(page), sections: nest(sections) };
}

const inside = (a: Section, b: Section) =>
  a !== b && a.from !== undefined && b.from !== undefined && b.from <= a.from && a.to! <= b.to! && (a.from !== b.from || a.to !== b.to);

function nest(list: Section[]): Section[] {
  const top = list.filter(s => !list.some(other => inside(s, other)));
  for (const parent of top) {
    const children = list.filter(s => inside(s, parent) && !list.some(mid => mid !== parent && inside(s, mid) && inside(mid, parent)));
    if (children.length) parent.parts = [...children, ...(parent.parts ?? [])].sort((a, b) => (a.from ?? 0) - (b.from ?? 0));
    if (parent.parts) parent.parts = nest(parent.parts);
  }
  return top;
}

export function rangeGaps(sections: Section[], from: number, to: number, at = ''): string[] {
  const ranged = sections.filter(s => s.from !== undefined)
    .filter((s, i, all) => all.findIndex(o => o.from === s.from && o.to === s.to) === i)
    .sort((a, b) => a.from! - b.from!);
  const out: string[] = [];
  let next = from;
  for (const s of ranged) {
    if (s.from! > next) out.push(`${at}${next}–${s.from! - 1} not in any heading`);
    if (s.from! < next) out.push(`${at}${s.from}–${Math.min(s.to!, next - 1)} in two headings`);
    next = Math.max(next, s.to! + 1);
  }
  if (ranged.length && next <= to) out.push(`${at}${next}–${to} not in any heading`);
  for (const s of sections) if (s.parts && s.from !== undefined) out.push(...rangeGaps(s.parts, s.from, s.to!, `inside «${s.title}»: `));
  return out;
}
