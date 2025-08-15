import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const limit = Math.min(
      20,
      Math.max(1, parseInt(searchParams.get('limit') || '10', 10) || 10)
    );

    if (!q) {
      return NextResponse.json({ data: [] });
    }

    const where: Prisma.PersonWhereInput = {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { fullName: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
      ],
    };

    const people = await prisma.person.findMany({
      where,
      orderBy: [{ name: 'asc' }],
      take: limit,
      select: { id: true, slug: true, name: true, fullName: true },
    });

    return NextResponse.json({ data: people });
  } catch (error) {
    console.error('Error fetching people suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people suggestions' },
      { status: 500 }
    );
  }
}
