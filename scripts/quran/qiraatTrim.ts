const plain = (word: string) => word.normalize('NFC').replace(/[ۖ-ۜـ]/g, '').replace(/ۡ/g, 'ْ').replace(/ٱ/g, 'ا');
export const sameWord = (a: string, b: string) => plain(a) === plain(b);

const skeleton = (word: string) => word.normalize('NFC').replace(/[^ء-غف-ي]/g, '').replace(/[اويأإآءؤئى]/g, '').replace(/ة/g, 'ه');
function likeness(a: string, b: string) {
  const x = skeleton(a);
  const y = skeleton(b);
  const row = Array<number>(y.length + 1).fill(0);
  for (let i = 1; i <= x.length; i++) {
    let diagonal = 0;
    for (let j = 1; j <= y.length; j++) {
      const up = row[j];
      row[j] = x[i - 1] === y[j - 1] ? diagonal + 1 : Math.max(row[j], row[j - 1]);
      diagonal = up;
    }
  }
  return row[y.length];
}

export type Trimmed = { start: number; end: number; texts: string[] } | { problem: string };

export function trimShared(texts: string[]): Trimmed {
  const hafs = texts[0].split(/\s+/).filter(Boolean);
  const words = texts.map((text, i) => {
    const own = text.split(/\s+/).filter(Boolean);
    if (!i || own.length >= hafs.length) return own;
    let best = -1;
    let bestScore = -1;
    for (let o = 0; o + own.length <= hafs.length; o++) {
      if (own.every((w, k) => sameWord(w, hafs[o + k]))) return own;
      const score = own.reduce((n, w, k) => n + likeness(w, hafs[o + k]), 0);
      if (score > bestScore) { best = o; bestScore = score; }
    }
    const twice = (k: number) => hafs.some((w, j) => (j < best || j >= best + own.length) && skeleton(w) === skeleton(hafs[best + k]));
    if (own.some((_, k) => twice(k))) return own;
    const joined = own.join('');
    const window = hafs.slice(best, best + own.length).join('');
    const near = [hafs[best - 1], hafs[best + own.length]].filter(Boolean);
    if (near.some(w => likeness(joined, `${w}${window}`) > likeness(joined, window) || likeness(joined, `${window}${w}`) > likeness(joined, window))) return own;
    return [...hafs.slice(0, best), ...own, ...hafs.slice(best + own.length)];
  });
  if (words.some(w => w.length !== hafs.length)) return { problem: 'readings of different lengths' };
  let start = 0;
  let end = hafs.length;
  const OPEN: Record<string, string> = { '\u08F0': '\u064B', '\u0657': '\u064B', '\u08F1': '\u064C', '\u065E': '\u064C', '\u08F2': '\u064D', '\u0656': '\u064D' };
  const context = (w: string) => plain(w).normalize('NFD').replace(/[\u08F0-\u08F2\u0656\u0657\u065E]/g, c => OPEN[c])
    .replace(/[\u0653\u06E5\u06E6\u0652]/g, '');
  const shared = (k: number) => words.every(w => context(w[k]) === context(hafs[k]));
  while (end - start > 1 && shared(start)) start++;
  while (end - start > 1 && shared(end - 1)) end--;
  const marks = (w: string) => plain(w).replace(/\u0653/g, '');
  const kept = words.map(w => w.slice(start, end).map(marks).join(' '));
  const cut = start > 0 || end < hafs.length;
  if (cut && (kept.slice(1).every(k => k === kept[0]) || new Set(kept).size < kept.length)) return { problem: 'the trimmed readings differ only in marks' };
  return { start, end, texts: words.map((w, i) => (start === 0 && end === hafs.length ? texts[i] : w.slice(start, end).join(' '))) };
}
