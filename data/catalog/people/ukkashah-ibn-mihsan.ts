import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData6.ts entry. His own page
 * gives no nasab beyond his father's given name, so fullName keeps only
 * what the page actually states.
 */
const ukkashahIbnMihsan = {
  kind: 'PERSON',
  slug: 'ukkashah-ibn-mihsan',
  name: 'عكاشة بن محصن',
  nameTransliterated: 'Ukkashah ibn Mihsan',
  hasProfile: true,
  fields: {
    fullName: { value: 'عكاشة بن محصن الأسدي حليف قريش', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default ukkashahIbnMihsan;
