import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * New to the catalog. The year comes from the death-year claim the person
 * module also follows, so the two cannot drift apart without one of them
 * failing its test.
 */
const plagueOfAmwas = {
  kind: 'EVENT',
  slug: 'plague-of-amwas',
  name: 'طاعون عمواس',
  nameTransliterated: 'Plague of Amwas',
  type: 'DEATH',
  fields: {
    hijriYear: { value: 18, claims: ['abu-ubaydah/death-year-18'] },
    location: { value: 'عمواس، بين الرملة وبيت المقدس', claims: ['abu-ubaydah/plague-of-amwas'] },
    description: {
      value: 'توفي أبو عبيدة بن الجراح في طاعون عمواس بعد أن أبى أن يفارق جنده.',
      claims: ['abu-ubaydah/plague-of-amwas'],
    },
  },
  people: [{ person: 'abu-ubaydah-ibn-al-jarrah', claims: ['abu-ubaydah/plague-of-amwas'] }],
} satisfies CatalogEvent;

export default plagueOfAmwas;
