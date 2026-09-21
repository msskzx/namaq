import type { CatalogUtterance } from '@/lib/catalog/types';

/**
 * The other rajaz of the mosque, beside هذا الحمال لا حمال خيبر. Three
 * narrations and three wordings: اللهم إن الأجر أجر الآخره with فارحم at
 * `1/284-p4`, لا خير إلا خير الآخره with فانصر at `1/290-p3`, and this one at
 * `1/290-p8`. One record, because it is one rajaz with the isnads differing
 * over a word, and all three citations are on it.
 *
 * At `1/290-p3` the Companions carry the stones and say it وهم يرتجزون,
 * ورسول الله صلى الله عليه وسلم معهم, so the speaker is not in doubt even
 * there.
 */
const prophetAllahummaLaKhayraIllaKhayrAlAkhirah = {
  kind: 'UTTERANCE',
  slug: 'prophet-allahumma-la-khayra-illa-khayr-al-akhirah',
  utteranceKind: 'POETRY',
  speaker: 'prophet-muhammad',
  event: 'building-of-the-prophets-mosque',
  textArabic: { value: 'اللهم لا خير إلا خير الآخره ... فارحم الأنصار والمهاجره', claims: ['prophet/rajaz-al-akhirah'] },
  fields: {
    occasion: { value: 'كان يرتجز به وهو ينقل اللبن والصخر مع أصحابه في بناء المسجد.', claims: ['prophet/rajaz-al-akhirah'] },
  },
} satisfies CatalogUtterance;

export default prophetAllahummaLaKhayraIllaKhayrAlAkhirah;
