import { NextResponse } from 'next/server';
import { titles } from '@/../prisma/titlesSeedData';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const title = titles.find((t) => t.slug === slug);
    if (!title) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(title);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch title' }, { status: 500 });
  }
} 