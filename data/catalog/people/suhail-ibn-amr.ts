import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/suhail-ibn-amr, entry 25, immediately
// after his two sons Abu Jandal (entry 23) and Abdullah ibn Suhail (entry
// 24), both of whom already carry a SON relation to him. The FATHER side of
// that tie stays declared on their modules, not repeated here, per the
// standing rule that a relation is declared once.
const suhailIbnAmr = {
  kind: 'PERSON',
  slug: 'suhail-ibn-amr',
  name: 'سُهَيْلُ بنُ عَمْرٍو',
  nameTransliterated: 'Suhail ibn Amr',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: { value: 'سُهَيْلُ بنُ عَمْرٍو', claims: ['suhail-ibn-amr-siyar25/full-name'] },
    kunya: { value: 'أَبَا يَزِيْدَ', claims: ['suhail-ibn-amr-siyar25/kunya'] },
    // Two competing reports on how he died: martyred at Yarmuk (al-Mada'ini
    // and others) against died in the Amwas plague (al-Shafii and al-Waqidi,
    // named individually). The plague reading takes the field;
    // suhail-ibn-amr-siyar25/death-place-alt carries the Yarmuk martyrdom as
    // its own DISPUTED claim.
    placeOfDeathArabic: { value: 'طَاعُوْنِ عَمَوَاسَ', claims: ['suhail-ibn-amr-siyar25/death-place'] },
  },
  virtues: [
    {
      value:
        'وَكَانَ خَطِيْبَ قُرَيْشٍ، وَفَصِيْحَهُم، وَمِنْ أَشْرَافِهِم. وَكَانَ سَمْحاً، جَوَاداً، مُفَوَّهاً. وَقَدْ قَامَ بِمَكَّةَ خَطِيْباً عِنْدَ وَفَاةِ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِنَحْوٍ مِنْ خُطْبَةِ الصِّدِّيْقِ بِالمَدِيْنَةِ، فَسَكَّنَهُم، وَعَظَّمَ الإِسْلاَمَ. كَانَ سُهَيْلُ بَعْدُ كَثِيْرَ الصَّلاَةِ وَالصَّوْمِ وَالصَّدَقَةِ، وَكَانَ كَثِيْرَ البُكَاءِ إِذَا سَمِعَ القُرْآنَ',
      claims: ['suhail-ibn-amr-siyar25/virtues'],
    },
  ],

  titles: [
    // Carried from the retired seed.
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-abd-shams', claims: ['suhail-ibn-amr-siyar25/father'] },
  ],
} satisfies CatalogPerson;

export default suhailIbnAmr;
