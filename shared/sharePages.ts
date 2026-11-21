/**
 * A long drawing shared as equal pictures (owner, 2026-11-21: Instagram wants every picture of a post the same size, 4:5).
 * The drawing's blocks (a bubble with its lead-in, a line of narration) flow from page to page and break only between
 * blocks. The pages are evened out: of the layouts that need the fewest pages, the one whose fullest page is least full, so
 * no page is left holding one bubble. The blocks from `tailFrom` on (a story's last scene) go together on a last page of
 * their own when they fit on one; the first page is shorter by its head (the title).
 */
export type PageFlow = {
  /** Each block's height. */
  heights: number[];
  /** The height a page holds, and the first page's, under its head. */
  room: number;
  firstRoom: number;
  /** The space between two blocks. */
  gap: number;
  /** The first block of the part kept whole on the last page. */
  tailFrom?: number;
  /** What the last page holds under its blocks (the source line), with its gap. */
  foot?: number;
};

const tall = (heights: number[], gap: number) => heights.reduce((sum, h) => sum + h, 0) + gap * Math.max(0, heights.length - 1);

/** Greedy flow with every page `slack` shorter: the block indexes on each page. */
function fill(blocks: number[], heights: number[], rooms: (page: number) => number, gap: number, slack: number): number[][] {
  const pages: number[][] = [[]];
  let used = 0;
  for (const i of blocks) {
    const page = pages[pages.length - 1];
    const next = page.length ? used + gap + heights[i] : heights[i];
    if (page.length && next > rooms(pages.length - 1) - slack) { pages.push([i]); used = heights[i]; }
    else { page.push(i); used = next; }
  }
  return pages;
}

/** The blocks on each page, in order. */
export function sharePages({ heights, room: whole, firstRoom: firstWhole, gap, tailFrom, foot = 0 }: PageFlow): number[][] {
  const all = heights.map((_, i) => i);
  const tail = tailFrom === undefined ? [] : all.slice(tailFrom);
  const ownPage = tail.length > 0 && tailFrom! > 0 && tall(tail.map(i => heights[i]), gap) <= whole - foot;
  // The foot goes under the tail's own page; else whichever page is last must have room for it, so every page keeps it.
  const room = ownPage ? whole : whole - foot;
  const firstRoom = ownPage ? firstWhole : firstWhole - foot;
  const flow = ownPage ? all.slice(0, tailFrom) : all;
  const rooms = (page: number) => (page === 0 ? firstRoom : room);
  const fewest = fill(flow, heights, rooms, gap, 0);
  // The tightest page height that still needs no more pages: found by halving, since a shorter page never needs fewer.
  let low = 0;
  let high = room;
  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if (fill(flow, heights, rooms, gap, mid).length === fewest.length) low = mid; else high = mid;
  }
  const even = fill(flow, heights, rooms, gap, low);
  return ownPage ? [...even, tail] : even;
}
