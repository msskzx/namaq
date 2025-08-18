"use client";

import React from 'react';
import useSWR from 'swr';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import BookCard from '@/components/books/BookCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { fetcher } from '@/lib/swr';
import { Book } from '@/types/book';

export default function BooksPage() {
  const { language } = useLanguage();
  const { data: books, error, isLoading } = useSWR<Book[]>('/api/books', fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400">
          {translations[language].books?.loadError || 'Failed to load books'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl text-gray-900 dark:text-white mb-8">
        {typeof translations[language].books === 'string' ? translations[language].books : translations[language].books.title}
      </h1>

      {!books || books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            {typeof translations[language].books === 'string' ? 'لا يوجد كتب' : translations[language].books.notFound}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
