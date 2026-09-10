import type { CatalogBattle } from '@/lib/catalog/types';

/**
 * He led the reinforcing party and handed command to Amr ibn al-As, so the
 * entry places him here without making him the expedition's commander.
 */
const zatAsSalasil = {
  kind: 'BATTLE',
  slug: 'zat-as-salasil',
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/dhat-al-salasil-command'] },
  ],
} satisfies CatalogBattle;

export default zatAsSalasil;
