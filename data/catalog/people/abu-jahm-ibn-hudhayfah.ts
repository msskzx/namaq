import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Name possibly Ubayd, per his own page ("qeela ismuhu Ubayd") --
 * no further nasab chain given.
 */
const abuJahmIbnHudhayfah = {
  kind: 'PERSON',
  slug: 'abu-jahm-ibn-hudhayfah',
  name: 'أبو جهم بن حذيفة القرشي',
  nameTransliterated: 'Abu Jahm ibn Hudhayfah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عبيد بن حذيفة القرشي العدوي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuJahmIbnHudhayfah;
