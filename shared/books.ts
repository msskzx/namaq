/**
 * The books the reader's sheets draw on (owner, 2026-11-15). On the phone each one is the person's to keep or remove:
 * a built-in book ships with the app and can be hidden and brought back without a connection; any other is downloaded
 * from the website and kept on the phone. The website fetches what a sheet shows, so it has nothing to manage.
 * The default tafsir can change later to a better book.
 */
export type BookKind = 'tafsir' | 'irab' | 'balagha' | 'gharib';
export type BookId = 'sadi' | 'irab-words' | 'ukbari' | 'itqan' | 'kashshaf' | 'gharib' | 'mufradat';
export type Book = { id: BookId; kind: BookKind; title: string; by: string; builtIn: boolean; megabytes: number };

export const BOOKS: Book[] = [
  { id: 'sadi', kind: 'tafsir', title: 'تيسير الكريم الرحمن', by: 'السعدي (ت ١٣٧٦هـ)', builtIn: true, megabytes: 1.9 },
  { id: 'irab-words', kind: 'irab', title: 'الإعراب القصير لكل كلمة', by: 'المدونة القرآنية والشجرة النحوية', builtIn: true, megabytes: 0.5 },
  { id: 'ukbari', kind: 'irab', title: 'التبيان في إعراب القرآن', by: 'العكبري (ت ٦١٦هـ)', builtIn: false, megabytes: 0.7 },
  { id: 'itqan', kind: 'balagha', title: 'الإتقان في علوم القرآن', by: 'السيوطي (ت ٩١١هـ)', builtIn: true, megabytes: 0.1 },
  { id: 'kashshaf', kind: 'balagha', title: 'الكشاف عن حقائق التنزيل', by: 'الزمخشري (ت ٥٣٨هـ)', builtIn: false, megabytes: 2.2 },
  { id: 'gharib', kind: 'gharib', title: 'تفسير غريب القرآن', by: 'ابن قتيبة (ت ٢٧٦هـ)', builtIn: true, megabytes: 0.8 },
  { id: 'mufradat', kind: 'gharib', title: 'المفردات في غريب القرآن', by: 'الراغب الأصفهاني (ت ٥٠٢هـ)', builtIn: true, megabytes: 2.9 },
];

export const BOOK_KINDS: { kind: BookKind; title: string }[] = [
  { kind: 'tafsir', title: 'التفسير' },
  { kind: 'irab', title: 'الإعراب' },
  { kind: 'balagha', title: 'البلاغة' },
  { kind: 'gharib', title: 'معاني الكلمات' },
];

export const bookOf = (id: BookId) => BOOKS.find(book => book.id === id)!;
export const isBookId = (value: unknown): value is BookId => BOOKS.some(book => book.id === value);

/** Where the phone downloads a book that does not ship with it (src/app/api/books/[id]/route.ts). */
export const bookPath = (id: BookId) => `/api/books/${id}`;
