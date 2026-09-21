import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/prophet-muhammad-sira, chapters one and
 * two: printed pages السيرة ١/٢٩ to ١/٢٧٦, his lineage through the hijra to
 * Medina. The sira runs to ٢/٤٩٦ over thirteen chapters, so this is a subject
 * still being read.
 *
 * He stays declared in prisma/personSeedData.ts, which keeps the catalog
 * additive for him: catalog:project connects what is here and leaves every
 * other seeded value alone. Nothing carries the legacy marker as a result,
 * because the seed is still the author of what this chapter did not reach.
 * Deleting his seed entry is what would hand this module authority, and that
 * waits until the sira is read out.
 *
 * The sira part is unvowelled where the companion entries are vowelled, so the
 * Arabic below matches its own pages rather than theirs.
 */
const prophetMuhammad = {
  kind: 'PERSON',
  slug: 'prophet-muhammad',
  name: 'محمد ﷺ',
  nameTransliterated: 'Muhammad',
  hasProfile: true,

  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    appearance: { value: 'كان متوسط القامة، عريض المنكبين، كث اللحية، مشرق الوجه، يوصف بأنه أجمل الناس.', claims: legacyUnreviewed },
    sex: { value: 'MALE', claims: ['prophet/sex'] },
    // The naming line unpacks the names behind the bynames: عبد المطلب is
    // Shaybah, هاشم is Amr, عبد مناف is al-Mughirah, قصي is Zayd. It stops at
    // عدنان, which is where al-Dhahabi says the agreement stops; four counts of
    // the fathers beyond him sit on the next two pages and none is taken.
    fullName: {
      value:
        'محمد بن عبد الله بن عبد المطلب واسم عبد المطلب شيبة, ابن هاشم واسمه عمرو, ابن عبد مناف واسمه المغيرة، ابن قصي واسمه زيد بن كلاب بن مرة بن كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة ابن مدركة، واسمه عامر بن إلياس بن مضر بن نزار بن معد بن عدنان.',
      claims: ['prophet/lineage'],
    },
    kunya: { value: 'أبو القاسم', claims: ['prophet/kunya'] },
    virtues: {
      value:
        'خاتم النبيين وسيد المرسلين، اصطفاه الله من بني هاشم، وهو دعوة أبيه إبراهيم وبشرى عيسى، وقال صلى الله عليه وسلم: (إنما أنا رحمة مهداة) .',
      claims: ['prophet/virtues'],
    },
  },

  // Ten of the seed's twelve. الشفيع and سيد ولد آدم are not in this chapter,
  // so they stay the seed's until a later one reaches the passages naming them.
  titles: [
    // Carried from the retired seed entry; no batch cites these yet.
    { title: 'master-of-children-of-adam', claims: legacyUnreviewed },
    { title: 'the-intercessor', claims: legacyUnreviewed },
    { title: 'al-sabiqoon', claims: ['sira/al-sabiqoon-eight'] },
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
    // Carried from the retired seed entry, which read this verse as his.
    { surah: 48, ayah: 29, claims: legacyUnreviewed },
    { surah: 2, ayah: 129, claims: ['prophet/ayah-al-baqarah'] },
    { surah: 5, ayah: 67, claims: ['prophet/ayah-al-maidah'] },
    { surah: 15, ayah: 95, claims: ['prophet/ayah-al-hijr-mustahziin'] },
    { surah: 17, ayah: 85, claims: ['prophet/ayah-al-isra-ruh'] },
    { surah: 21, ayah: 107, claims: ['prophet/ayah-al-anbiya'] },
    { surah: 26, ayah: 214, claims: ['prophet/ayah-al-shuara'] },
    { surah: 33, ayah: 45, claims: ['prophet/ayah-al-ahzab'] },
    { surah: 46, ayah: 29, claims: ['prophet/ayah-al-ahqaf-jinn'] },
    { surah: 61, ayah: 6, claims: ['prophet/ayah-al-saff'] },
    { surah: 70, ayah: 13, claims: ['prophet/ayah-al-maarij'] },
    { surah: 74, ayah: 1, claims: ['prophet/ayah-al-muddaththir'] },
    { surah: 96, ayah: 1, claims: ['prophet/ayah-al-alaq'] },
  ],

  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abdullah-ibn-abd-al-muttalib', claims: ['prophet/father'] },
    { type: 'GRANDSON', inverse: 'GRANDFATHER', to: 'abd-al-muttalib-ibn-hashim', claims: ['prophet/grandfather'] },
    { type: 'PATERNAL_NEPHEW', inverse: 'PATERNAL_UNCLE', to: 'abu-talib', claims: ['prophet/uncle-abu-talib'] },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'khadijah-bint-khuwaylid', claims: ['prophet/wife-khadijah'] },
    // Both after Khadijah died and both before the hijra, which is where
    // chapter two puts them. Khawlah bint Hakim named the two to him together.
    { type: 'HUSBAND', inverse: 'WIFE', to: 'aisha-bint-abi-bakr', claims: ['prophet/wife-aishah'] },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'sawdah-bint-zamah', claims: ['prophet/wife-sawdah'] },
    // Both in year three, chapter five. Zaynab lived only months after it.
    { type: 'HUSBAND', inverse: 'WIFE', to: 'hafsa-bint-umar', claims: ['prophet/wife-hafsah'] },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'zaynab-bint-khuzaymah', claims: ['prophet/wife-zaynab-khuzaymah'] },
    // He freed Zayd and adopted him before the revelation; الأحزاب 5 ended the
    // adoption, and the manumission is what remained. PATRON is his side of it.
    { type: 'PATRON', inverse: 'MAWLA', to: 'zaid-ibn-harithah', claims: ['prophet/mawla-zayd'] },
    { type: 'FATHER', inverse: 'SON', to: 'al-qasim-ibn-muhammad', claims: ['prophet/son-al-qasim'] },
    { type: 'FATHER', inverse: 'SON', to: 'ibrahim-ibn-muhammad', claims: ['prophet/son-ibrahim'] },
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'ruqayyah-bint-muhammad', claims: ['prophet/daughter-ruqayyah'] },
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'zaynab-bint-muhammad', claims: ['prophet/daughter-zaynab'] },
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'umm-kulthum-bint-muhammad', claims: ['prophet/daughter-umm-kulthum'] },
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'fatimah-bint-muhammad', claims: ['prophet/daughter-fatimah'] },
    // Carried from neo4j/graphSeedData.ts, whose node declaration is retired
    // with the rest. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'SON_IN_LAW', inverse: 'FATHER_IN_LAW', to: 'abu-bakr-as-siddiq', claims: legacyUnreviewed },
    { type: 'SON_IN_LAW', inverse: 'FATHER_IN_LAW', to: 'umar-ibn-al-khattab', claims: legacyUnreviewed },
    { type: 'FATHER_IN_LAW', inverse: 'SON_IN_LAW', to: 'uthman-ibn-affan', claims: legacyUnreviewed },
    { type: 'FATHER_IN_LAW', inverse: 'SON_IN_LAW', to: 'ali-ibn-abi-talib', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'umm-salamah', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'zaynab-bint-jahsh', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'juwayriyah-bint-al-harith', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'umm-habibah', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'safiyyah-bint-huyayy', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'maymunah-bint-al-harith', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'SON', to: 'abdullah-ibn-muhammad', claims: legacyUnreviewed },
    { type: 'PATERNAL_NEPHEW', inverse: 'PATERNAL_UNCLE', to: 'hamzah-ibn-abd-al-muttalib', claims: legacyUnreviewed },
    { type: 'PATERNAL_NEPHEW', inverse: 'PATERNAL_UNCLE', to: 'al-abbas-ibn-abd-al-muttalib', claims: legacyUnreviewed },
    { type: 'GRANDFATHER', inverse: 'GRANDSON', to: 'al-hasan-ibn-ali', claims: legacyUnreviewed },
    { type: 'GRANDFATHER', inverse: 'GRANDSON', to: 'al-husayn-ibn-ali', claims: legacyUnreviewed },
    { type: 'PATERNAL_COUSIN', inverse: 'PATERNAL_COUSIN', to: 'ali-ibn-abi-talib', claims: legacyUnreviewed },
    { type: 'PATERNAL_COUSIN', inverse: 'PATERNAL_COUSIN', to: 'abdullah-ibn-jaafar', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default prophetMuhammad;
