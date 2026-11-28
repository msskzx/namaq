export const TOUR_TREE = 'إِنَّ ٱلۡمُتَّقِينَ فِي';
export const TOUR_AYAH = '15:45';
export const TOUR_PAGE = 264;

export const tourPieceIn = <T extends { text: string }>(pieces: T[]) => pieces.find(piece => piece.text.normalize('NFC') === TOUR_TREE.normalize('NFC'));
