import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. The Prophet left his naqib place unfilled and
// took it himself, which the chapter says Banu al-Najjar took pride in.
const asadIbnZurarah = {
  kind: 'PERSON',
  slug: 'asad-ibn-zurarah',
  name: 'أسعد بن زرارة',
  nameTransliterated: 'Asad ibn Zurarah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['asad/sex'] },
    virtues: {
      value:
        'كان من سادة الأنصار ومن نقبائهم الأبرار، ولم يجعل النبي صلى الله عليه وسلم على بني النجار بعده نقيبا وقال: (أنا نقيبكم) ، فكانوا يفخرون بذلك.',
      claims: ['asad/naqib'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default asadIbnZurarah;
