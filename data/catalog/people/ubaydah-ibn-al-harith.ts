import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * He reaches this chapter through Zaynab bint Khuzaymah's obituary, which
 * names him her second husband and says he was martyred at Badr. That is the
 * one value chapter six adds to him; everything else his rows held is carried
 * on the marker, a module having made him catalog-owned.
 */
const ubaydahIbnAlHarith = {
  kind: 'PERSON',
  slug: 'ubaydah-ibn-al-harith',
  name: 'عبيدة بن الحارث',
  nameTransliterated: 'Ubaydah ibn al-Harith',
  hasProfile: true,
  fields: {
    // Carried from the seed rows.
    fullName: {
      value: 'عبيدة بن الحارث بن المطلب بن عبد مناف بن قصي القرشي المطلبي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    // Carried from the seed rows.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'HUSBAND', inverse: 'WIFE', to: 'zaynab-bint-khuzaymah', claims: ['zaynab-khuzaymah/wife-ubaydah'] },
    // Carried from the graph seed.
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-al-muttalib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ubaydahIbnAlHarith;
