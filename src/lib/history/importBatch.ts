import type { PrismaClient } from '@/generated/prisma';
import type { AccountRecord, ClaimRecord, HistoryBatch, SourceManifests, StorePages } from './batchSchema';
import { batchRevision, storePageKey } from './batchSchema';
import { pageAnchors } from './sourceStore';

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
 * A batch is usually dozens of pages and hundreds of passages, but the sira
 * alone runs to 988 pages, and pages and passages are now upserted one at a
 * time by natural key (docs/plans/source-page-store.md) rather than bulk
 * inserted, so round trips scale with the batch, not a fixed count. 120s
 * covered every batch but the sira; ten minutes covers it with room.
 */
const transactionOptions = { timeout: 600_000, maxWait: 20_000 };

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

/** Upserts every source manifest and volume the batch's accounts name. */
async function writeManifests(tx: Tx, manifests: SourceManifests) {
  const sourceIds = new Map<string, string>();
  const volumeIds = new Map<string, Map<number, string>>();

  for (const [slug, manifest] of manifests) {
    const { volumes, ...fields } = manifest;
    const row = await tx.historicalSource.upsert({
      where: { slug },
      create: fields,
      update: fields,
    });
    sourceIds.set(slug, row.id);

    const bySource = new Map<number, string>();
    for (const volume of volumes) {
      const written = await tx.sourceVolume.upsert({
        where: { sourceId_number: { sourceId: row.id, number: volume.number } },
        create: {
          sourceId: row.id,
          number: volume.number,
          name: volume.name ?? null,
          firstPrintedPage: volume.firstPrintedPage ?? null,
          lastPrintedPage: volume.lastPrintedPage ?? null,
          skippedPrintedPages: volume.skippedPrintedPages ?? [],
        },
        update: {
          name: volume.name ?? null,
          firstPrintedPage: volume.firstPrintedPage ?? null,
          lastPrintedPage: volume.lastPrintedPage ?? null,
          skippedPrintedPages: volume.skippedPrintedPages ?? [],
        },
      });
      bySource.set(volume.number, written.id);
    }
    volumeIds.set(slug, bySource);
  }

  return { sourceIds, volumeIds };
}

/**
 * Upserts every store page an account's run touches, keyed by
 * `(volumeId, printedPage)` -- the natural key that makes a page shared
 * across every account whose entry touches it, and keeps its id (and so its
 * passages' ids) stable across re-imports.
 */
async function writePagesAndPassages(
  tx: Tx,
  account: AccountRecord,
  sourceSlug: string,
  pages: StorePages,
  volumeIds: Map<number, string>,
  passageIds: Map<string, string>,
) {
  for (const page of account.pages) {
    const volumeNumber = page.volumeNumber ?? account.volumeNumber!;
    const volumeId = volumeIds.get(volumeNumber);
    if (!volumeId) continue;
    const store = pages.get(storePageKey(sourceSlug, volumeNumber, page.printedPage));
    if (!store) continue;

    const printedPage = Number(page.printedPage);
    // The store doesn't record each page's own Shamela id (only the account
    // that opened an entry does, on its own extractionUrl), so a shared page
    // has no single accurate host link of its own yet -- left null rather
    // than asserting one account's URL for a page other entries also touch.
    // Citation.extractionUrl is unaffected: each citation still carries its
    // own accurate link, authored per claim.
    const pageRow = await tx.sourcePage.upsert({
      where: { volumeId_printedPage: { volumeId, printedPage } },
      create: {
        volumeId,
        printedPage,
        bodyMarkdown: store.body,
        notesMarkdown: store.notes,
        accessedAt: new Date(account.accessedAt),
      },
      update: {
        bodyMarkdown: store.body,
        notesMarkdown: store.notes,
      },
    });

    for (const [anchor, excerpt] of pageAnchors(volumeNumber, page.printedPage, store.body)) {
      const passageRow = await tx.sourcePassage.upsert({
        where: { pageId_anchor: { pageId: pageRow.id, anchor } },
        create: { pageId: pageRow.id, anchor, excerpt },
        update: { excerpt },
      });
      passageIds.set(anchor, passageRow.id);
    }
  }
}

/** The [min, max] printed page an account's pages cover, per volume. */
function accountSpans(account: AccountRecord): Map<number, { first: number; last: number }> {
  const spans = new Map<number, { first: number; last: number }>();
  for (const page of account.pages) {
    const volumeNumber = page.volumeNumber ?? account.volumeNumber!;
    const printed = Number(page.printedPage);
    const span = spans.get(volumeNumber);
    if (!span) {
      spans.set(volumeNumber, { first: printed, last: printed });
    } else {
      span.first = Math.min(span.first, printed);
      span.last = Math.max(span.last, printed);
    }
  }
  return spans;
}

async function writeAccounts(
  tx: Tx,
  batch: HistoryBatch,
  pages: StorePages,
  sourceIds: Map<string, string>,
  batchId: string,
  volumeIds: Map<string, Map<number, string>>,
) {
  const passageIds = new Map<string, string>();
  let pageCount = 0;

  for (const account of batch.accounts) {
    const identity = {
      sourceId: sourceIds.get(account.sourceSlug)!,
      subjectKind: account.subjectKind,
      subjectSlug: account.subjectSlug,
    };
    const fields = {
      entryIdentifier: account.entryIdentifier ?? null,
      titleArabic: account.titleArabic ?? null,
      extractionUrl: account.extractionUrl,
      accessedAt: new Date(account.accessedAt),
      batchId,
    };

    const row = await tx.sourceAccount.upsert({
      where: { sourceId_subjectKind_subjectSlug: identity },
      create: { ...identity, ...fields },
      update: fields,
    });

    const sourceVolumeIds = volumeIds.get(account.sourceSlug) ?? new Map<number, string>();
    await writePagesAndPassages(tx, account, account.sourceSlug, pages, sourceVolumeIds, passageIds);
    pageCount += account.pages.length;

    // An account's spans have no authoring key of their own, so they are
    // replaced wholesale on each import rather than matched one by one.
    await tx.sourceAccountSpan.deleteMany({ where: { accountId: row.id } });
    const spans = [...accountSpans(account)]
      .filter(([volumeNumber]) => sourceVolumeIds.has(volumeNumber))
      .map(([volumeNumber, { first, last }]) => ({
        accountId: row.id,
        volumeId: sourceVolumeIds.get(volumeNumber)!,
        firstPrintedPage: first,
        lastPrintedPage: last,
      }));
    if (spans.length > 0) await tx.sourceAccountSpan.createMany({ data: spans });
  }

  return { passageIds, pages: pageCount };
}

/**
 * Writes a validated, approved batch. Re-running it with the same files is a
 * no-op in effect: pages and passages are upserted by their natural key, so a
 * partly failed import can be retried without duplicating or re-keying
 * anything a citation already points at.
 */
export async function importBatch(
  prisma: PrismaClient,
  batch: HistoryBatch,
  manifests: SourceManifests,
  pages: StorePages,
): Promise<ImportResult> {
  const revision = batchRevision(batch);

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

    const { sourceIds, volumeIds } = await writeManifests(tx, manifests);
    const { passageIds, pages: pageCount } = await writeAccounts(
      tx,
      batch,
      pages,
      sourceIds,
      batchRow.id,
      volumeIds,
    );

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
      sources: manifests.size,
      accounts: batch.accounts.length,
      pages: pageCount,
      claims: batch.claims.length,
      citations: citations.length,
    };
  }, transactionOptions);
}
