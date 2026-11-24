import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Sa'd ibn Abi Waqqas: no one became Muslim but on the day he did, and he stayed seven days a third of Islam. Told from
 * Sahih al-Bukhari 3858, the one hadith of its chapter «إسلام سعد» (Manaqib al-Ansar), whole.
 */
const islamOfSaadIbnAbiWaqqas = {
  kind: 'EVENT',
  slug: 'islam-of-saad-ibn-abi-waqqas',
  name: "إسلام سعد بن أبي وقاص",
  nameTransliterated: "The Islam of Sa'd ibn Abi Waqqas",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'saad-ibn-abi-waqqas' }],
  tags: ['ISLAM'],
  reports: [
    {
      isnad: sahih('bukhari', 3858, 0, 111),
      source: { slug: 'sahih-al-bukhari', hadith: 3858, url: 'https://sunnah.com/bukhari:3858' },
      moments: [
        { title: "«ما أسلم أحد إلا في اليوم الذي أسلمت فيه»", text: sahih('bukhari', 3858, 112, 247), people: ['saad-ibn-abi-waqqas'] },
        { title: "«وإني لثلث الإسلام»", text: sahih('bukhari', 3858, 248, 317), people: ['saad-ibn-abi-waqqas'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfSaadIbnAbiWaqqas;
