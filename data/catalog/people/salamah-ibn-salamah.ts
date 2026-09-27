import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData11.ts entry. Paternal
 * cousin of Muhammad ibn Maslamah, who already declares the relation from
 * his own side ("ابن عمة محمد بن مسلمة" -- son of Muhammad ibn Maslamah's
 * paternal aunt, per his own page).
 */
const salamahIbnSalamah = {
  kind: 'PERSON',
  slug: 'salamah-ibn-salamah',
  name: 'سلمة بن سلامة',
  nameTransliterated: 'Salamah ibn Salamah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'سلمة بن سلامة بن وقش بن زغبة بن زعوراء بن عبد الأشهل الأنصاري الأشهلي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default salamahIbnSalamah;
