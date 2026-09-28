import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. His own page
 * lists nine candidate real names and disputes his father's name too;
 * al-Dhahabi's own stated preference ("أرجحها") is used here. Mother
 * Maymunah bint Sabih (per al-Tabarani, no further chain given) is not
 * modelled as a separate node. Son al-Muharrar, a narrator from him, is
 * not yet in this pipeline.
 */
const abuHurayrah = {
  kind: 'PERSON',
  slug: 'abu-hurayrah',
  name: 'أبو هريرة',
  nameTransliterated: 'Abu Hurayrah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عبد الرحمن بن صخر الدوسي اليماني',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuHurayrah;
