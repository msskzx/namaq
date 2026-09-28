import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/khubayb-ibn-adi, entry 40, the martyr of
// al-Raji'. The entry never states his sex outright, so it stays on the
// legacy marker.
const khubaybIbnAdi = {
  kind: 'PERSON',
  slug: 'khubayb-ibn-adi',
  name: 'خبيب بن عدي',
  nameTransliterated: 'Khubayb ibn Adi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'خبيب بن عدي بن عامر بن مجدعة الأنصاري ابن جحجبى الأنصاري',
      claims: ['khubayb-ibn-adi-siyar40/full-name'],
    },
    placeOfDeathArabic: { value: 'مكة', claims: ['khubayb-ibn-adi-siyar40/death-place'] },
    virtues: {
      value:
        'فكان أول من سن الصلاة عند القتل. ودعا على قاتليه: اللهم أحصهم عدداً، واقتلهم بدداً، ولا تغادر منهم أحداً. قال معاوية: كنت فيمن حضره، فلقد رأيت أبا سفيان يلقيني إلى الأرض فرقاً من دعوة خبيب. ووجدته ماوية يأكل قطفاً من عنب مثل رأس الرجل وما أعلم في الأرض حبة عنب',
      claims: ['khubayb-ibn-adi-siyar40/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['khubayb-ibn-adi-siyar40/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'adi-ibn-amir',
      claims: ['khubayb-ibn-adi-siyar40/father'],
    },
  ],
} satisfies CatalogPerson;

export default khubaybIbnAdi;
