import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Asma bint Abi Bakr emigrated carrying Abd Allah ibn al-Zubayr, gave birth to him at Quba and brought him to the Prophet ﷺ,
 * who chewed a date and put it in his mouth and prayed for him: the first child born in Islam. Told from Sahih al-Bukhari,
 * each hadith whole, as its chapter on the hijra gives them: Asma's 3909 first, then Aisha's 3910. Abd Allah has no
 * catalog subject and is not linked.
 */
const birthOfAbdullahIbnAzZubayr = {
  kind: 'EVENT',
  slug: 'birth-of-abdullah-ibn-az-zubayr',
  name: "مولد عبد الله بن الزبير",
  nameTransliterated: "The birth of Abd Allah ibn al-Zubayr",
  type: 'BIRTH',
  fields: {},
  people: [{ person: 'asma-bint-abi-bakr' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 3909, 0, 132),
      source: { slug: 'sahih-al-bukhari', hadith: 3909, url: 'https://sunnah.com/bukhari:3909' },
      moments: [
        { title: "فولدته بقباء", text: sahih('bukhari', 3909, 133, 291), people: ['asma-bint-abi-bakr'] },
        { title: "أول شيء دخل جوفه", text: sahih('bukhari', 3909, 292, 590), people: ['asma-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "هاجرت وهي حبلى", text: sahih('bukhari', 3909, 591, 763), people: ['asma-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3910, 0, 125),
      source: { slug: 'sahih-al-bukhari', hadith: 3910, url: 'https://sunnah.com/bukhari:3910' },
      moments: [
        { title: "أول مولود ولد في الإسلام", text: sahih('bukhari', 3910, 126, 349), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default birthOfAbdullahIbnAzZubayr;
