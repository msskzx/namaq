import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Seventy men and, by Urwah's count, one woman; Ibn Ishaq counts two. The model
 * holds no headcount field, so the disagreement stays on the page and the
 * description keeps the seventy both agree on.
 *
 * Only the six نقباء with subjects in the app are linked. Ibn Ishaq names
 * twelve, and the roster of attenders runs to some seventy more.
 */
const secondPledgeOfAqaba = {
  kind: 'EVENT',
  slug: 'second-pledge-of-aqaba',
  name: 'بيعة العقبة الثانية',
  nameTransliterated: 'The Second Pledge of Aqaba',
  type: 'OTHER',
  fields: {
    location: { value: 'العقبة بمنى', claims: ['sira/aqaba-second'] },
    description: {
      value:
        'اجتمع سبعون من الأنصار فبايعوا رسول الله صلى الله عليه وسلم على السمع والطاعة في النشاط والكسل، وعلى النفقة في العسر واليسر، وعلى الأمر بالمعروف والنهي عن المنكر، وعلى أن ينصروه إذا قدم عليهم يثرب فيمنعوه مما يمنعون منه أنفسهم وأزواجهم، ولهم الجنة. ثم قال: أخرجوا إلي منكم اثني عشر نقيبا.',
      claims: ['sira/aqaba-second'],
    },
  },
  people: [
    { person: 'prophet-muhammad', claims: ['sira/aqaba-second'] },
    { person: 'asad-ibn-zurarah', claims: ['asad/aqaba-second'] },
    { person: 'al-baraa-ibn-marur', claims: ['al-baraa/aqaba-second'] },
    { person: 'saad-ibn-ubadah', claims: ['saad-ubadah/aqaba-second'] },
    { person: 'ubadah-ibn-al-samit', claims: ['ubadah/aqaba-second'] },
    { person: 'usayd-ibn-al-hudayr', claims: ['usayd/aqaba-second'] },
    { person: 'abu-al-haytham-ibn-at-tayyihan', claims: ['abu-al-haytham/aqaba-second'] },
  ],
} satisfies CatalogEvent;

export default secondPledgeOfAqaba;
