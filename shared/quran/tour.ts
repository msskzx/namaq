/** The tree the first-launch tour grows: «إن المتقين في», six ayat in six surahs, small enough for one phone screen. */
export const TOUR_TREE = 'إِنَّ ٱلْمُتَّقِينَ فِى';
/** Where the tour's recitation starts: the first ayah of that tree, in al-Hijr. */
export const TOUR_AYAH = '15:45';
/** The mushaf page that ayah starts on. */
export const TOUR_PAGE = 264;

export const tourPieceIn = <T extends { text: string }>(pieces: T[]) => pieces.find(piece => piece.text === TOUR_TREE);
