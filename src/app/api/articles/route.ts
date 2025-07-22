import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface WhereClause {
  isPublished: boolean;
  special?: boolean;
  categories?: {
    some: {
      slug: string;
    };
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const special = searchParams.get('special');
    const category = searchParams.get('category');
    
    // Build where clause
    const whereClause: WhereClause = { isPublished: true };
    
    // Filter by special articles if specified
    if (special !== null) {
      whereClause.special = special === 'true';
    }
    
    // Filter by category if specified
    if (category) {
      whereClause.categories = {
        some: {
          slug: category
        }
      };
    }
    
    const articles = await prisma.article.findMany({
      include: { categories: true },
      where: whereClause,
      orderBy: { publishedAt: 'desc' },
      ...(limit && { take: parseInt(limit) }),
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch articles.' }, { status: 500 });
  }
} 