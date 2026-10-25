import { num } from './arabicNumber';

const ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع'];
const QUARTERS = ['', 'ربع ', 'نصف ', 'ثلاثة أرباع '];

export function juzName(juz: number) {
  const unit = juz % 10;
  const tens = Math.floor(juz / 10);
  if (unit === 0) return ['', 'العاشر', 'العشرون', 'الثلاثون'][tens];
  const first = tens > 0 && unit === 1 ? 'الحادي' : ORDINALS[unit - 1];
  return [first, `${first} عشر`, `${first} والعشرون`][tens];
}

export function quarterLabel(quarter: number): string[] {
  const at = quarter - 1;
  const hizb = `${QUARTERS[at % 4]}الحزب ${num(Math.floor(at / 4) + 1)}`;
  return at % 8 === 0 ? [`الجزء ${num(at / 8 + 1)}`, hizb] : [hizb];
}

export const isSajda = (tokens: (string | number)[]) => tokens.some(token => typeof token === 'string' && token.includes('۩'));
