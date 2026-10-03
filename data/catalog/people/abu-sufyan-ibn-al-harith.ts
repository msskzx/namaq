import type { CatalogPerson } from '@/lib/catalog/types';

const abuSufyanIbnAlHarith = {
  kind: 'PERSON',
  slug: 'abu-sufyan-ibn-al-harith',
  name: 'أبو سفيان بن الحارث',
  nameTransliterated: 'Abu Sufyan ibn al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['abu-sufyan-ibn-al-harith-siyar32/sex'] },
    // The heading and the nasab paragraph give al-Mughira; a report on 203 says
    // his name is his kunya and al-Mughira is their brother. That report is
    // full-name-alt, DISPUTED, and does not take the field.
    fullName: {
      value: 'المُغِيْرَةُ بنُ الحَارِثِ بنِ عَبْدِ المُطَّلِبِ بنِ هَاشِمٍ الهَاشِمِيُّ',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/full-name'],
    },
    kunya: { value: 'أَبُو سُفْيَانَ', claims: ['abu-sufyan-ibn-al-harith-siyar32/kunya'] },
    virtues: {
      value:
        'أَحَبَّ أَبَا سُفْيَانَ هَذَا، وَشَهِدَ لَهُ بِالجَنَّةِ، وَقَالَ: (أَرْجُو أَنْ يَكُوْنَ خَلَفاً مِنْ حَمْزَةَ كَانَ الَّذِيْنَ يُشَبَّهُوْنَ بِالنَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ-: جَعْفَرٌ، وَالحَسَنُ بنُ عَلِيٍّ، وَقُثَمُ بنُ العَبَّاسِ، وَأَبُو سُفْيَانَ بنُ الحَارِثِ. أَبُو سُفْيَانَ بنُ الحَارِثِ سَيِّدُ فِتْيَانِ أَهْلِ الجَنَّةِ',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/virtues'],
    },
    deathYearHijri: { value: '20', claims: ['abu-sufyan-ibn-al-harith-siyar32/death-year'] },
    placeOfDeathArabic: { value: 'المَدِيْنَةِ', claims: ['abu-sufyan-ibn-al-harith-siyar32/death-place'] },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['abu-sufyan-ibn-al-harith-siyar32/companion'] },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-abd-al-muttalib', claims: ['abu-sufyan-ibn-al-harith-siyar32/father'] },
    {
      type: 'PATERNAL_COUSIN',
      inverse: 'PATERNAL_COUSIN',
      to: 'prophet-muhammad',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/cousin-of-prophet'],
    },
    {
      type: 'MILK_BROTHER',
      inverse: 'MILK_BROTHER',
      to: 'prophet-muhammad',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/milk-brother'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'nawfal-ibn-al-harith',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/half-brother-nawfal'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'rabiah-ibn-al-harith',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/half-brother-rabiah'],
    },
  ],
} satisfies CatalogPerson;

export default abuSufyanIbnAlHarith;
