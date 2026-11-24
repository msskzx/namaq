import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ibn Umar went in to Hafsah, who sent him to the people's gathering; when Mu'awiyah stood and said whoever wanted
 * to speak in this matter should show his head, Ibn Umar was about to answer and held back, fearing a word that would split
 * the people and shed blood, and remembered what Allah has prepared in the gardens. Told from Sahih al-Bukhari 4108
 * (al-Maghazi, in the chapter on al-Khandaq), whole. Hafsah is linked as named; Ibn Umar has no catalog subject and is not
 * linked.
 */
const ibnUmarHoldsHisTongue = {
  kind: 'EVENT',
  slug: 'ibn-umar-holds-his-tongue',
  name: "ابن عمر وخطبة معاوية",
  nameTransliterated: "Ibn Umar and Mu'awiyah's sermon",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'hafsa-bint-umar' }, { person: 'muawiyah-ibn-abi-sufyan' }, { person: 'habib-ibn-maslamah' }],
  reports: [
    {
      isnad: sahih('bukhari', 4108, 0, 214),
      source: { slug: 'sahih-al-bukhari', hadith: 4108, url: 'https://sunnah.com/bukhari:4108' },
      moments: [
        { title: "«الحق فإنهم ينتظرونك»", text: sahih('bukhari', 4108, 215, 498), people: ['hafsa-bint-umar'] },
        { title: "«فلنحن أحق به منه ومن أبيه»", text: sahih('bukhari', 4108, 499, 684), people: ['muawiyah-ibn-abi-sufyan'] },
        { title: "«فهلا أجبته؟»", text: sahih('bukhari', 4108, 685, 1133), people: ['habib-ibn-maslamah', 'muawiyah-ibn-abi-sufyan'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ibnUmarHoldsHisTongue;
