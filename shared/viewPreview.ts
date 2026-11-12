// The sample on the settings sheet's preview tiles (website and phone app): the إن المتقين في tree
// (shared/data/quiz/example.json), with «ونعيم» (52:17) as the ayah the tiles light up.
// Written as the Quran font (KFGQPC Hafs) encodes it, like mushafText's output.

/** The theme tiles' card: 52:17 on two lines, its own ending in the accent. */
export const SAMPLE_AYAH = { start: 'إِنَّ ٱلۡمُتَّقِينَ', end: 'فِي جَنَّـٰتٍ', ending: 'وَنَعِيمٍ' } as const;

/** The view tiles: the shared start (coloured, as the views colour matching words), then the endings that branch off it. */
export const SAMPLE_TREE = {
  trunk: ['إِنَّ ٱلۡمُتَّقِينَ', 'فِي جَنَّـٰتٍ'],
  endings: [
    { words: 'وَعُيُونٍ' },
    { words: 'وَنَعِيمٍ' },
    { words: 'وَنَهَرٍ' },
  ],
} as const;

/** Where the tree tile's boxes sit, in percent of the tile, root on the right as the trees read. */
export const TREE_LAYOUT = {
  trunk: { right: 5, top: 29, width: 40, height: 42 },
  ending: { left: 5, width: 30, height: 24, tops: [5, 38, 71] },
} as const;

/** The tree tile's branch lines in a 100×100 box (stretched to the tile): trunk's left edge to each ending's right edge. */
export const TREE_LINES = TREE_LAYOUT.ending.tops.map(top => {
  const fromX = 100 - TREE_LAYOUT.trunk.right - TREE_LAYOUT.trunk.width;
  const toX = TREE_LAYOUT.ending.left + TREE_LAYOUT.ending.width;
  const toY = top + TREE_LAYOUT.ending.height / 2;
  const fromY = TREE_LAYOUT.trunk.top + TREE_LAYOUT.trunk.height / 2;
  const mid = (fromX + toX) / 2;
  return `M${fromX} ${fromY} C${mid} ${fromY} ${mid} ${toY} ${toX} ${toY}`;
});
