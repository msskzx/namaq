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
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: { value: 'العباس بن عبد المطلب بن هاشم القرشي الهاشمي', claims: legacyUnreviewed },
    // Carried from the retired prisma/personSeedData.ts entry, uncited.
    virtues: {
      value: 'عم النبي، من السابقين إلى الإسلام، كان له دور في حماية النبي والدعوة بعد إسلامه، جد الخلفاء العباسيين.',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'umm-al-fadl-bint-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alAbbasIbnAbdAlMuttalib;
