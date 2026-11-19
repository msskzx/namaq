import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BattleView from '@/components/battles/BattleView';
import { BATTLES, battleOf } from '@/lib/stories';

export const generateStaticParams = () => BATTLES.map(battle => ({ slug: battle.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return { title: battleOf((await params).slug)?.name ?? 'الغزوات والمعارك' };
}

/**
 * A battle, as the app's battle page (owner, 2026-11-18; every phone feature on the website too, owner 2026-11-19): where
 * it was on a still map, how many, how it went in the source's words, and who was there.
 */
export default async function BattlePage({ params }: { params: Promise<{ slug: string }> }) {
  const battle = battleOf((await params).slug);
  if (!battle) notFound();
  return (
    <div dir="rtl" className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <BattleView battle={battle} />
    </div>
  );
}
