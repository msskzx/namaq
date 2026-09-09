import { describe, expect, it, vi } from 'vitest';
import type { PrismaClient } from '@/generated/prisma';
import { importBatch } from './importBatch';
import type { BatchFiles, HistoryBatch } from './batchSchema';

/**
 * A Prisma stand-in that records writes. Ids are derived from the arguments so
 * assertions can follow how rows reference each other.
 */
function fakePrisma() {
  const calls = {
    accountDeletes: [] as unknown[],
    citationDeletes: [] as unknown[],
    pages: [] as Record<string, unknown>[],
    passages: [] as Record<string, unknown>[],
    citations: [] as Record<string, unknown>[],
    claimUpserts: [] as Record<string, unknown>[],
    accountUpserts: [] as Record<string, unknown>[],
  };

  let pageCount = 0;
  let passageCount = 0;

  const tx = {
    reviewBatch: { upsert: vi.fn(async () => ({ id: 'batch-1' })) },
    historicalSource: { upsert: vi.fn(async ({ where }: never) => ({ id: `source-${(where as { slug: string }).slug}` })) },
    sourceAccount: {
      upsert: vi.fn(async (args: Record<string, unknown>) => {
        calls.accountUpserts.push(args);
        return { id: 'account-1' };
      }),
    },
    sourceAccountPage: {
      deleteMany: vi.fn(async (args: unknown) => {
        calls.accountDeletes.push(args);
        return { count: 0 };
      }),
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        calls.pages.push(data);
        pageCount += 1;
        return { id: `page-${pageCount}` };
      }),
    },
    sourcePassage: {
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        calls.passages.push(data);
        passageCount += 1;
        return { id: `passage-${passageCount}` };
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
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        calls.citations.push(data);
        return { id: 'citation-1' };
      }),
    },
  };

  const prisma = {
    $transaction: (run: (client: typeof tx) => Promise<unknown>) => run(tx),
  } as unknown as PrismaClient;

  return { prisma, calls, tx };
}

const files: BatchFiles = {
  'summary.md': '# summary',
  'accounts/abu-ubaydah/001.md': 'نص الصفحة',
};

function batch(): HistoryBatch {
  return {
    slug: 'abu-ubaydah-pilot',
    summaryFile: 'summary.md',
    sources: [{ slug: 'siyar-risalah', title: 'سير أعلام النبلاء' }],
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
            passages: [{ anchor: 'p5-opening', excerpt: 'أبو عبيدة' }],
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
            extractionUrl: 'https://shamela.ws/book/10906/1431',
            excerptArabic: 'أبو عبيدة',
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

    expect(await importBatch(prisma, batch(), files)).toEqual({
      sources: 1,
      accounts: 1,
      pages: 1,
      claims: 1,
      citations: 1,
    });
  });

  it('stores the page Markdown the batch file names', async () => {
    const { prisma, calls } = fakePrisma();

    await importBatch(prisma, batch(), files);

    expect(calls.pages[0]).toMatchObject({ printedPage: '5', bodyMarkdown: 'نص الصفحة', sequence: 1 });
  });

  it('links a citation to the passage its anchor names', async () => {
    const { prisma, calls } = fakePrisma();

    await importBatch(prisma, batch(), files);

    expect(calls.citations[0]).toMatchObject({ claimId: 'claim-1', passageId: 'passage-1' });
  });

  it('keys claims on their authoring key so a re-import updates in place', async () => {
    const { prisma, calls } = fakePrisma();

    await importBatch(prisma, batch(), files);

    expect(calls.claimUpserts[0]).toMatchObject({ where: { authoringKey: 'abu-ubaydah/full-name' } });
  });

  it("clears an account's old pages and a claim's old citations before rewriting", async () => {
    const { prisma, calls } = fakePrisma();

    await importBatch(prisma, batch(), files);

    expect(calls.accountDeletes).toEqual([{ where: { accountId: 'account-1' } }]);
    expect(calls.citationDeletes).toEqual([{ where: { claimId: 'claim-1' } }]);
  });

  it('records a narrator-only mention as no graph relationship', async () => {
    const { prisma, calls } = fakePrisma();
    const b = batch();
    b.claims[0].assertion = 'حدثنا محمد بن سعد عن أبي عبيدة';

    await importBatch(prisma, b, files);

    expect(calls.claimUpserts[0]).toMatchObject({
      create: { relationshipType: null, relatedSubjectSlug: null },
    });
  });
});
