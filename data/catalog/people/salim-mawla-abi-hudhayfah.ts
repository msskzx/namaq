import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/salim-mawla-abi-hudhayfah, entry 14,
// the entry immediately after abu-hudhayfah. One of the early Muslims who
// led the Muhajirun in prayer at Quba before the Prophet's own arrival, for
// knowing the most Qur'an among them, and was martyred at Yamamah beside
// his patron Abu Hudhayfah.
const salimMawlaAbiHudhayfah = {
  kind: 'PERSON',
  slug: 'salim-mawla-abi-hudhayfah',
  name: 'سالم مولى أبي حذيفة',
  nameTransliterated: 'Salim, mawla of Abi Hudhayfah',
  hasProfile: true,
  fields: {
    fullName: { value: 'سَالِمُ بنُ مَعْقِلٍ', claims: ['salim-siyar14/full-name'] },
    virtues: {
      value:
        'مِنَ السَّابِقِيْنَ الأَوَّلِيْنَ، البَدْرِيِّيْنَ، المُقَرَّبِيْنَ، العَالِمِيْنَ. كَانَ يَؤُمُّ المُهَاجِرِيْنَ لأَنَّهُ كَانَ أَقْرَأَهُم، وَقَالَ فِيْهِ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ-: الحَمْدُ لِلِّهِ الَّذِي جَعَلَ فِي أُمَّتِي مِثْلَكَ.',
      claims: ['salim-siyar14/virtues'],
    },
  },
  titles: [
    // Carried from the seed. This entry never calls him صحابي outright.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    // Musa ibn Uqbah's own account: the wala' runs to Abu Hudhayfah even
    // though he names Abu Hudhayfah's wife, Thubaytah, as the one who
    // freed him -- see summary.md.
    { type: 'MAWLA', inverse: 'PATRON', to: 'abu-hudhayfah', claims: ['salim-siyar14/mawla'] },
    // Muhammad ibn Ibrahim al-Taymi's report, and marked منقطع right after
    // it -- see summary.md.
    { type: 'PACT_BROTHER', inverse: 'PACT_BROTHER', to: 'abu-ubaydah-ibn-al-jarrah', claims: ['salim-siyar14/pact-brother-abu-ubaydah'] },
  ],
} satisfies CatalogPerson;

export default salimMawlaAbiHudhayfah;
