import data from '@shared/data/hadith/units.json';
import type { AppHadith, AppHadithUnit } from '@shared/hadith';

/** The hadith in the app, the website's own (shared/hadith.ts): written for the phone by scripts/model/buildAppHadith.ts. */
export const HADITH = data as AppHadith;

export const hadithUnit = (id: string): AppHadithUnit | undefined => HADITH.units.find(unit => unit.id === id);

/** The hadith the tab lists; a commentary's pages open from the hadith it explains. */
export const LISTED = HADITH.units.filter(unit => unit.explains.length === 0);
