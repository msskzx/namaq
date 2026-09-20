import type { CatalogEvent } from '@/lib/catalog/types';

// Shortly after Badr. The chapter gives his rank among the first Muslims and
// his manner rather than a cause.
const deathOfUthmanIbnMazun = {
  kind: 'EVENT',
  slug: 'death-of-uthman-ibn-mazun',
  name: 'وفاة عثمان بن مظعون',
  nameTransliterated: 'The Death of Uthman ibn Mazun',
  type: 'DEATH',
  fields: {
    hijriYear: { value: 2, claims: ['ibn-mazun/death'] },
    description: {
      value:
        'توفي بعد بدر بيسير، وهو أحد السابقين، أسلم بعد ثلاثة عشر رجلا، وهاجر إلى الحبشة الهجرة الأولى، وكان صواما قواما قانتا لله.',
      claims: ['ibn-mazun/death'],
    },
  },
  people: [{ person: 'uthman-ibn-mazun', claims: ['ibn-mazun/death'] }],
} satisfies CatalogEvent;

export default deathOfUthmanIbnMazun;
