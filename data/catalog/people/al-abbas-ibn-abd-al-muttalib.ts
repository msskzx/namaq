import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alAbbasIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'al-abbas-ibn-abd-al-muttalib',
  name: 'العباس بن عبد المطلب',
  nameTransliterated: 'Al-Abbas ibn Abd al-Muttalib',
  hasProfile: true,
  fields: {
    fullName: { value: 'العباس بن عبد المطلب بن هاشم القرشي الهاشمي', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'umm-al-fadl-bint-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alAbbasIbnAbdAlMuttalib;
