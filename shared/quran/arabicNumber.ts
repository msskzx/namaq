// One formatter for all: `toLocaleString` makes a new one at every call, which is slow on a phone.
const ARABIC = new Intl.NumberFormat('ar-EG', { useGrouping: false });
export const num = (n: number) => ARABIC.format(n);

export const counted = (n: number, [one, two, few]: [string, string, string]) => (n === 1 ? one : n === 2 ? two : `${num(n)} ${n <= 10 ? few : one}`);

export const ayatCount = (n: number) => counted(n, ['آية', 'آيتان', 'آيات']);
