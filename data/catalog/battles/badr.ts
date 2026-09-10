import type { CatalogBattle } from '@/lib/catalog/types';

/**
 * The entry adds that he killed his own father here, which is why the SON
 * relation in data/catalog/people/abu-ubaydah-ibn-al-jarrah.ts and this
 * participation are not in tension.
 */
const badr = {
  kind: 'BATTLE',
  slug: 'badr',
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/badr'] },
  ],
} satisfies CatalogBattle;

export default badr;
