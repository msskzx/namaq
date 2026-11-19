import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PEOPLE, tiesView } from '@/lib/tarajim';
import TiesPage from './TiesPage';

export const generateStaticParams = () => PEOPLE.map(person => ({ slug: person.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const view = tiesView((await params).slug);
  return { title: view ? `صلات ${view.name}` : 'الصلات' };
}

/**
 * «الصلات» (the app's ties screen, owner 2026-11-18): the person in the middle and his ties round him, a line coloured by
 * the kind of tie. Someone with a page opens his own ties; someone without shows the sentence that states the tie.
 */
export default async function PersonTiesPage({ params }: { params: Promise<{ slug: string }> }) {
  const view = tiesView((await params).slug);
  if (!view) notFound();
  return <TiesPage view={view} />;
}
