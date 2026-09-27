import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. A second, distinct companion of the same name and tribe as
 * rafi-ibn-amr-al-ghifari -- al-Dhahabi's own page opens by deliberately
 * distinguishing this entry from the other one. Brother of A'idh, not of
 * al-Hakam ibn Amr al-Ghifari; A'idh is not yet in this pipeline.
 */
const rafiIbnAmrAlGhifariAkhuAidh = {
  kind: 'PERSON',
  slug: 'rafi-ibn-amr-al-ghifari-akhu-aidh',
  name: 'رافع بن عمرو الغفاري',
  nameTransliterated: 'Rafi ibn Amr al-Ghifari (brother of Aidh)',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'رافع بن عمرو الغفاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default rafiIbnAmrAlGhifariAkhuAidh;
