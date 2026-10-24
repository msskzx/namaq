export const num = (n: number) => n.toLocaleString('ar-EG', { useGrouping: false });

export const counted = (n: number, [one, two, few]: [string, string, string]) => (n === 1 ? one : n === 2 ? two : `${num(n)} ${n <= 10 ? few : one}`);

export const ayatCount = (n: number) => counted(n, ['آية', 'آيتان', 'آيات']);
