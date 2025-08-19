import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const charity = await prisma.charity.findUnique({
      where: { slug },
      include: {
        categories: true,
      }
    });

    if (!charity) {
      return NextResponse.json(
        { error: 'Charity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(charity);
  } catch (error) {
    console.error('Error fetching charity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charity' },
      { status: 500 }
    );
  }
}