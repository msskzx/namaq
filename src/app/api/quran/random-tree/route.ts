import { NextResponse } from 'next/server';
import { getHomePreviews } from '@/lib/homePreviewData';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const data = await getHomePreviews(new URL(request.url).searchParams.get('exclude') ?? '');
    const names = await prisma.surah.findMany({ select: { number: true, name: true } });
    data.branches.names = Object.fromEntries(names.map(row => [row.number, row.name]));
    return NextResponse.json(data.branches, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Could not load a tree' }, { status: 500 });
  }
}
