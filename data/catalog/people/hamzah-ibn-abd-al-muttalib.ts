import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Seed-declared, so additive. The heading sweep gave him his Islam and left him
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
  name: 'حمزة بن عبد المطلب',
  nameTransliterated: 'Hamzah ibn Abd al-Muttalib',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['hamzah/sex'] },
    virtues: {
      value:
        'كان أعز فتى في قريش وأشده شكيمة، فلما أسلم عرفت قريش أن رسول الله صلى الله عليه وسلم قد عز وامتنع. وقال فيه يوم أحد لما سمع البكاء على قتلى الأنصار: (لكن حمزة لا بواكي له) ، واستغفر له.',
      claims: ['hamzah/virtues-islam', 'hamzah/la-bawakiya-lah'],
    },
  },

  // Not a title the book assigns him: it is what he called himself, fighting
  // with two swords in front of the Prophet at Uhud.
  titles: [{ title: 'asadu-allah', claims: ['hamzah/asadu-allah'] }],

  relations: [
    { type: 'PATERNAL_UNCLE', inverse: 'PATERNAL_NEPHEW', to: 'prophet-muhammad', claims: ['hamzah/uncle-prophet'] },
    // The reciprocal is whichever milk sibling the far end is, so it is stated
    // here the way every sex-dependent reciprocal in the catalog is.
    { type: 'MILK_BROTHER', inverse: 'MILK_BROTHER', to: 'prophet-muhammad', claims: ['hamzah/rida-thuwaybah'] },
  ],
} satisfies CatalogPerson;

export default hamzahIbnAbdAlMuttalib;
