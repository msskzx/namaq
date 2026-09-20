import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. His own Siyar entry has not been read; this is
// only what chapter two of the sira says about him.
const uthmanIbnAffan = {
  kind: 'PERSON',
  slug: 'uthman-ibn-affan',
  name: 'عثمان بن عفان',
  nameTransliterated: 'Uthman ibn Affan',
  hasProfile: true,
  fields: {
    virtues: {
      value:
        'خرج بامرأته رقية بنت رسول الله صلى الله عليه وسلم إلى الحبشة، فقال صلى الله عليه وسلم: (صحبهما الله، إن عثمان أول من هاجر بأهله بعد لوط) .',
      claims: ['uthman/hijra-habasha-bi-ahlihi'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default uthmanIbnAffan;
