import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/prophet-muhammad-lineage-and-birth, which
 * covers printed pages 29 to 41: his lineage, his birth, and his names and
 * kunya. That is three sections of a sira running to page 1154, so this module
 * is a first instalment rather than a finished subject.
 *
 * He is still declared in prisma/personSeedData.ts, which makes the catalog
 * additive for him: catalog:project connects what is here and leaves the rest
 * of the seed's values alone. Nothing carries the legacy marker as a result,
 * because the seed is still their author. Removing his seed entry is what would
 * hand this module authority, and that waits until the sira has been read.
 *
 * The sira section is unvowelled where the companion entries are vowelled, so
 * the Arabic below matches its own pages rather than theirs.
 */
const prophetMuhammad = {
  kind: 'PERSON',
  slug: 'prophet-muhammad',
  name: 'محمد ﷺ',
  nameTransliterated: 'Muhammad',
  hasProfile: true,

  fields: {
    // The naming line unpacks the names behind the bynames: عبد المطلب is
    // Shaybah, هاشم is Amr, عبد مناف is al-Mughirah, قصي is Zayd.
    fullName: {
      value:
        'محمد بن عبد الله بن عبد المطلب واسم عبد المطلب شيبة, ابن هاشم واسمه عمرو, ابن عبد مناف واسمه المغيرة، ابن قصي واسمه زيد بن كلاب بن مرة بن كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة ابن مدركة، واسمه عامر بن إلياس بن مضر بن نزار بن معد بن عدنان.',
      claims: ['prophet/lineage'],
    },
    kunya: { value: 'أبو القاسم', claims: ['prophet/kunya'] },
    virtues: {
      value:
        'سيد المرسلين وخاتم النبيين، اصطفاه الله من بني هاشم، وقال صلى الله عليه وسلم: (إنما أنا رحمة مهداة) .',
      claims: ['prophet/virtues'],
    },
  },

  // The seed's twelve titles, minus the two this batch found nothing for:
  // the-intercessor and master-of-children-of-adam. Those stay the seed's until
  // a later batch reaches the passages that name them.
  titles: [
    { title: 'prophet', claims: ['prophet/described-in-quran'] },
    { title: 'messenger', claims: ['prophet/described-in-quran'] },
    { title: 'the-chosen-one', claims: ['prophet/istifa'] },
    { title: 'ahmad', claims: ['prophet/names'] },
    { title: 'the-gatherer', claims: ['prophet/names'] },
    { title: 'the-last', claims: ['prophet/names'] },
    { title: 'prophet-of-mercy', claims: ['prophet/names'] },
    { title: 'prophet-of-repentance', claims: ['prophet/names'] },
    { title: 'truthful-trustworthy', claims: ['prophet/al-amin'] },
    { title: 'seal-of-the-prophets', claims: ['prophet/names'] },
  ],

  ayat: [
    // al-Dhahabi quotes the verse directly after the رحمة مهداة hadith.
    { surah: 21, ayah: 107, claims: ['prophet/ayah-al-anbiya'] },
    // Read of him: his فصيلة is بنو عبد المطلب, his فخذ بنو هاشم.
    { surah: 70, ayah: 13, claims: ['prophet/ayah-al-maarij'] },
  ],

  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abdullah-ibn-abd-al-muttalib', claims: ['prophet/father'] },
  ],
} satisfies CatalogPerson;

export default prophetMuhammad;
