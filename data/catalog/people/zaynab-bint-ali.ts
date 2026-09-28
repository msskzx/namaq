import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and virtues are carried
 * from the retired prisma/personSeedData.ts entry, uncited.
 */
const zaynabBintAli = {
  kind: 'PERSON',
  slug: 'zaynab-bint-ali',
  name: 'زينب بنت علي',
  nameTransliterated: 'Zaynab bint Ali',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'زينب بنت علي بن أبي طالب الهاشمية القرشية', claims: legacyUnreviewed },
    virtues: {
      value: 'بنت علي وفاطمة، حفيدة النبي، عرفت بشجاعتها وفصاحتها.',
      claims: legacyUnreviewed,
    },
  },
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'MOTHER', to: 'fatimah-bint-muhammad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default zaynabBintAli;
