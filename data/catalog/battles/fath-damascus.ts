import type { CatalogBattle } from '@/lib/catalog/types';

const fathDamascus = {
  kind: 'BATTLE',
  slug: 'fath-damascus',
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/damascus-conquest'] },
  ],
} satisfies CatalogBattle;

export default fathDamascus;
