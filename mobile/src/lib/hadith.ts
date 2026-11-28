import data from '@shared/data/hadith/units.json';
import forty from '@shared/data/hadith/forty.json';
import type { AppForty, AppHadith, AppHadithUnit, FortyEntry } from '@shared/hadith';

export const HADITH = data as AppHadith;

export const hadithUnit = (id: string): AppHadithUnit | undefined => HADITH.units.find(unit => unit.id === id);

export const FORTY: AppForty = { ...(forty as AppForty), entries: (forty as AppForty).entries.filter(entry => !entry.source) };

export const fortyEntry = (n: number): FortyEntry | undefined => FORTY.entries.find(entry => entry.n === n);

export const shamelaPage = (book: keyof AppForty['books'], id: number) => `https://shamela.ws/book/${FORTY.books[book].shamela}/${id}`;

export const JIBRIL = { muslim: 'muslim-jibril', bukhari: 'bukhari-jibril' } as const;
