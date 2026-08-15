import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { filterAndRankPeople } from '@/lib/personSearch';

const DEFAULT_PAGE_SIZE = 12;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || DEFAULT_PAGE_SIZE.toString(), 10);
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const where: Prisma.PersonWhereInput = {};

    if (title) {
      where.titles = { some: { slug: title } };
    }

    if (!search) {
      const total = await prisma.person.count({ where });
      const totalPages = Math.ceil(total / limit);
      const people = await prisma.person.findMany({
        where,
        include: { titles: true },
        orderBy: { name: 'asc' },
        take: limit,
        skip,
      });

      return NextResponse.json({
        data: people,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      });
    }

    // Keep this search in PostgreSQL instead of joining Neo4j. The stores are
    // intentionally independent until the canonical-data pipeline is in place.
    const people = await prisma.person.findMany({ where, include: { titles: true } });
    const results = filterAndRankPeople(people, search).map(({ person }) => person);
    const total = results.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: results.slice(skip, skip + limit),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people data' },
      { status: 500 }
    );
  }
}
