import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  console.log(title)

  const people = await prisma.person.findMany({
    where: title
      ? {
          titles: {
            some: { slug: title },
          },
        }
      : {},
    include: { titles: true },
  });

  return NextResponse.json(people);
} 