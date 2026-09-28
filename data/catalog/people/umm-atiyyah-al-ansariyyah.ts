import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData10.ts entry. Her own page
 * gives two variant names for her father (al-Harith, used here, or Kaab per
 * an alternate report) with no deeper chain either way, so no ancestor
 * node. Washed the body of the Prophet's daughter Zaynab bint Muhammad
 * after her death, per her own entry; described as among the
 * jurist-companions.
 */
const ummAtiyyahAlAnsariyyah = {
  kind: 'PERSON',
  slug: 'umm-atiyyah-al-ansariyyah',
  name: 'أم عطية الأنصارية',
  nameTransliterated: 'Umm Atiyyah al-Ansariyyah',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'نسيبة بنت الحارث الأنصارية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default ummAtiyyahAlAnsariyyah;
