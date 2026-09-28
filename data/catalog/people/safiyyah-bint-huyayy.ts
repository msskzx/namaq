import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * She enters the sira as a captive of Khaybar and leaves the chapter married,
 * and the book puts the whole of it in one sentence: فصارت صفية لدحية الكلبي،
 * ثم صارت لرسول الله، ثم تزوجها وجعل صداقها عتقها.
 *
 * عتقها as her صداق is the detail that matters and the one the model cannot
 * hold: there is no field for what a dower was. It stays in the page, and the
 * marriage edge is what the catalog records.
 *
 * The module is new, so what her rows already held is carried on the marker.
 */
const safiyyahBintHuyayy = {
  kind: 'PERSON',
  slug: 'safiyyah-bint-huyayy',
  name: 'صفية بنت حيي',
  nameTransliterated: 'Safiyyah bint Huyayy',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    // Carried from the retired prisma/personSeedData9.ts entry, uncited.
    fullName: { value: 'صفية بنت حيي بن أخطب بن سعية', claims: legacyUnreviewed },
    // Carried from the retired prisma/personSeedData.ts entry, uncited.
    appearance: { value: 'وصفت بأنها كانت جميلة جداً.', claims: legacyUnreviewed },
    virtues: {
      value: 'أم المؤمنين، كانت من سبايا خيبر، أسلمت وتزوجها النبي، عرفت بحلمها وصبرها.',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    // Carried from the seed rows; the chapter calls her neither.
    { title: 'mother-of-believers', name: 'أم المؤمنين', nameTransliterated: 'Mother of the Believers', claims: legacyUnreviewed },
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'WIFE', inverse: 'HUSBAND', to: 'prophet-muhammad', claims: ['safiyyah/freedom-as-dower'] },
  ],
} satisfies CatalogPerson;

export default safiyyahBintHuyayy;
