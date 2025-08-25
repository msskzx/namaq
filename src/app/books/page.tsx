"use client";

import React from 'react';
import useSWR from 'swr';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import BookCard from '@/components/books/BookCard';
import BookHero from '@/components/books/BookHero';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
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
        <ErrorMessage title={translations[language].books?.loadError || 'Failed to load books'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <BookHero />

        <div className="mt-16">
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
      </div>
    </div>
  );
}
