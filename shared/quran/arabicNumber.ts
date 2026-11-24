// One formatter for all: `toLocaleString` makes a new one at every call, which is slow on a phone.
const ARABIC = new Intl.NumberFormat('ar-EG', { useGrouping: false });
export const num = (n: number) => ARABIC.format(n);

/** «آية», «آيتان», «٣ آيات», «١١ آية», «١٠٣ آيات»: by the last two digits, 3 to 10 take the plural, 11 to 99 the accusative (`many`), the rest the singular. */
export const counted = (n: number, [one, two, few, many = one]: [string, string, string, string?]) => {
  if (n === 1) return one;
  if (n === 2) return two;
  const last = n % 100;
  return `${num(n)} ${last >= 3 && last <= 10 ? few : last >= 11 ? many : one}`;
};

export const ayatCount = (n: number) => counted(n, ['آية', 'آيتان', 'آيات']);
