import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const fatimahBintMuhammad = {
  kind: 'PERSON',
  slug: 'fatimah-bint-muhammad',
  name: 'فاطمة بنت محمد',
  nameTransliterated: 'Fatimah bint Muhammad',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'بِنْتُ سَيِّدِ الخَلْقِ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- أَبِي القَاسِمِ مُحَمَّدِ بنِ عَبْدِ اللهِ بنِ عَبْدِ المُطَّلِبِ بنِ هَاشِمِ بنِ عَبْدِ مَنَافٍ القُرَشِيَّةُ، الهَاشِمِيَّةُ',
      claims: ['fatimah-siyar/full-name'],
    },
    appearance: {
      value: 'جَاءتْ فَاطِمَةُ تَمْشِي مَا تُخْطِئُ مِشْيَتُهَا مِشْيَةَ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- مَا رَأَيْتُ أَحَداً كَانَ أَشْبَهَ كَلاَماً وَحَدِيْثاً بِرَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- مِنْ فَاطِمَةَ',
      claims: ['fatimah-siyar/appearance'],
    },
  },
  virtues: [
    {
      value: 'البَضْعَةُ النَّبَوِيَّةُ سَيِّدَةُ نِسَاءِ أَهْلِ الجَنَّةِ وَتَزَوَّجَهَا الإِمَامُ عَلِيُّ بنُ أَبِي طَالِبٍ وَأُمُّ الحَسَنَيْنِ',
      claims: ['fatimah-siyar/virtues'],
    },
  ],

  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    { title: 'sayyidat-nisa-ahl-al-jannah', name: 'سيدة نساء أهل الجنة', nameTransliterated: 'Mistress of the Women of Paradise', claims: ['fatimah-siyar/title-sayyidat-nisa'] },
    { title: 'daughter-of-prophet', name: 'بنت النبي', nameTransliterated: 'Daughter of the Prophet', claims: ['fatimah-siyar/title-daughter-of-prophet'] },
  ],
  ayat: [
    // الإنسان 8, carried uncited from the old seed, was dropped (2026-11-18): it rests on
    // the story of three nights of feeding, which al-Qurtubi calls «حديثا لا يصح ولا يثبت»
    // and al-Hakim al-Tirmidhi «حديث مزوق مزيف» (al-Qurtubi on الإنسان 8).
    { surah: 33, ayah: 33, kind: 'DESCRIBES', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'prophet-muhammad', claims: ['fatimah-siyar/daughter-prophet'] },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'ali-ibn-abi-talib', claims: ['fatimah-siyar/wife-ali'] },
  ],
} satisfies CatalogPerson;

export default fatimahBintMuhammad;
