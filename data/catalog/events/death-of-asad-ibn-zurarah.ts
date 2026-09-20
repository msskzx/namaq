import type { CatalogEvent } from '@/lib/catalog/types';

// He died of الذبحة while the mosque was being built, and the Prophet took
// Banu al-Najjar's naqib place himself rather than appoint another.
const deathOfAsadIbnZurarah = {
  kind: 'EVENT',
  slug: 'death-of-asad-ibn-zurarah',
  name: 'وفاة أسعد بن زرارة',
  nameTransliterated: 'The Death of Asad ibn Zurarah',
  type: 'DEATH',
  fields: {
    hijriYear: { value: 1, claims: ['asad/death'] },
    description: {
      value:
        'مات أبو أمامة أسعد بن زرارة أيام بناء المسجد بالذبحة، ووجد النبي صلى الله عليه وسلم لموته، ولم يجعل على بني النجار بعده نقيبا وقال: أنا نقيبكم.',
      claims: ['asad/death', 'asad/naqib'],
    },
  },
  people: [{ person: 'asad-ibn-zurarah', claims: ['asad/death'] }],
} satisfies CatalogEvent;

export default deathOfAsadIbnZurarah;
