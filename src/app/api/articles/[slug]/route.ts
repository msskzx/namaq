import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params;
    const article = await prisma.article.findUnique({
      where: { slug: slug },
      include: { categories: true },
    });
    if (!article) {
      return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch article.' }, { status: 500 });
  }
} 