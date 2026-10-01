import type { VolumeContentsItem } from '@/types/provenance';

/** See docs/adr/0019-a-contents-list-names-chapters-not-entries.md. */
export interface ChapterRow {
  item: VolumeContentsItem;
  title: string;
}

export function volumeChapterRows(items: VolumeContentsItem[]): ChapterRow[] {
  return items
    .map((item) => ({ item, title: item.headings[0] ?? item.entries[0]?.label }))
    .filter((row): row is ChapterRow => Boolean(row.title));
}
