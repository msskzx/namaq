import Link from 'next/link';
import Image from 'next/image';
import { CharityCategory } from '@/types/charity';

export default function CharityCategoryCard({ category }: { category: CharityCategory }) {
  return (
    <Link
      href={`/charities?category=${category.slug}`}
      className='block h-full'
    >
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow transition-transform duration-200 hover:shadow-xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer h-full flex flex-col">
        <div className='relative h-48 bg-gray-200 dark:bg-gray-700'>
          {category.img ? (
            <Image
              src={category.img}
              alt={category.name}
              fill
              className='object-cover'
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center'>
              <span className='text-2xl text-white'>
                {category.name}
              </span>
            </div>
          )}
        </div>
        <div className='p-4 flex-1 flex flex-col items-center justify-center'>
          {category.description && (
            <p className='text-gray-600 dark:text-gray-300 text-sm line-clamp-3 text-center'>
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}