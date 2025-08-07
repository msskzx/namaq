import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const surahs = await prisma.surah.findMany({
      select: {
        id: true,
        number: true,
        name: true,
        nameTransliterated: true,
        nameTranslated: true,
        revelationType: true,
        numberOfAyat: true,
        recitation: true,
        revelationPeriod: true,
        revelationOrder: true,
        createdAt: true,
        updatedAt: true,
        page: true,
      },
      orderBy: {
        number: 'asc',
      },
    });

    return NextResponse.json(surahs);
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surahs' },
      { status: 500 }
    );
  }
}
