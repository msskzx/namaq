import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

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