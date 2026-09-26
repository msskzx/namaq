import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Year four opens with the سرية he led to قطن and closes with his death from
 * the Uhud wound that reopened, so chapter six is where he stops being a name
 * in the emigration rosters. His mother, carried here on the marker when his
 * seed entry was retired, is named in the same sentence that gives his nasab.
 *
 * `companion` stays on the marker: the chapter never calls him one, and the
 * milk-brotherhood was already cited from chapter one.
 */
const abuSalamah = {
  kind: 'PERSON',
  slug: 'abu-salamah',
  name: 'أَبُو سَلَمَةَ بنُ عَبْدِ الأَسَدِ',
  nameTransliterated: 'Abu Salamah ibn Abd al-Asad',
  hasProfile: true,
  fields: {
    // The heading's name and the lineage line under it, as the edition prints
    // them; the entry number and collection marks are dropped.
    fullName: {
      value: 'أَبُو سَلَمَةَ بنُ عَبْدِ الأَسَدِ بنِ هِلاَلِ ابْنِ عَبْدِ اللهِ بنِ عُمَرَ بنِ مَخْزُوْمِ بنِ يَقَظَةَ بنِ مُرَّةَ بنِ كَعْبٍ',
      claims: ['abu-salamah-siyar8/full-name'],
    },
    // Two citations for one value: the obituary dates the death to جمادى
    // الآخرة سنة أربع, and the expedition's own page gives the day within that
    // month. Neither states the year and the month together.
    deathYearHijri: { value: '4 AH', claims: ['abu-salamah/death-year'] },
  },
  titles: [
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
    { title: 'al-sabiqoon', claims: ['abu-salamah-siyar8/title-sabiqoon'] },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-asad-ibn-hilal', claims: ['abu-salamah-siyar8/father'] },
    { type: 'SON', inverse: 'MOTHER', to: 'barrah-bint-abd-al-muttalib', claims: ['abu-salamah/mother-barrah'] },
    {
      type: 'MILK_BROTHER',
      inverse: 'MILK_BROTHER',
      to: 'prophet-muhammad',
      claims: ['abu-salamah/rida-thuwaybah'],
    },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'umm-salamah', claims: ['abu-salamah/husband-umm-salamah'] },
  ],
} satisfies CatalogPerson;

export default abuSalamah;
