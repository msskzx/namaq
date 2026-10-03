import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/tulayhah-ibn-khuwaylid, entry 62. The
// entry never states his sex outright, so it stays on the legacy marker.
//
// A marginal case: converted in 9 AH, apostatized and claimed false
// prophethood, then returned to Islam under Abu Bakr. Kept as a companion on
// the book's own framing ("صاحب رسول الله"), which no cited work contests —
// but the entry's own praise rests partly on the closing "قُلْتُ", al-Dhahabi's
// unauthenticated voice, so the death place is LIKELY rather than settled.
const tulayhahIbnKhuwaylid = {
  kind: 'PERSON',
  slug: 'tulayhah-ibn-khuwaylid',
  name: 'طُلَيْحَةُ بنُ خُوَيْلِدِ',
  nameTransliterated: 'Tulayhah ibn Khuwaylid',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'طُلَيْحَةُ بنُ خُوَيْلِدِ بنِ نَوْفَلٍ الأَسَدِيُّ',
      claims: ['tulayhah-ibn-khuwaylid-siyar62/full-name'],
    },
    virtues: {
      value:
        'البَطَلُ الكَرَّارُ، صَاحِبُ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- وَمَنْ يُضْرَبُ بِشَجَاعَتِهِ المَثَلُ. وَكَتَبَ عُمَرُ إِلَى سَعْدِ بنِ أَبِي وَقَّاصٍ: أَنْ شَاوِرْ طُلَيْحَةَ فِي أَمْرِ الحَرْبِ، وَلاَ تُوَلِّهِ شَيْئاً. قَالَ مُحَمَّدُ بنُ سَعْدٍ: كَانَ طُلَيْحَةُ يُعَدُّ بِأَلْفِ فَارِسٍ لِشَجَاعَتِهِ وَشِدَّتِهِ',
      claims: ['tulayhah-ibn-khuwaylid-siyar62/virtues'],
    },
    placeOfDeathArabic: { value: 'نَهَاوَنْدَ', claims: ['tulayhah-ibn-khuwaylid-siyar62/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['tulayhah-ibn-khuwaylid-siyar62/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'khuwaylid-ibn-nawfal',
      claims: ['tulayhah-ibn-khuwaylid-siyar62/father'],
    },
  ],
} satisfies CatalogPerson;

export default tulayhahIbnKhuwaylid;
