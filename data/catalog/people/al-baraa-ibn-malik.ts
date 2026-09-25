import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/al-baraa-ibn-malik, entry 26, the tenth
// and final chapter of this run (immediately after Suhail ibn Amr, entry
// 25). His own entry names him brother of Anas ibn Malik by name only, with
// no shared mother stated, so the tie is HALF_BROTHER against a stub node
// (neo4j/graphSeedData4.ts) — Anas has no profile of his own yet.
const alBaraaIbnMalik = {
  kind: 'PERSON',
  slug: 'al-baraa-ibn-malik',
  name: 'البراء بن مالك',
  nameTransliterated: 'Al-Baraa ibn Malik',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'البراء بن مالك بن النضر بن ضمضم الأنصاري، ابن زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار، الأنصاري النجاري المدني',
      claims: ['al-baraa-ibn-malik-siyar26/full-name'],
    },
    virtues: {
      value:
        'البطل الكرار، صاحب رسول الله؛ حذر عمر أمراء الجيش من تأميره؛ اشتهر بقتل مائة رجل مبارزة؛ مدحه النبي بحديث (لو أقسم على الله لأبره)؛ وأخبر عن يقينه بالشهادة بعد قتله تسعة وتسعين مشركا مبارزة.',
      claims: ['al-baraa-ibn-malik-siyar26/virtues'],
    },
    deathYearHijri: { value: '20', claims: ['al-baraa-ibn-malik-siyar26/death-year'] },
    placeOfDeathArabic: { value: 'تستر', claims: ['al-baraa-ibn-malik-siyar26/death-place'] },
  },
  titles: [
    // Carried from the retired seed.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'malik-ibn-an-nadr-al-najjari',
      claims: ['al-baraa-ibn-malik-siyar26/father'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'anas-ibn-malik',
      claims: ['al-baraa-ibn-malik-siyar26/half-brother'],
    },
  ],
} satisfies CatalogPerson;

export default alBaraaIbnMalik;
