import Link from 'next/link';
import { Book } from '@/types/book';

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="group relative h-full">
      <Link 
        href={`/books/${book.slug}`}
        className="block h-full rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-400 transition-colors duration-300">
          <div className="p-6 h-full flex flex-col">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {book.title}
            </h3>
            {book.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                {book.description}
              </p>
            )}
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                <span className="mr-1">المجلد</span>
                <span className="font-medium">{book.volume}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
