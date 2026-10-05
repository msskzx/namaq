import { notFound } from 'next/navigation';
import HadithUnit from '@/components/hadith/HadithUnit';
import { hadithView } from '@/lib/model/hadithView';

export const dynamic = 'force-dynamic';

export default async function HadithUnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const view = hadithView((await params).unit);
  if (!view) notFound();
  return <HadithUnit view={view} />;
}
