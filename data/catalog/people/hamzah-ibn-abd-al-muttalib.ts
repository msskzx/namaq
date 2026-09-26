import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * The seed entry and its graph node are retired, so this module is
 * the author; what they held and no batch cites is carried below with its
 * evidence owed. The heading sweep gave him his Islam and left him
 * with one field; this is the rest of what these chapters say about him, and
 * most of it is kinship the graph had no way to hold.
 *
 * He is the Prophet's paternal uncle, which the book states in three places
 * without ever making a section of it, and his milk brother besides: Thuwaybah,
 * Abu Lahab's slave woman, nursed the two of them together with Abu Salamah.
 */
const hamzahIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'hamzah-ibn-abd-al-muttalib',
  name: 'حَمْزَةُ بنُ عَبْدِ المُطَّلِبِ',
  nameTransliterated: 'Hamzah ibn Abd al-Muttalib',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'حَمْزَةُ بنُ عَبْدِ المُطَّلِبِ بنِ هَاشِمِ بنِ عَبْدِ مَنَافٍ القُرَشِيُّ الهَاشِمِيُّ', claims: legacyUnreviewed },
    appearance: { value: 'كان رجلاً قوي البنية، شجاعاً، مهاباً.', claims: legacyUnreviewed },
    sex: { value: 'MALE', claims: ['hamzah/sex'] },
    kunya: { value: 'أَبُو عُمَارَةَ، وَأَبُو يَعْلَى', claims: ['hamzah-siyar15/kunya'] },
    virtues: {
      value:
        'كان أعز فتى في قريش وأشده شكيمة، فلما أسلم عرفت قريش أن رسول الله صلى الله عليه وسلم قد عز وامتنع. وقال فيه يوم أحد لما سمع البكاء على قتلى الأنصار: (لكن حمزة لا بواكي له) ، واستغفر له.',
      claims: ['hamzah/virtues-islam', 'hamzah/la-bawakiya-lah'],
    },
  },

  // Not a title the book assigns him: it is what he called himself, fighting
  // with two swords in front of the Prophet at Uhud.
  titles: [
    { title: 'asadu-allah', claims: ['hamzah/asadu-allah'] },
    // Two chains, each marked weak by al-Dhahabi himself: see
    // hamzah-ibn-abd-al-muttalib-siyar15/batch.json's reviewerNote.
    { title: 'sayyid-al-shuhada', claims: ['hamzah-siyar15/sayyid-al-shuhada'] },
    { title: 'companion', claims: legacyUnreviewed },
  ],

  relations: [
    // Carried from neo4j/graphSeedData.ts, whose node declaration is retired
    // with the rest. The catalog owns this subject's edges now, so they live
    // here or not at all.
    //
    // Unlike his brothers Abu Talib, Al-Harith and Al-Abbas, the seed never
    // gave Hamzah a direct SON/FATHER edge to his own father
    // abd-al-muttalib-ibn-hashim (see graphSeedData7.ts's note on the same
    // gap for Al-Abbas). No new node needed, just the missing edge.
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'SISTER', to: 'safiyyah-bint-abd-al-muttalib', claims: legacyUnreviewed },
    { type: 'PATERNAL_UNCLE', inverse: 'PATERNAL_NEPHEW', to: 'prophet-muhammad', claims: ['hamzah/uncle-prophet'] },
    // The reciprocal is whichever milk sibling the far end is, so it is stated
    // here the way every sex-dependent reciprocal in the catalog is.
    { type: 'MILK_BROTHER', inverse: 'MILK_BROTHER', to: 'prophet-muhammad', claims: ['hamzah/rida-thuwaybah'] },
  ],
} satisfies CatalogPerson;

export default hamzahIbnAbdAlMuttalib;
