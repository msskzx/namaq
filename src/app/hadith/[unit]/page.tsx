import { notFound } from 'next/navigation';
import HadithUnit from '@/components/hadith/HadithUnit';
import { loadUnitView } from '@/lib/modelUnits';

export const dynamic = 'force-dynamic';

export default async function HadithUnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const view = await loadUnitView((await params).unit);
  if (!view) notFound();
  return <HadithUnit view={view} />;
}
