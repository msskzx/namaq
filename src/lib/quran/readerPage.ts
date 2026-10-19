// docs/data-pipelines.md
export type ReaderItem = { surah: number } | { line: (string | number)[]; short?: boolean };

export type ReaderPageData = { juz: number; items: ReaderItem[] };

export type WordGroup = { word: string; marks: number[]; surah?: number; ayah?: number };

export const lineGroups = (tokens: (string | number)[]) =>
  tokens.reduce<WordGroup[]>((all, token) => {
    if (typeof token === 'string') all.push({ word: token, marks: [] });
    else if (all.length === 0) all.push({ word: '', marks: [token] });
    else all.at(-1)?.marks.push(token);
    return all;
  }, []);

export function pageGroups(items: ReaderItem[], top?: number): (WordGroup[] | null)[] {
  const lines = items.map(item => ('surah' in item ? null : lineGroups(item.line)));
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
  load: (page: number) => Promise<ReaderPageData>,
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
