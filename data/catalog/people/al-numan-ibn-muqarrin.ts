import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alNumanIbnMuqarrin = {
  kind: 'PERSON',
  slug: 'al-numan-ibn-muqarrin',
  name: 'النعمان بن مقرن',
  nameTransliterated: 'Al-Numan ibn Muqarrin',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'النعمان بن عمرو بن مقرن بن عائذ بن ميجا بن هجير بن نصر بن حبشية بن كعب بن ثور بن هدمة بن لاطم بن عثمان المزني',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-muqarrin', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alNumanIbnMuqarrin;
