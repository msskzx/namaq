import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const battle = await prisma.battle.findUnique({
      where: { slug },
      include: {
        participations: {
          include: {
            person: true,
          },
        },
      },
    });
    if (!battle) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(battle);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch battle' }, { status: 500 });
  }
} 