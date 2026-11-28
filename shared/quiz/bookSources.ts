import { num } from '../quran/arabicNumber';
import { tafsirSadiPage, type TafsirPassage } from '../quran/tafsirSadi';
import { ITQAN_BOOK, itqanPage, type ItqanParagraph } from '../quran/itqanBalagha';
import { QIRAAT_SOURCE } from '../quran/qiraat';
import { IRAB_SOURCES } from '../quran/irab';
import { ayahPlace, type QuizSource } from './sources';

export const sadiSource = (passage: TafsirPassage): QuizSource => ({ book: 'تيسير الكريم الرحمن', author: 'السعدي', at: `ص ${num(passage.pages[0])}`, url: tafsirSadiPage(passage) });
export const itqanSource = ({ part, pages: [first, last], id }: Pick<ItqanParagraph, 'part' | 'pages' | 'id'>): QuizSource =>
  ({ book: ITQAN_BOOK, author: 'السيوطي', at: `${num(part)}/${num(first)}${last !== first ? `–${num(last)}` : ''}`, url: itqanPage({ id }) });
export const irabSources = (key: string): QuizSource[] => IRAB_SOURCES.slice().reverse().map(source => ({ book: source.name, at: ayahPlace(key), url: source.url }));
export const qiraatSources = (key: string): QuizSource[] => [{ book: QIRAAT_SOURCE.name, at: ayahPlace(key), url: QIRAAT_SOURCE.url }];
