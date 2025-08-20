import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const categorySlug = searchParams.get('category');
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  console.log(categorySlug);

  try {
    const whereClause = categorySlug
      ? {
        categories: {
          some: {
            slug: categorySlug
          }
        }
      }
      : {};

    const charities = await prisma.charity.findMany({
      where: whereClause,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      },
      take: limit,
    });

    return NextResponse.json(charities);
  } catch (error) {
    console.error('Error fetching charities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charities' },
      { status: 500 }
    );
  }
}
