import { describe, expect, it } from 'vitest';
import {
  batchRevision,
  checkApproval,
  checklistReminders,
  markBatchReviewed,
  validateBatch,
  type BatchFiles,
  type HistoryBatch,
  type SourceManifests,
  type StorePages,
} from './batchSchema';
import type { SourceManifest } from './sourceStore';

function files(overrides: BatchFiles = {}): BatchFiles {
  return {
    'summary.md': '# Batch summary',
    ...overrides,
  };
}

function manifest(overrides: Partial<SourceManifest> = {}): SourceManifest {
  return {
    slug: 'siyar-risalah',
    title: 'سير أعلام النبلاء',
    digitalHost: 'shamela',
    volumes: [{ number: 1 }],
    ...overrides,
  };
}

function manifests(overrides: SourceManifest = manifest()): SourceManifests {
  return new Map([[overrides.slug, overrides]]);
}

function pages(overrides: Record<string, string> = {}): StorePages {
  const bodies: Record<string, string> = { 'siyar-risalah/v1/5': 'نص الصفحة الأولى', ...overrides };
  return new Map(Object.entries(bodies).map(([key, body]) => [key, { body, notes: null }]));
}

function batch(overrides: Partial<HistoryBatch> = {}): HistoryBatch {
  return {
    slug: 'abu-ubaydah-pilot',
    summaryFile: 'summary.md',
    accounts: [
      {
        sourceSlug: 'siyar-risalah',
        subjectKind: 'PERSON',
        subjectSlug: 'abu-ubaydah-ibn-al-jarrah',
        volumeNumber: 1,
        extractionUrl: 'https://shamela.ws/book/10906/1431',
        accessedAt: '2026-09-09',
        pages: [{ sequence: 1, printedPage: '5' }],
      },
    ],
    claims: [
      {
        key: 'abu-ubaydah/full-name',
        subjectKind: 'PERSON',
        subjectSlug: 'abu-ubaydah-ibn-al-jarrah',
        field: 'fullName',
        assertion: 'عامر بن عبد الله بن الجراح',
        citations: [
          {
            sourceSlug: 'siyar-risalah',
            passageAnchor: '1/5-p1',
            pageReference: '5',
            extractionUrl: 'https://shamela.ws/book/10906/1431',
            excerptArabic: 'نص الصفحة الأولى',
            accessedAt: '2026-09-09',
          },
        ],
      },
    ],
    ...overrides,
  };
}

describe('markBatchReviewed', () => {
  it('marks every claim in the batch and reports how many changed', () => {
    const b = batch();
    b.claims.push({ ...b.claims[0], key: 'abu-ubaydah/titles', reviewStatus: 'REVIEWED' });

    expect(markBatchReviewed(b)).toBe(1);
    expect(b.claims.map((claim) => claim.reviewStatus)).toEqual(['REVIEWED', 'REVIEWED']);
  });
});

describe('validateBatch', () => {
  it('accepts a well-formed batch', () => {
    expect(validateBatch(batch(), files(), manifests(), pages())).toEqual([]);
  });

  // A volume number is only meaningful against the volumes its own source
  // declares, so a typo fails here rather than importing an unbound page.
  it('rejects an account bound in a volume its source does not declare', () => {
    const b = batch();
    b.accounts[0].volumeNumber = 2;

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'accounts[0]',
      message: `volumeNumber 2 is not a volume "${b.accounts[0].sourceSlug}" declares`,
    });
  });

  // docs/extraction-checklist.md: an account may declare a content item
  // absent from its source, but only from the fixed checklist vocabulary, so
  // a typo doesn't silently pass as "checked".
  it('accepts a valid notInSource item', () => {
    const b = batch();
    b.accounts[0].notInSource = ['wives', 'siblings'];

    expect(validateBatch(b, files(), manifests(), pages())).toEqual([]);
  });

  it('rejects a notInSource item outside the checklist vocabulary', () => {
    const b = batch();
    b.accounts[0].notInSource = ['spouse' as never];

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'accounts[0].notInSource[0]',
      message: expect.stringContaining('"spouse" is not a checklist content item'),
    });
  });

  it('rejects a citation whose source is not declared', () => {
    const b = batch();
    b.claims[0].citations[0].sourceSlug = 'unknown-book';

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'claims[0].citations[0]',
      message: 'unknown source "unknown-book"',
    });
  });

  it('rejects a citation without a usable extraction link', () => {
    const b = batch();
    b.claims[0].citations[0].extractionUrl = 'not a url';

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'claims[0].citations[0]',
      message: 'extractionUrl must be an http(s) URL',
    });
  });

  it('accepts a citation with no printed page', () => {
    const b = batch();
    delete b.claims[0].citations[0].pageReference;

    expect(validateBatch(b, files(), manifests(), pages())).toEqual([]);
  });

  it('rejects a citation pointing at a passage no page declares', () => {
    const b = batch();
    b.claims[0].citations[0].passageAnchor = '1/5-p9';

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'claims[0].citations[0]',
      message: 'citation targets unknown passage "1/5-p9"',
    });
  });

  it('rejects a claim with no citation', () => {
    const b = batch();
    b.claims[0].citations = [];

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'claims[0]',
      message: 'every claim needs at least one citation',
    });
  });

  // The database enforces its own enum at write time, but a bad value here
  // passed validate/approve clean before and only failed on import, minutes
  // into a bulk run -- see docs/lessons/lessons/0003-a-check-that-exists-but-doesnt-run.html.
  it('rejects a confidence value outside the enum', () => {
    const b = batch();
    b.claims[0].confidence = 'REPORTED' as never;

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'claims[0]',
      message: expect.stringContaining('confidence "REPORTED" is not one of'),
    });
  });

  it('rejects a reviewStatus value outside the enum', () => {
    const b = batch();
    b.claims[0].reviewStatus = 'PENDING' as never;

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'claims[0]',
      message: expect.stringContaining('reviewStatus "PENDING" is not one of'),
    });
  });

  it('rejects a claim that backs no recorded value, since the pages already hold the text', () => {
    const b = batch();
    b.claims[0].field = undefined;
    b.claims[0].relationshipType = undefined;

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'claims[0]',
      message: 'a claim must name the field or relationship it supports',
    });
  });

  it('rejects a half-specified relationship claim', () => {
    const b = batch();
    b.claims[0].relationshipType = 'COMPANION_OF';

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'claims[0]',
      message: 'a relationship claim needs type, related kind and related slug',
    });
  });

  it('accepts a fully specified relationship claim', () => {
    const b = batch();
    b.claims[0].relationshipType = 'COMPANION_OF';
    b.claims[0].relatedSubjectKind = 'PERSON';
    b.claims[0].relatedSubjectSlug = 'prophet-muhammad';

    expect(validateBatch(b, files(), manifests(), pages())).toEqual([]);
  });

  it('rejects a page absent from the store', () => {
    const b = batch();
    b.accounts[0].pages[0].printedPage = '404';

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'accounts[0].pages[0]',
      message: `no store page at v1/404 for "siyar-risalah"`,
    });
  });

  it('rejects a gap in page sequence', () => {
    const b = batch();
    b.accounts[0].pages.push({ sequence: 3, printedPage: '6' });

    const issues = validateBatch(b, files(), manifests(), pages({ 'siyar-risalah/v1/6': 'نص' }));

    expect(issues).toContainEqual({
      path: 'accounts[0].pages[1]',
      message: 'sequence must be 2, found 3',
    });
  });

  it('rejects duplicate claim keys', () => {
    const b = batch();
    b.claims.push({ ...b.claims[0] });

    expect(validateBatch(b, files(), manifests(), pages())).toContainEqual({
      path: 'claims[1]',
      message: 'duplicate claim key "abu-ubaydah/full-name"',
    });
  });
});

describe('checklistReminders', () => {
  it('reminds when a PERSON account declares no notInSource items', () => {
    const b = batch();

    expect(checklistReminders(b)).toEqual([
      'abu-ubaydah-ibn-al-jarrah: no notInSource items declared — run npm run catalog:checklist -- abu-ubaydah-ibn-al-jarrah before approving',
    ]);
  });

  it('stays quiet once at least one item is marked notInSource', () => {
    const b = batch();
    b.accounts[0].notInSource = ['wives'];

    expect(checklistReminders(b)).toEqual([]);
  });

  it('ignores non-PERSON accounts', () => {
    const b = batch();
    b.accounts[0].subjectKind = 'BATTLE';

    expect(checklistReminders(b)).toEqual([]);
  });
});

describe('checkApproval', () => {
  it('refuses a batch that was never approved', () => {
    const result = checkApproval(batch());

    expect(result.approved).toBe(false);
    expect(result).toMatchObject({ reason: 'the batch has no recorded approval' });
  });

  it('accepts the exact approved revision', () => {
    const b = batch();
    const revision = batchRevision(b);
    b.approval = { revision, approvedAt: '2026-09-09', approvedBy: 'msskzx' };

    expect(checkApproval(b)).toEqual({ approved: true, revision });
  });

  it('refuses a batch edited after approval', () => {
    const b = batch();
    b.approval = { revision: batchRevision(b), approvedAt: '2026-09-09', approvedBy: 'msskzx' };
    b.claims[0].assertion = 'عامر بن عبد الله';

    const result = checkApproval(b);

    expect(result.approved).toBe(false);
  });

  it('ignores edits to the approval block itself when hashing', () => {
    const b = batch();
    const revision = batchRevision(b);
    b.approval = { revision, approvedAt: '2026-09-10', approvedBy: 'someone-else' };

    expect(batchRevision(b)).toBe(revision);
  });

  // Store page text is published on its own (docs/plans/source-page-store.md)
  // and does not gate a batch's approval, so only the batch's own content —
  // claims, citations, account spans — changes the revision.
  it('changes revision when an account span changes', () => {
    const b = batch();
    const before = batchRevision(b);
    b.accounts[0].pages.push({ sequence: 2, printedPage: '6' });

    expect(batchRevision(b)).not.toBe(before);
  });
});
