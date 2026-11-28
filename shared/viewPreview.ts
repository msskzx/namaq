
export const SAMPLE_AYAH = { start: 'إِنَّ ٱلۡمُتَّقِينَ', end: 'فِي جَنَّـٰتٍ', ending: 'وَنَعِيمٍ' } as const;

export const SAMPLE_TREE = {
  trunk: ['إِنَّ ٱلۡمُتَّقِينَ', 'فِي جَنَّـٰتٍ'],
  endings: [
    { words: 'وَعُيُونٍ' },
    { words: 'وَنَعِيمٍ' },
    { words: 'وَنَهَرٍ' },
  ],
} as const;

export const TREE_LAYOUT = {
  trunk: { right: 5, top: 29, width: 40, height: 42 },
  ending: { left: 5, width: 30, height: 24, tops: [5, 38, 71] },
} as const;

export const TREE_LINES = TREE_LAYOUT.ending.tops.map(top => {
  const fromX = 100 - TREE_LAYOUT.trunk.right - TREE_LAYOUT.trunk.width;
  const toX = TREE_LAYOUT.ending.left + TREE_LAYOUT.ending.width;
  const toY = top + TREE_LAYOUT.ending.height / 2;
  const fromY = TREE_LAYOUT.trunk.top + TREE_LAYOUT.trunk.height / 2;
  const mid = (fromX + toX) / 2;
  return `M${fromX} ${fromY} C${mid} ${fromY} ${mid} ${toY} ${toX} ${toY}`;
});

export const TILE_SHARE = { tile: 0.45, half: 0.35, view: 0.42, words: 0.55 } as const;
