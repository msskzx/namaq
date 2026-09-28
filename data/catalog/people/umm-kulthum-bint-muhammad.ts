import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData9.ts entry. Her FATHER edge
 * (prophet-muhammad.ts) and HUSBAND edge (uthman-ibn-affan.ts, married after
 * her sister Ruqayyah's death) are already declared from the other side.
 */
const ummKulthumBintMuhammad = {
  kind: 'PERSON',
  slug: 'umm-kulthum-bint-muhammad',
  name: 'أم كلثوم بنت محمد',
  nameTransliterated: 'Umm Kulthum bint Muhammad',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'أم كلثوم بنت محمد بن عبد الله بن عبد المطلب بن هاشم القرشية الهاشمية',
      claims: legacyUnreviewed,
    },
    // Carried from the retired prisma/personSeedData.ts entry, uncited.
    virtues: {
      value: 'بنت النبي، زوجة عثمان بن عفان بعد وفاة أختها رقية، وبذلك لقب عثمان بذي النورين.',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    { title: 'daughter-of-prophet', name: 'بنت النبي', nameTransliterated: 'Daughter of the Prophet', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default ummKulthumBintMuhammad;
