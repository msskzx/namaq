import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type AyahPair = { surah: number; ayah: number };

function parseIntStrict(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

function parsePairsParams(searchParams: URLSearchParams): AyahPair[] {
  const pairs: AyahPair[] = [];
  const pairsJoined = searchParams.get('q');
  if (pairsJoined) {
    for (const token of pairsJoined.split(',')) {
      const [s, a] = token.split(':').map(v => v?.trim());
      const surah = s ? parseIntStrict(s) : null;
      const ayah = a ? parseIntStrict(a) : null;
      if (surah && ayah) pairs.push({ surah, ayah });
    }
  }

  return pairs;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const pairsFromParams = parsePairsParams(searchParams);

    const pairs: AyahPair[] = pairsFromParams;
    if (pairs.length === 0) {
      return NextResponse.json(
        { error: "Provide surah:ayah parameters" },
        { status: 400 }
      );
    }

    // Validate ranges
    for (const { surah, ayah } of pairs) {
      if (surah < 1 || surah > 114 || ayah < 1) {
        return NextResponse.json({ error: 'Invalid surah or ayah number in query' }, { status: 400 });
      }
    }

    if (pairs.length === 1) {
      const { surah, ayah } = pairs[0];
      const result = await prisma.ayah.findFirst({
        where: {
          number: ayah,
          surah: { number: surah },
        },
        include: {
          surah: {
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
            },
          },
        },
      });

      if (!result) {
        return NextResponse.json({ error: 'Ayah not found' }, { status: 404 });
      }
      return NextResponse.json(result);
    }

    // Multiple pairs: fetch all, then order by requested order
    const results = await prisma.ayah.findMany({
      where: {
        OR: pairs.map(p => ({ number: p.ayah, surah: { number: p.surah } })),
      },
      include: {
        surah: {
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
          },
        },
      },
      orderBy: {
        globalNumber: 'asc',
      },
    });

    if (!results || results.length === 0) {
      return NextResponse.json({ error: 'Ayat not found' }, { status: 404 });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching ayah(s):', error);
    return NextResponse.json(
      { error: 'Failed to fetch ayah(s)' },
      { status: 500 }
    );
  }
}
