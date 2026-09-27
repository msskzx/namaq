import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * The seed entry (prisma/personSeedData.ts) and the graph node's edges
 * (neo4j/graphSeedData2.ts) are retired; what they held is carried here on
 * the legacy marker, the way hamzah-ibn-abd-al-muttalib.ts already carries
 * his brother's. No batch has read his own chapter yet.
 */
const abuTalib = {
  kind: 'PERSON',
  slug: 'abu-talib',
  name: 'أبو طالب بن عبد المطلب',
  nameTransliterated: 'Abu Talib ibn Abd al-Muttalib',
  hasProfile: true,
  fields: {
    fullName: { value: 'عبد مناف بن عبد المطلب بن هاشم القرشي الهاشمي (أبو طالب)', claims: legacyUnreviewed },
    virtues: {
      value: 'عم النبي وكافله بعد وفاة جده، حاميه وناصره في بداية الدعوة الإسلامية رغم عدم إسلامه.',
      claims: legacyUnreviewed,
    },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'fatimah-bint-asad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuTalib;
