import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {  
  try {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
      where: { slug: slug },
      include: { articles: true },
    });
    if (!category) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch category.' }, { status: 500 });
  }
} 