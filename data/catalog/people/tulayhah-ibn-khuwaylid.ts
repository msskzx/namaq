import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * A marginal/unusual case per the retired prisma/personSeedData7.ts entry:
 * converted in 9 AH, apostatized and fought Muslims in the Ridda wars
 * claiming false prophethood, then returned to Islam under Abu Bakr and
 * died a Muslim general at Nahawand. Kept as a companion per the book's own
 * framing ("صاحب رسول الله") and the classical position that an initial
 * conversion during the Prophet's lifetime plus a final death as a Muslim
 * qualifies, despite the intervening apostasy -- worth a second look.
 */
const tulayhahIbnKhuwaylid = {
  kind: 'PERSON',
  slug: 'tulayhah-ibn-khuwaylid',
  name: 'طليحة بن خويلد',
  nameTransliterated: 'Tulayhah ibn Khuwaylid',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: { value: 'طليحة بن خويلد بن نوفل الأسدي', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'khuwaylid-ibn-nawfal', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default tulayhahIbnKhuwaylid;
