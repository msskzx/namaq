// docs/data-pipelines.md
export type ReaderItem = { surah: number } | { line: (string | number)[]; short?: boolean };

export type ReaderPageData = { juz: number; items: ReaderItem[] };

export type MushafItem = { surah: number } | { basmala: true } | { line: (string | number)[]; quarter?: number };

export type MushafPage = { juz: number; items: MushafItem[] };

export const spreadOf = (page: number) => (page % 2 ? [page, Math.min(604, page + 1)] : [page - 1, page]);

export function turn(page: number, spread: boolean, step: 1 | -1) {
  const from = spread ? spreadOf(page)[0] : page;
  return Math.min(604, Math.max(1, from + step * (spread ? 2 : 1)));
}

export function mushafPages(pages: { items: MushafItem[] }[]): Map<string, number> {
  const starts = new Map<string, number>();
  let surah = 0;
  let next = 1;
  pages.forEach((data, at) => {
    for (const item of data.items) {
      if ('surah' in item) [surah, next] = [item.surah, 1];
      if (!('line' in item)) continue;
      for (const token of item.line) {
        if (typeof token === 'number') next = token + 1;
        else if (!starts.has(`${surah}:${next}`)) starts.set(`${surah}:${next}`, at + 1);
      }
    }
  });
  return starts;
}

export type WordGroup = { word: string; marks: number[]; surah?: number; ayah?: number };

export const lineGroups = (tokens: (string | number)[]) =>
  tokens.reduce<WordGroup[]>((all, token) => {
    if (typeof token === 'string') all.push({ word: token, marks: [] });
    else if (all.length === 0) all.push({ word: '', marks: [token] });
    else all.at(-1)?.marks.push(token);
    return all;
  }, []);

export function pageGroups(items: (ReaderItem | MushafItem)[], top?: number): (WordGroup[] | null)[] {
  const lines = items.map(item => ('line' in item ? lineGroups(item.line) : null));
  let surah = top;
  let last = 0;
  lines.forEach((line, at) => {
    const item = items[at];
    if ('surah' in item) [surah, last] = [item.surah, 0];
    line?.forEach(group => {
      group.surah = surah;
      if (group.marks.length) last = group.marks.at(-1)!;
    });
  });
  let next: number | undefined;
  for (let at = lines.length - 1; at >= 0; at--) {
    if (!lines[at]) next = undefined;
    for (const group of [...(lines[at] ?? [])].reverse()) {
      if (group.marks.length) next = group.marks[0];
      group.ayah = next ?? last + 1;
    }
  }
  return lines;
}


export async function pageOfAyah(
  surah: number,
  ayah: number,
  from: number,
  load: (page: number) => Promise<{ items: (ReaderItem | MushafItem)[] }>,
): Promise<number | null> {
  let current = 0;
  let next = 1;
  let open = true;
  for (let page = Math.max(1, from); page <= 604; page++) {
    for (const item of (await load(page)).items) {
      if ('surah' in item) {
        if (item.surah > surah) return null;
        [current, next, open] = [item.surah, 1, true];
        continue;
      }
      if (!('line' in item)) continue;
      for (const token of item.line) {
        if (typeof token === 'number') [next, open] = [token + 1, true];
        else if (open) {
          if (current === surah && next === ayah) return page;
          open = false;
        }
      }
    }
  }
  return null;
}
