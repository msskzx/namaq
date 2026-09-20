import type { CatalogEvent } from '@/lib/catalog/types';

// Three years in the شعب, ending when the صحيفة was found eaten. The account
// gives the length but no year, so hijriYear stays unset.
const boycottOfBanuHashim = {
  kind: 'EVENT',
  slug: 'boycott-of-banu-hashim',
  name: 'حصار بني هاشم في الشعب والصحيفة',
  nameTransliterated: 'The Boycott of Banu Hashim',
  type: 'OTHER',
  fields: {
    location: { value: 'شعب أبي طالب بمكة', claims: ['sira/shib-abi-talib'] },
    description: {
      value:
        'جمع أبو طالب بني أبيه فأدخلوا رسول الله صلى الله عليه وسلم شعبهم ومنعوه، فتعاهدت قريش في صحيفة أن لا يجالسوهم ولا يبايعوهم، فلبث بنو هاشم في شعبهم ثلاث سنين واشتد عليهم البلاء، ثم بعث الله على الصحيفة الأرضة فلحست كل ما فيها من عهد وميثاق.',
      claims: ['sira/shib-abi-talib', 'abu-talib/shib'],
    },
  },
  people: [
    { person: 'prophet-muhammad', claims: ['sira/shib-abi-talib'] },
    { person: 'abu-talib', claims: ['abu-talib/shib'] },
  ],
} satisfies CatalogEvent;

export default boycottOfBanuHashim;
