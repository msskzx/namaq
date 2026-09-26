import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const titles = await prisma.title.findMany({
      select: {
        id: true,
        name: true,
        nameTransliterated: true,
        slug: true,
        _count: { select: { people: true } },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(titles.map(({ _count, ...title }) => ({ ...title, peopleCount: _count.people })));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch titles' }, { status: 500 });
  }
}