import type { CatalogUtterance } from '@/lib/catalog/types';

// The second night names them: Sa'd of the Aws and Sa'd of the Khazraj, which
// is the answer Abu Sufyan had been guessing at.
const hatifAbiQubaysAyaSadaAlAws = {
  kind: 'UTTERANCE',
  slug: 'hatif-abi-qubays-aya-sada-al-aws',
  utteranceKind: 'POETRY',
  textArabic: {
    value: [
      'أيا سعد الأوس كن أنت ناصرا ... ويا سعد سعد الخزرجين الغطارف',
      'أجيبا إلى داعي الهدى وتمنيا ... على الله في الفردوس منية عارف',
      'فإن ثواب الله للطالب الهدى ... جنان من الفردوس ذات رفارف',
    ].join('\n'),
    claims: ['sira/verses-hatif-saad-al-aws'],
  },
  fields: {
    speakerName: { value: 'هاتف سمعته قريش على أبي قبيس', claims: ['sira/verses-hatif-saad-al-aws'] },
    occasion: { value: 'سمعوه في الليلة الثانية بعد أن سأل أبو سفيان: من السعدان؟', claims: ['sira/verses-hatif-saad-al-aws'] },
  },
} satisfies CatalogUtterance;

export default hatifAbiQubaysAyaSadaAlAws;
