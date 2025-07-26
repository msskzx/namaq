import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const title = await prisma.title.findUnique({
      where: { slug },
      include: { people: true },
    });
    if (!title) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(title);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch title' }, { status: 500 });
  }
}