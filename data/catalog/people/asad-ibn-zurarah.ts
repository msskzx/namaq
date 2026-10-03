import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/asad-ibn-zurarah, entry 58. The entry
// never states his sex outright, so sex stays on the sira chapter's claim.
const asadIbnZurarah = {
  kind: 'PERSON',
  slug: 'asad-ibn-zurarah',
  name: 'أسعد بن زرارة',
  nameTransliterated: 'Asad ibn Zurarah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'أَسَعْدُ بنُ زُرَارَةَ بنِ عُدَسَ بنِ عُبَيْدِ بنِ ثَعْلَبَةَ الأَنْصَارِيُّ بنِ غَنْمِ بنِ مَالِكِ بنِ النَّجَّارِ.',
      claims: ['asad-ibn-zurarah-siyar58/full-name'],
    },
    sex: { value: 'MALE', claims: ['asad/sex'] },
    kunya: {
      value: 'أَبُو أُمَامَةَ',
      claims: ['asad-ibn-zurarah-siyar58/kunya'],
    },
    tribalAffiliation: {
      value: 'الأنصاري، الخزرجي، النجاري',
      claims: ['asad-ibn-zurarah-siyar58/tribal-affiliation'],
    },
    virtues: {
      value:
        'كان من سادة الأنصار ومن نقبائهم الأبرار، ولم يجعل النبي صلى الله عليه وسلم على بني النجار بعده نقيبا وقال: (أنا نقيبكم) ، فكانوا يفخرون بذلك. وكان أول من جمع بالمدينة، ومقدم النقباء الاثني عشر، وأول من قدم المدينة بالإسلام مع ذكوان بن عبد قيس، وصلى بالناس قبل مقدم النبي صلى الله عليه وسلم.',
      claims: ['asad/naqib', 'asad-ibn-zurarah-siyar58/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['asad-ibn-zurarah-siyar58/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'zurarah-ibn-udas',
      claims: ['asad-ibn-zurarah-siyar58/father'],
    },
  ],
} satisfies CatalogPerson;

export default asadIbnZurarah;
