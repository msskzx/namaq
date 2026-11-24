import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sat on the minbar and spoke of a servant whom Allah gave the choice between the flower of this world and
 * what is with Him, and he chose what is with Him; Abu Bakr wept, «فديناك بآبائنا وأمهاتنا», and the people wondered,
 * until they knew the one given the choice was the Prophet ﷺ himself. Told from Sahih al-Bukhari 3904 (Manaqib al-Ansar,
 * the chapter on the hijra), whole. The text does not say when; no date is given here.
 */
const theServantGivenTheChoice = {
  kind: 'EVENT',
  slug: 'the-servant-given-the-choice',
  name: "عبد خيره الله",
  nameTransliterated: "The servant whom Allah gave the choice",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'abu-said-al-khudri' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3904, 0, 212),
      source: { slug: 'sahih-al-bukhari', hadith: 3904, url: 'https://sunnah.com/bukhari:3904' },
      moments: [
        { title: "«عبد خيره الله»", text: sahih('bukhari', 3904, 213, 405), people: ['prophet-muhammad'] },
        { title: "«فديناك بآبائنا وأمهاتنا»", text: sahih('bukhari', 3904, 406, 726), people: ['abu-bakr-as-siddiq', 'abu-said-al-khudri'] },
        { title: "كان أبو بكر أعلمنا به", text: sahih('bukhari', 3904, 727, 813), people: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'abu-said-al-khudri'] },
        { title: "«إلا خوخة أبي بكر»", text: sahih('bukhari', 3904, 814, 1089), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theServantGivenTheChoice;
