import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const search = searchParams.get('search');

  const where: any = {};

  if (title) {
    where.titles = { some: { slug: title } };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { fullName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const people = await prisma.person.findMany({
    where,
    include: { titles: true },
  });

  return NextResponse.json(people);
} 