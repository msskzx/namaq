import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

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

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.person.count({ where });
    const totalPages = Math.ceil(total / limit);

    // Get paginated results
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
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people data' },
      { status: 500 }
    );
  }
}