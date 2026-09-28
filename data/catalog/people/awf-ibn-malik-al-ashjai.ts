import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. No nasab beyond tribe given on his own page.
 */
const awfIbnMalikAlAshjai = {
  kind: 'PERSON',
  slug: 'awf-ibn-malik-al-ashjai',
  name: 'عوف بن مالك الأشجعي',
  nameTransliterated: 'Awf ibn Malik al-Ashjai',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عوف بن مالك الأشجعي الغطفاني',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default awfIbnMalikAlAshjai;
