import { prisma } from '@/lib/prisma';
import { pageHeadings } from '@/lib/history/sectionHeadings';
import type { Prisma } from '@/generated/prisma';

/**
 * Reading an account is the same work whoever asked for it: the profile asks
 * for one person's accounts and the bookshelf asks for one source's, and from
 * there the paging, the page body and the section index do not differ. The
 * queries live here so the two route pairs are the `where` clause and nothing
 * else.
 */

const accountSummary = {
  id: true,
  subjectKind: true,
  subjectSlug: true,
  entryIdentifier: true,
  titleArabic: true,
  volume: true,
  extractionUrl: true,
  source: true,
  _count: { select: { pages: true } },
} as const;

/**
 * Where an entry begins in its work, taken from the host's page id for its
 * first page.
 *
 * A SourceAccount records no position of its own, so `createdAt` is the only
 * order the table has, and that is the order batches were imported rather than
 * the order the work reads in: the pilot batch lands first and the sira, which
 * opens the book, lands last. The host numbers its pages in the work's own
 * sequence, so the first page's id stands in until an account carries its
 * place itself. An entry with no id sorts last rather than jumping the queue.
 */
function openingPage(url: string | null | undefined) {
  const id = url?.match(/(\d+)\s*$/)?.[1];
  return id ? Number(id) : Number.MAX_SAFE_INTEGER;
}

/**
 * Which volumes each account's pages are bound in, and the run of pages in
 * each. An entry is a run of pages and a run can cross a binding, so one entry
 * may sit in two volumes -- the sira is 497 pages of one and 491 of the next --
 * and the contents list it under both, each with only its own pages.
 */
async function volumeSpans(accountIds: string[]) {
  if (accountIds.length === 0) return new Map<string, VolumeSpan[]>();

  const groups = await prisma.sourceAccountPage.groupBy({
    by: ['accountId', 'volumeId'],
    where: { accountId: { in: accountIds }, volumeId: { not: null } },
    _min: { sequence: true },
    _max: { sequence: true },
    _count: { _all: true },
  });
  const volumeIds = [...new Set(groups.map((group) => group.volumeId!))];
  const volumes = volumeIds.length
    ? await prisma.sourceVolume.findMany({
        where: { id: { in: volumeIds } },
        select: { id: true, number: true, name: true },
      })
    : [];
  const volumeById = new Map(volumes.map((volume) => [volume.id, volume]));

  // The printed page each run opens on, which is what a reader looks for in a
  // contents list; the sequence only says where it falls in our own paging.
  const openings = await prisma.sourceAccountPage.findMany({
    where: { OR: groups.map((group) => ({ accountId: group.accountId, sequence: group._min.sequence! })) },
    select: { accountId: true, sequence: true, printedPage: true },
  });
  const printedAt = new Map(openings.map((page) => [`${page.accountId}:${page.sequence}`, page.printedPage]));

  const spans = new Map<string, VolumeSpan[]>();
  for (const group of groups) {
    const volume = volumeById.get(group.volumeId!);
    if (!volume) continue;
    const list = spans.get(group.accountId) ?? [];
    list.push({
      number: volume.number,
      name: volume.name,
      firstSequence: group._min.sequence!,
      firstPrintedPage: printedAt.get(`${group.accountId}:${group._min.sequence}`) ?? null,
      lastSequence: group._max.sequence!,
      pageCount: group._count._all,
    });
    spans.set(group.accountId, list);
  }
  spans.forEach((list) => list.sort((a, b) => a.number - b.number));
  return spans;
}

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

  const openings = rows.length
    ? await prisma.sourceAccountPage.findMany({
        where: { accountId: { in: rows.map((row) => row.id) }, sequence: 1 },
        select: { accountId: true, extractionUrl: true },
      })
    : [];
  const openingByAccount = new Map(openings.map((page) => [page.accountId, openingPage(page.extractionUrl)]));

  const spans = await volumeSpans(rows.map((row) => row.id));

  return rows
    .map(({ _count, ...account }) => ({
      ...account,
      pageCount: _count.pages,
      subjectName: nameBySlug.get(account.subjectSlug) ?? null,
      volumes: spans.get(account.id) ?? [],
    }))
    .sort((a, b) => (openingByAccount.get(a.id) ?? 0) - (openingByAccount.get(b.id) ?? 0));
}

export async function readPage(accountId: string, sequence: number) {
  return prisma.sourceAccountPage.findUnique({
    where: { accountId_sequence: { accountId, sequence } },
    select: {
      sequence: true,
      printedPage: true,
      bodyMarkdown: true,
      notesMarkdown: true,
      extractionUrl: true,
    },
  });
}

/**
 * Every heading the account's pages declare. Building it reads every page's
 * body, which is why it is served apart from the page itself.
 */
export async function sectionIndex(accountId: string) {
  const pages = await prisma.sourceAccountPage.findMany({
    where: { accountId },
    select: { sequence: true, printedPage: true, bodyMarkdown: true },
    orderBy: { sequence: 'asc' },
  });

  return pages.flatMap((page) =>
    pageHeadings(page.bodyMarkdown).map((heading) => ({
      sequence: page.sequence,
      printedPage: page.printedPage,
      heading: heading.text,
    })),
  );
}

/**
 * The reader's payload: every account the caller may page through, the one it
 * asked for, and the page it is showing. A whole account can run to hundreds
 * of printed pages, so the caller names the page it wants rather than
 * receiving every account's full text on load.
 */
export async function accountsPayload(
  where: Prisma.SourceAccountWhereInput,
  requestedAccount: string | null,
  requestedPage: number,
  /** Each caller says what the account was not found in, since it knows. */
  unknownAccount: string,
) {
  const accounts = await listAccounts(where);
  if (accounts.length === 0) return { status: 200 as const, body: { accounts: [], account: null, page: null } };

  const selected = requestedAccount
    ? accounts.find((account) => account.id === requestedAccount)
    : accounts[0];

  if (!selected) return { status: 404 as const, body: { error: unknownAccount } };

  const page = await readPage(selected.id, requestedPage);
  if (!page) {
    return {
      status: 404 as const,
      body: { error: `Page ${requestedPage} is outside this account`, pageCount: selected.pageCount },
    };
  }

  return { status: 200 as const, body: { accounts, account: selected, page } };
}
