import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Read against data/history/batches/sawdah-bint-zamah, her own Siyar entry
 * (سير أعلام النبلاء ط الرسالة, السيرة 2/265-269). Her marriage to al-Sakran
 * ibn Amr and to the Prophet are each declared on both sides per
 * docs/extraction-checklist.md's bidirectional-edge convention. `sex` stays
 * on the legacy marker: the source never states it directly.
 */
const sawdahBintZamah = {
  kind: 'PERSON',
  slug: 'sawdah-bint-zamah',
  name: 'سَوْدَةُ بِنْتُ زَمْعَةَ',
  nameTransliterated: 'Sawdah bint Zam\'ah',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'سَوْدَةُ أُمُّ المُؤْمِنِيْنَ بِنْتُ زَمْعَةَ بنِ قَيْسٍ العَامِرِيَّةُ القُرَشِيَّةُ، العَامِرِيَّةُ',
      claims: ['sawdah-bint-zamah-siyar40/full-name'],
    },
    appearance: {
      value: 'كَانَتْ سَيِّدَةً جَلِيْلَةً، نَبِيْلَةً، ضَخْمَةً',
      claims: ['sawdah-bint-zamah-siyar40/appearance'],
    },
    virtues: {
      value:
        'وَهِيَ أَوَّلُ مَنْ تَزَوَّجَ بِهَا النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بَعْدَ خَدِيْجَةَ، وَانْفَرَدَتْ بِهِ نَحْواً مِنْ ثَلاَثِ سِنِيْنَ أَوْ أَكْثَرَ، حَتَّى دَخَلَ بِعَائِشَةَ. وَهِيَ الَّتِي وَهَبَتْ يَوْمَهَا لِعَائِشَةَ، رِعَايَةً لِقَلْبِ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ-',
      claims: ['sawdah-bint-zamah-siyar40/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    {
      title: 'mother-of-believers',
      name: 'أم المؤمنين',
      nameTransliterated: 'Mother of the Believers',
      claims: ['sawdah-bint-zamah-siyar40/titles'],
    },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'zamah-ibn-qais-al-amiri', claims: ['sawdah-bint-zamah-siyar40/father'] },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'prophet-muhammad', claims: ['sawdah-bint-zamah-siyar40/husband-prophet'] },
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'al-sakran-ibn-amr-al-amiri',
      claims: ['sawdah-bint-zamah-siyar40/husband-sakran'],
    },
  ],
} satisfies CatalogPerson;

export default sawdahBintZamah;
