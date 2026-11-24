import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Umar guessed that a handsome man passing by had been the soothsayer of his people in the Jahiliyyah, and the man owned
 * it and told what his jinniyyah brought him in fright; Umar said he was right, and told of the cry he heard by their
 * idols over a slaughtered calf, «يا جليح، أمر نجيح», before they heard: this is a prophet. Told from Sahih al-Bukhari
 * 3866 (the chapter on Umar's islam), whole. The man is not named in the text, so no one is linked for him. Not tagged
 * ISLAM: it is what came before Umar's islam, not his islam.
 */
const umarAndTheKahin = {
  kind: 'EVENT',
  slug: 'umar-and-the-kahin',
  name: "عمر والكاهن",
  nameTransliterated: "Umar and the soothsayer",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }],
  reports: [
    {
      isnad: sahih('bukhari', 3866, 0, 148),
      source: { slug: 'sahih-al-bukhari', hadith: 3866, url: 'https://sunnah.com/bukhari:3866' },
      moments: [
        { title: "«إلا كان كما يظن»", text: sahih('bukhari', 3866, 149, 254), people: ['umar-ibn-al-khattab'] },
        { title: "«أو لقد كان كاهنهم»", text: sahih('bukhari', 3866, 255, 462), people: ['umar-ibn-al-khattab'] },
        { title: "«كنت كاهنهم في الجاهلية»", text: sahih('bukhari', 3866, 463, 658), people: ['umar-ibn-al-khattab'] },
        { title: "ما جاءته به جنيته", text: sahih('bukhari', 3866, 659, 924), people: ['umar-ibn-al-khattab'] },
        { title: "«يا جليح، أمر نجيح»", text: sahih('bukhari', 3866, 925, 1407), people: ['umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default umarAndTheKahin;
