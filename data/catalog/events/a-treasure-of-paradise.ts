import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On the way to Khaybar the people raised their voices in takbir over a valley and the Prophet ﷺ said «اربعوا على أنفسكم»;
 * he heard Abu Musa behind his mount saying «لا حول ولا قوة إلا بالله» and told him it was a treasure of the treasures of
 * Paradise. Told from Sahih al-Bukhari 4205 (al-Maghazi, the chapter on Khaybar), whole.
 */
const aTreasureOfParadise = {
  kind: 'EVENT',
  slug: 'a-treasure-of-paradise',
  name: "كنز من كنوز الجنة",
  nameTransliterated: "A treasure of Paradise",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-musa-al-ashari' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4205, 0, 156),
      source: { slug: 'sahih-al-bukhari', hadith: 4205, url: 'https://sunnah.com/bukhari:4205' },
      moments: [
        { title: "«اربعوا على أنفسكم»", text: sahih('bukhari', 4205, 157, 529), people: ['prophet-muhammad'] },
        { title: "«ألا أدلك على كلمة من كنز من كنوز الجنة»", text: sahih('bukhari', 4205, 530, 896), people: ['abu-musa-al-ashari', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default aTreasureOfParadise;
