import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
try {
    const { slug } = await params;
    console.log(slug);
    const surahNumber = parseInt(slug, 10);
    
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { error: 'Invalid surah number' },
        { status: 400 }
      );
    }

    // First find the surah by number to get its ID
    const surah = await prisma.surah.findFirst({
      where: { number: surahNumber },
      include: {
        ayat: {
          orderBy: {
            number: 'asc',
          },
        },
      },
    });

    if (!surah) {
      return NextResponse.json(
        { error: 'Surah not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(surah);
  } catch (error) {
    console.error('Error fetching surah:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surah' },
      { status: 500 }
    );
  }
}
