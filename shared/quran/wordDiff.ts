// docs/plans/quran-relations-page.md
export function wordDiff(a: string[], b: string[]): { a: number[]; b: number[] } {
  const table = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const sameA = new Set<number>();
  const sameB = new Set<number>();
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { sameA.add(i++); sameB.add(j++); }
    else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  const differing = (n: number, same: Set<number>) => Array.from({ length: n }, (_, k) => k).filter(k => !same.has(k));
  return { a: differing(a.length, sameA), b: differing(b.length, sameB) };
}

export function sharedSlots(count: number, differing: number[], slot = 0, slots: Record<number, number> = {}): Record<number, number> {
  for (let k = 0; k < count; k++) if (!differing.includes(k) && !(k in slots)) slots[k] = slot;
  return slots;
}
