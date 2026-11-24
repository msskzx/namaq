import dataFile from '@shared/data/events/life.json';
import type { AppLife, AppLifeEntry } from '@shared/events/life';
import { personLifeItems, type LifeItem } from '@shared/events/lifeTimeline';
import type { AppPerson } from '@shared/tarajim';
import { battleOf } from '@/lib/battles';
import { dataOf } from '@shared/appData';

const data = dataOf(dataFile);

/** Each person's «حياته» (shared/events/life.ts): written from the catalog by scripts/battles/buildAppBattles.ts. */
const LIFE = data as AppLife;

/** The events, battles and sira stories a person is in, dated by year first, then the undated stories. */
export const lifeOf = (slug: string): AppLifeEntry[] => LIFE[slug] ?? [];

/** A person's rows on the «حياته» timeline (shared/events/lifeTimeline.ts), each battle's kind from its page. */
export const personLife = (person: AppPerson): LifeItem[] => personLifeItems(person, lifeOf(person.slug), slug => battleOf(slug)?.kind?.value);
