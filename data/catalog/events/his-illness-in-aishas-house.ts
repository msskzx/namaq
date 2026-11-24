import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * As his illness grew the Prophet ﷺ asked his wives' leave to be nursed in Aisha's house and walked out between al-Abbas and
 * another man his feet trailing on the ground; there he said «هريقوا علي من سبع قرب لم تحلل أوكيتهن، لعلي أعهد إلى
 * الناس», they poured water over him in a tub, and he went out, prayed with the people and addressed them. Told from Sahih
 * al-Bukhari 4442 (al-Maghazi, the illness of the Prophet ﷺ), whole. Aisha does not name the other man; Ibn Abbas in the
 * same hadith says «هو علي», and Ali is linked from that moment. Hafsah is named only as the owner of the tub.
 */
const hisIllnessInAishasHouse = {
  kind: 'EVENT',
  slug: 'his-illness-in-aishas-house',
  name: "تمريضه ﷺ في بيت عائشة",
  nameTransliterated: "His illness in Aisha's house",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'aisha-bint-abi-bakr' }, { person: 'al-abbas-ibn-abd-al-muttalib' }, { person: 'ali-ibn-abi-talib' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4442, 0, 237),
      source: { slug: 'sahih-al-bukhari', hadith: 4442, url: 'https://sunnah.com/bukhari:4442' },
      moments: [
        { title: "يمرض في بيتي", text: sahih('bukhari', 4442, 238, 496), people: ['prophet-muhammad', 'aisha-bint-abi-bakr', 'al-abbas-ibn-abd-al-muttalib'] },
        { title: "«هو علي»", text: sahih('bukhari', 4442, 497, 738), people: ['ali-ibn-abi-talib'] },
        { title: "«هريقوا علي من سبع قرب»", text: sahih('bukhari', 4442, 739, 1218), people: ['prophet-muhammad', 'aisha-bint-abi-bakr'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default hisIllnessInAishasHouse;
