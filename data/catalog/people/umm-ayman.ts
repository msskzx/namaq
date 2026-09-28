import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. Barakah, the Prophet's Abyssinian
 * freedwoman/nurse and mother of Usama ibn Zaid, per the retired
 * prisma/personSeedData9.ts entry. Her own page gives no father or tribe at
 * all, so fullName is just her known given name.
 */
const ummAyman = {
  kind: 'PERSON',
  slug: 'umm-ayman',
  name: 'أم أيمن',
  nameTransliterated: 'Umm Ayman',
  hasProfile: true,
  fields: {
    fullName: { value: 'بركة', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'WIFE', inverse: 'HUSBAND', to: 'zaid-ibn-harithah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummAyman;
