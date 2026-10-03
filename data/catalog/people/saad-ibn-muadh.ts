import type { CatalogPerson } from '@/lib/catalog/types';

const saadIbnMuadh = {
  kind: 'PERSON',
  slug: 'saad-ibn-muadh',
  name: 'سَعْدُ بنُ مُعَاذِ',
  nameTransliterated: 'Saad ibn Muadh',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['saad-ibn-muadh-siyar56/sex'] },
    fullName: {
      value: 'سَعْدُ بنُ مُعَاذِ بنِ النُّعْمَانِ بنِ امْرِئِ القَيْسِ الأَنْصَارِيُّ بنِ زَيْدِ بنِ عَبْدِ الأَشْهَلِ',
      claims: ['saad-ibn-muadh-siyar56/full-name'],
    },
    kunya: { value: 'أَبُو عَمْرٍو', claims: ['saad-ibn-muadh-siyar56/kunya'] },
    appearance: {
      value:
        'رَجُلاً أَبْيَضَ، طُوَالاً، جَمِيْلاً، حَسَنَ الوَجْهِ، أَعْيَنَ، حَسَنَ اللِّحْيَةِ',
      claims: ['saad-ibn-muadh-siyar56/appearance'],
    },
    virtues: {
      value:
        'أسلم على يد مصعب بن عمير، ثم قال لقومه: كلام رجالكم ونسائكم علي حرام حتى تؤمنوا، فما أمسى في دار بني عبد الأشهل رجل ولا امرأة إلا مسلما ومسلمة. وقال فيه النبي صلى الله عليه وسلم: (إن هذا الذي تحرك له العرش) ، وشيع جنازته سبعون ألف ملك.',
      claims: ['saad-muadh/islam', 'saad-muadh/arsh'],
    },
    deathYearHijri: { value: '5 AH', claims: ['saad-muadh/death-year'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['saad-ibn-muadh-siyar56/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'muadh-ibn-al-numan',
      claims: ['saad-ibn-muadh-siyar56/father'],
    },
  ],
} satisfies CatalogPerson;

export default saadIbnMuadh;
