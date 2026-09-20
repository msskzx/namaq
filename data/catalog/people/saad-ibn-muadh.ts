import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. His Islam is the chapter's turning point in
// Medina: بنو عبد الأشهل followed him in a single day.
const saadIbnMuadh = {
  kind: 'PERSON',
  slug: 'saad-ibn-muadh',
  name: 'سعد بن معاذ',
  nameTransliterated: 'Saad ibn Muadh',
  hasProfile: true,
  fields: {
    virtues: {
      value:
        'أسلم على يد مصعب بن عمير، ثم قال لقومه: كلام رجالكم ونسائكم علي حرام حتى تؤمنوا، فما أمسى في دار بني عبد الأشهل رجل ولا امرأة إلا مسلما ومسلمة.',
      claims: ['saad-muadh/islam'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default saadIbnMuadh;
