import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData7.ts entry. The Negus of
 * Abyssinia: al-Dhahabi discusses him within the Companions section with
 * the qualifier "تابعي من وجه، صاحب من وجه" (a Follower in one respect, a
 * Companion in another) -- he never met the Prophet in person, but the
 * Prophet performed a unique funeral prayer in absentia for him. No Arab
 * nasab exists for him (a foreign king), so no fullName and no ancestor
 * relation.
 */
const anNajashi = {
  kind: 'PERSON',
  slug: 'an-najashi',
  name: 'النجاشي',
  nameTransliterated: 'An-Najashi (the Negus)',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default anNajashi;
