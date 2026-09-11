import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

const uhud = {
  kind: 'BATTLE',
  slug: 'uhud',
  // Carried from the old seed, which an earlier agent extracted from this same
  // work without citations. The entry does not date it, so the evidence is
  // still owed (AGENTS.md, "Historical evidence data").
  fields: { hijriYear: { value: 3, claims: legacyUnreviewed } },
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/uhud'] },
  ],
} satisfies CatalogBattle;

export default uhud;
