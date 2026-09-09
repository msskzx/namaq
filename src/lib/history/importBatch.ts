import type { PrismaClient } from '@/generated/prisma';
import type { BatchFiles, ClaimRecord, HistoryBatch } from './batchSchema';
import { batchRevision } from './batchSchema';

export interface ImportResult {
  sources: number;
  accounts: number;
  pages: number;
  claims: number;
  citations: number;
}

/** Prisma's transaction client: the same API minus the connection-level calls. */
type Tx = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

/**
 * A batch is dozens of pages and hundreds of passages, and the default five
 * seconds is not enough for that many round trips against a hosted database.
 */
const transactionOptions = { timeout: 120_000, maxWait: 20_000 };

function claimFields(claim: ClaimRecord, batchId: string) {
  return {
    subjectKind: claim.subjectKind,
    subjectSlug: claim.subjectSlug,
    field: claim.field ?? null,
    assertion: claim.assertion,
    relationshipType: claim.relationshipType ?? null,
    relatedSubjectKind: claim.relatedSubjectKind ?? null,
    relatedSubjectSlug: claim.relatedSubjectSlug ?? null,
    confidence: claim.confidence ?? 'UNASSESSED',
    reviewStatus: claim.reviewStatus ?? 'NOT_REVIEWED',
    reviewerNote: claim.reviewerNote ?? null,
    disputed: claim.disputed ?? false,
    batchId,
  };
}

async function writeAccounts(tx: Tx, batch: HistoryBatch, files: BatchFiles, sourceIds: Map<string, string>, batchId: string) {
  const accountIds = new Map<string, string>();
  const passageIds = new Map<string, string>();
  let pages = 0;

  for (const account of batch.accounts) {
    const identity = {
      sourceId: sourceIds.get(account.sourceSlug)!,
      subjectKind: account.subjectKind,
      subjectSlug: account.subjectSlug,
    };
    const fields = {
      entryIdentifier: account.entryIdentifier ?? null,
      titleArabic: account.titleArabic ?? null,
      volume: account.volume ?? null,
      extractionUrl: account.extractionUrl,
      accessedAt: new Date(account.accessedAt),
      batchId,
    };

    const row = await tx.sourceAccount.upsert({
      where: { sourceId_subjectKind_subjectSlug: identity },
      create: { ...identity, ...fields },
      update: fields,
    });
    accountIds.set(`${account.sourceSlug}:${account.subjectSlug}`, row.id);

    // Pages carry no authoring key of their own, so a re-import replaces the
    // account's text wholesale rather than matching pages one by one.
    await tx.sourceAccountPage.deleteMany({ where: { accountId: row.id } });
    await tx.sourceAccountPage.createMany({
      data: account.pages.map((page) => ({
        accountId: row.id,
        sequence: page.sequence,
        printedPage: page.printedPage ?? null,
        bodyMarkdown: files[page.bodyFile] ?? '',
        notesMarkdown: page.notesFile ? (files[page.notesFile] ?? null) : null,
        extractionUrl: page.extractionUrl ?? null,
      })),
    });
    pages += account.pages.length;

    const written = await tx.sourceAccountPage.findMany({
      where: { accountId: row.id },
      select: { id: true, sequence: true },
    });
    const pageIdBySequence = new Map(written.map((page) => [page.sequence, page.id]));

    const passages = account.pages.flatMap((page) =>
      (page.passages ?? []).map((passage) => ({
        pageId: pageIdBySequence.get(page.sequence)!,
        anchor: passage.anchor,
        kind: passage.kind ?? 'BODY',
        excerpt: passage.excerpt,
      })),
    );
    if (passages.length > 0) {
      await tx.sourcePassage.createMany({ data: passages });
      const stored = await tx.sourcePassage.findMany({
        where: { pageId: { in: [...pageIdBySequence.values()] } },
        select: { id: true, anchor: true },
      });
      stored.forEach((passage) => passageIds.set(passage.anchor, passage.id));
    }
  }

  return { accountIds, passageIds, pages };
}

/**
 * Writes a validated, approved batch. Re-running it with the same files is a
 * no-op in effect, so a partly failed import can be retried without leaving
 * duplicate accounts, claims or citations behind.
 */
export async function importBatch(
  prisma: PrismaClient,
  batch: HistoryBatch,
  files: BatchFiles,
): Promise<ImportResult> {
  const revision = batchRevision(batch, files);

  return prisma.$transaction(async (tx) => {
    const batchRow = await tx.reviewBatch.upsert({
      where: { slug_revision: { slug: batch.slug, revision } },
      create: {
        slug: batch.slug,
        revision,
        summaryPath: batch.summaryFile,
        approvedAt: batch.approval ? new Date(batch.approval.approvedAt) : null,
        approvedBy: batch.approval?.approvedBy ?? null,
        importedAt: new Date(),
      },
      update: { importedAt: new Date() },
    });

    const sourceIds = new Map<string, string>();
    for (const source of batch.sources) {
      const { slug, ...fields } = source;
      const row = await tx.historicalSource.upsert({
        where: { slug },
        create: { slug, ...fields },
        update: fields,
      });
      sourceIds.set(slug, row.id);
    }

    const { accountIds, passageIds, pages } = await writeAccounts(tx, batch, files, sourceIds, batchRow.id);

    const claimIds = new Map<string, string>();
    for (const claim of batch.claims) {
      const fields = claimFields(claim, batchRow.id);
      const row = await tx.historicalClaim.upsert({
        where: { authoringKey: claim.key },
        create: { authoringKey: claim.key, ...fields },
        update: fields,
      });
      claimIds.set(claim.key, row.id);
    }

    await tx.citation.deleteMany({ where: { claimId: { in: [...claimIds.values()] } } });

    const citations = batch.claims.flatMap((claim) =>
      claim.citations.map((citation) => ({
        claimId: claimIds.get(claim.key)!,
        subjectKind: claim.subjectKind,
        subjectSlug: claim.subjectSlug,
        sourceId: sourceIds.get(citation.sourceSlug)!,
        accountId: accountIds.get(`${citation.sourceSlug}:${claim.subjectSlug}`) ?? null,
        passageId: citation.passageAnchor ? (passageIds.get(citation.passageAnchor) ?? null) : null,
        paragraphKey: citation.paragraphKey ?? null,
        footnoteNumber: citation.footnoteNumber ?? null,
        volume: citation.volume ?? null,
        pageReference: citation.pageReference ?? null,
        extractionUrl: citation.extractionUrl,
        excerptArabic: citation.excerptArabic,
        accessedAt: new Date(citation.accessedAt),
      })),
    );
    if (citations.length > 0) await tx.citation.createMany({ data: citations });

    return {
      sources: batch.sources.length,
      accounts: batch.accounts.length,
      pages,
      claims: batch.claims.length,
      citations: citations.length,
    };
  }, transactionOptions);
}
