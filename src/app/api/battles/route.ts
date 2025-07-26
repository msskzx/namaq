import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const battles = await prisma.battle.findMany({
      orderBy: { hijriYear: 'asc' },
    });
    return NextResponse.json(battles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch battles' }, { status: 500 });
  }
} 