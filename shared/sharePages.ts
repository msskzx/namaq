export type PageFlow = {
  heights: number[];
  room: number;
  firstRoom: number;
  gap: number;
  tailFrom?: number;
  foot?: number;
};

const tall = (heights: number[], gap: number) => heights.reduce((sum, h) => sum + h, 0) + gap * Math.max(0, heights.length - 1);

function fill(blocks: number[], heights: number[], rooms: (page: number) => number, gap: number, slack: number): number[][] {
  const pages: number[][] = [[]];
  let used = 0;
  for (const i of blocks) {
    if (pages.length === 1 && !pages[0].length && heights[i] > rooms(0) - slack && heights[i] <= rooms(1) - slack) pages.push([]);
    const page = pages[pages.length - 1];
    const next = page.length ? used + gap + heights[i] : heights[i];
    if (page.length && next > rooms(pages.length - 1) - slack) { pages.push([i]); used = heights[i]; }
    else { page.push(i); used = next; }
  }
  return pages;
}

export function sharePages({ heights, room: whole, firstRoom: firstWhole, gap, tailFrom, foot = 0 }: PageFlow): number[][] {
  const all = heights.map((_, i) => i);
  const tail = tailFrom === undefined ? [] : all.slice(tailFrom);
  const ownPage = tail.length > 0 && tailFrom! > 0 && tall(tail.map(i => heights[i]), gap) <= whole - foot;
  const room = ownPage ? whole : whole - foot;
  const firstRoom = ownPage ? firstWhole : firstWhole - foot;
  const flow = ownPage ? all.slice(0, tailFrom) : all;
  const rooms = (page: number) => (page === 0 ? firstRoom : room);
  const fewest = fill(flow, heights, rooms, gap, 0);
  let low = 0;
  let high = room;
  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if (fill(flow, heights, rooms, gap, mid).length === fewest.length) low = mid; else high = mid;
  }
  const even = fill(flow, heights, rooms, gap, low);
  return ownPage ? [...even, tail] : even;
}
