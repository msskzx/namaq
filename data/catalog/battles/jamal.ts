import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

const jamal = {
  kind: 'BATTLE',
  slug: 'jamal',
  // The entry dates his death to 36 AH but never dates the battle itself, so
  // the seed's year is still owed its evidence (AGENTS.md, "Historical
  // evidence data"). Both say 36; neither says where the other got it.
  fields: { hijriYear: { value: 36, claims: legacyUnreviewed } },
  participants: [
    { person: 'talhah-ibn-ubaydullah', isMuslim: true, status: ['MARTYRED'], claims: ['talhah/jamal'] },
  ],
} satisfies CatalogBattle;

export default jamal;
