import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Twelve men, on بيعة النساء, before fighting was made an obligation. Only the
 * four the chapter names who have subjects in the app are linked; Ibn Ishaq's
 * roster runs longer, and the rest wait for subjects of their own.
 *
 * Told as a story from Sahih al-Bukhari 3893, whole: Ubadah, «إني من النقباء». Its chain (al-Layth, Yazid ibn
 * Abi Habib, al-Sunabihi) is the one al-Dhahabi says both Sahihs have for Ubadah's first-Aqaba report («أخرجاه عن قتيبة،
 * عن الليث», al-Sira 1 p241), so it is told here and not under the second pledge.
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
  reports: [
    {
      isnad: sahih('bukhari', 3893, 0, 166),
      source: { slug: 'sahih-al-bukhari', hadith: 3893, url: 'https://sunnah.com/bukhari:3893' },
      moments: [
        { title: "«إني من النقباء»", text: sahih('bukhari', 3893, 167, 244), people: ['ubadah-ibn-al-samit', 'prophet-muhammad'] },
        { title: "ما بايعوه عليه", text: sahih('bukhari', 3893, 245, 529), people: ['ubadah-ibn-al-samit', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default firstPledgeOfAqaba;
