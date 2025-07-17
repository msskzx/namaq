import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: params.slug },
      include: { articles: true },
    });
    if (!category) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category.' }, { status: 500 });
  }
} 