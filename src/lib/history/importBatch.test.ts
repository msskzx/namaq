import { describe, expect, it, vi } from 'vitest';
import type { PrismaClient } from '@/generated/prisma';
import { importBatch } from './importBatch';
import type { HistoryBatch, SourceManifests, StorePages } from './batchSchema';
import type { SourceManifest } from './sourceStore';

/**
 * A Prisma stand-in that records writes. Ids are derived from the arguments so
 * assertions can follow how rows reference each other.
 */
function fakePrisma() {
  const calls = {
    spanDeletes: [] as unknown[],
    citationDeletes: [] as unknown[],
    pages: [] as Record<string, unknown>[],
    spans: [] as Record<string, unknown>[],
    passages: [] as Record<string, unknown>[],
    citations: [] as Record<string, unknown>[],
    claimUpserts: [] as Record<string, unknown>[],
    accountUpserts: [] as Record<string, unknown>[],
    volumeUpserts: [] as { id: string; number: number }[],
  };

  const tx = {
    reviewBatch: { upsert: vi.fn(async () => ({ id: 'batch-1' })) },
    historicalSource: { upsert: vi.fn(async ({ where }: never) => ({ id: `source-${(where as { slug: string }).slug}` })) },
    // Volumes are upserted per source and then read back, so an account can
    // link to one another batch declared as well as one this batch did.
    sourceVolume: {
      upsert: vi.fn(async ({ where }: never) => {
        const key = (where as { sourceId_number: { sourceId: string; number: number } }).sourceId_number;
        const row = { id: `volume-${key.sourceId}-${key.number}`, number: key.number };
        calls.volumeUpserts.push(row);
        return row;
      }),
      findMany: vi.fn(async () => calls.volumeUpserts),
    },
    sourceAccount: {
      upsert: vi.fn(async (args: Record<string, unknown>) => {
        calls.accountUpserts.push(args);
        return { id: 'account-1' };
      }),
    },
    // A page is shared across every account whose entry touches it, so it is
    // upserted by its natural key (volume + printed page) rather than
    // recreated wholesale per account.
    sourcePage: {
      upsert: vi.fn(async ({ where, create }: { where: { volumeId_printedPage: { volumeId: string; printedPage: number } }; create: Record<string, unknown> }) => {
        const { volumeId, printedPage } = where.volumeId_printedPage;
        const row = { id: `page-${volumeId}-${printedPage}`, ...create };
        calls.pages.push(row);
        return row;
      }),
    },
    sourcePassage: {
      upsert: vi.fn(async ({ where, create }: { where: { pageId_anchor: { pageId: string; anchor: string } }; create: Record<string, unknown> }) => {
        const row = { id: `passage-${where.pageId_anchor.anchor}`, ...create };
        calls.passages.push(row);
        return row;
      }),
    },
    sourceAccountSpan: {
      deleteMany: vi.fn(async (args: unknown) => {
        calls.spanDeletes.push(args);
        return { count: 0 };
      }),
      createMany: vi.fn(async ({ data }: { data: Record<string, unknown>[] }) => {
        data.forEach((row) => calls.spans.push(row));
        return { count: data.length };
      }),
    },
    historicalClaim: {
      upsert: vi.fn(async (args: Record<string, unknown>) => {
        calls.claimUpserts.push(args);
        return { id: 'claim-1' };
      }),
    },
    citation: {
      deleteMany: vi.fn(async (args: unknown) => {
        calls.citationDeletes.push(args);
        return { count: 0 };
      }),
      createMany: vi.fn(async ({ data }: { data: Record<string, unknown>[] }) => {
        data.forEach((row) => calls.citations.push(row));
        return { count: data.length };
      }),
    },
  };

  const transactionOptions: unknown[] = [];
  const prisma = {
    $transaction: (run: (client: typeof tx) => Promise<unknown>, options?: unknown) => {
      transactionOptions.push(options);
      return run(tx);
    },
  } as unknown as PrismaClient;

  return { prisma, calls, tx, transactionOptions };
}

function manifest(overrides: Partial<SourceManifest> = {}): SourceManifest {
  return { slug: 'siyar-risalah', title: 'سير أعلام النبلاء', volumes: [], ...overrides };
}

function manifests(...list: SourceManifest[]): SourceManifests {
  return new Map(list.map((m) => [m.slug, m]));
}

function pages(overrides: Record<string, string> = {}): StorePages {
  const bodies: Record<string, string> = { 'siyar-risalah/v1/5': 'نص الصفحة', ...overrides };
  return new Map(Object.entries(bodies).map(([key, body]) => [key, { body, notes: null }]));
}

function batch(): HistoryBatch {
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
            extractionUrl: 'https://shamela.ws/book/10906/1431',
            excerptArabic: 'نص الصفحة',
            accessedAt: '2026-09-09',
          },
        ],
      },
    ],
  };
}

describe('importBatch', () => {
  it('reports what it wrote', async () => {
    const { prisma } = fakePrisma();

    expect(await importBatch(prisma, batch(), manifests(manifest({ volumes: [{ number: 1 }] })), pages())).toEqual({
      sources: 1,
      accounts: 1,
      pages: 1,
      claims: 1,
      citations: 1,
    });
  });

  it("stores the store page's Markdown", async () => {
    const { prisma, calls } = fakePrisma();

    await importBatch(prisma, batch(), manifests(manifest({ volumes: [{ number: 1 }] })), pages());

    expect(calls.pages[0]).toMatchObject({ printedPage: 5, bodyMarkdown: 'نص الصفحة' });
  });

  // An entry is a run of pages and a run can cross a binding, so the volume is
  // written per page: each takes its entry's volume unless it names its own.
  it('binds each page in its own volume, defaulting to the one its entry opens in', async () => {
    const { prisma, calls } = fakePrisma();
    const crossing = batch();
    crossing.accounts[0].volumeNumber = 1;
    crossing.accounts[0].pages = [
      { sequence: 1, printedPage: '527' },
      { sequence: 2, printedPage: '5', volumeNumber: 2 },
    ];
    crossing.claims = [];

    await importBatch(
      prisma,
      crossing,
      manifests(
        manifest({
          volumes: [
            { number: 1, name: 'السيرة النبوية ج١' },
            { number: 2, name: 'السيرة النبوية ج٢' },
          ],
        }),
      ),
      pages({ 'siyar-risalah/v1/527': 'نص', 'siyar-risalah/v2/5': 'نص' }),
    );

    expect(calls.pages.map((page) => page.id)).toEqual([
      'page-volume-source-siyar-risalah-1-527',
      'page-volume-source-siyar-risalah-2-5',
    ]);
    // Two volumes means two spans, one printed page each.
    expect(calls.spans).toEqual([
      { accountId: 'account-1', volumeId: 'volume-source-siyar-risalah-1', firstPrintedPage: 527, lastPrintedPage: 527 },
      { accountId: 'account-1', volumeId: 'volume-source-siyar-risalah-2', firstPrintedPage: 5, lastPrintedPage: 5 },
    ]);
  });

  it('links a citation to the passage its anchor names', async () => {
    const { prisma, calls } = fakePrisma();

    await importBatch(prisma, batch(), manifests(manifest({ volumes: [{ number: 1 }] })), pages());

    expect(calls.citations[0]).toMatchObject({ claimId: 'claim-1', passageId: 'passage-1/5-p1' });
  });

  it('keys claims on their authoring key so a re-import updates in place', async () => {
    const { prisma, calls } = fakePrisma();

    await importBatch(prisma, batch(), manifests(manifest({ volumes: [{ number: 1 }] })), pages());

    expect(calls.claimUpserts[0]).toMatchObject({ where: { authoringKey: 'abu-ubaydah/full-name' } });
  });

  it("clears an account's old spans and a claim's old citations before rewriting", async () => {
    const { prisma, calls } = fakePrisma();

    await importBatch(prisma, batch(), manifests(manifest({ volumes: [{ number: 1 }] })), pages());

    expect(calls.spanDeletes).toEqual([{ where: { accountId: 'account-1' } }]);
    expect(calls.citationDeletes).toEqual([{ where: { claimId: { in: ['claim-1'] } } }]);
  });

  it('records the batch under its slug and revision together', async () => {
    const { prisma, tx } = fakePrisma();

    await importBatch(prisma, batch(), manifests(manifest({ volumes: [{ number: 1 }] })), pages());

    expect(tx.reviewBatch.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug_revision: { slug: 'abu-ubaydah-pilot', revision: expect.any(String) } },
      }),
    );
  });

  it('carries the approval into the recorded batch', async () => {
    const { prisma, tx } = fakePrisma();
    const approved = batch();
    approved.approval = { revision: 'r1', approvedAt: '2026-09-09', approvedBy: 'msskzx' };

    await importBatch(prisma, approved, manifests(manifest({ volumes: [{ number: 1 }] })), pages());

    expect(tx.reviewBatch.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ approvedBy: 'msskzx' }) }),
    );
  });

  it('imports claims at the review status the files give them', async () => {
    const { prisma, calls } = fakePrisma();

    await importBatch(prisma, batch(), manifests(manifest({ volumes: [{ number: 1 }] })), pages());

    expect(calls.claimUpserts[0]).toMatchObject({ create: { reviewStatus: 'NOT_REVIEWED' } });
  });

  it('gives the transaction long enough for a whole account', async () => {
    const { prisma, transactionOptions } = fakePrisma();

    await importBatch(prisma, batch(), manifests(manifest({ volumes: [{ number: 1 }] })), pages());

    expect(transactionOptions[0]).toMatchObject({ timeout: 120_000 });
  });

  it('records a narrator-only mention as no graph relationship', async () => {
    const { prisma, calls } = fakePrisma();
    const b = batch();
    b.claims[0].assertion = 'حدثنا محمد بن سعد عن أبي عبيدة';

    await importBatch(prisma, b, manifests(manifest({ volumes: [{ number: 1 }] })), pages());

    expect(calls.claimUpserts[0]).toMatchObject({
      create: { relationshipType: null, relatedSubjectSlug: null },
    });
  });
});
