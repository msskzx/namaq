import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Masruq found Hassan ibn Thabit reciting love verses to Aisha, «حصان رزان ما تزن بريبة», and she said «لكنك لست كذلك»; when
 * Masruq asked why she let him in, reciting «والذي تولى كبره منهم له عذاب عظيم», she said «وأي عذاب أشد من العمى؟» and that
 * he used to defend the Messenger of Allah ﷺ. Told from Sahih al-Bukhari 4146 (al-Maghazi, the chapter on the hadith of the
 * Ifk), whole.
 */
const hassanRecitesToAisha = {
  kind: 'EVENT',
  slug: 'hassan-recites-to-aisha',
  name: "حسان ينشد عائشة",
  nameTransliterated: "Hassan recites to Aisha",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'aisha-bint-abi-bakr' }, { person: 'hassan-ibn-thabit' }, { person: 'prophet-muhammad' }],
  ayat: [
    {
      kind: 'RECITED',
      from: '24:11',
      to: '24:11',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4146, url: 'https://sunnah.com/bukhari:4146', quote: sahih('bukhari', 4146, 492, 580) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4146, 0, 144),
      source: { slug: 'sahih-al-bukhari', hadith: 4146, url: 'https://sunnah.com/bukhari:4146' },
      moments: [
        { title: "«حصان رزان ما تزن بريبة»", text: sahih('bukhari', 4146, 145, 415), people: ['aisha-bint-abi-bakr', 'hassan-ibn-thabit'] },
        { title: "«وأي عذاب أشد من العمى؟»", text: sahih('bukhari', 4146, 416, 707), people: ['aisha-bint-abi-bakr', 'hassan-ibn-thabit', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default hassanRecitesToAisha;
