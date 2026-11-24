import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent Abu Musa and Mu'adh ibn Jabal to Yemen, each over a district, «يسرا ولا تعسرا، وبشرا ولا تنفرا»;
 * visiting Abu Musa, Mu'adh found a man bound who had left islam and would not dismount until he was killed, and they asked
 * each other how they read the Quran, «فأحتسب نومتي كما أحتسب قومتي». Told from Sahih al-Bukhari (al-Maghazi, the sending
 * of Abu Musa and Mu'adh to Yemen), each hadith whole: Abu Burdah's 4341 first, then 4344. 4343 is a ruling on drinks.
 */
const abuMusaAndMuadhInYemen = {
  kind: 'EVENT',
  slug: 'abu-musa-and-muadh-in-yemen',
  name: "أبو موسى ومعاذ باليمن",
  nameTransliterated: "Abu Musa and Mu'adh in Yemen",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-musa-al-ashari' }, { person: 'muadh-ibn-jabal' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4341, 0, 102),
      source: { slug: 'sahih-al-bukhari', hadith: 4341, url: 'https://sunnah.com/bukhari:4341' },
      moments: [
        { title: "«يسرا ولا تعسرا»", text: sahih('bukhari', 4341, 103, 337), people: ['prophet-muhammad', 'abu-musa-al-ashari', 'muadh-ibn-jabal'] },
        { title: "«لا أنزل حتى يقتل»", text: sahih('bukhari', 4341, 338, 1021), people: ['muadh-ibn-jabal', 'abu-musa-al-ashari'] },
        { title: "«فأحتسب نومتي كما أحتسب قومتي»", text: sahih('bukhari', 4341, 1022, 1335), people: ['muadh-ibn-jabal', 'abu-musa-al-ashari'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4344, 0, 101),
      source: { slug: 'sahih-al-bukhari', hadith: 4344, url: 'https://sunnah.com/bukhari:4344' },
      moments: [
        { title: "«يسرا ولا تعسرا»", text: sahih('bukhari', 4344, 102, 415), people: ['prophet-muhammad', 'abu-musa-al-ashari', 'muadh-ibn-jabal'] },
        { title: "«فأحتسب نومتي كما أحتسب قومتي»", text: sahih('bukhari', 4344, 416, 657), people: ['muadh-ibn-jabal', 'abu-musa-al-ashari'] },
        { title: "«لأضربن عنقه»", text: sahih('bukhari', 4344, 658, 1127), people: ['muadh-ibn-jabal', 'abu-musa-al-ashari'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuMusaAndMuadhInYemen;
