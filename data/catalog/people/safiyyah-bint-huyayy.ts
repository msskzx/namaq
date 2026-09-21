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
  fields: {},
  titles: [
    // Carried from the seed rows; the chapter calls her neither.
    { title: 'mother-of-believers', claims: legacyUnreviewed },
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'WIFE', inverse: 'HUSBAND', to: 'prophet-muhammad', claims: ['safiyyah/freedom-as-dower'] },
  ],
} satisfies CatalogPerson;

export default safiyyahBintHuyayy;
