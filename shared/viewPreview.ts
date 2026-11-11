// The tree and matrix preview drawings on the settings sheet's view tiles (website and phone app).
// A 60×40 box, root on the right as the trees read. `tone` picks the colour: card, rule or accent.

export type PreviewBox = { x: number; y: number; w: number; h: number; tone: 'card' | 'accent' };
export type PreviewDrawing = { boxes: PreviewBox[]; lines: string[] };

export const VIEW_PREVIEW: Record<'tree' | 'matrix', PreviewDrawing> = {
  tree: {
    lines: ['M40 20 C31 20 31 9 23 9', 'M40 20 C31 20 31 31 23 31'],
    boxes: [
      { x: 40, y: 16, w: 16, h: 8, tone: 'card' },
      { x: 5, y: 5, w: 18, h: 8, tone: 'card' },
      { x: 5, y: 27, w: 18, h: 8, tone: 'card' },
      { x: 44, y: 19, w: 8, h: 2, tone: 'accent' },
    ],
  },
  matrix: {
    lines: [],
    boxes: [6, 17, 28].flatMap(y => [
      { x: 4, y, w: 52, h: 8, tone: 'card' as const },
      { x: 38, y: y + 3, w: 14, h: 2, tone: 'accent' as const },
    ]),
  },
};
