import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when its rows were retired. The Siyar entry is
// silent about this battle, so both values are in use with their evidence owed.
const fathJerusalem = {
  kind: 'BATTLE',
  slug: 'fath-jerusalem',
  fields: { hijriYear: { value: 16, claims: legacyUnreviewed } },
  participants: [{ person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: legacyUnreviewed }],
} satisfies CatalogBattle;

export default fathJerusalem;
