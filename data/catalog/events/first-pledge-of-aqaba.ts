import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Twelve men, on بيعة النساء, before fighting was made an obligation. Only the
 * four the chapter names who have subjects in the app are linked; Ibn Ishaq's
 * roster runs longer, and the rest wait for subjects of their own.
 */
const firstPledgeOfAqaba = {
  kind: 'EVENT',
  slug: 'first-pledge-of-aqaba',
  name: 'بيعة العقبة الأولى',
  nameTransliterated: 'The First Pledge of Aqaba',
  type: 'OTHER',
  fields: {
    location: { value: 'العقبة بمنى', claims: ['sira/aqaba-first'] },
    description: {
      value:
        'بايع اثنا عشر رجلا من الأنصار رسول الله صلى الله عليه وسلم ليلة العقبة الأولى بيعة النساء، على أن لا يشركوا بالله شيئا ولا يسرقوا ولا يزنوا ولا يقتلوا أولادهم ولا يعصوه في معروف، وذلك قبل أن تفترض الحرب.',
      claims: ['sira/aqaba-first', 'ubadah/aqaba-first'],
    },
  },
  people: [
    { person: 'prophet-muhammad', claims: ['sira/aqaba-first'] },
    { person: 'ubadah-ibn-al-samit', claims: ['ubadah/aqaba-first'] },
    { person: 'asad-ibn-zurarah', claims: ['asad/aqaba-first'] },
    { person: 'uwaym-ibn-saidah', claims: ['uwaym/aqaba-first'] },
    { person: 'abu-al-haytham-ibn-at-tayyihan', claims: ['abu-al-haytham/aqaba-first'] },
  ],
} satisfies CatalogEvent;

export default firstPledgeOfAqaba;
