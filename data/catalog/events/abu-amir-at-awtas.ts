import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * After Hunayn the Prophet ﷺ sent Abu Amir with an army to Awtas; Durayd ibn al-Simmah was killed, Abu Amir was shot in
 * the knee, his nephew Abu Musa killed the archer, and dying Abu Amir sent his salam and asked for his prayer; the Prophet ﷺ
 * made wudu, raised his hands, «اللهم اغفر لعبيد أبي عامر», and prayed for Abu Musa too. Told from Sahih al-Bukhari 4323
 * (al-Maghazi, the raid of Awtas), whole. Abu Amir, Durayd and the archer have no catalog subject and are not linked.
 */
const abuAmirAtAwtas = {
  kind: 'EVENT',
  slug: 'abu-amir-at-awtas',
  name: "أبو عامر يوم أوطاس",
  nameTransliterated: "Abu Amir at Awtas",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-musa-al-ashari' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4323, 0, 158),
      source: { slug: 'sahih-al-bukhari', hadith: 4323, url: 'https://sunnah.com/bukhari:4323' },
      moments: [
        { title: "بعث أبا عامر إلى أوطاس", text: sahih('bukhari', 4323, 159, 479), people: ['prophet-muhammad', 'abu-musa-al-ashari'] },
        { title: "«ذاك قاتلي الذي رماني»", text: sahih('bukhari', 4323, 480, 797), people: ['abu-musa-al-ashari'] },
        { title: "«أقرئ النبي ﷺ السلام»", text: sahih('bukhari', 4323, 798, 1088), people: ['abu-musa-al-ashari', 'prophet-muhammad'] },
        { title: "«اللهم اغفر لعبيد أبي عامر»", text: sahih('bukhari', 4323, 1089, 1793), people: ['abu-musa-al-ashari', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuAmirAtAwtas;
