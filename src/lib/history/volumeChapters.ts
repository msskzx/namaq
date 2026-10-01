import type { VolumeContentsItem } from '@/types/provenance';

/**
 * A volume's own chapters and sections, the way a printed فهرس does -- a page
 * with no heading of its own contributes nothing, except the rare entry that
 * opens with none, which falls back to its own label so it stays reachable.
 * Shared by the source's contents list and the reader's own index, so a
 * volume reads the same table of contents in both places.
 */
export interface ChapterRow {
  item: VolumeContentsItem;
  title: string;
}

export function volumeChapterRows(items: VolumeContentsItem[]): ChapterRow[] {
  return items
    .map((item) => ({ item, title: item.headings[0] ?? item.entries[0]?.label }))
    .filter((row): row is ChapterRow => Boolean(row.title));
}
