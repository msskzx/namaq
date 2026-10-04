// docs/plans/data-model/plan.md, sections 2.14 and 6.2 (the review surface)
import { loadStorePage } from '../history/sourceStore';
import { closureOf } from './review';
import { locateSpanRecord } from './render';
import type { WorkFolder } from './types';

export interface PageMark {
  start: number;
  end: number;
  spans: { unit: string; id: string }[];
  assertions: { unit: string; id: string }[];
}

export function highlightsOnPage(
  folders: WorkFolder[],
  root: string,
  witness: string,
  volume: number,
  page: string,
) {
  const body = loadStorePage(root, witness, volume, page)?.body;
  if (body === undefined) throw new Error(`no text for ${witness} v${volume} page ${page}`);
  const found: { unit: string; id: string; start: number; end: number; assertions: string[] }[] =
    [];
  for (const folder of folders) {
    const editions = new Set(
      folder.witnesses.filter((w) => w.slug === witness).map((w) => w.edition),
    );
    for (const file of folder.units) {
      for (const span of file.spans) {
        if (!editions.has(span.edition) || span.volume !== volume || span.page !== page) continue;
        if (span.layer !== 'MAIN') continue;
        const { start, end } = locateSpanRecord(folder, span, root);
        const assertions = file.assertions
          .filter((a) => closureOf(file, a).spans.some((s) => s.id === span.id))
          .map((a) => a.id);
        found.push({ unit: file.unit.id, id: span.id, start, end, assertions });
      }
    }
  }
  const points = [...new Set(found.flatMap((s) => [s.start, s.end]))].sort((a, b) => a - b);
  const marks: PageMark[] = [];
  for (let i = 0; i + 1 < points.length; i += 1) {
    const [start, end] = [points[i], points[i + 1]];
    const covering = found.filter((s) => s.start <= start && s.end >= end);
    if (covering.length === 0) continue;
    marks.push({
      start,
      end,
      spans: covering.map(({ unit, id }) => ({ unit, id })),
      assertions: covering.flatMap((s) => s.assertions.map((id) => ({ unit: s.unit, id }))),
    });
  }
  return { body, marks };
}
