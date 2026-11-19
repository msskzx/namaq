import type { Metadata } from 'next';
import Card from '@/components/common/Card';
import { battleLine } from '@shared/battles/battle';
import { BATTLES } from '@/lib/stories';

export const metadata: Metadata = { title: 'الغزوات والمعارك' };

/** Every battle, earliest first; each opens its page (the app's battles screen). */
export default function BattlesPage() {
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-2xl flex-col gap-2.5 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">الغزوات والمعارك</h1>
      {BATTLES.map(battle => (
        <Card key={battle.slug} href={`/battles/${battle.slug}`} className="flex flex-col gap-0.5 px-3.5 py-2.5">
          <span className="text-[1.1875rem]">{battle.name}</span>
          <span className="text-sm text-[var(--home-muted)]">{battleLine(battle)}</span>
        </Card>
      ))}
    </div>
  );
}
