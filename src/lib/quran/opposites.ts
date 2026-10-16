// docs/plans/quran-repetition-merge.md
import type { Side } from './lemmas';

export const OPPOSITES: [Side, Side][] = [
  [{ label: 'السماء', lemma: "samaA^'" }, { label: 'الأرض', lemma: '>aroD' }],
  [{ label: 'الجنة', lemma: 'jan~ap' }, { label: 'النار', lemma: 'naAr' }],
  [{ label: 'الدنيا', lemma: 'd~unoyaA' }, { label: 'الآخرة', lemma: 'A^xir', form: "'Axrp" }],
  [{ label: 'الليل', lemma: 'layol' }, { label: 'النهار', lemma: 'nahaAr' }],
  [{ label: 'الحياة', lemma: 'Hayaw`p' }, { label: 'الموت', lemma: 'mawot' }],
  [{ label: 'الملائكة', lemma: 'malak' }, { label: 'الشياطين', lemma: '$ayoTa`n' }],
  [{ label: 'النور', lemma: 'nuwr' }, { label: 'الظلمات', lemma: 'Zuluma`t' }],
  [{ label: 'الخير', lemma: 'xayor' }, { label: 'الشر', lemma: '$ar~' }],
  [{ label: 'الحسنة', lemma: 'Hasanap' }, { label: 'السيئة', lemma: 'say~i}ap' }],
  [{ label: 'الإيمان', lemma: '<iyma`n' }, { label: 'الكفر', lemma: 'kufor' }],
  [{ label: 'الذكر', lemma: '*akar' }, { label: 'الأنثى', lemma: '>unvaY`' }],
];
