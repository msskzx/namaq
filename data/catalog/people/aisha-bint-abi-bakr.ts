import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData9.ts entry. Her FATHER edge
 * (abu-bakr-as-siddiq.ts) and HUSBAND edge (prophet-muhammad.ts) are already
 * declared from the other side. appearance, virtues and the ayat below are
 * carried from the retired prisma/personSeedData.ts entry, uncited.
 */
const aishaBintAbiBakr = {
  kind: 'PERSON',
  slug: 'aisha-bint-abi-bakr',
  name: 'عائشة بنت أبي بكر',
  nameTransliterated: 'Aisha bint Abi Bakr',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عائشة بنت أبي بكر عبد الله بن أبي قحافة عثمان بن عامر بن عمرو بن كعب بن سعد بن تيم بن مرة بن كعب بن لؤي القرشية التيمية',
      claims: legacyUnreviewed,
    },
    appearance: { value: 'وصفت بأنها كانت بيضاء اللون، ذات جمال، وكانت نحيفة.', claims: legacyUnreviewed },
    virtues: {
      value: 'أم المؤمنين، حبيبة رسول الله، أفقه نساء الأمة، روت أحاديث كثيرة، اشتهرت بذكائها وفصاحتها.',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    { title: 'siddiqa', name: 'صديقة', nameTransliterated: 'Siddiqa', claims: legacyUnreviewed },
    { title: 'mother-of-believers', name: 'أم المؤمنين', nameTransliterated: 'Mother of the Believers', claims: legacyUnreviewed },
  ],
  ayat: [
    { surah: 24, ayah: 11, claims: legacyUnreviewed },
    { surah: 33, ayah: 33, claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default aishaBintAbiBakr;
