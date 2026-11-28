import dataFile from '@shared/data/events/life.json';
import type { AppLife, AppLifeEntry } from '@shared/events/life';
import { personLifeItems, type LifeItem } from '@shared/events/lifeTimeline';
import type { AppPerson } from '@shared/tarajim';
import { battleOf } from '@/lib/battles';
import { dataOf } from '@shared/appData';

const data = dataOf(dataFile);

const LIFE = data as AppLife;

export const lifeOf = (slug: string): AppLifeEntry[] => LIFE[slug] ?? [];

export const personLife = (person: AppPerson): LifeItem[] => personLifeItems(person, lifeOf(person.slug), slug => battleOf(slug)?.kind?.value);
