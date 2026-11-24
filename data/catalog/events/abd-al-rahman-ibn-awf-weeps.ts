import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abd al-Rahman ibn Awf, fasting, was brought food and remembered Mus'ab ibn Umayr, shrouded in a cloak too short for him,
 * and Hamzah, both better than he, and feared their own good deeds had been paid in this world, and wept until he left the
 * food. Told from Sahih al-Bukhari 4045 (al-Maghazi, the chapter on Uhud), whole.
 */
const abdAlRahmanIbnAwfWeeps = {
  kind: 'EVENT',
  slug: 'abd-al-rahman-ibn-awf-weeps',
  name: "بكاء عبد الرحمن بن عوف",
  nameTransliterated: "Abd al-Rahman ibn Awf weeps",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdur-rahman-ibn-awf' }, { person: 'musab-ibn-umayr' }, { person: 'hamzah-ibn-abd-al-muttalib' }],
  reports: [
    {
      isnad: sahih('bukhari', 4045, 0, 126),
      source: { slug: 'sahih-al-bukhari', hadith: 4045, url: 'https://sunnah.com/bukhari:4045' },
      moments: [
        { title: "«قتل مصعب بن عمير وهو خير مني»", text: sahih('bukhari', 4045, 127, 364), people: ['abdur-rahman-ibn-awf', 'musab-ibn-umayr'] },
        { title: "«وقد خشينا أن تكون حسناتنا عجلت لنا»", text: sahih('bukhari', 4045, 365, 630), people: ['hamzah-ibn-abd-al-muttalib', 'abdur-rahman-ibn-awf'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abdAlRahmanIbnAwfWeeps;
