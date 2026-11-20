// The books a Quran card or question stands on (owner, 2026-11-19 and 2026-11-20): the quiz kinds and the home cards share them.
import { num } from '../quran/arabicNumber';
import { tafsirSadiPage, type TafsirPassage } from '../quran/tafsirSadi';
import { ITQAN_BOOK, itqanPage, type ItqanParagraph } from '../quran/itqanBalagha';
import { QIRAAT_SOURCE } from '../quran/qiraat';
import { IRAB_SOURCES } from '../quran/irab';
import { ayahPlace, type QuizSource } from './sources';

/** Al-Sa'di's passage on an ayah, for its question and the feed's tafsir card. */
export const sadiSource = (passage: TafsirPassage): QuizSource => ({ book: 'تيسير الكريم الرحمن', author: 'السعدي', at: `ص ${num(passage.pages[0])}`, url: tafsirSadiPage(passage) });
/** Al-Suyuti's paragraph in al-Itqan, for its question and the feed's balagha card. */
export const itqanSource = ({ part, pages: [first, last], id }: Pick<ItqanParagraph, 'part' | 'pages' | 'id'>): QuizSource =>
  ({ book: ITQAN_BOOK, author: 'السيوطي', at: `${num(part)}/${num(first)}${last !== first ? `–${num(last)}` : ''}`, url: itqanPage({ id }) });
/** The books of a word's i'rab, for its question and the feed's i'rab card. */
export const irabSources = (key: string): QuizSource[] => IRAB_SOURCES.slice().reverse().map(source => ({ book: source.name, at: ayahPlace(key), url: source.url }));
/** The readings' book, for its questions and the feed's readings card. */
export const qiraatSources = (key: string): QuizSource[] => [{ book: QIRAAT_SOURCE.name, at: ayahPlace(key), url: QIRAAT_SOURCE.url }];
