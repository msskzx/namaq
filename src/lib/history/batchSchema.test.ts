import { describe, expect, it } from 'vitest';
import {
  batchRevision,
  checkApproval,
  validateBatch,
  type BatchFiles,
  type HistoryBatch,
} from './batchSchema';

function files(overrides: BatchFiles = {}): BatchFiles {
  return {
    'summary.md': '# Batch summary',
    'accounts/abu-ubaydah/001.md': 'نص الصفحة الأولى',
    ...overrides,
  };
}

function batch(overrides: Partial<HistoryBatch> = {}): HistoryBatch {
  return {
    slug: 'abu-ubaydah-pilot',
    summaryFile: 'summary.md',
    sources: [{ slug: 'siyar-risalah', title: 'سير أعلام النبلاء', digitalHost: 'shamela' }],
    accounts: [
      {
        sourceSlug: 'siyar-risalah',
        subjectKind: 'PERSON',
        subjectSlug: 'abu-ubaydah-ibn-al-jarrah',
        extractionUrl: 'https://shamela.ws/book/10906/1431',
        accessedAt: '2026-09-09',
        pages: [
          {
            sequence: 1,
            printedPage: '5',
            bodyFile: 'accounts/abu-ubaydah/001.md',
            passages: [{ anchor: 'p5-opening', excerpt: 'أبو عبيدة بن الجراح' }],
          },
        ],
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
            passageAnchor: 'p5-opening',
            pageReference: '5',
            extractionUrl: 'https://shamela.ws/book/10906/1431',
            excerptArabic: 'أبو عبيدة بن الجراح',
            accessedAt: '2026-09-09',
          },
        ],
      },
    ],
    ...overrides,
  };
}

describe('validateBatch', () => {
  it('accepts a well-formed batch', () => {
    expect(validateBatch(batch(), files())).toEqual([]);
  });

  it('rejects a citation whose source is not declared', () => {
    const b = batch();
    b.claims[0].citations[0].sourceSlug = 'unknown-book';

    expect(validateBatch(b, files())).toContainEqual({
      path: 'claims[0].citations[0]',
      message: 'unknown source "unknown-book"',
    });
  });

  it('rejects a citation without a usable extraction link', () => {
    const b = batch();
    b.claims[0].citations[0].extractionUrl = 'not a url';

    expect(validateBatch(b, files())).toContainEqual({
      path: 'claims[0].citations[0]',
      message: 'extractionUrl must be an http(s) URL',
    });
  });

  it('accepts a citation with no printed page', () => {
    const b = batch();
    delete b.claims[0].citations[0].pageReference;

    expect(validateBatch(b, files())).toEqual([]);
  });

  it('rejects a citation pointing at a passage no page declares', () => {
    const b = batch();
    b.claims[0].citations[0].passageAnchor = 'p9-missing';

    expect(validateBatch(b, files())).toContainEqual({
      path: 'claims[0].citations[0]',
      message: 'citation targets unknown passage "p9-missing"',
    });
  });

  it('rejects a claim with no citation', () => {
    const b = batch();
    b.claims[0].citations = [];

    expect(validateBatch(b, files())).toContainEqual({
      path: 'claims[0]',
      message: 'every claim needs at least one citation',
    });
  });

  it('rejects a claim that backs no recorded value, since the pages already hold the text', () => {
    const b = batch();
    b.claims[0].field = undefined;
    b.claims[0].relationshipType = undefined;

    expect(validateBatch(b, files())).toContainEqual({
      path: 'claims[0]',
      message: 'a claim must name the field or relationship it supports',
    });
  });

  it('rejects a half-specified relationship claim', () => {
    const b = batch();
    b.claims[0].relationshipType = 'COMPANION_OF';

    expect(validateBatch(b, files())).toContainEqual({
      path: 'claims[0]',
      message: 'a relationship claim needs type, related kind and related slug',
    });
  });

  it('accepts a fully specified relationship claim', () => {
    const b = batch();
    b.claims[0].relationshipType = 'COMPANION_OF';
    b.claims[0].relatedSubjectKind = 'PERSON';
    b.claims[0].relatedSubjectSlug = 'prophet-muhammad';

    expect(validateBatch(b, files())).toEqual([]);
  });

  it('rejects a page whose Markdown file is absent', () => {
    const b = batch();
    b.accounts[0].pages[0].bodyFile = 'accounts/abu-ubaydah/404.md';

    expect(validateBatch(b, files())).toContainEqual({
      path: 'accounts[0].pages[0]',
      message: 'missing page file "accounts/abu-ubaydah/404.md"',
    });
  });

  it('rejects a gap in page sequence', () => {
    const b = batch();
    b.accounts[0].pages.push({ sequence: 3, bodyFile: 'accounts/abu-ubaydah/002.md' });

    const issues = validateBatch(b, files({ 'accounts/abu-ubaydah/002.md': 'نص' }));

    expect(issues).toContainEqual({
      path: 'accounts[0].pages[1]',
      message: 'sequence must be 2, found 3',
    });
  });

  it('rejects duplicate claim keys', () => {
    const b = batch();
    b.claims.push({ ...b.claims[0] });

    expect(validateBatch(b, files())).toContainEqual({
      path: 'claims[1]',
      message: 'duplicate claim key "abu-ubaydah/full-name"',
    });
  });
});

describe('checkApproval', () => {
  it('refuses a batch that was never approved', () => {
    const result = checkApproval(batch(), files());

    expect(result.approved).toBe(false);
    expect(result).toMatchObject({ reason: 'the batch has no recorded approval' });
  });

  it('accepts the exact approved revision', () => {
    const b = batch();
    const revision = batchRevision(b, files());
    b.approval = { revision, approvedAt: '2026-09-09', approvedBy: 'msskzx' };

    expect(checkApproval(b, files())).toEqual({ approved: true, revision });
  });

  it('refuses a batch edited after approval', () => {
    const b = batch();
    b.approval = { revision: batchRevision(b, files()), approvedAt: '2026-09-09', approvedBy: 'msskzx' };
    b.claims[0].assertion = 'عامر بن عبد الله';

    const result = checkApproval(b, files());

    expect(result.approved).toBe(false);
  });

  it('ignores edits to the approval block itself when hashing', () => {
    const b = batch();
    const revision = batchRevision(b, files());
    b.approval = { revision, approvedAt: '2026-09-10', approvedBy: 'someone-else' };

    expect(batchRevision(b, files())).toBe(revision);
  });

  it("changes revision when a page's Markdown changes", () => {
    const b = batch();
    const before = batchRevision(b, files());

    expect(batchRevision(b, files({ 'accounts/abu-ubaydah/001.md': 'نص مختلف' }))).not.toBe(before);
  });
});
