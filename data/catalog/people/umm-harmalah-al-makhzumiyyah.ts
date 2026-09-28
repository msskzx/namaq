import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const ummHarmalahAlMakhzumiyyah = {
  kind: 'PERSON',
  slug: 'umm-harmalah-al-makhzumiyyah',
  name: 'أم حرملة المخزومية',
  nameTransliterated: 'Umm Harmalah Al Makhzumiyyah',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SISTER', inverse: 'BROTHER', to: 'abu-jahl-ibn-hisham', claims: legacyUnreviewed },
    { type: 'MOTHER', inverse: 'SON', to: 'hisham-ibn-al-as', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummHarmalahAlMakhzumiyyah;
