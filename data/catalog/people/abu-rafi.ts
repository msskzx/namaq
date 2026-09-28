import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData8.ts entry. A Coptic mawla
 * of the Prophet, originally enslaved by al-Abbas, then freed. His own page
 * gives two disputed given names ("يقال: اسمه إبراهيم، وقيل: أسلم") and no
 * Arab nasab at all, so no fullName and no ancestor relation -- same
 * precedent as salim-mawla-abi-hudhayfah/salman-al-farisi.
 */
const abuRafi = {
  kind: 'PERSON',
  slug: 'abu-rafi',
  name: 'أبو رافع',
  nameTransliterated: 'Abu Rafi',
  hasProfile: true,
  fields: {},
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuRafi;
