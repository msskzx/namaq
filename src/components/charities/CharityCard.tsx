import Link from 'next/link';
import React from 'react';
import { Charity } from '@/types/charity';
import Image from 'next/image';

export default function CharityCard({ charity }: { charity: Charity }) {
  return (
    <Link
      key={charity.id}
      href={`/charities/${charity.slug}`}
      className='block h-full'
    >
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow transition-transform duration-200 hover:shadow-xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer h-full flex flex-col">
        <div className='relative h-48 bg-gray-200 dark:bg-gray-700'>
          {charity.img ? (
            <Image
              src={charity.img}
              alt={charity.name}
              fill
              className='object-cover'
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center'>
              <span className='text-4xl font-bold text-white'>
                {charity.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className='p-4 flex-1 flex flex-col'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2'>
            {charity.name}
          </h3>
          {charity.description && (
            <p className='text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3'>
              {charity.description}
            </p>
          )}
          <div className='mt-auto pt-2'>
            <div className='flex flex-wrap gap-1 mb-2'>
              {charity.categories.slice(0, 3).map((category) => (
                <span
                  key={category.id}
                  className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                >
                  {category.name}
                </span>
              ))}
              {charity.categories.length > 3 && (
                <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'>
                  +{charity.categories.length - 3} more
                </span>
              )}
            </div>
            <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
              <span>{charity.city || ''} {charity.city && charity.country ? ', ' : ''} {charity.country || ''}</span>
              {charity.isVerified && (
                <span className='inline-flex items-center text-green-600 dark:text-green-400'>
                  <svg className='h-4 w-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
