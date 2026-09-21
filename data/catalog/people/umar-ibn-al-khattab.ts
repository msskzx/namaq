import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. The chapter's section on his Islam is three
// du'as and Ibn Mas'ud's line; only the du'a in Aishah's narration is a
// sentence about Umar himself rather than about what followed.
const umarIbnAlKhattab = {
  kind: 'PERSON',
  slug: 'umar-ibn-al-khattab',
  name: 'عمر بن الخطاب',
  nameTransliterated: 'Umar ibn al-Khattab',
  hasProfile: true,
  fields: {
    virtues: {
      value: 'قال صلى الله عليه وسلم: (اللهم أعز الإسلام بعمر بن الخطاب خاصة) .',
      claims: ['umar/virtues-islam'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default umarIbnAlKhattab;
