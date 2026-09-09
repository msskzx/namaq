import type { PrismaClient } from '@/generated/prisma';
import type { AccountRecord, BatchFiles, ClaimRecord, HistoryBatch } from './batchSchema';
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

function pageText(files: BatchFiles, path: string | undefined) {
  return path === undefined ? null : (files[path] ?? null);
}

async function writeAccount(tx: Tx, account: AccountRecord, files: BatchFiles, sourceId: string, batchId: string) {
  const identity = {
    sourceId,
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

  // Pages carry no authoring key of their own, so a re-import replaces the
  // account's text wholesale rather than trying to match pages one by one.
  await tx.sourceAccountPage.deleteMany({ where: { accountId: row.id } });

  const anchors = new Map<string, string>();
  for (const page of account.pages) {
    const pageRow = await tx.sourceAccountPage.create({
      data: {
        accountId: row.id,
        sequence: page.sequence,
        printedPage: page.printedPage ?? null,
        bodyMarkdown: pageText(files, page.bodyFile) ?? '',
        notesMarkdown: pageText(files, page.notesFile),
        extractionUrl: page.extractionUrl ?? null,
      },
    });

    for (const passage of page.passages ?? []) {
      const passageRow = await tx.sourcePassage.create({
        data: {
          pageId: pageRow.id,
          anchor: passage.anchor,
          kind: passage.kind ?? 'BODY',
          excerpt: passage.excerpt,
        },
      });
      anchors.set(passage.anchor, passageRow.id);
    }
  }

  return { accountId: row.id, pages: account.pages.length, anchors };
}

async function writeClaim(
  tx: Tx,
  claim: ClaimRecord,
  sourceIds: Map<string, string>,
  accountIds: Map<string, string>,
  anchors: Map<string, string>,
  batchId: string,
) {
  const fields = {
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

  const row = await tx.historicalClaim.upsert({
    where: { authoringKey: claim.key },
    create: { authoringKey: claim.key, ...fields },
    update: fields,
  });

  await tx.citation.deleteMany({ where: { claimId: row.id } });

  for (const citation of claim.citations) {
    await tx.citation.create({
      data: {
        claimId: row.id,
        subjectKind: claim.subjectKind,
        subjectSlug: claim.subjectSlug,
        sourceId: sourceIds.get(citation.sourceSlug)!,
        accountId: accountIds.get(`${citation.sourceSlug}:${claim.subjectSlug}`) ?? null,
        passageId: citation.passageAnchor ? (anchors.get(citation.passageAnchor) ?? null) : null,
        paragraphKey: citation.paragraphKey ?? null,
        footnoteNumber: citation.footnoteNumber ?? null,
        volume: citation.volume ?? null,
        pageReference: citation.pageReference ?? null,
        extractionUrl: citation.extractionUrl,
        excerptArabic: citation.excerptArabic,
        accessedAt: new Date(citation.accessedAt),
      },
    });
  }

  return claim.citations.length;
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

    const accountIds = new Map<string, string>();
    const anchors = new Map<string, string>();
    let pages = 0;
    for (const account of batch.accounts) {
      const written = await writeAccount(tx, account, files, sourceIds.get(account.sourceSlug)!, batchRow.id);
      accountIds.set(`${account.sourceSlug}:${account.subjectSlug}`, written.accountId);
      written.anchors.forEach((id, anchor) => anchors.set(anchor, id));
      pages += written.pages;
    }

    let citations = 0;
    for (const claim of batch.claims) {
      citations += await writeClaim(tx, claim, sourceIds, accountIds, anchors, batchRow.id);
    }

    return {
      sources: batch.sources.length,
      accounts: batch.accounts.length,
      pages,
      claims: batch.claims.length,
      citations,
    };
  });
}
