import type { CatalogBattle } from '@/lib/catalog/types';

const uhud = {
  kind: 'BATTLE',
  slug: 'uhud',
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/uhud'] },
  ],
} satisfies CatalogBattle;

export default uhud;
