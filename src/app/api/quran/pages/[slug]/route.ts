import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loadAyahText } from '@/lib/quran/readerAyat';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
try {
    const { slug } = await params;
    const pageNumber = parseInt(slug, 10);
    
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 604) {
      return NextResponse.json(
        { error: 'Invalid page number' },
        { status: 400 }
      );
    }

    // First find the surah by number to get its ID
    const ayat = await prisma.ayah.findMany({
      where: { page: pageNumber },
      orderBy: {
        globalNumber: 'asc',
      },
      include: { surah: { select: { number: true } } },
    });

    if (!ayat) {
      return NextResponse.json(
        { error: 'Ayah not found' },
        { status: 404 }
      );
    }

    const text = await loadAyahText();
    return NextResponse.json(ayat.map(({ surah, ...row }) => ({ ...row, text: text(surah.number, row.number) })));
  } catch (error) {
    console.error('Error fetching ayah:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ayah' },
      { status: 500 }
    );
  }
}
