import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.charityCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        img: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            charities: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching charity categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charity categories' },
      { status: 500 }
    );
  }
}
