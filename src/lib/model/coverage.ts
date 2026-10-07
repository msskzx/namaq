// docs/plans/siyar-parsing.md
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadSourceManifest, loadStorePage, sourcesRoot } from '../history/sourceStore';
import { dateTag } from './dateReader';
import { locateSpanRecord } from './render';
import { standingAgent } from './referents';
import { matchForm } from './span';
import type { UnitFile, WorkFolder } from './types';

export interface NotModeled {
  page: string;
  text: string;
  tag?: string;
}

export interface Coverage {
  unit: string;
  pages: string[];
  sentences: number;
  covered: number;
  notModeled: NotModeled[];
  unresolved: string[];
  outside: string[];
  bounded: boolean;
}

const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';

const nextNumber = (printed: string) => {
  const digits = [...printed].map((c) => ARABIC_INDIC.indexOf(c));
  if (digits.some((d) => d < 0)) throw new Error(`entry number "${printed}" is not Arabic-Indic digits`);
  return String(Number(digits.join('')) + 1)
    .split('')
    .map((d) => ARABIC_INDIC[Number(d)])
    .join('');
};

function sentencesOf(body: string, from: number, to: number) {
  const found: { start: number; end: number; text: string }[] = [];
  const slice = body.slice(from, to);
  for (const match of slice.matchAll(/[^\n]+(?:\n(?!\n)[^\n]+)*/g)) {
    const base = from + (match.index ?? 0);
    for (const piece of match[0].matchAll(/[^.؟!]+[.؟!]*\s*/g)) {
      const text = piece[0].trim();
      const start = base + (piece.index ?? 0);
      if (text) found.push({ start, end: start + piece[0].trimEnd().length, text });
    }
  }
  return found;
}

function coveredLength(spans: { start: number; end: number }[], start: number, end: number) {
  const clipped = spans
    .map((at) => ({ start: Math.max(at.start, start), end: Math.min(at.end, end) }))
    .filter((at) => at.end > at.start)
    .sort((a, b) => a.start - b.start);
  let total = 0;
  let reached = start;
  for (const at of clipped) {
    if (at.end > reached) {
      total += at.end - Math.max(at.start, reached);
      reached = at.end;
    }
  }
  return total;
}

export function coverageOf(folder: WorkFolder, file: UnitFile, root: string): Coverage {
  const main = file.spans.filter((span) => span.layer === 'MAIN');
  if (main.length === 0) throw new Error(`${file.unit.id}: no MAIN span, so no page to start from`);
  const witness = folder.witnesses.find((w) => w.edition === main[0].edition);
  if (!witness) throw new Error(`${file.unit.id}: edition "${main[0].edition}" has no witness`);
  const volume = main[0].volume;
  const printed = file.unit.numbers.printed;
  const heading = new RegExp(`(^|\\n\\n)${printed} - `);
  const stop = new RegExp(`(^|\\n\\n)${nextNumber(printed)} - `);
  const first = Math.min(...main.filter((span) => span.volume === volume).map((span) => Number(span.page)));
  const manifest = existsSync(join(root, sourcesRoot, witness.slug, 'source.json'))
    ? loadSourceManifest(root, witness.slug)
    : undefined;
  const lastPage = manifest?.volumes.find((v) => v.number === volume)?.lastPrintedPage ?? undefined;

  const segments: { page: string; body: string; start: number; end: number }[] = [];
  let ended = false;
  for (let page = first; ; page += 1) {
    const loaded = loadStorePage(root, witness.slug, volume, String(page));
    if (!loaded) {
      if (lastPage !== undefined && page <= lastPage && segments.length > 0) {
        throw new Error(`${file.unit.id}: page ${page} is missing from the store before the entry ends`);
      }
      break;
    }
    const body = loaded.body;
    let start = 0;
    if (page === first) {
      const at = heading.exec(body);
      if (!at) throw new Error(`${file.unit.id}: heading "${printed} - " not found on page ${page}`);
      start = at.index + at[1].length;
    }
    const cut = stop.exec(body.slice(start));
    const end = cut ? start + cut.index + cut[1].length : body.length;
    if (end > start) segments.push({ page: String(page), body, start, end });
    if (cut) {
      ended = true;
      break;
    }
  }
  if (!ended && lastPage !== undefined && Number(segments[segments.length - 1]?.page) < lastPage) {
    throw new Error(`${file.unit.id}: the next entry's heading was not found before the volume ends`);
  }

  const located = main
    .filter((span) => span.volume === volume)
    .map((span) => ({ span, at: locateSpanRecord(folder, span, root) }));
  const outside = [
    ...main.filter((span) => span.volume !== volume).map((span) => span.id),
    ...located
      .filter(({ span, at }) => {
        const segment = segments.find((s) => s.page === span.page);
        return !segment || at.start < segment.start || at.end > segment.end;
      })
      .map(({ span }) => span.id),
  ];

  const notModeled: NotModeled[] = [];
  let sentences = 0;
  let covered = 0;
  for (const segment of segments) {
    const spans = located.filter(({ span }) => span.page === segment.page).map(({ at }) => at);
    for (const sentence of sentencesOf(segment.body, segment.start, segment.end)) {
      if (!/\p{L}/u.test(sentence.text)) continue;
      sentences += 1;
      if (coveredLength(spans, sentence.start, sentence.end) * 2 >= sentence.end - sentence.start) covered += 1;
      else {
        const text = matchForm(sentence.text);
        notModeled.push({ page: segment.page, text, tag: dateTag(text) });
      }
    }
  }

  const named = new Set(file.identifications.filter((i) => i.status !== 'REJECTED').map((i) => i.mention));
  const unresolved = file.mentions
    .filter((m) => !named.has(m.id) && !standingAgent(m.exact))
    .map((m) => m.exact);

  return {
    unit: file.unit.id,
    pages: segments.map((s) => s.page),
    sentences,
    covered,
    notModeled,
    unresolved,
    outside,
    bounded: ended || (lastPage !== undefined && Number(segments[segments.length - 1]?.page) === lastPage),
  };
}
