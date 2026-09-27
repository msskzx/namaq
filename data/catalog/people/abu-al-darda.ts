import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData11.ts entry. Kunya used as
 * the primary name, per the book's own heading; fullName uses Ibn Abi
 * Hatim's fullest reported chain (several shorter variants are also given
 * on his page). Wife Umm al-Darda' al-Alimah and son Bilal ibn Abi al-Darda'
 * are not yet in this pipeline.
 */
const abuAlDarda = {
  kind: 'PERSON',
  slug: 'abu-al-darda',
  name: 'أبو الدرداء',
  nameTransliterated: 'Abu al-Darda',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عويمر بن قيس بن زيد بن قيس بن أمية بن عامر بن عدي بن كعب الأنصاري الخزرجي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuAlDarda;
