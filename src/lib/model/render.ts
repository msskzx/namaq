// docs/adr/0021-a-span-selects-text-by-quote.md
import { loadStorePage } from '../history/sourceStore';
import { renderSpan } from './span';
import type { SpanRecord, WorkFolder } from './types';

export function renderSpanRecord(folder: WorkFolder, span: SpanRecord, root: string) {
  const witness = folder.witnesses.find((w) => w.edition === span.edition);
  if (!witness) throw new Error(`edition "${span.edition}" has no witness`);
  const page = loadStorePage(root, witness.slug, span.volume, span.page);
  const body = span.layer === 'NOTES' ? page?.notes : page?.body;
  if (body == null) throw new Error(`no ${span.layer} text for v${span.volume} page ${span.page}`);
  return renderSpan(body, span);
}
