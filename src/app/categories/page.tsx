"use client";

import React from "react";
import useSWR from "swr";
import CategoryCard from '../../components/CategoryCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useLanguage } from '@/components/LanguageContext';
import translations from '@/components/translations';
import { Category } from '@/types/category';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CategoriesPage: React.FC = () => {
  const { language } = useLanguage();
  const { data: categories, error, isLoading } = useSWR<Category[]>("/api/categories", fetcher);

  return (
    <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold mb-6">{translations[language].categories}</h1>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-center mb-4">
          {translations[language].categoriesLoadError}
        </div>
      )}
      {isLoading || !categories ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
              {translations[language].categoriesNotFound}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage; 