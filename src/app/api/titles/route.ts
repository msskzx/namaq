import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const titles = await prisma.title.findMany({
    select: {
      id: true,
      name: true,
      nameAr: true,
      slug: true,
    },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(titles);
} 