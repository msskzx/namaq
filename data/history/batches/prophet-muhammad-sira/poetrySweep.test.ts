import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * The same sweep as headingSweep.test.ts, over verse instead of sections. The
 * editor prints a hemistich break as ` ... `, which makes a line of verse
 * findable without knowing any metre, and consecutive lines are one poem.
 *
 * Every poem in the swept chapters has to reach an Utterance, or DECLINED has
 * to say why it did not. Fifty runs sat unrecorded until the Utterance record
 * existed; this is what stops that happening again a chapter at a time.
 */
const BATCH = 'data/history/batches/prophet-muhammad-sira';

/** Where chapter two begins: the poetry back-fill has reached this far. */
const UNSWEPT_FROM = '1/146-p1';

/**
 * Runs the separator finds that are not verse, with the reason. Prose uses the
 * same three dots to abbreviate a hadith it has quoted before.
 */
const DECLINED: Record<string, string> = {
  '1/60-p4': 'prose: the ellipsis abbreviates the Bahira hadith, ببحيرا ... الحديث',
};

type Batch = {
  accounts: { pages: { bodyFile: string; passages: { anchor: string }[] }[] }[];
  claims: { field?: string; citations: { passageAnchor: string }[] }[];
};

const batch = JSON.parse(readFileSync(`${BATCH}/batch.json`, 'utf8')) as Batch;

const passages = batch.accounts[0].pages.flatMap((page) => {
  const paragraphs = readFileSync(`${BATCH}/${page.bodyFile}`, 'utf8')
    .split('\n\n')
    .map((text) => text.trim())
    .filter(Boolean);
  return page.passages.map((passage, index) => ({ anchor: passage.anchor, text: paragraphs[index] ?? '' }));
});

const cited = new Set(
  batch.claims
    .filter((claim) => claim.field === 'utterance')
    .flatMap((claim) => claim.citations.map((citation) => citation.passageAnchor)),
);

const swept = passages.findIndex((passage) => passage.anchor === UNSWEPT_FROM);

/** Consecutive lines carrying the separator are one poem. */
const runs: { anchor: string; text: string; span: string[] }[] = [];
let open: { anchor: string; text: string; span: string[] } | null = null;
passages.slice(0, swept).forEach((passage, index) => {
  if (!passage.text.includes(' ... ')) {
    open = null;
    return;
  }
  if (open) {
    open.span.push(passage.anchor);
    return;
  }
  // The sentence before the first line is what names the poet, so a citation
  // anchored there counts as covering the poem.
  open = { anchor: passage.anchor, text: passage.text, span: [passages[index - 1]?.anchor, passage.anchor].filter(Boolean) as string[] };
  runs.push(open);
});

const uncited = () => runs.filter((run) => !run.span.some((anchor) => cited.has(anchor)));

describe('the sira batch against its own verse', () => {
  it('finds the boundary of the swept chapters', () => {
    expect(swept).toBeGreaterThan(0);
    expect(runs.length).toBeGreaterThan(10);
  });

  it('records every poem it has reached as an utterance, or says why not', () => {
    const undeclared = uncited()
      .filter((run) => !(run.anchor in DECLINED))
      .map((run) => `${run.anchor} ${run.text}`);

    expect(undeclared).toEqual([]);
  });

  // A decline that no longer names an uncited run is stale, the same way a
  // stale heading decline is: the reason has stopped being true.
  it('keeps no decline for a run that now reaches an utterance', () => {
    const empty = new Set(uncited().map((run) => run.anchor));

    expect(Object.keys(DECLINED).filter((anchor) => !empty.has(anchor))).toEqual([]);
  });
});
