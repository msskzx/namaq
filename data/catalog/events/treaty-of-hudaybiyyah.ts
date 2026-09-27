import { legacyUnreviewed, type CatalogEvent } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/eventSeedData.ts entry, uncited. Distinct
 * from the `hudaybiyyah` battle record (data/catalog/battles/hudaybiyyah.ts):
 * the seed modeled the treaty as both an event and a battle, and this module
 * only carries the event side forward.
 */
const treatyOfHudaybiyyah = {
  kind: 'EVENT',
  slug: 'treaty-of-hudaybiyyah',
  name: 'صلح الحديبية',
  nameTransliterated: 'Treaty of Hudaybiyyah',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 6, claims: legacyUnreviewed },
    location: { value: 'الحديبية', claims: legacyUnreviewed },
    description: { value: 'صلح الحديبية', claims: legacyUnreviewed },
  },
  people: [
    { person: 'prophet-muhammad', claims: legacyUnreviewed },
    { person: 'abu-bakr-as-siddiq', claims: legacyUnreviewed },
    { person: 'umar-ibn-al-khattab', claims: legacyUnreviewed },
  ],
} satisfies CatalogEvent;

export default treatyOfHudaybiyyah;
