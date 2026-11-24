import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ibn Abbas, Abd al-Rahman ibn Azhar and al-Miswar sent Kurayb to ask Aisha about the two rak'ahs after Asr; she sent him
 * to Umm Salamah, who told how she had seen the Prophet ﷺ pray them, sent a servant girl to ask, and he answered that men
 * of Abd al-Qays had kept him from the two after Zuhr. Told from Sahih al-Bukhari 4370 (al-Maghazi, the delegation of Abd
 * al-Qays), whole. Kurayb, Abd al-Rahman ibn Azhar, al-Miswar and the servant girl are not linked.
 */
const theTwoRakahsAfterAsr = {
  kind: 'EVENT',
  slug: 'the-two-rakahs-after-asr',
  name: "الركعتان بعد العصر",
  nameTransliterated: "The two rak'ahs after Asr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'aisha-bint-abi-bakr' }, { person: 'umm-salamah' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 4370, 0, 204),
      source: { slug: 'sahih-al-bukhari', hadith: 4370, url: 'https://sunnah.com/bukhari:4370' },
      moments: [
        { title: "أرسلوا كريبا إلى عائشة", text: sahih('bukhari', 4370, 205, 792), people: ['aisha-bint-abi-bakr', 'umm-salamah'] },
        { title: "أرسلت إليه الخادم", text: sahih('bukhari', 4370, 793, 1291), people: ['umm-salamah', 'prophet-muhammad'] },
        { title: "«أتاني أناس من عبد القيس»", text: sahih('bukhari', 4370, 1292, 1555), people: ['prophet-muhammad', 'umm-salamah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theTwoRakahsAfterAsr;
