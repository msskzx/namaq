import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

const fathDamascus = {
  kind: 'BATTLE',
  slug: 'fath-damascus',
  name: 'فتح دمشق',
  nameTransliterated: 'Conquest of Damascus',
  // Carried from the old seed, which an earlier agent extracted from this same
  // work without citations. The entry does not date it, so the evidence is
  // still owed (AGENTS.md, "Historical evidence data").
  fields: { engagement: { value: 'BATTLE', claims: legacyUnreviewed }, hijriYear: { value: 14, claims: legacyUnreviewed } },
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/damascus-conquest'] },
  ],
} satisfies CatalogBattle;

export default fathDamascus;
