import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData10.ts entry. Sister of
 * al-Dahhak ibn Qais (not yet in this pipeline). Her first husband (whose
 * triple divorce of her is the subject of a well-known hadith on
 * maintenance for divorced women) and her second husband, Usamah ibn Zaid,
 * are not yet nodes in this pipeline, so neither marriage is modelled.
 */
const fatimahBintQaisAlFihriyyah = {
  kind: 'PERSON',
  slug: 'fatimah-bint-qais-al-fihriyyah',
  name: 'فاطمة بنت قيس الفهرية',
  nameTransliterated: 'Fatimah bint Qais al-Fihriyyah',
  hasProfile: true,
  fields: {
    fullName: { value: 'فاطمة بنت قيس الفهرية القرشية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default fatimahBintQaisAlFihriyyah;
