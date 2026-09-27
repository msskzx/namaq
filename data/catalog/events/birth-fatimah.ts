import { legacyUnreviewed, type CatalogEvent } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/eventSeedData.ts entry, uncited. Its
 * personSlugs read 'fatimah-bint-muhammad', a slug that never existed in
 * personSeedData -- corrected to the real slugs on migration.
 */
const birthFatimah = {
  kind: 'EVENT',
  slug: 'birth-fatimah',
  name: 'مولد فاطمة بنت محمد',
  nameTransliterated: 'Birth of Fatimah bint Muhammad',
  type: 'BIRTH',
  fields: {
    hijriYear: { value: -3, claims: legacyUnreviewed },
    location: { value: 'مكة المكرمة', claims: legacyUnreviewed },
    description: { value: 'مولد فاطمة بنت محمد', claims: legacyUnreviewed },
  },
  people: [
    { person: 'prophet-muhammad', claims: legacyUnreviewed },
    { person: 'khadijah-bint-khuwaylid', claims: legacyUnreviewed },
    { person: 'fatimah-bint-muhammad', claims: legacyUnreviewed },
  ],
} satisfies CatalogEvent;

export default birthFatimah;
