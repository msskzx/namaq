import data from '@shared/data/hadith/units.json';
import forty from '@shared/data/hadith/forty.json';
import type { AppForty, AppHadith, AppHadithUnit, FortyEntry } from '@shared/hadith';

/** The hadith in the app, the website's own (shared/hadith.ts): written for the phone by scripts/model/buildAppHadith.ts. */
export const HADITH = data as AppHadith;

export const hadithUnit = (id: string): AppHadithUnit | undefined => HADITH.units.find(unit => unit.id === id);

/** al-Nawawi's Forty and the Bukhari and Muslim records he names (scripts/hadith/buildForty.ts). */
export const FORTY = forty as AppForty;

export const fortyEntry = (n: number): FortyEntry | undefined => FORTY.entries.find(entry => entry.n === n);

/** A page of one of the Forty's books on Shamela, by the page's id there. */
export const shamelaPage = (book: keyof AppForty['books'], id: number) => `https://shamela.ws/book/${FORTY.books[book].shamela}/${id}`;

/** The Jibril pages, which tell no. 2 with its scenes: Muslim's from Umar, and al-Bukhari's from Abu Hurayra. */
export const JIBRIL = { muslim: 'muslim-jibril', bukhari: 'bukhari-jibril' } as const;
