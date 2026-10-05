// docs/adr/0021-a-span-selects-text-by-quote.md
import { loadStorePage } from '../history/sourceStore';
import { matchForm, resolveSpan } from './span';
import type { SpanRecord, WorkFolder } from './types';

export function locateSpanRecord(folder: WorkFolder, span: SpanRecord, root: string) {
  const witness = folder.witnesses.find((w) => w.edition === span.edition);
  if (!witness) throw new Error(`edition "${span.edition}" has no witness`);
  const page = loadStorePage(root, witness.slug, span.volume, span.page);
  const body = span.layer === 'NOTES' ? page?.notes : page?.body;
  if (body == null) throw new Error(`no ${span.layer} text for v${span.volume} page ${span.page}`);
  const { start, end } = resolveSpan(body, span);
  return {
    key: `${witness.slug}/v${span.volume}/${span.page}/${span.layer}`,
    body,
    start,
    end,
    text: matchForm(body.slice(start, end)),
  };
}

export function renderSpanRecord(folder: WorkFolder, span: SpanRecord, root: string) {
  return locateSpanRecord(folder, span, root).text;
}
