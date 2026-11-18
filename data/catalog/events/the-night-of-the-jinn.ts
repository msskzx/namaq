import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The night the jinn's caller came to the Prophet ﷺ and he went and recited to them, as Ibn Mas'ud told it (al-Sira 1
 * p160): Muslim's report through Alqamah, and the tree that told him of them (through Masruq, «متفق عليه»). al-Dhahabi
 * gives a report that Ibn Mas'ud was with him that night («وقد جاء ما يخالف هذا», al-Nasa'i's) after these; it waits
 * with the weaker reports (owner: sahih first).
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
  ],
} satisfies CatalogEvent;

export default theNightOfTheJinn;
