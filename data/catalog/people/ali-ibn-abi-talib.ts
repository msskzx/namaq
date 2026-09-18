import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the old seed, which holds أبو الحسن as a title assignment. A
 * kunya is a name, so it moves here (ADR 0014). No batch covers him yet, so
 * the value is in use with its evidence still owed; the batch that reaches his
 * entry promotes it and tombstones the title row the database still carries.
 */
const aliIbnAbiTalib = {
  kind: 'PERSON',
  slug: 'ali-ibn-abi-talib',
  name: 'علي بن أبي طالب',
  nameTransliterated: 'Ali ibn Abi Talib',
  hasProfile: true,

  fields: {
    kunya: { value: 'أبو الحسن', claims: legacyUnreviewed },
  },

  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default aliIbnAbiTalib;
