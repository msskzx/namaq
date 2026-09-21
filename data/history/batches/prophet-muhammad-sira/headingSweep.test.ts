import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * The sweep this pins: al-Dhahabi's own section headings are the checklist, and
 * every section the batch has reached must have produced at least one citation.
 *
 * A section that produced none is either a miss or a decision, and the two look
 * identical in the data -- which is how chapter one lost زيد بن عمرو and the
 * persecution section for five chapters. DECLINED is where the decision gets
 * written down, so the next reader sees a reason instead of a gap.
 */
const BATCH = 'data/history/batches/prophet-muhammad-sira';

/**
 * Where the authored chapters stop: the heading that opens the first chapter
 * the pass has not reached. Move it forward as chapters land, never to make a
 * failure go away.
 */
const UNSWEPT_FROM = '1/443-p1';

/**
 * Headings that legitimately produce nothing, with the reason. Every entry here
 * is a heading over other headings or a title of the book itself -- the
 * sections beneath them carry the citations.
 */
const DECLINED: Record<string, string> = {
  '1/29-p1': 'the book\'s own title, not a section',
  '1/29-p4': 'the title of the part that holds these chapters',
  '1/298-p3': 'a heading over غزوة بواط and غزوة العشيرة, which follow it',
  '1/375-p2': 'a heading over غزوة ذي أمر and غزوة بحران, which follow it',
};

type Batch = {
  accounts: { pages: { bodyFile: string; passages: { anchor: string }[] }[] }[];
  claims: { citations: { passageAnchor: string }[] }[];
};

const batch = JSON.parse(readFileSync(`${BATCH}/batch.json`, 'utf8')) as Batch;

const passages = batch.accounts[0].pages.flatMap((page) => {
  const paragraphs = readFileSync(`${BATCH}/${page.bodyFile}`, 'utf8')
    .split('\n\n')
    .map((text) => text.trim())
    .filter(Boolean);
  return page.passages.map((passage, index) => ({ anchor: passage.anchor, text: paragraphs[index] ?? '' }));
});

const cited = new Set(batch.claims.flatMap((claim) => claim.citations.map((citation) => citation.passageAnchor)));

/** A heading is a whole paragraph the editor bracketed; nothing else is. */
const headings = passages
  .map((passage, index) => ({ ...passage, index }))
  .filter(({ text }) => text.startsWith('[') && text.endsWith(']'));

const swept = passages.findIndex((passage) => passage.anchor === UNSWEPT_FROM);

/** A section runs from its heading to the next one, whatever pages it crosses. */
const sections = headings
  .map((heading, position) => ({
    ...heading,
    span: passages.slice(heading.index, headings[position + 1]?.index ?? passages.length),
  }))
  .filter(({ index }) => index < swept);

const uncited = () => sections.filter((section) => !section.span.some(({ anchor }) => cited.has(anchor)));

describe('the sira batch against the book\'s own headings', () => {
  it('finds the boundary of the swept chapters', () => {
    expect(swept).toBeGreaterThan(0);
    expect(sections.length).toBeGreaterThan(40);
  });

  it('cites something under every heading it has reached, or says why not', () => {
    const undeclared = uncited()
      .filter((section) => !(section.anchor in DECLINED))
      .map((section) => `${section.anchor} ${section.text}`);

    expect(undeclared).toEqual([]);
  });

  // A decline that no longer names an empty section is stale: either the
  // section was authored after all, or the anchor moved. Either way the reason
  // has stopped being true, and a list nobody prunes stops being read.
  it('keeps no decline for a section that now carries a citation', () => {
    const empty = new Set(uncited().map((section) => section.anchor));

    expect(Object.keys(DECLINED).filter((anchor) => !empty.has(anchor))).toEqual([]);
  });
});
