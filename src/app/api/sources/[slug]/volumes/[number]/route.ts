import { NextResponse } from 'next/server';
import { volumeContents } from '@/lib/history/sourceAccounts';

/** One volume's contents, in the book's own printed-page order. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; number: string }> },
) {
  const { slug, number } = await params;
  const volumeNumber = Number(number);
  if (!Number.isInteger(volumeNumber) || volumeNumber < 1) {
    return NextResponse.json({ error: 'number must be a positive whole number' }, { status: 400 });
  }

  try {
    const contents = await volumeContents(slug, volumeNumber);
    if (!contents) return NextResponse.json({ error: 'Unknown volume for this source' }, { status: 404 });
    return NextResponse.json(contents);
  } catch (error) {
    console.error('Volume contents API error:', error);
    return NextResponse.json({ error: 'Failed to fetch this volume' }, { status: 500 });
  }
}
