import type { CatalogEvent } from '@/lib/catalog/types';

// He satirised the Prophet in verse and went to Mecca to rouse Quraysh after
// Badr. Muhammad ibn Maslamah volunteered and asked leave to say what he had
// to say to reach him, which the Prophet granted.
const killingOfKaabIbnAlAshraf = {
  kind: 'EVENT',
  slug: 'killing-of-kaab-ibn-al-ashraf',
  name: 'قتل كعب بن الأشرف',
  nameTransliterated: 'The Killing of Kaab ibn al-Ashraf',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 3, claims: ['sira/kaab-ibn-al-ashraf'] },
    description: {
      value:
        'قال صلى الله عليه وسلم: (من لكعب بن الأشرف؟ فقد آذانا بالشعر وقوى المشركين علينا) . فقال محمد بن مسلمة: أنا يا رسول الله. فاستأذنه أن يقول، فأذن له، فأتاه ليلا في نفر فقتلوه.',
      claims: ['sira/kaab-ibn-al-ashraf'],
    },
  },
  people: [
    { person: 'muhammad-ibn-maslamah', claims: ['sira/kaab-ibn-al-ashraf'] },
    { person: 'abu-abs', claims: ['abu-abs-siyar21/kaab-ashraf'] },
  ],
} satisfies CatalogEvent;

export default killingOfKaabIbnAlAshraf;
