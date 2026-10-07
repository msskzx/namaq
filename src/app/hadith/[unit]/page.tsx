import { notFound } from 'next/navigation';
import HadithUnit from '@/components/hadith/HadithUnit';
import { isnadGraph } from '@/lib/model/isnadGraph';
import { loadUnitView } from '@/lib/modelUnits';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HadithUnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const view = await loadUnitView((await params).unit);
  if (!view) notFound();
  const agents = view.reports.flatMap((r) =>
    isnadGraph(r, view.compiler ?? view.book).nodes.flatMap((n) => (n.agent ? [n.agent] : [])),
  );
  const people = await prisma.person
    .findMany({ where: { slug: { in: agents } }, select: { slug: true } })
    .catch(() => []);
  return <HadithUnit view={view} profiles={people.map((p) => p.slug)} />;
}
