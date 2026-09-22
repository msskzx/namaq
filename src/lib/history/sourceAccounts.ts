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

  return rows.map(({ _count, ...account }) => ({
    ...account,
    pageCount: _count.pages,
    subjectName: nameBySlug.get(account.subjectSlug) ?? null,
  }));
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
