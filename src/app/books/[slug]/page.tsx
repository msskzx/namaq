"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { fetcher } from '@/lib/swr';
import { BookFull } from '@/types/book';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { data: book, error, isLoading } = useSWR<BookFull>(`/api/books/${slug}`, fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage title={typeof translations[language].books === 'string' ? 'Failed to load book' : translations[language].books.loadError} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir='rtl'>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {book.title}
              </h1>
              {book.author && (
                <p className="text-gray-600 dark:text-gray-300">
                  {book.author.name}
                </p>
              )}
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>المجلد {book.volume}</span>
              </div>
            </div>
          </div>

          {book.description && (
            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-gray-700 dark:text-gray-300">
                {book.description}
              </p>
            </div>
          )}


          {book.pages.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {typeof translations[language].books === 'string' ? 'الصفحات' : translations[language].books.pages}
              </h2>
              <div className="space-y-4">
                {book.pages.map((page) => (
                  <div
                    key={page.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {typeof translations[language].books === 'string' ? 'الصفحة' : translations[language].books.pages} {page.page}
                        {page.chapter ? ` • ${typeof translations[language].books === 'string' ? 'الفصل' : translations[language].books.chapter} ${page.chapter}` : ''}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {page.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
