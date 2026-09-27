import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData9.ts entry. Her FATHER edge
 * (umar-ibn-al-khattab.ts) and HUSBAND edge (prophet-muhammad.ts) are
 * already declared from the other side. appearance, virtues and the ayah
 * below are carried from the retired prisma/personSeedData.ts entry, uncited.
 */
const hafsaBintUmar = {
  kind: 'PERSON',
  slug: 'hafsa-bint-umar',
  name: 'حفصة بنت عمر',
  nameTransliterated: 'Hafsa bint Umar',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'حفصة بنت عمر بن الخطاب بن نفيل بن عبد العزى بن رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشية العدوية',
      claims: legacyUnreviewed,
    },
    appearance: { value: 'وصفت بأنها كانت ذات هيئة وجمال.', claims: legacyUnreviewed },
    virtues: {
      value: 'أم المؤمنين، كانت قارئة كاتبة، حفظت المصحف بعد وفاة أبيها، عرفت بالعبادة والورع.',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    { title: 'mother-of-believers', name: 'أم المؤمنين', nameTransliterated: 'Mother of the Believers', claims: legacyUnreviewed },
  ],
  ayat: [{ surah: 66, ayah: 5, claims: legacyUnreviewed }],
  relations: [],
} satisfies CatalogPerson;

export default hafsaBintUmar;
