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
    sex: { value: 'MALE', claims: ['uthman/sex'] },
    virtues: {
      value:
        'خرج بامرأته رقية بنت رسول الله صلى الله عليه وسلم إلى الحبشة، فقال صلى الله عليه وسلم: (صحبهما الله، إن عثمان أول من هاجر بأهله بعد لوط) .',
      claims: ['uthman/hijra-habasha-bi-ahlihi'],
    },
  },
  titles: [
    { title: 'al-sabiqoon', claims: ['uthman/al-sabiqoon-eight'] },
  ],
  // Both daughters, in the order the sira gives them: Ruqayyah to Abyssinia
  // and dying during Badr, then Umm Kulthum in the same year.
  relations: [
    { type: 'HUSBAND', inverse: 'WIFE', to: 'ruqayyah-bint-muhammad', claims: ['uthman/husband-ruqayyah'] },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'umm-kulthum-bint-muhammad', claims: ['uthman/husband-umm-kulthum'] },
  ],
} satisfies CatalogPerson;

export default uthmanIbnAffan;
