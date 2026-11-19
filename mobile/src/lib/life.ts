import data from '@shared/data/events/life.json';
import type { AppLife, AppLifeEntry } from '@shared/events/life';
import { lifeItems, type LifeItem } from '@shared/events/lifeTimeline';
import { pageLabel, type AppPerson } from '@shared/tarajim';
import { battleOf } from '@/lib/battles';
import { unvowelled } from '@/lib/tarajim';

/** Each person's «حياته» (shared/events/life.ts): written from the catalog by scripts/battles/buildAppBattles.ts. */
const LIFE = data as AppLife;

/** The events, battles and sira stories a person is in, dated by year first, then the undated stories. */
export const lifeOf = (slug: string): AppLifeEntry[] => LIFE[slug] ?? [];

/**
 * A person's rows on the «حياته» timeline: his entries, each battle's kind from its page, and his death where his entry
 * gives its year as a number (the first saying; the others shown on a tap, in their words).
 */
export function personLife(person: AppPerson): LifeItem[] {
  const [first, ...rest] = person.died.year.filter(fact => typeof fact.value === 'number');
  const cite = (fact: AppPerson['died']['year'][number]) => ({ text: unvowelled(fact.text), cite: pageLabel(fact.refs) });
  const death = first && {
    year: first.value as number, label: person.sex === 'FEMALE' ? 'وفاتها' : 'وفاته', refs: [cite(first)],
    others: rest.map(fact => ({ text: unvowelled(fact.text), refs: [cite(fact)] })),
  };
  return lifeItems(lifeOf(person.slug), slug => battleOf(slug)?.kind?.value, death || undefined);
}
