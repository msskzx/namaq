import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry and its graph node are retired, so this module is
// the author; what they held and no batch cites is carried below with its
// evidence owed. His own Siyar entry has not been read; this is
// only what chapter two of the sira says about him.
const uthmanIbnAffan = {
  kind: 'PERSON',
  slug: 'uthman-ibn-affan',
  name: 'عثمان بن عفان',
  nameTransliterated: 'Uthman ibn Affan',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'عثمان بن عفان بن أبي العاص الأموي القرشي', claims: legacyUnreviewed },
    appearance: { value: 'كان حسن الوجه، كث اللحية، طويل القامة.', claims: legacyUnreviewed },
    sex: { value: 'MALE', claims: ['uthman/sex'] },
    virtues: {
      value:
        'خرج بامرأته رقية بنت رسول الله صلى الله عليه وسلم إلى الحبشة، فقال صلى الله عليه وسلم: (صحبهما الله، إن عثمان أول من هاجر بأهله بعد لوط) .',
      claims: ['uthman/hijra-habasha-bi-ahlihi'],
    },
  },
  titles: [
    // Carried from the retired seed entry; no batch cites these yet.
    { title: 'the-ten-promised-paradise', claims: legacyUnreviewed },
    { title: 'the-six-of-the-shura', claims: legacyUnreviewed },
    { title: 'caliph', claims: legacyUnreviewed },
    { title: 'companion', claims: legacyUnreviewed },
    { title: 'dhu-al-nurayn', claims: legacyUnreviewed },
    { title: 'al-sabiqoon', claims: ['uthman/al-sabiqoon-eight'] },
  ],
  // Both daughters, in the order the sira gives them: Ruqayyah to Abyssinia
  // and dying during Badr, then Umm Kulthum in the same year.
  relations: [
    // Carried from neo4j/graphSeedData.ts, whose node declaration is retired
    // with the rest. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'SON', inverse: 'FATHER', to: 'affan-ibn-abi-al-as', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'arwa-bint-kurayz', claims: legacyUnreviewed },
    { type: 'MATERNAL_NEPHEW', inverse: 'MATERNAL_UNCLE', to: 'amir-ibn-kurayz', claims: legacyUnreviewed },
    { type: 'SON_IN_LAW', inverse: 'FATHER_IN_LAW', to: 'prophet-muhammad', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'ruqayyah-bint-muhammad', claims: ['uthman/husband-ruqayyah'] },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'umm-kulthum-bint-muhammad', claims: ['uthman/husband-umm-kulthum'] },
  ],
} satisfies CatalogPerson;

export default uthmanIbnAffan;
