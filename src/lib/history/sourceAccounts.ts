import { prisma } from '@/lib/prisma';
import { pageHeadings } from '@/lib/history/sectionHeadings';
import type { Prisma } from '@/generated/prisma';

/**
 * Reading an account is the same work whoever asked for it: the profile asks
 * for one person's accounts and the bookshelf asks for one source's, and from
 * there the paging, the page body and the section index do not differ. The
 * queries live here so the two route pairs are the `where` clause and nothing
 * else.
 *
 * An account holds no pages of its own -- it names a span of pages per
 * volume (`SourceAccountSpan`), and the pages themselves belong to the
 * volume (`SourcePage`), shared by every account whose entry touches one --
 * see docs/plans/source-page-store.md and
 * docs/adr/0018-a-page-belongs-to-the-edition.md. `sequence` here is a
 * position within one account's own span(s), 1-based, translated to a real
 * `(volumeId, printedPage)` before touching `SourcePage`.
 */

const accountSummary = {
  id: true,
  subjectKind: true,
  subjectSlug: true,
  entryIdentifier: true,
  titleArabic: true,
  extractionUrl: true,
  source: true,
  spans: { select: { firstPrintedPage: true, lastPrintedPage: true, volume: { select: { number: true, name: true } } } },
} as const;

export interface VolumeSpan {
  number: number;
  name: string | null;
  /** The account's first and last page in this volume, by `sequence`. */
  firstSequence: number;
  /** The first page's number as printed, when the edition prints one. */
  firstPrintedPage: string | null;
  lastSequence: number;
  pageCount: number;
}

type SpanRow = { firstPrintedPage: number; lastPrintedPage: number; volume: { number: number; name: string | null } };

/** An account's spans, ordered by volume, with the running `sequence` each one starts at. */
function orderedSpans(spans: SpanRow[]) {
  const sorted = [...spans].sort((a, b) => a.volume.number - b.volume.number || a.firstPrintedPage - b.firstPrintedPage);
  let sequence = 1;
  return sorted.map((span) => {
    const pageCount = span.lastPrintedPage - span.firstPrintedPage + 1;
    const firstSequence = sequence;
    sequence += pageCount;
    return { ...span, firstSequence, lastSequence: firstSequence + pageCount - 1, pageCount };
  });
}

function toVolumeSpans(spans: SpanRow[]): VolumeSpan[] {
  return orderedSpans(spans).map((span) => ({
    number: span.volume.number,
    name: span.volume.name,
    firstSequence: span.firstSequence,
    firstPrintedPage: String(span.firstPrintedPage),
    lastSequence: span.lastSequence,
    pageCount: span.pageCount,
  }));
}

/** The `(volumeNumber, printedPage)` a 1-based `sequence` resolves to within an account's spans. */
function sequenceToPage(spans: SpanRow[], sequence: number): { volumeNumber: number; printedPage: number } | null {
  const span = orderedSpans(spans).find((candidate) => sequence >= candidate.firstSequence && sequence <= candidate.lastSequence);
  if (!span) return null;
  return { volumeNumber: span.volume.number, printedPage: span.firstPrintedPage + (sequence - span.firstSequence) };
}

async function volumeIdsBySource(sourceId: string): Promise<Map<number, string>> {
  const volumes = await prisma.sourceVolume.findMany({ where: { sourceId }, select: { id: true, number: true } });
  return new Map(volumes.map((volume) => [volume.number, volume.id]));
}

export async function listAccounts(where: Prisma.SourceAccountWhereInput) {
  const rows = await prisma.sourceAccount.findMany({
    where,
    select: accountSummary,
    orderBy: { createdAt: 'asc' },
  });

  // A profile already knows whose entry it is showing; a bookshelf does not,
  // and a slug is not a name to read. The subject's own name is resolved here
  // so the reader can label an entry by the person it is about. A subject with
  // no profile row keeps its slug, which is all there is to show.
  const slugs = rows.filter((row) => row.subjectKind === 'PERSON').map((row) => row.subjectSlug);
  const people = slugs.length
    ? await prisma.person.findMany({ where: { slug: { in: slugs } }, select: { slug: true, name: true } })
    : [];
  const nameBySlug = new Map(people.map((person) => [person.slug, person.name]));

  return rows
    .map((row) => {
      const volumes = toVolumeSpans(row.spans);
      return {
        ...row,
        spans: undefined,
        pageCount: volumes.reduce((total, span) => total + span.pageCount, 0),
        subjectName: row.subjectKind === 'PERSON' ? (nameBySlug.get(row.subjectSlug) ?? null) : null,
        volumes,
      };
    })
    // The book's own reading order: which volume an entry opens in, and
    // where in it -- see docs/plans/source-page-store.md, "Nonblocking".
    .sort((a, b) => (a.volumes[0]?.number ?? 0) - (b.volumes[0]?.number ?? 0) || (a.volumes[0]?.firstSequence ?? 0) - (b.volumes[0]?.firstSequence ?? 0));
}

async function accountSpans(accountId: string): Promise<SpanRow[]> {
  return prisma.sourceAccountSpan.findMany({
    where: { accountId },
    select: { firstPrintedPage: true, lastPrintedPage: true, volume: { select: { number: true, name: true } } },
  });
}

async function readSourcePage(sourceId: string, volumeNumber: number, printedPage: number, extractionUrl: string) {
  const volumeIds = await volumeIdsBySource(sourceId);
  const volumeId = volumeIds.get(volumeNumber);
  if (!volumeId) return null;
  const page = await prisma.sourcePage.findUnique({
    where: { volumeId_printedPage: { volumeId, printedPage } },
    select: { printedPage: true, bodyMarkdown: true, notesMarkdown: true, extractionUrl: true, passages: { select: { anchor: true, excerpt: true } } },
  });
  if (!page) return null;
  return {
    sequence: 0, // filled in by the caller, which knows the account's own spans
    printedPage: String(page.printedPage),
    bodyMarkdown: page.bodyMarkdown,
    notesMarkdown: page.notesMarkdown,
    extractionUrl: page.extractionUrl ?? extractionUrl,
    passages: page.passages,
  };
}

export async function readPage(accountId: string, sequence: number) {
  const account = await prisma.sourceAccount.findUnique({ where: { id: accountId }, select: { sourceId: true, extractionUrl: true } });
  if (!account) return null;
  const spans = await accountSpans(accountId);
  const target = sequenceToPage(spans, sequence);
  if (!target) return null;
  const page = await readSourcePage(account.sourceId, target.volumeNumber, target.printedPage, account.extractionUrl);
  return page && { ...page, sequence };
}

/** The most pages one request may ask for, so a range cannot read a whole book. */
export const MAX_PAGES_PER_REQUEST = 9;

/** Pages `from..to` (inclusive) of one account, in reading order. */
export async function readPages(accountId: string, from: number, to: number) {
  const account = await prisma.sourceAccount.findUnique({ where: { id: accountId }, select: { sourceId: true, extractionUrl: true } });
  if (!account) return [];
  const spans = await accountSpans(accountId);
  const pages = [];
  for (let sequence = from; sequence <= to; sequence += 1) {
    const target = sequenceToPage(spans, sequence);
    if (!target) continue;
    const page = await readSourcePage(account.sourceId, target.volumeNumber, target.printedPage, account.extractionUrl);
    if (page) pages.push({ ...page, sequence });
  }
  return pages;
}

/**
 * Page bodies alone, for a reader that already holds the account list and is
 * filling its cache ahead of the reader's position.
 */
export async function pagesPayload(
  where: Prisma.SourceAccountWhereInput,
  accountId: string,
  from: number,
  to: number,
  unknownAccount: string,
) {
  const account = await prisma.sourceAccount.findFirst({ where: { ...where, id: accountId }, select: { id: true } });
  if (!account) return { status: 404 as const, body: { error: unknownAccount } };
  return { status: 200 as const, body: { pages: await readPages(accountId, from, to) } };
}

/**
 * Every heading the account's pages declare. Building it reads every page's
 * body, which is why it is served apart from the page itself.
 */
export async function sectionIndex(accountId: string) {
  const account = await prisma.sourceAccount.findUnique({ where: { id: accountId }, select: { sourceId: true } });
  if (!account) return [];
  const spans = await accountSpans(accountId);
  const ordered = orderedSpans(spans);
  const volumeIds = await volumeIdsBySource(account.sourceId);

  const headings = [];
  for (const span of ordered) {
    const volumeId = volumeIds.get(span.volume.number);
    if (!volumeId) continue;
    const pages = await prisma.sourcePage.findMany({
      where: { volumeId, printedPage: { gte: span.firstPrintedPage, lte: span.lastPrintedPage } },
      select: { printedPage: true, bodyMarkdown: true },
      orderBy: { printedPage: 'asc' },
    });
    for (const page of pages) {
      const sequence = span.firstSequence + (page.printedPage - span.firstPrintedPage);
      for (const heading of pageHeadings(page.bodyMarkdown)) {
        headings.push({ sequence, printedPage: String(page.printedPage), heading: heading.text });
      }
    }
  }
  return headings;
}

/**
 * The reader's payload: every account the caller may page through, the one it
 * asked for, and the page it is showing. A whole account can run to hundreds
 * of printed pages, so the caller names the page it wants rather than
 * receiving every account's full text on load.
 */
/** Which account, and which of its own `sequence` positions, a citation's `(volume, printedPage)` deep link lands on. */
function resolveByPage(
  accounts: Awaited<ReturnType<typeof listAccounts>>,
  volumeNumber: number,
  printedPage: number,
) {
  for (const account of accounts) {
    const span = account.volumes.find(
      (candidate) => candidate.number === volumeNumber && printedPage >= Number(candidate.firstPrintedPage) && printedPage <= Number(candidate.firstPrintedPage) + candidate.pageCount - 1,
    );
    if (span) return { account, sequence: span.firstSequence + (printedPage - Number(span.firstPrintedPage)) };
  }
  return null;
}

export async function accountsPayload(
  where: Prisma.SourceAccountWhereInput,
  requestedAccount: string | null,
  requestedPage: number,
  /** Each caller says what the account was not found in, since it knows. */
  unknownAccount: string,
  /** A citation deep link: which account to open is resolved from the page itself. */
  volumeAndPage?: { volumeNumber: number; printedPage: number },
) {
  const accounts = await listAccounts(where);
  if (accounts.length === 0) return { status: 200 as const, body: { accounts: [], account: null, page: null } };

  const resolved = volumeAndPage ? resolveByPage(accounts, volumeAndPage.volumeNumber, volumeAndPage.printedPage) : null;
  if (volumeAndPage && !resolved) return { status: 404 as const, body: { error: unknownAccount } };

  const selected = resolved
    ? resolved.account
    : requestedAccount
      ? accounts.find((account) => account.id === requestedAccount)
      : accounts[0];
  requestedPage = resolved ? resolved.sequence : requestedPage;

  if (!selected) return { status: 404 as const, body: { error: unknownAccount } };

  const [page, pages] = await Promise.all([
    readPage(selected.id, requestedPage),
    readPages(selected.id, Math.max(1, requestedPage - 2), requestedPage + 2),
  ]);
  if (!page) {
    return {
      status: 404 as const,
      body: { error: `Page ${requestedPage} is outside this account`, pageCount: selected.pageCount },
    };
  }

  const pageNumbers = selected.volumes.flatMap((span) =>
    Array.from({ length: span.pageCount }, (_, index) => ({
      sequence: span.firstSequence + index,
      printedPage: String(Number(span.firstPrintedPage) + index),
      volume: { number: span.number },
    })),
  );

  return { status: 200 as const, body: { accounts, account: selected, page, pages, pageNumbers } };
}
