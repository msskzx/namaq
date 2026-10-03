import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const abuAlAsIbnAlRabi = {
  kind: 'PERSON',
  slug: 'abu-al-as-ibn-al-rabi',
  name: 'أبو العاص بن الربيع',
  nameTransliterated: 'Abu al-As ibn al-Rabi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'أَبُو العَاصِ بنُ الرَّبِيْعِ بنِ عَبْدِ العُزَّى القُرَشِيُّ بنِ عَبْدِ شَمْسٍ بنِ عَبْدِ مَنَافٍ بنِ قُصَيِّ بنِ كِلاَبٍ القُرَشِيُّ، العَبْشَمِيُّ',
      claims: ['abu-al-as-ibn-al-rabi-siyar69/full-name'],
    },
  },
  virtues: [
    {
      value: 'صِهْرُ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- زَوْجُ بِنْتِهِ زَيْنَبَ، وَهُوَ وَالِدُ أُمَامَةَ الَّتِي كَانَ يَحْمِلُهَا النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- فِي صَلاَتِهِ أَثْنَى النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- عَلَى أَبِي العَاصِ فِي مُصَاهَرَتِهِ خَيْراً. وَكَانَ قَدْ وَعَدَ النَّبِيَّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- أَنْ يَرْجِعَ إِلَى مَكَّةَ بَعْدَ وَقْعَةِ بَدْرٍ، فَيَبْعَثَ إِلَيْهِ بِزَيْنَبَ ابْنَتِهِ، فَوَفَى بِوَعْدِهِ، وَفَارَقَهَا مَعَ شِدَّةِ حُبِّهِ لَهَا، وَكَانَ مِنْ تُجَّارِ قُرَيْشٍ وَأُمَنَائِهِم',
      claims: ['abu-al-as-ibn-al-rabi-siyar69/virtues'],
    },
  ],

  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-rabi-ibn-abd-al-uzza', claims: ['abu-al-as-ibn-al-rabi-siyar69/father'] },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'zaynab-bint-muhammad', claims: ['abu-al-as-ibn-al-rabi-siyar69/zaynab-wife'] },
  ],
} satisfies CatalogPerson;

export default abuAlAsIbnAlRabi;
