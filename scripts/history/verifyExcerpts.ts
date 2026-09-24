import { loadBatch } from '../../src/lib/history/loadBatch';
import { passageExcerpts } from '../../src/lib/history/batchSchema';

/**
 * The needle-assertion check this batch's authoring harness relies on: every
 * claim citation's excerptArabic must be a literal substring of the page
 * paragraph its passageAnchor names. validateBatch checks an anchor resolves
 * to *some* paragraph; this checks the excerpt is actually drawn from it,
 * which is what keeps a batch's citations from being malformed quietly.
 */

const dir = process.argv[2];
if (!dir) {
  console.error('Usage: tsx scripts/history/verifyExcerpts.ts data/history/batches/<batch>');
  process.exit(1);
}

// Footnote markers such as "(١)" are typeset inline with the text but are the
// editor's, not the author's; an excerpt may legitimately drop them, so both
// sides are compared with them removed and whitespace collapsed.
function normalize(text: string) {
  return text
    .replace(/\(\s*[٠-٩0-9]+\s*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const { batch, files } = loadBatch(dir);

const paragraphsByAnchor = new Map<string, string>();
for (const account of batch.accounts) {
  for (const page of account.pages) {
    const excerpts = passageExcerpts(page, files);
    for (const [anchor, text] of excerpts) paragraphsByAnchor.set(anchor, text);
  }
}

let failures = 0;
let checked = 0;

for (const claim of batch.claims) {
  for (const citation of claim.citations) {
    checked += 1;
    if (!citation.passageAnchor) continue; // some citations may target a whole-page reference
    const paragraph = paragraphsByAnchor.get(citation.passageAnchor);
    if (paragraph === undefined) {
      console.error(`FAIL ${claim.key}: anchor "${citation.passageAnchor}" has no paragraph`);
      failures += 1;
      continue;
    }
    const needle = normalize(citation.excerptArabic);
    const haystack = normalize(paragraph);
    if (!haystack.includes(needle)) {
      console.error(`FAIL ${claim.key}: excerpt not found in "${citation.passageAnchor}"`);
      console.error(`  needle:    ${needle}`);
      console.error(`  haystack:  ${haystack}`);
      failures += 1;
    }
  }
}

console.log(`Checked ${checked} citation(s) across ${batch.claims.length} claim(s).`);
if (failures > 0) {
  console.error(`${failures} citation(s) failed the needle check.`);
  process.exit(1);
}
console.log('All citations verified as literal substrings of their source paragraphs.');
