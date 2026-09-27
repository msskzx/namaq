import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abuSufyanIbnHarb = {
  kind: 'PERSON',
  slug: 'abu-sufyan-ibn-harb',
  name: 'أبو سفيان بن حرب',
  nameTransliterated: 'Abu Sufyan ibn Harb',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'صخر بن حرب بن أمية بن عبد شمس بن عبد مناف بن قصي بن كلاب القرشي الأموي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'harb-ibn-umayyah', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'hind-bint-utbah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuSufyanIbnHarb;
