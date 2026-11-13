import type { Metadata } from 'next';
import { getCardData } from '@/lib/homepageData';
import Library from './Library';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'المحفوظات وما نسيته', robots: { index: false, follow: false } };

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return <Library data={await getCardData()} tab={tab === 'forgotten' ? 'forgotten' : 'saved'} />;
}
