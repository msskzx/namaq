import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. The companion exonerated alongside Aisha in the Ifk (slander)
 * incident -- his own page recounts his role in escorting her back to the
 * caravan.
 */
const safwanIbnAlMuattal = {
  kind: 'PERSON',
  slug: 'safwan-ibn-al-muattal',
  name: 'صفوان بن المعطل',
  nameTransliterated: 'Safwan ibn al-Muattal',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'صفوان بن المعطل بن رحضة بن المؤمل السلمي الذكواني',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default safwanIbnAlMuattal;
