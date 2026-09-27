import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Real name Uqbah ibn Amr; his page gives two variant spellings
 * for one link in the chain ("Usayrah" or "Yusayrah") -- the fuller of the
 * two reports is used here since it continues the chain further.
 */
const abuMasudAlBadri = {
  kind: 'PERSON',
  slug: 'abu-masud-al-badri',
  name: 'أبو مسعود البدري',
  nameTransliterated: 'Abu Masud al-Badri',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عقبة بن عمرو بن ثعلبة بن يسيرة بن عسيرة بن عطية بن خدارة بن عوف بن الحارث بن الخزرج الأنصاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuMasudAlBadri;
