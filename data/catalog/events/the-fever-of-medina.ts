import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When the Prophet ﷺ came to Medina, Abu Bakr and Bilal fell ill with fever, each with his lines of verse; Aisha told the
 * Prophet ﷺ, and he prayed that Allah make Medina beloved to them as Makkah or more, bless its sa' and mudd, and move its
 * fever to al-Juhfah. Told from Sahih al-Bukhari 3926 (Manaqib al-Ansar, the chapter on the Prophet's arrival in Medina),
 * whole.
 */
const theFeverOfMedina = {
  kind: 'EVENT',
  slug: 'the-fever-of-medina',
  name: "حمى المدينة",
  nameTransliterated: "The fever of Medina",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'bilal-ibn-rabah' }, { person: 'aisha-bint-abi-bakr' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3926, 0, 148),
      source: { slug: 'sahih-al-bukhari', hadith: 3926, url: 'https://sunnah.com/bukhari:3926' },
      moments: [
        { title: "وعك أبو بكر وبلال", text: sahih('bukhari', 3926, 149, 326), people: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'bilal-ibn-rabah', 'aisha-bint-abi-bakr'] },
        { title: "«كل امرئ مصبح في أهله»", text: sahih('bukhari', 3926, 327, 473), people: ['abu-bakr-as-siddiq'] },
        { title: "«ألا ليت شعري»", text: sahih('bukhari', 3926, 474, 722), people: ['bilal-ibn-rabah'] },
        { title: "«اللهم حبب إلينا المدينة»", text: sahih('bukhari', 3926, 723, 970), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theFeverOfMedina;
