import type { Metadata } from 'next';
import Card from '@/components/common/Card';
import BattleTimeline from '@/components/battles/BattleTimeline';
import { battleLine } from '@shared/battles/battle';
import { battleTimeline, yearAnchor } from '@shared/battles/timeline';
import { BATTLES } from '@/lib/stories';

export const metadata: Metadata = { title: 'الغزوات والمعارك' };

/** Every battle: the timeline over the years, then the list by year (undated last); each row opens its page (the app's battles screen). */
export default function BattlesPage() {
  const timeline = battleTimeline(BATTLES);
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-2xl flex-col gap-2.5 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">الغزوات والمعارك</h1>
      <BattleTimeline madinah={timeline.madinah} after={timeline.after} />
      {timeline.groups.map(group => (
        <section key={group.title} id={group.year === undefined ? undefined : yearAnchor(group.year)} className="flex scroll-mt-20 flex-col gap-2.5 pt-1.5">
          <h2 className="text-sm text-[var(--home-muted)]">{group.title}</h2>
          {group.battles.map(battle => (
            <Card key={battle.slug} href={`/battles/${battle.slug}`} className="flex flex-col gap-0.5 px-3.5 py-2.5">
              <span className="text-[1.1875rem]">{battle.name}</span>
              <span className="text-sm text-[var(--home-muted)]">{battleLine(battle)}</span>
            </Card>
          ))}
        </section>
      ))}
    </div>
  );
}
