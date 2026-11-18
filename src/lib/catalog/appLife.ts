// A person's «حياته» for the phone app (shared/events/life.ts): only what is cited, both the person's place in it and its year.
import type { AppLife, AppLifeEntry } from '@shared/events/life';
import { batchClaims, citing, type Claim } from './appBattles';
import type { Catalog } from './types';

export function appLife(catalog: Catalog, claims: Map<string, Claim> = batchClaims()): AppLife {
  const { refs, cited } = citing(claims);
  const life: AppLife = {};
  const add = (person: string, entry: AppLifeEntry) => {
    if (!entry.refs.length) return;
    (life[person] ??= []).push(entry);
  };
  for (const event of catalog.events) {
    const year = cited(event.fields.hijriYear);
    const kind = event.reports?.length ? 'story' : 'event';
    // An event with no cited year stays off the timeline (owner, 2026-11-18); a story shows undated.
    if (kind === 'event' && !year) continue;
    for (const person of event.people) add(person.person, { kind, slug: event.slug, name: event.name, ...(year ? { year } : {}), refs: refs(person.claims) });
  }
  for (const battle of catalog.battles) {
    const year = cited(battle.fields?.hijriYear);
    if (!year) continue;
    for (const p of battle.participants) {
      if (!p.isMuslim || (p.relation ?? 'PARTICIPATED_IN') !== 'PARTICIPATED_IN') continue;
      add(p.person, { kind: 'battle', slug: battle.slug, name: battle.name, year, role: p.status?.includes('MARTYRED') ? 'استشهد فيها' : 'شهدها', refs: refs(p.claims) });
    }
  }
  for (const entries of Object.values(life)) {
    entries.sort((a, b) => (a.year && b.year ? a.year.value - b.year.value : a.year ? -1 : b.year ? 1 : 0));
  }
  return life;
}
