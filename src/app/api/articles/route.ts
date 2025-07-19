import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    const articles = await prisma.article.findMany({
      include: { categories: true },
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      ...(limit && { take: parseInt(limit) }),
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch articles.' }, { status: 500 });
  }
} 