import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Present as the reinforcing party's leader, not the expedition's commander.
const zatAsSalasil = {
  kind: 'BATTLE',
  slug: 'zat-as-salasil',
  // Carried from the old seed, which an earlier agent extracted from this same
  // work without citations. The entry does not date it, so the evidence is
  // still owed (AGENTS.md, "Historical evidence data").
  fields: { hijriYear: { value: 12, claims: legacyUnreviewed } },
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/dhat-al-salasil-command'] },
  ],
} satisfies CatalogBattle;

export default zatAsSalasil;
