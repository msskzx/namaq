import { BOOK_SOURCE, GITHUB_FILES, WEBSITE, type BookSource } from './downloadSources';

export type BookKind = 'tafsir' | 'irab' | 'balagha' | 'gharib' | 'mutashabih' | 'hadith';
export type BookId = 'sadi' | 'irab-words' | 'ukbari' | 'itqan' | 'kashshaf' | 'gharib' | 'mufradat' | 'bukhari' | 'muslim' | 'kirmani' | 'iskafi' | 'zubayr';
export type Book = { id: BookId; kind: BookKind; title: string; by: string; builtIn: boolean; megabytes: number };

export const BOOKS: Book[] = [
  { id: 'sadi', kind: 'tafsir', title: 'تيسير الكريم الرحمن', by: 'السعدي (ت ١٣٧٦هـ)', builtIn: true, megabytes: 1.9 },
  { id: 'irab-words', kind: 'irab', title: 'الإعراب القصير لكل كلمة', by: 'المدونة القرآنية والشجرة النحوية', builtIn: true, megabytes: 0.5 },
  { id: 'ukbari', kind: 'irab', title: 'التبيان في إعراب القرآن', by: 'العكبري (ت ٦١٦هـ)', builtIn: false, megabytes: 0.7 },
  { id: 'itqan', kind: 'balagha', title: 'الإتقان في علوم القرآن', by: 'السيوطي (ت ٩١١هـ)', builtIn: true, megabytes: 0.1 },
  { id: 'kashshaf', kind: 'balagha', title: 'الكشاف عن حقائق التنزيل', by: 'الزمخشري (ت ٥٣٨هـ)', builtIn: false, megabytes: 2.2 },
  { id: 'gharib', kind: 'gharib', title: 'تفسير غريب القرآن', by: 'ابن قتيبة (ت ٢٧٦هـ)', builtIn: true, megabytes: 0.8 },
  { id: 'mufradat', kind: 'gharib', title: 'المفردات في غريب القرآن', by: 'الراغب الأصفهاني (ت ٥٠٢هـ)', builtIn: true, megabytes: 2.9 },
  { id: 'iskafi', kind: 'mutashabih', title: 'درة التنزيل وغرة التأويل', by: 'الخطيب الإسكافي (ت ٤٢٠هـ)', builtIn: false, megabytes: 0.6 },
  { id: 'kirmani', kind: 'mutashabih', title: 'أسرار التكرار في القرآن', by: 'تاج القراء الكرماني', builtIn: false, megabytes: 0.3 },
  { id: 'zubayr', kind: 'mutashabih', title: 'ملاك التأويل', by: 'ابن الزبير الغرناطي (ت ٧٠٨هـ)', builtIn: false, megabytes: 1 },
  { id: 'bukhari', kind: 'hadith', title: 'صحيح البخاري', by: 'البخاري (ت ٢٥٦هـ)', builtIn: false, megabytes: 10.9 },
  { id: 'muslim', kind: 'hadith', title: 'صحيح مسلم', by: 'مسلم (ت ٢٦١هـ)', builtIn: false, megabytes: 7 },
];

export const BOOK_KINDS: { kind: BookKind; title: string }[] = [
  { kind: 'tafsir', title: 'التفسير' },
  { kind: 'irab', title: 'الإعراب' },
  { kind: 'balagha', title: 'البلاغة' },
  { kind: 'gharib', title: 'معاني الكلمات' },
  { kind: 'mutashabih', title: 'المتشابه اللفظي' },
  { kind: 'hadith', title: 'الحديث' },
];

export const bookOf = (id: BookId) => BOOKS.find(book => book.id === id)!;
export const isBookId = (value: unknown): value is BookId => BOOKS.some(book => book.id === value);

export const bookFile = (id: BookId) => (bookOf(id).kind === 'hadith' ? `data/hadith/sahih/${id}.json` : `data/books/${id}.json`);
export const BOOK_SOURCES: Record<BookSource, (id: BookId) => string> = {
  website: id => `${WEBSITE}/api/books/${id}`,
  github: id => `${GITHUB_FILES}${bookFile(id)}`,
};
export const bookUrl = (id: BookId) => BOOK_SOURCES[BOOK_SOURCE](id);
