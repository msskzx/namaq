import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A new event, and an undated one. al-Waqidi puts it سنة خمس من المبعث, which
 * counts from the calling and not from the hijra, so it is not a value
 * `hijriYear` can hold and the field is left unset.
 */
const secondHijraToAbyssinia = {
  kind: 'EVENT',
  slug: 'second-hijra-to-abyssinia',
  name: 'الهجرة الثانية إلى الحبشة',
  nameTransliterated: 'Second Hijra to Abyssinia',
  type: 'HIJRA_HABASHA',
  fields: {
    description: {
      value:
        'خرج جعفر بن أبي طالب وأصحابه إلى الحبشة، فبعثت قريش عمرو بن العاص وعبد الله بن أبي ربيعة بالهدايا ليردهم، فكلم جعفر النجاشي وقرأ عليه صدرا من سورة مريم، فقال: إن هذا والذي جاء به موسى ليخرج من مشكاة واحدة، ورد هديتهما ولم يسلمهم إليهما.',
      claims: ['sira/hijra-habasha-second', 'jaafar/hijra-habasha-second'],
    },
  },
  people: [
    { person: 'jaafar-ibn-abi-talib', claims: ['jaafar/hijra-habasha-second'] },
    // He swam the Nile on an inflated waterskin to watch the battle for the
    // Najashi's throne and carried the news back.
    { person: 'az-zubayr-ibn-al-awwam', claims: ['zubayr/nile-habasha'] },
    { person: 'qudamah-ibn-mazun', claims: ['qudamah-mazun-siyar10/hijra-habasha-second'] },
    { person: 'abdullah-ibn-mazun-al-jumahi', claims: ['abdullah-mazun-siyar11/hijra-habasha-second'] },
  ],
} satisfies CatalogEvent;

export default secondHijraToAbyssinia;
