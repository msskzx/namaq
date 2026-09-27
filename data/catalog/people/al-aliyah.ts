import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData10.ts entry. No father
 * given; tribe itself disputed (Bakr ibn Kilab or Ghifar), so no ancestor
 * chain. Her marriage to the Prophet was annulled before consummation (a
 * physical blemish found, per the retired entry).
 */
const alAliyah = {
  kind: 'PERSON',
  slug: 'al-aliyah',
  name: 'العالية',
  nameTransliterated: 'Al-Aliyah',
  hasProfile: true,
  fields: {},
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default alAliyah;
