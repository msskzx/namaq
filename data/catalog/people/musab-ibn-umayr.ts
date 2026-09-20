import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. Sent to Medina after the first Aqaba to teach
// the Qur'an, which is how Sa'd ibn Mu'adh and his whole clan came to Islam.
const musabIbnUmayr = {
  kind: 'PERSON',
  slug: 'musab-ibn-umayr',
  name: 'مصعب بن عمير',
  nameTransliterated: 'Musab ibn Umayr',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['musab/sex'] },
    virtues: {
      value:
        'بعثه رسول الله صلى الله عليه وسلم إلى المدينة يقرئهم ويفقههم في الدين، فكان يسمى بها المقرئ، وكان أول من جمع الجمعة بالمدينة.',
      claims: ['musab/madinah-muqri'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default musabIbnUmayr;
