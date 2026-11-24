import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The night the jinn's caller came to the Prophet ﷺ and he went and recited to them, as Ibn Mas'ud told it (al-Sira 1
 * p160): Muslim's report through Alqamah, and the tree that told him of them (through Masruq, «متفق عليه»). Masruq's
 * «ليلة استمعوا القرآن» does not say which occasion; putting it here, after Alqamah's as Muslim has them, is our reading.
 * Reports that Ibn Mas'ud was with him that night (al-Nasa'i's, «وقد جاء ما يخالف هذا», pp160-161) and saw them (the Zutt,
 * p161, «صحيح» but not placed in a Sahih) wait (owner: sahih first).
 *
 * Masruq's report follows as al-Bukhari prints it (3859), whole.
 */
const theNightOfTheJinn = {
  kind: 'EVENT',
  slug: 'the-night-of-the-jinn',
  name: 'ليلة الجن',
  nameTransliterated: 'The night of the jinn',
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abdullah-ibn-masud' }],
  tags: ['HEARD_QURAN'],
  reports: [
    {
      isnad: 'وقال داود بن أبي هند، عن الشعبي، عن علقمة،',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 160, url: 'https://shamela.ws/book/10906/298' },
      grading: 'رواه مسلم.',
      moments: [
        { title: '«هل صحبه منكم أحد؟»', text: 'قال: قلت لابن مسعود: هل صحب رسول الله صلى الله عليه وسلم ليلة الجن منكم أحد؟', people: ['abdullah-ibn-masud', 'prophet-muhammad'] },
        { title: '«فقدناه ذات ليلة»', text: 'فقال: ما صحبه منا أحد، ولكنا فقدناه ذات ليلة بمكة، فقلنا اغتيل، استطير، ما فعل؟ فبتنا بشر ليلة بات بها قوم،', people: ['abdullah-ibn-masud', 'prophet-muhammad'] },
        { title: '«أتاني داعي الجن»', text: 'فلما كان في وجه الصبح -أو قال: في السحر- إذا نحن به يجيء من قبل حراء، فقلنا: يا رسول الله، فذكروا الذي كانوا فيه، فقال: "إنه أتاني داعي الجن فأتيتهم فقرأت عليهم".', people: ['prophet-muhammad', 'abdullah-ibn-masud'] },
        { title: 'آثارهم وآثار نيرانهم', text: 'فانطلق فأرانا آثارهم وآثار نيرانهم.', people: ['prophet-muhammad', 'abdullah-ibn-masud'] },
      ],
    },
    {
      isnad: 'وقال مسعر، عن معن، قال: حدثنا أبي،',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 160, url: 'https://shamela.ws/book/10906/298' },
      grading: 'متفق عليه.',
      moments: [
        { title: 'آذنته بهم شجرة', text: 'قال: سألت مسروقا: من آذن النبي صلى الله عليه وسلم ليلة استمعوا القرآن؟ فقال: حدثني أبوك، يعني ابن مسعود: أنه آذنته بهم شجرة.', people: ['prophet-muhammad', 'abdullah-ibn-masud'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3859, 0, 124),
      source: { slug: 'sahih-al-bukhari', hadith: 3859, url: 'https://sunnah.com/bukhari:3859' },
      moments: [
        { title: "آذنته بهم شجرة", text: sahih('bukhari', 3859, 125, 328), people: ['prophet-muhammad', 'abdullah-ibn-masud'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theNightOfTheJinn;
