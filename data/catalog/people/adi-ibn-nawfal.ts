import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const adiIbnNawfal = {
  kind: 'PERSON',
  slug: 'adi-ibn-nawfal',
  name: 'عدي بن نوفل',
  nameTransliterated: 'Adi ibn Nawfal',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'nawfal-ibn-abd-manaf', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default adiIbnNawfal;
