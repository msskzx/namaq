import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { filterAndRankSubjects } from '@/lib/subjectSearch';
import { parsePagination } from '@/lib/apiParams';
import { apiError, CATALOG_CACHE_HEADERS } from '@/lib/apiError';

const DEFAULT_PAGE_SIZE = 12;

// PersonWithTitles (src/types/person.ts) plus graphRank/nameTransliterated,
// which the search ranking in subjectSearch.ts also needs. Long text fields
// (nasab, biography, ...) the list view never renders are left out. See
// docs/plans/backend-issues.md, item 3b.
const personListSelect = {
  id: true,
  slug: true,
  name: true,
  fullName: true,
  nameTransliterated: true,
  sex: true,
  graphRank: true,
  titles: true,
} satisfies Prisma.PersonSelect;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const search = searchParams.get('search');
    const { page, limit, skip } = parsePagination(searchParams, { defaultLimit: DEFAULT_PAGE_SIZE });

    const where: Prisma.PersonWhereInput = {};

    if (title) {
      where.titles = { some: { slug: title } };
    }

    if (!search) {
      const total = await prisma.person.count({ where });
      const totalPages = Math.ceil(total / limit);
      const people = await prisma.person.findMany({
        where,
        select: personListSelect,
        orderBy: [{ graphRank: { sort: 'asc', nulls: 'last' } }, { name: 'asc' }],
        take: limit,
        skip,
      });

      return NextResponse.json(
        {
          data: people,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        },
        { headers: CATALOG_CACHE_HEADERS }
      );
    }

    // Keep this search in PostgreSQL instead of joining Neo4j. The stores are
    // intentionally independent until the canonical-data pipeline is in place.
    // graphRank is an exception: it's a graph-derived signal, but it's computed
    // offline and persisted here, so reading it is still a plain Postgres read.
    const people = await prisma.person.findMany({ where, select: personListSelect });
    const results = filterAndRankSubjects(people, search).map(({ subject }) => subject);
    const total = results.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        data: results.slice(skip, skip + limit),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      { headers: CATALOG_CACHE_HEADERS }
    );
  } catch (error) {
    return apiError('GET /api/people', error, 'Failed to fetch people data');
  }
}
