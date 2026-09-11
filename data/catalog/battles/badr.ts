import type { CatalogBattle } from '@/lib/catalog/types';

// He killed his own father here, so the SON relation is not in tension with this.
const badr = {
  kind: 'BATTLE',
  slug: 'badr',
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/badr'] },
  ],
} satisfies CatalogBattle;

export default badr;
