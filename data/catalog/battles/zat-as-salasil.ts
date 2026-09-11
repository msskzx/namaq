import type { CatalogBattle } from '@/lib/catalog/types';

// Present as the reinforcing party's leader, not the expedition's commander.
const zatAsSalasil = {
  kind: 'BATTLE',
  slug: 'zat-as-salasil',
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/dhat-al-salasil-command'] },
  ],
} satisfies CatalogBattle;

export default zatAsSalasil;
