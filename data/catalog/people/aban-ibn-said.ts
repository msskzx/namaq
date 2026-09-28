import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abanIbnSaid = {
  kind: 'PERSON',
  slug: 'aban-ibn-said',
  name: 'أبان بن سعيد',
  nameTransliterated: 'Aban ibn Said',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'أبان بن سعيد بن العاص بن أمية بن عبد شمس بن عبد مناف بن قصي القرشي الأموي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'said-ibn-al-as', claims: legacyUnreviewed },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'amr-ibn-said-al-umawi',
      claims: ['amr-ibn-said-al-umawi-siyar50/brother-aban'],
    },
  ],
} satisfies CatalogPerson;

export default abanIbnSaid;
