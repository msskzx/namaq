import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Ash'aris sent Abu Musa to ask the Prophet ﷺ for mounts for the army of hardship, Tabuk; he swore «والله لا أحملكم
 * على شيء», then called him and gave them six camels, and Abu Musa took some of them to the men who had heard him refuse,
 * so they would not think he had said what he had not; and when they feared he had forgotten his oath he said «لا أحلف على
 * يمين فأرى غيرها خيرا منها إلا أتيت الذي هو خير منها». Told from Abu Musa's hadith in Sahih al-Bukhari, each whole: 4415
 * (al-Maghazi, the raid of Tabuk) first, the fullest; then 4385 (the coming of the Ash'aris), which Abu Musa tells over a
 * meal of chicken. The Sa'd from whom the camels were bought is not named further and is not linked.
 */
const theMountsOfTheAsharis = {
  kind: 'EVENT',
  slug: 'the-mounts-of-the-asharis',
  name: "حملان الأشعريين",
  nameTransliterated: "Mounts for the Ash'aris",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-musa-al-ashari' }, { person: 'prophet-muhammad' }, { person: 'bilal-ibn-rabah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4415, 0, 179),
      source: { slug: 'sahih-al-bukhari', hadith: 4415, url: 'https://sunnah.com/bukhari:4415' },
      moments: [
        { title: "«والله لا أحملكم على شيء»", text: sahih('bukhari', 4415, 180, 619), people: ['abu-musa-al-ashari', 'prophet-muhammad'] },
        { title: "«خذ هذين القرينين»", text: sahih('bukhari', 4415, 620, 1130), people: ['abu-musa-al-ashari', 'bilal-ibn-rabah', 'prophet-muhammad'] },
        { title: "«إنك عندنا لمصدق»", text: sahih('bukhari', 4415, 1131, 1731), people: ['abu-musa-al-ashari'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4385, 0, 114),
      source: { slug: 'sahih-al-bukhari', hadith: 4385, url: 'https://sunnah.com/bukhari:4385' },
      moments: [
        { title: "يتغدى دجاجا", text: sahih('bukhari', 4385, 115, 453), people: ['abu-musa-al-ashari'] },
        { title: "«لا أحلف على يمين فأرى غيرها خيرا منها»", text: sahih('bukhari', 4385, 454, 1078), people: ['abu-musa-al-ashari', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMountsOfTheAsharis;
